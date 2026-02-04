'use client';

import { useEffect, useState } from 'react';
import { fetchWorld } from '@/lib/api';

interface WorldState {
  meta: {
    version: string;
    last_modified: string;
    description: string;
  };
  setting: {
    name: string;
    context: {
      year: number;
      summary: string;
    };
  };
  domains: Record<string, {
    id: string;
    name: string;
    description: string;
    status: string;
  }>;
  openQuestions: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

export default function Overview() {
  const [world, setWorld] = useState<WorldState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorld()
      .then(setWorld)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-100 rounded-2xl w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-100 rounded-xl w-2/3 mb-8"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="glass-card p-6">
          <h3 className="text-red-600 font-medium">Error loading world data</h3>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <p className="text-red-500 text-sm mt-2">
            Make sure the backend is running: <code className="bg-red-50 px-2 py-0.5 rounded-lg text-xs">cd backend && npm start</code>
          </p>
        </div>
      </div>
    );
  }

  if (!world) return null;

  const domainList = Object.values(world.domains);
  const lockedCount = domainList.filter((d) => d.status === 'locked').length;
  const openCount = world.openQuestions.filter((q) => q.status === 'open').length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">World Overview</h1>
            <p className="text-gray-400 mt-1.5 tracking-tight">{world.meta.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Version</div>
            <div className="text-2xl font-semibold text-gray-900 tracking-tight">v{world.meta.version}</div>
            <div className="text-xs text-gray-300 mt-1">Modified: {world.meta.last_modified}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-10">
        <div className="glass-card p-5">
          <div className="text-3xl font-semibold text-gray-900">{world.setting.context.year}</div>
          <div className="text-sm text-gray-400 mt-1">World Year</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-3xl font-semibold text-gray-900">{domainList.length}</div>
          <div className="text-sm text-gray-400 mt-1">Domains</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-3xl font-semibold gradient-text">{lockedCount}</div>
          <div className="text-sm text-gray-400 mt-1">Locked Decisions</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-3xl font-semibold text-emerald-500">{openCount}</div>
          <div className="text-sm text-gray-400 mt-1">Open Questions</div>
        </div>
      </div>

      {/* Domains Grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Domains</h2>
          <a href="/domains" className="text-sm text-[#008cff] hover:text-[#006acc] font-medium transition-colors">View all →</a>
        </div>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          {domainList
            .map((domain) => (
              <a
                key={domain.id}
                href={`/domains/${domain.id}`}
                className="card card-interactive p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{domain.name}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{domain.description}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 ${domain.status === 'locked' ? 'badge-locked' : 'badge-open'
                    }`}>
                    {domain.status}
                  </span>
                </div>
              </a>
            ))}
        </div>
      </div>

      {/* Open Questions */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Open Questions</h2>
          <a href="/questions" className="text-sm text-[#008cff] hover:text-[#006acc] font-medium transition-colors">View all →</a>
        </div>
        <div className="glass-card overflow-hidden">
          {world.openQuestions.slice(0, 5).map((q, idx) => (
            <div key={q.id} className={`p-5 flex items-center justify-between ${idx !== 0 ? 'border-t border-black/5' : ''}`}>
              <div className="flex items-center">
                <span className="text-sm font-mono text-gray-300 mr-4">{q.id}</span>
                <span className="text-gray-700">{q.name}</span>
              </div>
              <span className={`text-xs px-3 py-1 ${q.status === 'open' ? 'badge-open' : 'badge-locked'
                }`}>
                {q.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
