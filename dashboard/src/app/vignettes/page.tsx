'use client';

import { useEffect, useState } from 'react';

interface VignetteSummary {
  id: string;
  title: string;
  status: 'active' | 'draft' | 'archived';
  simulation: { mode: string; creativity: string };
  created_at: string;
  updated_at: string;
}

interface Vignette extends VignetteSummary {
  setting?: {
    date?: string;
    time?: string;
    location?: string;
    lifeos_mode?: string;
    device?: string;
  };
  tensions_to_surface?: Array<{ id: string; description: string }>;
  research_questions?: string[];
}

export default function VignettesPage() {
  const [vignettes, setVignettes] = useState<VignetteSummary[]>([]);
  const [active, setActive] = useState<Vignette | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vignettes')
      .then(r => r.json())
      .then(d => setVignettes(d.vignettes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSelect(id: string) {
    if (active?.id === id) return;
    const r = await fetch(`/api/vignettes/${id}`);
    const d = await r.json();
    setActive(d);
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-gray-100 text-gray-500',
  };

  const modeColors: Record<string, string> = {
    immersive: 'bg-purple-100 text-purple-700',
    reflective: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="flex h-screen">
      {/* List panel */}
      <div className="w-80 flex-shrink-0 border-r border-black/5 flex flex-col">
        <div className="px-6 py-5 border-b border-black/5">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Vignettes</h1>
          <p className="text-xs text-gray-400 mt-0.5">Simulation specifications</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {loading && (
            <div className="text-sm text-gray-400 px-3 py-4">Loading...</div>
          )}
          {!loading && vignettes.length === 0 && (
            <div className="text-sm text-gray-400 px-3 py-4">No vignettes yet.</div>
          )}
          {vignettes.map(v => (
            <button
              key={v.id}
              onClick={() => handleSelect(v.id)}
              className={`w-full text-left px-3 py-3 rounded-xl mb-1 transition-all duration-150 ${
                active?.id === v.id
                  ? 'bg-black/5'
                  : 'hover:bg-black/3'
              }`}
            >
              <div className="text-sm font-medium text-gray-800 leading-snug">{v.title}</div>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[v.status] || statusColors.draft}`}>
                  {v.status}
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${modeColors[v.simulation?.mode] || modeColors.immersive}`}>
                  {v.simulation?.mode}
                </span>
              </div>
              <div className="text-[10px] text-gray-400 mt-1">{v.updated_at}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-y-auto px-8 py-10">
        {!active && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">Select a vignette to view details</p>
          </div>
        )}
        {active && (
          <div className="max-w-2xl space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{active.title}</h2>
                <a
                  href={`/simulate?vignette=${active.id}`}
                  className="flex-shrink-0 px-4 py-2 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Run Simulation
                </a>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[active.status] || statusColors.draft}`}>
                  {active.status}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${modeColors[active.simulation?.mode] || modeColors.immersive}`}>
                  {active.simulation?.mode}
                </span>
                <span className="text-xs text-gray-400">{active.simulation?.creativity}</span>
              </div>
            </div>

            {active.setting && (
              <section className="glass rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-black/5">
                  <h3 className="text-sm font-medium text-black">Setting</h3>
                </div>
                <div className="px-5 py-4 space-y-1.5">
                  {Object.entries(active.setting).map(([k, v]) => v && (
                    <div key={k} className="flex gap-2 text-sm">
                      <span className="text-gray-400 w-28 flex-shrink-0 capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="text-gray-800">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {active.tensions_to_surface && active.tensions_to_surface.length > 0 && (
              <section className="glass rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-black/5">
                  <h3 className="text-sm font-medium text-black">Design Tensions</h3>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {active.tensions_to_surface.map(t => (
                    <div key={t.id}>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">{t.id}</div>
                      <div className="text-sm text-gray-700 leading-relaxed">{t.description}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {active.research_questions && active.research_questions.length > 0 && (
              <section className="glass rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-black/5">
                  <h3 className="text-sm font-medium text-black">Research Questions</h3>
                </div>
                <div className="px-5 py-4 space-y-2">
                  {active.research_questions.map((q, i) => (
                    <div key={i} className="text-sm text-gray-700 leading-relaxed flex gap-2">
                      <span className="text-gray-400 flex-shrink-0">{i + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
