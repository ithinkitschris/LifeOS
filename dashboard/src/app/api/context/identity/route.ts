export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getKG } from '@/lib/data-loader';

export function GET() {
  return NextResponse.json(getKG('identity'));
}
