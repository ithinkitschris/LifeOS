import { NextResponse } from 'next/server';
import { getWorldOpenQuestions, saveWorldOpenQuestions } from '@/lib/fs-data';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const data = getWorldOpenQuestions() as any;
  const questions = data?.questions || [];
  const idx = questions.findIndex((q: any) => q.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  questions[idx] = { ...questions[idx], ...body, id };
  saveWorldOpenQuestions({ ...data, questions });
  return NextResponse.json(questions[idx]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = getWorldOpenQuestions() as any;
  const questions = (data?.questions || []).filter((q: any) => q.id !== id);
  saveWorldOpenQuestions({ ...data, questions });
  return NextResponse.json({ deleted: id });
}
