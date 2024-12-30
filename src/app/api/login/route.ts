import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Hello Wariz Api route" }, { status: 200 });
}