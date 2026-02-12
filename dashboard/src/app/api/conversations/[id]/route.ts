import { NextResponse } from 'next/server';
import path from 'path';
import { loadJson, CONVERSATIONS_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        return NextResponse.json(loadJson(path.join(CONVERSATIONS_PATH, `${params.id}.json`)));
    } catch {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
}

export const DELETE = readOnly;
