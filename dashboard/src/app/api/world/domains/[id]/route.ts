import { NextResponse } from 'next/server';
import { getDomain, saveDomain } from '@/lib/fs-data';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const domain = getDomain(id);
  if (!domain) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ id, ...domain });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  saveDomain(id, body);
  return NextResponse.json({ id, ...getDomain(id) });
}
