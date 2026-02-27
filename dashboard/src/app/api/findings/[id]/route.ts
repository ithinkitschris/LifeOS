import { NextResponse } from 'next/server';
import { getFindingSession, saveFindingSession } from '@/lib/fs-data';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getFindingSession(id);
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(session);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getFindingSession(id) as any;
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();

  // Append a reaction
  if (body.reaction) {
    const reaction = {
      id: `rxn_${Date.now()}`,
      timestamp: new Date().toISOString(),
      vignette_id: session.vignette_id,
      simulation_turn: body.simulation_turn ?? (session.transcript?.length || 0),
      simulation_context: body.simulation_context || '',
      reaction: body.reaction,
      tags: body.tags || [],
      tension_id: body.tension_id || null,
    };
    session.reactions = [...(session.reactions || []), reaction];
  }

  // Append a transcript turn
  if (body.turn) {
    session.transcript = [...(session.transcript || []), body.turn];
  }

  // Update any top-level fields
  const updated = { ...session, ...body, id, reactions: session.reactions, transcript: session.transcript };
  saveFindingSession(id, updated);
  return NextResponse.json(updated);
}
