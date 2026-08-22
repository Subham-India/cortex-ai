import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);

const generateImage = async (prompt) => {
  try {
    console.log("Generating image...");

    const image = await hf.textToImage({
      provider: "auto",
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
    });

    return image;
  } catch (error) {
    console.error("Hugging Face Image Error:", error.message);
    throw error;
  }
};

export default generateImage;