import express from "express";
import { runAgentController } from "../controllers/agent.controller.js";
import { streamAgentController } from "../controllers/agentStream.controller.js";

const router = express.Router();

router.post("/run", runAgentController);
router.post("/stream", streamAgentController);

export default router;