import express from "express";
import { sendMessage } from "../controller/chat.controller.js";
import { streamMessage } from "../controller/chatStream.controller.js";

const router = express.Router();

router.post("/", sendMessage);
router.post("/stream", streamMessage);

export default router;