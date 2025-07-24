import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/google/flan-t5-base",
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: `Expand this resume summary: ${text}` }),
            }
        );

        if(!response.body) throw new Error('Failed to fetch response');


        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();

                while(reader) {
                    const { value, done} = await reader.read();
                    if(done) break;
                    controller.enqueue(value);
                }

                controller.close();
            }
        })

        return new NextResponse(stream, {
            headers: {
                "Content-Type": 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        })

    } catch {
        return NextResponse.json({ error: 'Streaming failed' }, { status: 500 });
    }
}