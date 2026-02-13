export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { loadYaml, SCENARIOS_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
    try {
        if (!fs.existsSync(SCENARIOS_PATH)) return NextResponse.json({ scenarios: [] });
        const files = fs.readdirSync(SCENARIOS_PATH)
            .filter(f => f.endsWith('.yaml') && f !== '_registry.yaml');
        const scenarios = files.map(f => {
            try {
                const s = loadYaml<any>(path.join(SCENARIOS_PATH, f));
                if (!s) return null;
                return {
                    id: s.id, title: s.title,
                    status: s.status || 'active',
                    created_at: s.created_at,
                    updated_at: s.updated_at,
                };
            } catch { return null; }
        }).filter(Boolean);
        return NextResponse.json({ scenarios });
    } catch {
        return NextResponse.json({ error: 'Failed to load scenarios' }, { status: 500 });
    }
}

export const POST = readOnly;
