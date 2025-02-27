"use server";

const API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;

export async function summary(data: { inputs: string }) {
  if (!API_KEY) {
    console.log("Hugging face api key is missing");
    return;
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      console.error("API Error:", await response.text());
      throw new Error(`API request failed with status ${response.status}`);
    }

    // const text = await response.text();

    // try {
    //   return JSON.parse(text);
    // } catch {
    //   console.error("Invalid JSON response:", text);
    //   return { error: "Invalid API response" };
    // }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
}

export async function text2TextGeneration(data: { inputs: string }) {

  if (!API_KEY) {
    console.log("Hugging face api key is missing");
    return;
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-small",
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      console.error("API Error:", await response.text());
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling API:", error);
  }
}


// async function query(data) {
// 	const response = await fetch(
// 		"https://router.huggingface.co/hf-inference/models/google/flan-t5-base",
// 		{
// 			headers: {
// 				Authorization: "Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxx",
// 				"Content-Type": "application/json",
// 			},
// 			method: "POST",
// 			body: JSON.stringify(data),
// 		}
// 	);
// 	const result = await response.json();
// 	return result;
// }

// query({"inputs": "The answer to the universe is"}).then((response) => {
// 	console.log(JSON.stringify(response));
// });


// import { HfInference } from "@huggingface/inference";

// const client = new HfInference("hf_xxxxxxxxxxxxxxxxxxxxxxxx");

// const output = await client.textGeneration({
// 	model: "google/flan-t5-base",
// 	inputs: "The answer to the universe is",
// 	provider: "hf-inference",
// });

// console.log(output);
