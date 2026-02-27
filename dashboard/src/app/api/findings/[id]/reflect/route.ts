import { NextResponse } from 'next/server';
import { getFindingSession, saveFindingSession } from '@/lib/fs-data';
import { getVignette } from '@/lib/fs-data';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getFindingSession(id) as any;
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const vignette = getVignette(session.vignette_id) as any;

  const reactionsSummary = (session.reactions || [])
    .map((r: any) => `[Turn ${r.simulation_turn}] ${r.reaction} (tags: ${(r.tags || []).join(', ') || 'none'})`)
    .join('\n');

  const transcriptSummary = (session.transcript || [])
    .map((t: any) => `${t.role === 'user' ? 'Chris' : 'LifeOS'}: ${t.content}`)
    .slice(-20)
    .join('\n');

  const prompt = `You are a design research facilitator reviewing a LifeOS simulation session.

Vignette: ${vignette?.title || session.vignette_id}
Mode: ${session.mode}

Transcript excerpt (last 20 turns):
${transcriptSummary || 'No transcript recorded.'}

Chris's real-time reactions during the session:
${reactionsSummary || 'No reactions recorded.'}

Design tensions this vignette was meant to surface:
${(vignette?.tensions_to_surface || []).map((t: any) => `- ${t.id}: ${t.description}`).join('\n') || 'None specified.'}

Generate 3-5 targeted structured reflection questions based on what actually happened. Each question should:
1. Reference something specific from the reactions or transcript
2. Push Chris to articulate the underlying design tension
3. Not have an obvious answer

Format as a numbered list. Be direct and specific.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const reflectionText = response.content[0].type === 'text' ? response.content[0].text : '';

  const reflection = {
    generated_at: new Date().toISOString(),
    prompts: reflectionText,
  };

  const updated = { ...session, reflection };
  saveFindingSession(id, updated);

  return NextResponse.json({ reflection });
}
