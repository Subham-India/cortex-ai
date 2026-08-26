import runAgent from "../services/agent.service.js";

export const runAgentController = async (req, res) => {
  try {
    const {
      userId,
      conversationId,
      message,
      messages,
      documentId,
    } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const result = await runAgent({
      userId,
      conversationId,
      userMessage: message,
      messages,
      documentId: documentId || null,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {

    console.error("Agent Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Agent service failed",
      error: error.message,
    });
  }
};