import { NextResponse } from 'next/server';
import { getPrototypeRegistry } from '@/lib/fs-data';

export function GET() {
  const data = getPrototypeRegistry();
  return NextResponse.json({ prototypes: data?.prototypes ?? [] });
}
