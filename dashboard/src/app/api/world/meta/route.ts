export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';

export async function GET() {
    try {
        return NextResponse.json(loadYaml(path.join(WORLD_PATH, 'meta.yaml')));
    } catch {
        return NextResponse.json({ error: 'Failed to load meta' }, { status: 500 });
    }
}
