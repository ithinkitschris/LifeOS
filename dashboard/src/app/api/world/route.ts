import { NextResponse } from 'next/server';
import { getFullWorld } from '@/lib/fs-data';

export function GET() {
  return NextResponse.json(getFullWorld());
}
