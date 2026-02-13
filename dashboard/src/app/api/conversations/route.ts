export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import path from 'path';
import { loadJson, CONVERSATIONS_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
    try {
        const index = loadJson<{ conversations: any[] }>(path.join(CONVERSATIONS_PATH, 'index.json'));
        const sorted = (index.conversations || []).sort((a: any, b: any) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        return NextResponse.json({ conversations: sorted });
    } catch {
        return NextResponse.json({ conversations: [] });
    }
}

export const POST = readOnly;
