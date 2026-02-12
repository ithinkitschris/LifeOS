import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
    try {
        return NextResponse.json(loadYaml(path.join(WORLD_PATH, 'open-questions.yaml')));
    } catch {
        return NextResponse.json({ error: 'Failed to load open questions' }, { status: 500 });
    }
}

export const POST = readOnly;
