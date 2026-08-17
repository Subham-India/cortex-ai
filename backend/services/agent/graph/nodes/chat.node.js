import chatAgent from "../../agents/chat/chat.agent.js";

const chatNode = async (state) => {
  try {
    const history = state.messages || [];

    const response = await chatAgent([
      ...history,
      {
        role: "user",
        content: state.userMessage,
      },
    ]);

    return {
      response,
    };

  } catch (error) {
    console.error("Chat Node Error:", error);

    return {
      error: error.message,
    };
  }
};

export default chatNode;