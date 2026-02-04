'use client';

import { useEffect, useState } from 'react';
import { fetchThesis } from '@/lib/api';

interface Contribution {
  id: string;
  name: string;
  description: string;
}

interface ThesisData {
  id: string;
  name: string;
  description: string;
  problem_statement: string;
  diagnosis: string;
  solution: {
    name: string;
    summary: string;
  };
  core_tension: {
    summary: string;
    statement: string;
  };
  scope_and_limitations: string;
  contributions: Contribution[];
}

export default function ThesisPage() {
  const [thesis, setThesis] = useState<ThesisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchThesis()
      .then(setThesis)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-100 rounded-2xl w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-100 rounded-xl w-2/3 mb-8"></div>
          <div className="space-y-4">
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
      <div className="p-8 max-w-6xl mx-auto">
        <div className="glass-card p-6">
          <h3 className="text-red-600 font-medium">Error loading thesis data</h3>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <p className="text-red-500 text-sm mt-2">
            Make sure the backend is running: <code className="bg-red-50 px-2 py-0.5 rounded-lg text-xs">cd backend && npm start</code>
          </p>
        </div>
      </div>
    );
  }

  if (!thesis) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{thesis.name}</h1>
        <p className="text-gray-400 mt-1.5 tracking-tight">{thesis.description}</p>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-8">
        {/* Problem Statement */}
        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Problem Statement</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{thesis.problem_statement}</p>
        </section>

        {/* Diagnosis */}
        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Diagnosis</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{thesis.diagnosis}</p>
        </section>

        {/* Solution */}
        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Solution: {thesis.solution.name}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{thesis.solution.summary}</p>
        </section>

        {/* Core Tension */}
        <section className="glass-card p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Core Tension</h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{thesis.core_tension.summary}</p>
            <div className="border-l-4 border-amber-400 pl-4">
              <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-line">{thesis.core_tension.statement}</p>
            </div>
          </div>
        </section>

        {/* Scope & Limitations */}
        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Scope & Limitations</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{thesis.scope_and_limitations}</p>
        </section>

        {/* Contributions */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Contributions</h2>
          <div className="grid grid-cols-1 gap-4">
            {thesis.contributions.map((contribution) => (
              <div key={contribution.id} className="glass-card p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{contribution.name}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{contribution.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
