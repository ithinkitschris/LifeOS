import { NextResponse } from 'next/server';
import { getFindingsList, saveFindingSession } from '@/lib/fs-data';

export function GET() {
  return NextResponse.json(getFindingsList());
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = `session_${Date.now()}`;
  const session = {
    id,
    vignette_id: body.vignette_id,
    vignette_title: body.vignette_title || '',
    mode: body.mode || 'immersive',
    started_at: new Date().toISOString(),
    reactions: [],
    transcript: [],
    reflection: null,
  };
  saveFindingSession(id, session);
  return NextResponse.json(session, { status: 201 });
}
