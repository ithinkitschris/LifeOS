import { NextResponse } from 'next/server';
import { getPrototypeDays, savePrototypeDays } from '@/lib/fs-data';

export function GET() {
  const data = getPrototypeDays();
  return NextResponse.json({ days: data?.days ?? [] });
}

export async function POST(request: Request) {
  const { date } = await request.json();
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 });

  const data = getPrototypeDays() ?? { days: [] };
  if (!data.days) data.days = [];

  if (data.days.find((d: any) => d.date === date)) {
    return NextResponse.json({ error: 'Day already exists' }, { status: 409 });
  }

  const newDay = { date, prototypes: [] };
  data.days.push(newDay);
  data.days.sort((a: any, b: any) => b.date.localeCompare(a.date));
  savePrototypeDays(data);

  return NextResponse.json(newDay, { status: 201 });
}
