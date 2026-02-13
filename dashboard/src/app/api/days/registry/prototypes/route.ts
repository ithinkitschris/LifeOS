export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, PROTOTYPES_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
    try {
        const data = loadYaml<{ prototypes: unknown[] }>(
            path.join(PROTOTYPES_PATH, 'prototype-registry.yaml')
        );
        return NextResponse.json({ prototypes: data?.prototypes || [] });
    } catch {
        return NextResponse.json({ prototypes: [] });
    }
}

export const POST = readOnly;
