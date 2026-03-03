import { NextResponse } from 'next/server';
import { getPKGStatus, loadWorldCanon, getCapabilitiesStatus } from '@/lib/knowledge';

export function GET() {
  const pkg = getPKGStatus();
  const worldCanon = loadWorldCanon();
  const capabilities = getCapabilitiesStatus();

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
    capabilities: {
      enabled: capabilities.enabled,
      loaded: capabilities.loaded,
      missing: capabilities.missing,
      directivesDir: capabilities.directivesDir,
      status: !capabilities.enabled
        ? 'disabled'
        : capabilities.missing.length === 0
          ? 'ok'
          : 'partial',
    },
  });
}
