import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const domainsPath = path.join(WORLD_PATH, 'domains');
        const registry = loadYaml<{ domains: { id: string; file: string }[] }>(
            path.join(domainsPath, '_registry.yaml')
        );
        const ref = registry?.domains?.find(d => d.id === params.id);
        if (!ref) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
        return NextResponse.json(loadYaml(path.join(domainsPath, ref.file)));
    } catch {
        return NextResponse.json({ error: 'Failed to load domain' }, { status: 500 });
    }
}

export const PUT = readOnly;
export const DELETE = readOnly;
