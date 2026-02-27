import { NextResponse } from 'next/server';
import { getWorldThesis, saveWorldThesis } from '@/lib/fs-data';

export function GET() {
  return NextResponse.json(getWorldThesis());
}

export async function PUT(request: Request) {
  const body = await request.json();
  saveWorldThesis(body);
  return NextResponse.json(getWorldThesis());
}
