export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getConversationsList } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function GET() {
  return NextResponse.json(getConversationsList());
}

export const POST = readOnly;
