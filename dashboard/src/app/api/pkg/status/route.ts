import { NextResponse } from 'next/server';
import { getPKGStatus, loadWorldCanon } from '@/lib/knowledge';

export function GET() {
  const pkg = getPKGStatus();
  const worldCanon = loadWorldCanon();
  return NextResponse.json({
    pkg: {
      loaded: pkg.loaded,
      missing: pkg.missing,
      pkgDir: pkg.pkgDir,
      status: pkg.missing.length === 0 ? 'ok' : 'partial',
    },
    worldCanon: {
      loaded: worldCanon.length > 0,
      length: worldCanon.length,
    },
  });
}
