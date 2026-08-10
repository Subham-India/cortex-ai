import "dotenv/config";

import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.routes.js";

const app = express();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "chat-service",
    status: "running"
  });
});

// Chat routes
app.use("/api/chat", chatRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
});