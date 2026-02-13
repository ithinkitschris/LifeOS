export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getDay, getDayDates } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export function generateStaticParams() {
  return getDayDates().map(date => ({ date }));
}

export function GET(_req: Request, { params }: { params: Promise<{ date: string }> }) {
  return params.then(({ date }) => {
    const day = getDay(date);
    if (!day) return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    return NextResponse.json(day);
  });
}

export const DELETE = readOnly;
