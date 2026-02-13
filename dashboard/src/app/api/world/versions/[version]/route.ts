import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  try {
    const versionsPath = path.join(WORLD_PATH, 'versions');
    const files = fs.readdirSync(versionsPath).filter((f: string) => f.endsWith('.yaml'));
    return files.map((f: string) => ({ version: f.replace('.yaml', '') }));
  } catch {
    return [];
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ version: string }> }) {
    const { version } = await params;
    try {
        return NextResponse.json(loadYaml(path.join(WORLD_PATH, 'versions', `${version}.yaml`)));
    } catch {
        return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }
}
