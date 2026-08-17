import generateImage from "../../services/image/imageGenerator.js";
const photoAgent = async ({
  userMessage,
  userId,
  conversationId,
}) => {
  try {
    console.log("Photo Agent called");
    console.log("Prompt:", userMessage);

    const image = await generateImage(userMessage);

    return {
      success: true,
      type: "image",
      image,
      prompt: userMessage,
      userId,
      conversationId,
    };

  } catch (error) {
    console.error("Photo Agent Error:", error);

    return {
      success: false,
      type: "image",
      message: "Failed to generate image",
    };
  }
};

export default photoAgent;