import { NextResponse } from "next/server";

const messages: string[] = [];

export async function GET() {
  console.log(messages)
  return NextResponse.json({ messages })
}

export async function POST(req: Request) {
  try{
    const { message } = await req.json()
    if(!message) {
      return NextResponse.json({ error: 'Message is required'}, { status: 400})
    }
    messages.push(message)
    console.log(message)
    console.log(messages)
    return NextResponse.json({ success: true, messages});
  } catch {
    return NextResponse.json({ error: 'Invalid request'}, { status: 400})
  }
}