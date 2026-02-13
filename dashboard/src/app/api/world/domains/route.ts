export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getDomainsList } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function GET() {
  return NextResponse.json(getDomainsList());
}

export const POST = readOnly;
