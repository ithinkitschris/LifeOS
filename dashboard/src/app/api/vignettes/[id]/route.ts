import { NextResponse } from 'next/server';
import { getVignette, saveVignette, deleteVignette } from '@/lib/fs-data';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vignette = getVignette(id);
  if (!vignette) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(vignette);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = getVignette(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await request.json();
  const updated = {
    ...existing,
    ...body,
    id,
    updated_at: new Date().toISOString().split('T')[0],
  };
  saveVignette(id, updated);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  deleteVignette(id);
  return NextResponse.json({ deleted: id });
}
