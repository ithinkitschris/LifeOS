import { NextResponse } from 'next/server';
import { getVignettesList, saveVignette } from '@/lib/fs-data';

export function GET() {
  return NextResponse.json(getVignettesList());
}

export async function POST(request: Request) {
  const body = await request.json();
  const now = new Date().toISOString().split('T')[0];
  const vignette = {
    id: body.id || `vignette_${Date.now()}`,
    title: body.title,
    status: body.status || 'draft',
    created_at: now,
    updated_at: now,
    simulation: body.simulation || { mode: 'immersive', creativity: 'balanced' },
    setting: body.setting || {},
    context: body.context || {},
    tensions_to_surface: body.tensions_to_surface || [],
    research_questions: body.research_questions || [],
    pkg_focus: body.pkg_focus || [],
  };
  saveVignette(vignette.id, vignette);
  return NextResponse.json(vignette, { status: 201 });
}
