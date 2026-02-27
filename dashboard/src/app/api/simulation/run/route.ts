import { NextResponse } from 'next/server';
import { assembleSimulationPrompt } from '@/lib/knowledge';
import { getVignette } from '@/lib/fs-data';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  const body = await request.json();
  const { vignette_id, mode, messages = [], additional_context = '' } = body;

  if (!vignette_id) {
    return NextResponse.json({ error: 'vignette_id is required' }, { status: 400 });
  }

  const vignette = getVignette(vignette_id);
  if (!vignette) {
    return NextResponse.json({ error: 'Vignette not found' }, { status: 404 });
  }

  const simulationMode = mode || vignette.simulation?.mode || 'immersive';

  const systemPrompt = assembleSimulationPrompt({
    mode: simulationMode,
    vignette,
    additionalContext: additional_context,
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: 'claude-opus-4-6',
          max_tokens: 2048,
          system: systemPrompt,
          messages: messages.length > 0 ? messages : [
            {
              role: 'user',
              content: simulationMode === 'immersive'
                ? 'Begin the simulation.'
                : 'Please begin the session. Introduce the vignette and start the first narration.',
            },
          ],
        });

        for await (const chunk of anthropicStream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            const data = JSON.stringify({ type: 'text', text: chunk.delta.text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }

        const finalMessage = await anthropicStream.finalMessage();
        const done = JSON.stringify({
          type: 'done',
          usage: finalMessage.usage,
          stop_reason: finalMessage.stop_reason,
        });
        controller.enqueue(encoder.encode(`data: ${done}\n\n`));
      } catch (error) {
        const errMsg = JSON.stringify({ type: 'error', error: (error as Error).message });
        controller.enqueue(encoder.encode(`data: ${errMsg}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
