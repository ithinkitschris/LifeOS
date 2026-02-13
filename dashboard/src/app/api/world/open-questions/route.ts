export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getWorldOpenQuestions } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function GET() {
  return NextResponse.json(getWorldOpenQuestions());
}

export const POST = readOnly;
