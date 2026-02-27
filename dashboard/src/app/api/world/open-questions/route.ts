import { NextResponse } from 'next/server';
import { getWorldOpenQuestions, saveWorldOpenQuestions } from '@/lib/fs-data';

export function GET() {
  return NextResponse.json(getWorldOpenQuestions());
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = getWorldOpenQuestions() as any;
  const questions = data?.questions || [];
  const newQuestion = {
    id: body.id || `q_${Date.now()}`,
    name: body.name,
    question: body.question,
    domain: body.domain || null,
    notes: body.notes || null,
    created_at: new Date().toISOString(),
    status: 'open',
  };
  questions.push(newQuestion);
  saveWorldOpenQuestions({ ...data, questions });
  return NextResponse.json(newQuestion, { status: 201 });
}
