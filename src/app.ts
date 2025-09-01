import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { enqueueImages } from "./enqueue"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Express TypeScript server with Firestore is running!' });
});

// API route or handler

app.post("/request-images", async (req, res) => {
  const { userId, prompts } = req.body;

  // Example: prompts = ["cat in space", "dog on surfboard", ...]
  const jobs = prompts.map((p: string, idx: number) => ({
    id: `job-${Date.now()}-${idx}`,
    userId,
    prompt: p,
  }));

  const taskNames = await enqueueImages(jobs);

  res.json({ message: "Enqueued", taskNames });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;