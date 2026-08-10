import { generateResponse } from "../chatservices/service.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate request
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // Call chat service
    const response = await generateResponse(message);

    // Send response
    return res.status(200).json({
      success: true,
      response
    });

  } catch (error) {
    console.error("Chat Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate response"
    });
  }
};