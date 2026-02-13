import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  try {
    const registry = loadYaml<{ domains: { id: string }[] }>(
      path.join(WORLD_PATH, 'domains', '_registry.yaml')
    );
    return (registry?.domains || []).map(d => ({ id: d.id }));
  } catch {
    return [];
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const domainsPath = path.join(WORLD_PATH, 'domains');
        const registry = loadYaml<{ domains: { id: string; file: string }[] }>(
            path.join(domainsPath, '_registry.yaml')
        );
        const ref = registry?.domains?.find(d => d.id === id);
        if (!ref) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
        return NextResponse.json(loadYaml(path.join(domainsPath, ref.file)));
    } catch {
        return NextResponse.json({ error: 'Failed to load domain' }, { status: 500 });
    }
}

export const PUT = readOnly;
export const DELETE = readOnly;
