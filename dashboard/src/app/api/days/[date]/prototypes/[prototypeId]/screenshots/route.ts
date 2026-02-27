import { NextResponse } from 'next/server';
import { getPrototypeDays, savePrototypeDays } from '@/lib/fs-data';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), '..', 'data', 'prototypes', 'images');

export async function POST(
  request: Request,
  { params }: { params: Promise<{ date: string; prototypeId: string }> }
) {
  const { date, prototypeId } = await params;

  const data = getPrototypeDays() ?? { days: [] };
  const day = (data.days ?? []).find((d: any) => d.date === date);
  if (!day) return NextResponse.json({ error: 'Day not found' }, { status: 404 });

  const proto = (day.prototypes ?? []).find((p: any) => p.id === prototypeId);
  if (!proto) return NextResponse.json({ error: 'Prototype not found' }, { status: 404 });

  const uploadDir = path.join(IMAGES_DIR, date, prototypeId);
  fs.mkdirSync(uploadDir, { recursive: true });

  const formData = await request.formData();
  const files = formData.getAll('files') as File[];

  const added = [];
  for (const file of files) {
    const safeOriginal = file.name.replace(/[^a-zA-Z0-9._\-]/g, '_');
    const filename = `${Date.now()}-${safeOriginal}`;
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const screenshot = {
      filename,
      originalName: file.name,
      path: `/prototype-images/${date}/${prototypeId}/${filename}`,
      uploadedAt: new Date().toISOString(),
    };
    if (!proto.screenshots) proto.screenshots = [];
    proto.screenshots.push(screenshot);
    added.push(screenshot);
  }

  savePrototypeDays(data);
  return NextResponse.json({ added }, { status: 201 });
}
