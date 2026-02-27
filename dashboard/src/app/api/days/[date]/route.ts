import { NextResponse } from 'next/server';
import { getPrototypeDays, savePrototypeDays } from '@/lib/fs-data';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), '..', 'data', 'prototypes', 'images');

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  const data = getPrototypeDays() ?? { days: [] };
  const before = data.days?.length ?? 0;
  data.days = (data.days ?? []).filter((d: any) => d.date !== date);

  if (data.days.length === before) {
    return NextResponse.json({ error: 'Day not found' }, { status: 404 });
  }

  savePrototypeDays(data);

  // Clean up images directory for this date
  const dayImagesDir = path.join(IMAGES_DIR, date);
  if (fs.existsSync(dayImagesDir)) {
    fs.rmSync(dayImagesDir, { recursive: true });
  }

  return NextResponse.json({ success: true, deleted: date });
}
