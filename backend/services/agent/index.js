import "dotenv/config";
import express from "express";
import cors from "cors";

import agentRoutes from "./routes/agent.routes.js";

const app = express();

const PORT = process.env.PORT || 8003;

app.use(cors());
app.use(express.json());

app.use("/api/agent", agentRoutes);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "agent-service",
    status: "running",
  });
});

app.listen(PORT, () => {
  console.log(`Agent Service running on port ${PORT}`);
});