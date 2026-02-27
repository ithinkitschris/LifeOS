import { NextResponse } from 'next/server';
import { getVersion } from '@/lib/fs-data';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ version: string }> }
) {
  const { version } = await params;
  const v = getVersion(version);
  if (!v) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(v);
}
