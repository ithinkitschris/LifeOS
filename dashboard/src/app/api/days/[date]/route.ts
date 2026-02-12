import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, PROTOTYPES_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET(_req: Request, { params }: { params: { date: string } }) {
    try {
        const data = loadYaml<{ days: any[] }>(path.join(PROTOTYPES_PATH, 'days.yaml'));
        const day = (data?.days || []).find((d: any) => d.date === params.date);
        if (!day) return NextResponse.json({ error: 'Day not found' }, { status: 404 });
        return NextResponse.json(day);
    } catch {
        return NextResponse.json({ error: 'Failed to load day' }, { status: 500 });
    }
}

export const DELETE = readOnly;
