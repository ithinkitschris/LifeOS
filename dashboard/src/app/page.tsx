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
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading world data</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <p className="text-red-600 text-sm mt-2">
            Make sure the backend is running: <code className="bg-red-100 px-1 rounded">cd backend && npm start</code>
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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">World Overview</h1>
            <p className="text-gray-500 mt-1">{world.meta.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Version</div>
            <div className="text-lg font-mono font-medium text-gray-900">v{world.meta.version}</div>
            <div className="text-xs text-gray-400">Modified: {world.meta.last_modified}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-3xl font-bold text-gray-900">{world.setting.context.year}</div>
          <div className="text-sm text-gray-500">World Year</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-3xl font-bold text-gray-900">{domainList.length}</div>
          <div className="text-sm text-gray-500">Domains</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-3xl font-bold text-amber-600">{lockedCount}</div>
          <div className="text-sm text-gray-500">Locked Decisions</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-3xl font-bold text-green-600">{openCount}</div>
          <div className="text-sm text-gray-500">Open Questions</div>
        </div>
      </div>

      {/* Domains Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Domains</h2>
          <a href="/domains" className="text-sm text-lifeos-600 hover:text-lifeos-700">View all →</a>
        </div>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          {domainList
            .filter((domain) => !['modes', 'architecture', 'devices'].includes(domain.id))
            .map((domain) => (
            <a
              key={domain.id}
              href={`/domains/${domain.id}`}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-lifeos-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{domain.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{domain.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  domain.status === 'locked' ? 'badge-locked' : 'badge-open'
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Open Questions</h2>
          <a href="/questions" className="text-sm text-lifeos-600 hover:text-lifeos-700">View all →</a>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {world.openQuestions.slice(0, 5).map((q) => (
            <div key={q.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-mono text-gray-400 mr-3">{q.id}</span>
                <span className="text-gray-900">{q.name}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                q.status === 'open' ? 'badge-open' : 'badge-locked'
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
