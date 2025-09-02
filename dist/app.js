"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const enqueue_1 = require("./enqueue");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({ message: 'Express TypeScript server with Firestore is running!' });
});
// API route or handler
app.post("/request-images", async (req, res) => {
    try {
        const { userId, prompts } = req.body;
        console.log("Received prompts:", prompts);
        console.log("For userId:", userId);
        // Example: prompts = ["cat in space", "dog on surfboard", ...]
        const jobs = prompts.map((p, idx) => ({
            id: `job-${Date.now()}-${idx}`,
            userId,
            prompt: p,
        }));
        const taskNames = await (0, enqueue_1.enqueueImages)(jobs);
        res.json({ message: "Enqueued", taskNames });
    }
    catch (error) {
        console.error("Error enqueueing images:", error);
        res.status(500).json({
            error: "Failed to enqueue images",
            details: error instanceof Error ? error.message : "Unknown error",
            note: "Make sure Google Cloud credentials are configured if using Cloud Tasks"
        });
    }
});
app.post("/generate-image", async (req, res) => {
    try {
        const { id, userId, prompt } = req.body;
        // if (!id || !userId || !prompt) {
        //   return res.status(400).json({ 
        //     error: "Missing required fields: id, userId, or prompt" 
        //   });
        // }
        // TODO: Add your image generation logic here
        // This could involve calling an AI image generation API like:
        // - OpenAI DALL-E
        // - Stability AI
        // - Midjourney API
        // - Replicate
        console.log(`Generating image for job ${id}: ${prompt}`);
        // Placeholder response - replace with actual image generation
        // const imageUrl = `https://placeholder.com/image/${id}`;
        // res.json({ 
        //   success: true,
        //   jobId: id,
        //   userId,
        //   prompt,
        //   imageUrl,
        //   message: "Image generation completed"
        // });
        res.status(200).json({
            success: true,
            message: "Image generation completed"
        });
    }
    catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({
            error: "Failed to generate image",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map