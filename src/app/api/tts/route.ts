import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
    const { text, voice } = await req.json();
    const { arrayBuffer } = await openai.audio.speech.create({
        model: 'tts-1',
        voice,
        stream_format: 'audio',
        input: text,

    });

    return new Response(Buffer.from(await arrayBuffer()), {
        headers: { 'Content-Type': 'audio/mpeg' },
    });
}