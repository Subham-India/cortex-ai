import groq from "../../llms/groq/groq.client.js";

const chatAgent = async (messages) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant.",
        },

        ...messages.map((message) => ({
          role: message.role === "assistant"
            ? "assistant"
            : "user",
          content: message.content,
        })),
      ],

      temperature: 0.7,
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("Chat Agent Error:", error);
    throw error;
  }
};

export default chatAgent;