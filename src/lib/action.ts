"use server";

export async function query(data: { inputs: string }) {
  const API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;

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

    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error("Invalid JSON response:", text);
      return { error: "Invalid API response" };
    }
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
}
