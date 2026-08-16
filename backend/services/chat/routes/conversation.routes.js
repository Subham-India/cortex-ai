import express from "express";

import {
  createConversation,
  getConversations,
  getMessages,
  deleteConversation,
} from "../controller/conversation.controller.js";

const router = express.Router();

router.post("/", createConversation);

router.get("/", getConversations);

router.get("/:conversationId/messages", getMessages);

router.delete("/:conversationId", deleteConversation);

export default router;