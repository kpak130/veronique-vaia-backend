import dotenv from 'dotenv';
import {v2 as tasks} from "@google-cloud/tasks";

dotenv.config();

const client = new tasks.CloudTasksClient();

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT!;
const LOCATION = "us-central1";
const QUEUE = "imagegen-default";
const PARENT = client.queuePath(PROJECT, LOCATION, QUEUE);

// URL of your Cloud Run worker
const TARGET_URL = "https://YOUR_RUN_URL/generate-image";

// Service Account Cloud Tasks uses to call your worker
const INVOKER_SA = `tasks-invoker@${PROJECT}.iam.gserviceaccount.com`;

export async function enqueueImages(jobs: Array<{id: string; userId: string; prompt: string}>) {
  const now = Date.now();
  const results: string[] = [];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const body = Buffer.from(JSON.stringify(job)).toString("base64");

    // Optionally stagger scheduleTime (queue rate limit already does spacing)
    const ts = now + i * 100; // 100ms apart
    const scheduleTime = {
      seconds: Math.floor(ts / 1000),
      nanos: (ts % 1000) * 1e6,
    };

    const [task] = await client.createTask({
      parent: PARENT,
      task: {
        scheduleTime,
        httpRequest: {
          httpMethod: "POST",
          url: TARGET_URL,
          headers: { "Content-Type": "application/json" },
          body,
          oidcToken: { serviceAccountEmail: INVOKER_SA },
        },
      },
    });

    results.push(task.name!);
  }

  return results;
}