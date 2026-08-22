import generateImage from "../../services/image/imageGenerator.js";
import uploadImageToCloudinary from "../../storage/cloudinaryUpload.service.js";

const photoAgent = async ({
  userMessage,
  userId,
  conversationId,
}) => {
  try {
    console.log("Photo Agent called");
    console.log("Prompt:", userMessage);

    // 1. Generate image using Hugging Face
    const image = await generateImage(userMessage);

    // 2. Upload generated image to Cloudinary
    const uploadedImage = await uploadImageToCloudinary(image);

    console.log("Generated image URL:", uploadedImage.url);

    // 3. Return Cloudinary image information
    return {
      success: true,
      type: "image",
      image: uploadedImage.url,
      publicId: uploadedImage.publicId,
      prompt: userMessage,
      userId,
      conversationId,
    };
  } catch (error) {
    console.error("Photo Agent Error:", error.message);

    return {
      success: false,
      type: "image",
      message: "Failed to generate image",
    };
  }
};

export default photoAgent;