import { NextResponse } from 'next/server';
import path from 'path';
import { loadJson, CONVERSATIONS_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        return NextResponse.json(loadJson(path.join(CONVERSATIONS_PATH, `${id}.json`)));
    } catch {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
}

export const DELETE = readOnly;
