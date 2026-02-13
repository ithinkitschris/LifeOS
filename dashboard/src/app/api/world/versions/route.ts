export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getVersionsList } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function GET() {
  return NextResponse.json(getVersionsList());
}

export const POST = readOnly;
