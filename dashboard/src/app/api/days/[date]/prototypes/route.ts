import { NextResponse } from 'next/server';
import { getPrototypeDays, savePrototypeDays, getPrototypeRegistry } from '@/lib/fs-data';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  const { prototypeId } = await request.json();

  if (!prototypeId) return NextResponse.json({ error: 'prototypeId required' }, { status: 400 });

  const data = getPrototypeDays() ?? { days: [] };
  const day = (data.days ?? []).find((d: any) => d.date === date);
  if (!day) return NextResponse.json({ error: 'Day not found' }, { status: 404 });

  if (day.prototypes?.find((p: any) => p.id === prototypeId)) {
    return NextResponse.json({ error: 'Prototype already added to this day' }, { status: 409 });
  }

  // Look up name from registry
  const registry = getPrototypeRegistry();
  const registryEntry = registry?.prototypes?.find((p: any) => p.id === prototypeId);
  const name = registryEntry?.name ?? prototypeId;

  if (!day.prototypes) day.prototypes = [];
  day.prototypes.push({ id: prototypeId, name, screenshots: [] });
  savePrototypeDays(data);

  return NextResponse.json(day, { status: 201 });
}
