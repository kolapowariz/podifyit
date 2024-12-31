import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Hello Wariz Register route" }, { status: 200 });
}