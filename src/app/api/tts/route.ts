import { pipeline, TextStreamer } from "@huggingface/transformers";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return new Response("Text is required", { status: 400 });
    }

    const generator = await pipeline(
      "text-generation",
      "onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX",
      { dtype: "q4f16" }
    );

    console.log("Model loaded successfully")

    const messages = [
      { role: "user", content: text },
    ];

    const streamer = new TextStreamer(generator.tokenizer, {
      skip_prompt: true,
    });

    const output = await generator(messages, {
      max_new_tokens: 512,
      do_sample: false,
      streamer,
    });


    return new Response(JSON.stringify({ result: output[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in TTS API:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
