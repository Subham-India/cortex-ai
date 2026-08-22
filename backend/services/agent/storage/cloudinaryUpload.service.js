import cloudinary from "../config/cloudinary.js";

const uploadImageToCloudinary = async (image) => {
  try {
    // Convert Hugging Face Blob to Buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload Buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "cortex-ai/generated-images",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    console.log("Image uploaded to Cloudinary");
    console.log("Image URL:", result.secure_url);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    throw error;
  }
};

export default uploadImageToCloudinary;