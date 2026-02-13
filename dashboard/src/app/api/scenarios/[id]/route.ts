import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, SCENARIOS_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        return NextResponse.json(loadYaml(path.join(SCENARIOS_PATH, `${id}.yaml`)));
    } catch {
        return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }
}

export const PUT = readOnly;
export const DELETE = readOnly;
