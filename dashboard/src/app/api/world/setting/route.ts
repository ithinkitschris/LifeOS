export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getWorldSetting } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function GET() {
  return NextResponse.json(getWorldSetting());
}

export const PUT = readOnly;
