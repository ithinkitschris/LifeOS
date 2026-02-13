export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getFullWorld } from '@/lib/data-loader';

export function GET() {
  return NextResponse.json(getFullWorld());
}
