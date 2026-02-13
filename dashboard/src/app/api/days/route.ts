export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getDaysList } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function GET() {
  return NextResponse.json(getDaysList());
}

export const POST = readOnly;
