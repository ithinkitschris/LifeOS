import { NextResponse } from 'next/server';
import { getDomainsList } from '@/lib/fs-data';

export function GET() {
  return NextResponse.json(getDomainsList());
}
