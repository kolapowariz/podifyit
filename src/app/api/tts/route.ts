export const config = {
  runtime: "edge",
};

import { pipeline, TextStreamer } from "@huggingface/transformers";
import type { Pipeline } from "@huggingface/transformers";


// import { AutoModelForCausalLM, AutoTokenizer } from "@huggingface/transformers";

// async function loadModel() {
//   const tokenizer = await AutoTokenizer.from_pretrained("onnx-community/distilgpt2-onnx");
//   const model = await AutoModelForCausalLM.from_pretrained("onnx-community/distilgpt2-onnx");
  
//   return { tokenizer, model };
// }

// const { tokenizer, model } = await loadModel();

let generator: Pipeline | null = null;

async function loadModel() {
  if (!generator) {
    generator = await pipeline(
      'text-generation',
      'onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX',
      { dtype: 'q4f16'}
    ) as Pipeline;
    console.log('Model loaded successfully')
  }
}

export async function POST(request: Request) {
  try {
    const { text }: {text?: string} = await request.json();

    if (!text || typeof text != 'string') {
      return new Response(JSON.stringify({ error: 'Invalid or missing text'}), { status: 400 });
    }

    await loadModel()

    const messages = [
      { role: "user", content: text },
    ];

    if (!generator) {
      throw new Error('Generator is not initialized');
    }
    const streamer = new TextStreamer(generator.tokenizer, {
      skip_prompt: true,
    });

    const output = await generator(messages, {
      max_new_tokens: 512,
      do_sample: false,
      streamer,
    });


    return new Response(JSON.stringify({ result: output?.[0] || '' }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in text generation API:", error);
    return new Response(JSON.stringify({ error: 'Internal server error'}), { status: 500 });
  }
}
