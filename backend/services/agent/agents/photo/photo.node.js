import photoAgent from "./photo.agent.js";

const photoNode = async (state) => {
  try {
    console.log("Photo Node started");

    const result = await photoAgent({
      userMessage: state.userMessage,
      userId: state.userId,
      conversationId: state.conversationId,
    });

    if (!result.success) {
      return {
        ...state,
        success: false,
        type: "image",
        error: result.message,
      };
    }

    return {
      ...state,

      // Important: these values go back into LangGraph state
      success: true,
      type: "image",

      // Cloudinary URL
      image: result.image,

      // Cloudinary public ID
      publicId: result.publicId,

      // Original prompt
      prompt: result.prompt,
    };
  } catch (error) {
    console.error("Photo Node Error:", error.message);

    return {
      ...state,
      success: false,
      type: "image",
      error: "Photo generation failed",
    };
  }
};

export default photoNode;