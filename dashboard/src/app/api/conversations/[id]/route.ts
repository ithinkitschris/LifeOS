export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getConversation, getConversationIds } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function generateStaticParams() {
  return getConversationIds().map(id => ({ id }));
}

export function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const conv = getConversation(id);
    if (!conv) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    return NextResponse.json(conv);
  });
}

export const DELETE = readOnly;
