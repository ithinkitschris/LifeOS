export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getPrototypeRegistry } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function GET() {
  return NextResponse.json(getPrototypeRegistry());
}

export const POST = readOnly;
