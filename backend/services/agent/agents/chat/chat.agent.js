import gemini from "../../llms/gemini/gemini.client.js";

const chatAgent = async (messages) => {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [
          {
            text: message.content,
          },
        ],
      })),
    });

    return response.text;
  } catch (error) {
    console.error("Chat Agent Error:", error);
    throw error;
  }
};

export default chatAgent;