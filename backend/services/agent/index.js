
import "dotenv/config";

import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 8003;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "agent-service",
    status: "running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Agent Service running on port ${PORT}`);
});