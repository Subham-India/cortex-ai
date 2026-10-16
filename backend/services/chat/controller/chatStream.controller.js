import axios from "axios";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const streamMessage = async (req, res) => {
  let upstream = null;

  try {
    const { userId, conversationId, message } = req.body;

    if (!userId) return res.status(400).json({ success: false, message: "userId is required" });
    if (!conversationId) return res.status(400).json({ success: false, message: "conversationId is required" });
    if (!message || !message.trim()) return res.status(400).json({ success: false, message: "Message is required" });

    const conversation = await Conversation.findOne({ _id: conversationId, userId });
    if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });

    await Message.create({ conversationId, role: "user", content: message });

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .select("role content -_id");

    const agentResponse = await axios.post(
      `${process.env.AGENT_SERVICE_URL}/api/agent/stream`,
      { userId, conversationId, message, messages },
      { responseType: "stream" }
    );
    upstream = agentResponse.data;

    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    let buffer = "";
    let fullText = "";
    let imageUrl = null;
    let finished = false;

    const handleEvent = (event) => {
      if (event.type === "token") fullText += event.token;
      else if (event.type === "text") fullText = event.content || "";
      else if (event.type === "image") imageUrl = event.image;
    };

    const saveAssistantMessage = async () => {
      if (finished) return;
      finished = true;

      const content = imageUrl || fullText;
      if (!content.trim()) return;

      await Message.create({ conversationId, role: "assistant", content });
      conversation.updatedAt = new Date();
      await conversation.save();
    };

    upstream.on("data", (chunk) => {
      res.write(chunk); // forward immediately

      buffer += chunk.toString("utf8");
      const parts = buffer.split("\n\n");
      buffer = parts.pop();

      for (const part of parts) {
        const line = part.split("\n").find((l) => l.startsWith("data: "));
        if (!line) continue;
        try {
          handleEvent(JSON.parse(line.slice(6)));
        } catch {
          // ignore malformed event
        }
      }
    });

    upstream.on("end", async () => {
      try {
        await saveAssistantMessage();
      } catch (err) {
        console.error("Save assistant message error:", err);
      }
      res.end();
    });

    upstream.on("error", async (err) => {
      console.error("Agent stream error:", err.message);
      try {
        await saveAssistantMessage();
      } catch {
        // ignore
      }
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ type: "error", message: "Stream interrupted" })}\n\n`);
        res.end();
      }
    });

    // Browser closed the connection: stop the agent, keep what was generated
    res.on("close", async () => {
      if (!res.writableEnded) {
        upstream.destroy();
        try {
          await saveAssistantMessage();
        } catch {
          // ignore
        }
      }
    });
  } catch (error) {
    console.error("Chat Stream Error:", error.response?.data || error.message);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate response",
        error: error.message,
      });
    }

    res.write(`data: ${JSON.stringify({ type: "error", message: "Failed to generate response" })}\n\n`);
    res.end();
  }
};