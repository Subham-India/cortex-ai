import axios from "axios";

export const generateResponse = async ({
  userId,
  conversationId,
  message,
  messages = [],
}) => {
  try {
    const response = await axios.post(
      `${process.env.AGENT_SERVICE_URL}/api/agent/run`,
      {
        userId,
        conversationId,
        message,
        messages,
      }
    );

    console.log("Agent Service Response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Agent Service Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};