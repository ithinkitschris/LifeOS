export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getVersion, getVersionIds } from '@/lib/data-loader';

export function generateStaticParams() {
  return getVersionIds().map(version => ({ version }));
}

export function GET(_req: Request, { params }: { params: Promise<{ version: string }> }) {
  return params.then(({ version }) => {
    const v = getVersion(version);
    if (!v) return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    return NextResponse.json(v);
  });
}
