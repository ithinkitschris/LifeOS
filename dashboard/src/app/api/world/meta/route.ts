import { NextResponse } from 'next/server';
import { getWorldMeta } from '@/lib/fs-data';

export function GET() {
  return NextResponse.json(getWorldMeta());
}
