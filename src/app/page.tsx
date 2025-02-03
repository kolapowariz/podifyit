import MyDropzone from "@/components/dashboard/DragnDrop";


import { pipeline } from "@huggingface/transformers";

async function testPipeline() {
  try {
    const generator = await pipeline(
      "text-generation",
      "distilgpt2",
      { dtype: "q4f16" }
      // "onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX",
      // { dtype: "q4f16" }
    );
    console.log(generator)
    console.log("Model loaded successfully!");
  } catch (error) {
    console.error("Error loading model:", error);
  }
}


export default async function Home() {
  const data = await testPipeline();
  console.log(data)

  return (
    <section>
      <MyDropzone />
    </section>
  );
}