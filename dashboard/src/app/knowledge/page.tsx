'use client';

import { useEffect, useState } from 'react';

interface PKGStatus {
  pkg: {
    loaded: string[];
    missing: string[];
    pkgDir: string;
    status: 'ok' | 'partial';
  };
  worldCanon: {
    loaded: boolean;
    length: number;
  };
}

const PKG_DESCRIPTIONS: Record<string, string> = {
  'core/identity.md': 'Who Chris is — background, traits, self-conception',
  'core/thinking.md': 'How Chris thinks — cognitive patterns, mental models',
  'core/working.md': 'How Chris works — process, environment, collaboration',
  'core/values.md': 'What Chris values — priorities, principles, commitments',
  'positions/technology.md': 'Technology stance — relationship with tools and AI',
  'positions/career.md': 'Career orientation — goals, identity, direction',
  'positions/design.md': 'Design philosophy — approach, taste, conviction',
  'positions/personal.md': 'Personal positions — relationships, life philosophy',
  'context/life.md': 'Life context — current situation, ongoing projects',
  'context/interpersonal.md': 'Relationships — people, dynamics, communication patterns',
  'context/behavioral.md': 'Behavioral patterns — habits, rhythms, tendencies',
  'context/personal-life.md': 'Personal life — interests, history, environment',
};

const TIER_LABELS: Record<string, string> = {
  core: 'Core',
  positions: 'Positions',
  context: 'Context',
};

export default function KnowledgePage() {
  const [status, setStatus] = useState<PKGStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/pkg/status')
      .then(r => r.json())
      .then(setStatus)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const byTier = (files: string[]) => {
    const tiers: Record<string, string[]> = { core: [], positions: [], context: [] };
    for (const f of files) {
      const tier = f.split('/')[0];
      if (tiers[tier]) tiers[tier].push(f);
    }
    return tiers;
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Knowledge</h1>
        <p className="text-sm text-gray-500 mt-1">
          What the simulation system knows — PKG and world canon status
        </p>
      </div>

      {loading && <div className="text-sm text-gray-400">Loading...</div>}
      {error && <div className="text-sm text-red-500">Error: {error}</div>}

      {status && (
        <div className="space-y-6">
          {/* Status summary */}
          <section className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
              <h2 className="text-base font-medium text-black">System Status</h2>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${status.pkg.status === 'ok' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-xs text-gray-500">{status.pkg.status === 'ok' ? 'All PKG files loaded' : 'Partial load'}</span>
              </div>
            </div>
            <div className="px-6 py-4 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-semibold text-gray-900">{status.pkg.loaded.length}</div>
                <div className="text-xs text-gray-400 mt-0.5">PKG files loaded</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">{status.pkg.missing.length}</div>
                <div className="text-xs text-gray-400 mt-0.5">Missing files</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">{Math.round(status.worldCanon.length / 1000)}k</div>
                <div className="text-xs text-gray-400 mt-0.5">World canon chars</div>
              </div>
            </div>
          </section>

          {/* PKG files by tier */}
          {(['core', 'positions', 'context'] as const).map(tier => {
            const loadedInTier = byTier(status.pkg.loaded)[tier] || [];
            const missingInTier = byTier(status.pkg.missing)[tier] || [];
            const allInTier = [...loadedInTier, ...missingInTier];
            if (allInTier.length === 0) return null;
            return (
              <section key={tier} className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-black/5">
                  <h2 className="text-base font-medium text-black">{TIER_LABELS[tier]}</h2>
                </div>
                <div className="divide-y divide-black/5">
                  {allInTier.map(file => {
                    const isLoaded = loadedInTier.includes(file);
                    return (
                      <div key={file} className="px-6 py-3.5 flex items-start gap-3">
                        <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${isLoaded ? 'bg-green-500' : 'bg-red-400'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800">{file.split('/').pop()}</div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {PKG_DESCRIPTIONS[file] || file}
                          </div>
                        </div>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                          isLoaded ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {isLoaded ? 'loaded' : 'missing'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* World canon */}
          <section className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5">
              <h2 className="text-base font-medium text-black">World Canon</h2>
            </div>
            <div className="px-6 py-4 flex items-start gap-3">
              <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${status.worldCanon.loaded ? 'bg-green-500' : 'bg-red-400'}`} />
              <div>
                <div className="text-sm font-medium text-gray-800">WORLD.md</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {status.worldCanon.loaded
                    ? `${status.worldCanon.length.toLocaleString()} characters — Domain-Mode-Intent, Center/Periphery/Silence, constitutional framework, device ecosystem`
                    : 'Not found at repo root'}
                </div>
              </div>
            </div>
          </section>

          {/* PKG path */}
          <div className="text-xs text-gray-400 px-1">
            PKG path: <code className="font-mono text-gray-500">{status.pkg.pkgDir}</code>
          </div>
        </div>
      )}
    </div>
  );
}
