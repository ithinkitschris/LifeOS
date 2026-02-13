export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getDomain, getDomainIds } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function generateStaticParams() {
  return getDomainIds().map(id => ({ id }));
}

export function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const domain = getDomain(id);
    if (!domain) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    return NextResponse.json(domain);
  });
}

export const PUT = readOnly;
export const DELETE = readOnly;
