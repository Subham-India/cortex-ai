import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

import { generateResponse } from "../chatservices/service.js";

export const sendMessage = async (req, res) => {
  try {
    const {
      userId,
      conversationId,
      message,
    } = req.body;

    // -------------------------
    // 1. Validate request
    // -------------------------

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId is required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // -------------------------
    // 2. Find conversation
    // -------------------------

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // -------------------------
    // 3. Save user message
    // -------------------------

    await Message.create({
      conversationId,
      role: "user",
      content: message,
    });

    // -------------------------
    // 4. Get conversation history
    // -------------------------

    const messages = await Message.find({
      conversationId,
    })
      .sort({ createdAt: 1 })
      .select("role content -_id");

    // -------------------------
    // 5. Call Agent Service
    // -------------------------

    const result = await generateResponse({
      userId,
      conversationId,
      message,
      messages,
    });

    console.log("Agent Result:", result);

    // -------------------------
    // 6. Check AI response
    // -------------------------

    if (!result || !result.response) {
      throw new Error("Agent returned no response");
    }

    // -------------------------
    // 7. Save AI message
    // -------------------------

    await Message.create({
      conversationId,
      role: "assistant",
      content: result.response,
    });

    // -------------------------
    // 8. Update conversation
    // -------------------------

    conversation.updatedAt = new Date();

    await conversation.save();

    // -------------------------
    // 9. Send response
    // -------------------------

    return res.status(200).json({
      success: true,
      response: result.response,
      selectedAgent: result.selectedAgent,
      searchResults: result.searchResults || [],
      conversationId,
    });

  } catch (error) {

    console.error("Chat Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate response",
      error: error.message,
    });
  }
};