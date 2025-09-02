import dotenv from 'dotenv';
import {v2 as tasks} from "@google-cloud/tasks";
import { getServiceAccountConfig } from './config/google-auth';

dotenv.config();

let client: tasks.CloudTasksClient | null = null;

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT!;
const LOCATION = "us-central1";
const QUEUE = "imagegen-default";

// URL of your Cloud Run worker
const TARGET_URL = "https://veronique-vaia-backend-production.up.railway.app/generate-image";

// Service Account Cloud Tasks uses to call your worker
// const INVOKER_SA = `tasks-invoker@${PROJECT}.iam.gserviceaccount.com`;
const INVOKER_SA = 'firebase-adminsdk-7wd74@veronique-5c5bf.iam.gserviceaccount.com';
export async function enqueueImages(jobs: Array<{id: string; userId: string; prompt: string}>) {
  // Initialize client lazily when actually needed
  if (!client) {
    const serviceAccountConfig = getServiceAccountConfig();
    
    if (serviceAccountConfig) {
      // Use Firebase service account credentials
      console.log('Using Firebase service account:', serviceAccountConfig.client_email);
      console.log('Project ID:', serviceAccountConfig.project_id);
      
      client = new tasks.CloudTasksClient({
        credentials: serviceAccountConfig,
        projectId: serviceAccountConfig.project_id
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Use key file if specified
      console.log('Using key file:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
      client = new tasks.CloudTasksClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
      });
    } else {
      // Fall back to Application Default Credentials
      console.log('Using Application Default Credentials');
      client = new tasks.CloudTasksClient();
    }
  }
  
  const PARENT = client.queuePath(PROJECT, LOCATION, QUEUE);
  const now = Date.now();
  const results: string[] = [];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const rawBody = {
      id: job.id,
      userId: job.userId,
      prompt: job.prompt
    }
    const body = Buffer.from(JSON.stringify(rawBody)).toString("base64");
    // Optionally stagger scheduleTime (queue rate limit already does spacing)
    const ts = now + i * 100; // 100ms apart
    const scheduleTime = {
      seconds: Math.floor(ts / 1000),
      nanos: (ts % 1000) * 1e6,
    };

    const task = await client.createTask({
      parent: PARENT,
      task: {
        scheduleTime,
        httpRequest: {
          httpMethod: "POST" as const,
          url: TARGET_URL,
          headers: { "Content-Type": "application/json" },
          body,
          oidcToken: { serviceAccountEmail: INVOKER_SA },
        },
      },
    });

    results.push(task[0].name!);
  }

  return results;
}