import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';

export async function GET(_req: Request, { params }: { params: { version: string } }) {
    try {
        return NextResponse.json(loadYaml(path.join(WORLD_PATH, 'versions', `${params.version}.yaml`)));
    } catch {
        return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }
}
