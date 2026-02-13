export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
    try {
        const domainsPath = path.join(WORLD_PATH, 'domains');
        const registry = loadYaml<{ domains: { id: string; file: string }[] }>(
            path.join(domainsPath, '_registry.yaml')
        );
        const domains = (registry?.domains || []).map(ref => {
            try { return loadYaml(path.join(domainsPath, ref.file)); } catch { return null; }
        }).filter(Boolean);
        return NextResponse.json(domains);
    } catch {
        return NextResponse.json({ error: 'Failed to load domains' }, { status: 500 });
    }
}

export const POST = readOnly;
