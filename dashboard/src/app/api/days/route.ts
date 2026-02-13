export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, PROTOTYPES_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
    try {
        const data = loadYaml<{ days: unknown[] }>(path.join(PROTOTYPES_PATH, 'days.yaml'));
        return NextResponse.json({ days: data?.days || [] });
    } catch {
        return NextResponse.json({ days: [] });
    }
}

export const POST = readOnly;
