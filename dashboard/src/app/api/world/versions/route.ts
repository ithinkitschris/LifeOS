import { NextResponse } from 'next/server';
import { getVersionsList, saveVersion, getFullWorld } from '@/lib/fs-data';

export function GET() {
  return NextResponse.json(getVersionsList());
}

export async function POST(request: Request) {
  const body = await request.json();
  const { version, notes } = body;
  const snapshot = {
    version,
    notes: notes || '',
    created: new Date().toISOString(),
    files: getFullWorld(),
  };
  saveVersion(version, snapshot);
  return NextResponse.json(snapshot, { status: 201 });
}
