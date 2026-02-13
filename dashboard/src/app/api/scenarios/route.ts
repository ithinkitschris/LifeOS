export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getScenariosList } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function GET() {
  return NextResponse.json(getScenariosList());
}

export const POST = readOnly;
