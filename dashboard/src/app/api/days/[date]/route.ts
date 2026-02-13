import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, PROTOTYPES_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  try {
    const data = loadYaml<{ days: { date: string }[] }>(
      path.join(PROTOTYPES_PATH, 'days.yaml')
    );
    return (data?.days || []).map((d: { date: string }) => ({ date: d.date }));
  } catch {
    return [];
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ date: string }> }) {
    const { date } = await params;
    try {
        const data = loadYaml<{ days: any[] }>(path.join(PROTOTYPES_PATH, 'days.yaml'));
        const day = (data?.days || []).find((d: any) => d.date === date);
        if (!day) return NextResponse.json({ error: 'Day not found' }, { status: 404 });
        return NextResponse.json(day);
    } catch {
        return NextResponse.json({ error: 'Failed to load day' }, { status: 500 });
    }
}

export const DELETE = readOnly;
