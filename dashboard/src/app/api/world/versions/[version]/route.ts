import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';

export async function GET(_req: Request, { params }: { params: Promise<{ version: string }> }) {
    const { version } = await params;
    try {
        return NextResponse.json(loadYaml(path.join(WORLD_PATH, 'versions', `${version}.yaml`)));
    } catch {
        return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }
}
