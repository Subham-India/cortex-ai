import photoAgent from "../../agents/photo/photo.agent.js";

const photoNode = async (state) => {
  try {
    const result = await photoAgent({
      userMessage: state.userMessage,
      userId: state.userId,
      conversationId: state.conversationId,
    });

    return {
      response: result.image,
      selectedAgent: "photo",
      type: "image",
    };

  } catch (error) {
    console.error("Photo Node Error:", error);

    return {
      response: null,
      selectedAgent: "photo",
      type: "image",
      error: "Failed to generate image.",
    };
  }
};

export default photoNode;