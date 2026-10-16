import { runAgentStream } from "../services/agentStream.service.js";

export const streamAgentController = async (req, res) => {
  const { userId, conversationId, message, messages, documentId } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const send = (event) => res.write(`data: ${JSON.stringify(event)}\n\n`);

  // Stop calling the LLM if the client goes away mid-answer
  const abort = new AbortController();
  res.on("close", () => {
    if (!res.writableEnded) abort.abort();
  });

  try {
    for await (const event of runAgentStream({
      userId,
      conversationId,
      userMessage: message,
      messages: Array.isArray(messages) ? messages : [],
      documentId: documentId || null,
      signal: abort.signal,
    })) {
      send(event);
    }
    send({ type: "done" });
  } catch (error) {
    if (!abort.signal.aborted) {
      console.error("Agent Stream Error:", error);
      send({ type: "error", message: error.message || "Agent service failed" });
    }
  } finally {
    res.end();
  }
};