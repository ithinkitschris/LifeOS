import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
    try {
        const versionsPath = path.join(WORLD_PATH, 'versions');
        if (!fs.existsSync(versionsPath)) return NextResponse.json([]);
        const files = fs.readdirSync(versionsPath).filter(f => f.endsWith('.yaml'));
        const versions = files.map(f => {
            try { return loadYaml(path.join(versionsPath, f)); } catch { return null; }
        }).filter(Boolean);
        return NextResponse.json(versions);
    } catch {
        return NextResponse.json({ error: 'Failed to load versions' }, { status: 500 });
    }
}

export const POST = readOnly;
