import { NextResponse } from 'next/server';
import { getWorldSetting, saveWorldSetting } from '@/lib/fs-data';

export function GET() {
  return NextResponse.json(getWorldSetting());
}

export async function PUT(request: Request) {
  const body = await request.json();
  saveWorldSetting(body);
  return NextResponse.json(getWorldSetting());
}
