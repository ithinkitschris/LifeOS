export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getScenario, getScenarioIds } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function generateStaticParams() {
  return getScenarioIds().map(id => ({ id }));
}

export function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const s = getScenario(id);
    if (!s) return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    return NextResponse.json(s);
  });
}

export const PUT = readOnly;
export const DELETE = readOnly;
