'use client'

import { useState } from "react"

export default function StreamingText() {
    const [inputText, setInputText] = useState<string>('')
    const [responseText, setResponseText] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    async function handleSubmit() {
        setResponseText('');
        setLoading(true);

        const res = await fetch('/api/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: inputText }),
        })

        if (!res.body) return;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while(true) {
            const { value, done } = await reader.read();
            if(done) break;

            setResponseText((prev) => prev + decoder.decode(value, { stream: true }));
        }

        setLoading(false);
    }

    return (
        <div className="p-4">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Enter text to generate..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate AI Response"}
          </button>
          
          <div className="mt-4 p-2 border rounded bg-gray-100">
            <h2 className="font-bold">Generated Text:</h2>
            <p className="whitespace-pre-line">{responseText}</p>
          </div>

        </div>
      );
}