import { NextResponse } from 'next/server';
import { getPrototypeDays, savePrototypeDays } from '@/lib/fs-data';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), '..', 'data', 'prototypes', 'images');

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ date: string; prototypeId: string }> }
) {
  const { date, prototypeId } = await params;

  const data = getPrototypeDays() ?? { days: [] };
  const day = (data.days ?? []).find((d: any) => d.date === date);
  if (!day) return NextResponse.json({ error: 'Day not found' }, { status: 404 });

  const before = day.prototypes?.length ?? 0;
  day.prototypes = (day.prototypes ?? []).filter((p: any) => p.id !== prototypeId);
  if (day.prototypes.length === before) {
    return NextResponse.json({ error: 'Prototype not found' }, { status: 404 });
  }

  savePrototypeDays(data);

  // Clean up images directory
  const protoImagesDir = path.join(IMAGES_DIR, date, prototypeId);
  if (fs.existsSync(protoImagesDir)) {
    fs.rmSync(protoImagesDir, { recursive: true });
  }

  return NextResponse.json({ success: true, deleted: prototypeId });
}
