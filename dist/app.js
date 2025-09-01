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
    const { userId, prompts } = req.body;
    // Example: prompts = ["cat in space", "dog on surfboard", ...]
    const jobs = prompts.map((p, idx) => ({
        id: `job-${Date.now()}-${idx}`,
        userId,
        prompt: p,
    }));
    const taskNames = await (0, enqueue_1.enqueueImages)(jobs);
    res.json({ message: "Enqueued", taskNames });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map