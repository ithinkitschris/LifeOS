export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getFullKG } from '@/lib/data-loader';

export function GET() {
  return NextResponse.json(getFullKG());
}
