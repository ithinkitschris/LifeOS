'use client';

import { useEffect, useState } from 'react';

interface SessionSummary {
  id: string;
  vignette_id: string;
  vignette_title: string;
  mode: string;
  started_at: string;
  reaction_count: number;
  has_reflection: boolean;
}

interface Session {
  id: string;
  vignette_id: string;
  vignette_title: string;
  mode: string;
  started_at: string;
  reactions: Array<{
    id: string;
    timestamp: string;
    simulation_turn: number;
    simulation_context: string;
    reaction: string;
    tags: string[];
    tension_id: string | null;
  }>;
  transcript: Array<{ role: string; content: string }>;
  reflection: { generated_at: string; prompts: string } | null;
}

const TAG_COLORS: Record<string, string> = {
  'agency-held': 'bg-green-100 text-green-700',
  'agency-eroded': 'bg-red-100 text-red-700',
  'surprising': 'bg-yellow-100 text-yellow-700',
  'uncomfortable': 'bg-orange-100 text-orange-700',
  'delightful': 'bg-emerald-100 text-emerald-700',
  'design-tension': 'bg-purple-100 text-purple-700',
  'augmentation-landed': 'bg-blue-100 text-blue-700',
  'substitution-crept': 'bg-pink-100 text-pink-700',
};

export default function FindingsPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [active, setActive] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<'reactions' | 'transcript' | 'reflection'>('reactions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/findings')
      .then(r => r.json())
      .then(d => setSessions(d.sessions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSelect(id: string) {
    if (active?.id === id) return;
    const r = await fetch(`/api/findings/${id}`);
    const d = await r.json();
    setActive(d);
    setActiveTab('reactions');
  }

  const modeColors: Record<string, string> = {
    immersive: 'bg-purple-100 text-purple-700',
    reflective: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="flex h-screen">
      {/* Session list */}
      <div className="w-72 flex-shrink-0 border-r border-black/5 flex flex-col">
        <div className="px-6 py-5 border-b border-black/5">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Findings</h1>
          <p className="text-xs text-gray-400 mt-0.5">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {loading && <div className="text-sm text-gray-400 px-3 py-4">Loading...</div>}
          {!loading && sessions.length === 0 && (
            <div className="text-sm text-gray-400 px-3 py-4">No sessions yet. Run a simulation to capture findings.</div>
          )}
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className={`w-full text-left px-3 py-3 rounded-xl mb-1 transition-all duration-150 ${
                active?.id === s.id ? 'bg-black/5' : 'hover:bg-black/3'
              }`}
            >
              <div className="text-sm font-medium text-gray-800 leading-snug truncate">{s.vignette_title || s.vignette_id}</div>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${modeColors[s.mode] || modeColors.immersive}`}>
                  {s.mode}
                </span>
                <span className="text-[10px] text-gray-400">{s.reaction_count} reaction{s.reaction_count !== 1 ? 's' : ''}</span>
                {s.has_reflection && <span className="text-[10px] text-indigo-500">✦ reflected</span>}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                {new Date(s.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Session detail */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!active && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">Select a session to review findings</p>
          </div>
        )}
        {active && (
          <>
            {/* Session header */}
            <div className="px-8 py-5 border-b border-black/5 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">{active.vignette_title || active.vignette_id}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${modeColors[active.mode] || modeColors.immersive}`}>
                  {active.mode}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(active.started_at).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              {/* Tabs */}
              <div className="flex gap-1 mt-4">
                {(['reactions', 'transcript', 'reflection'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      activeTab === tab
                        ? 'bg-black text-white'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-black/5'
                    }`}
                  >
                    {tab === 'reactions' && `Reactions (${active.reactions.length})`}
                    {tab === 'transcript' && `Transcript (${active.transcript.length})`}
                    {tab === 'reflection' && (active.reflection ? 'Reflection ✦' : 'Reflection')}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {activeTab === 'reactions' && (
                <div className="space-y-3 max-w-2xl">
                  {active.reactions.length === 0 && (
                    <p className="text-sm text-gray-400">No reactions logged in this session.</p>
                  )}
                  {active.reactions.map(r => (
                    <div key={r.id} className="glass rounded-xl px-5 py-4">
                      <div className="text-sm text-gray-800 leading-relaxed">{r.reaction}</div>
                      {r.simulation_context && (
                        <div className="text-xs text-gray-400 mt-2 italic">Context: {r.simulation_context}</div>
                      )}
                      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                        {r.tags.map(tag => (
                          <span key={tag} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${TAG_COLORS[tag] || 'bg-gray-100 text-gray-600'}`}>
                            {tag}
                          </span>
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">turn {r.simulation_turn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'transcript' && (
                <div className="space-y-3 max-w-2xl">
                  {active.transcript.length === 0 && (
                    <p className="text-sm text-gray-400">No transcript recorded.</p>
                  )}
                  {active.transcript.map((t, i) => (
                    <div
                      key={i}
                      className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                        t.role === 'user'
                          ? 'bg-black text-white'
                          : 'glass text-gray-800'
                      }`}>
                        <div className={`text-[10px] font-medium mb-1 ${t.role === 'user' ? 'text-gray-400' : 'text-gray-400'}`}>
                          {t.role === 'user' ? 'Chris' : 'LifeOS'}
                        </div>
                        <div className="whitespace-pre-wrap">{t.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reflection' && (
                <div className="max-w-2xl">
                  {!active.reflection && (
                    <p className="text-sm text-gray-400">No reflection generated for this session.</p>
                  )}
                  {active.reflection && (
                    <div className="glass rounded-xl px-5 py-5">
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                        Reflection Prompts
                      </div>
                      <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {active.reflection.prompts}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-4">
                        Generated {new Date(active.reflection.generated_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
