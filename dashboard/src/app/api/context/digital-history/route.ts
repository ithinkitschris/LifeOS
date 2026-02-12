import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, KG_PATH } from '@/lib/data-loader';

export async function GET() {
    try {
        return NextResponse.json(loadYaml(path.join(KG_PATH, 'digital-history.yaml')));
    } catch {
        return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
    }
}
