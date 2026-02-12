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
  context: string;
  research_question: string;
  approach: string;
  core_tension: string;
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
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-sm">Loading thesis structure...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="glass rounded-2xl p-6">
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
    <div className="max-w-6xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{thesis.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{thesis.description}</p>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-6">
        {/* Problem Statement */}
        <section className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5">
            <h2 className="text-lg font-medium text-black">Problem Statement</h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-black/60 text-[12pt] leading-relaxed whitespace-pre-line">{thesis.problem_statement}</p>
          </div>
        </section>

        {/* Context */}
        <section className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5">
            <h2 className="text-lg font-medium text-black">Context</h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-black/60 text-[12pt] leading-relaxed whitespace-pre-line">{thesis.context}</p>
          </div>
        </section>

        {/* Research Question */}
        {/* <section className="glass rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="px-6 py-4 border-b border-purple-200/50">
            <h2 className="text-lg font-medium text-black">Research Question</h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-black/60 text-[12pt] leading-relaxed whitespace-pre-line">{thesis.research_question}</p>
          </div>
        </section> */}

        {/* Approach */}
        <section className="glass rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="px-6 py-4 border-b border-blue-200/50">
            <h2 className="text-lg font-medium text-black">Approach</h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-black/60 text-[12pt] leading-relaxed whitespace-pre-line">{thesis.approach}</p>
          </div>
        </section>

        {/* Core Tension */}
        <section className="glass rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="px-6 py-4 border-b border-amber-200/50">
            <h2 className="text-lg font-medium text-black">Core Tension</h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-black/60 text-[12pt] leading-relaxed whitespace-pre-line">{thesis.core_tension}</p>
          </div>
        </section>

        {/* Scope & Limitations */}
        <section className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5">
            <h2 className="text-lg font-medium text-black">Scope & Limitations</h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-black/60 text-[12pt] leading-relaxed whitespace-pre-line">{thesis.scope_and_limitations}</p>
          </div>
        </section>

        {/* Contributions */}
        <section className="space-y-4 mt-24 mb-62">
          <h2 className="text-2xl ml-6 font-medium text-black">Contributions</h2>
          {thesis.contributions.map((contribution) => (
            <div key={contribution.id} className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-black/5">
                <h3 className="text-[1.05rem] font-semibold text-gray-700">{contribution.name}</h3>
              </div>
              <div className="px-6 py-5">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{contribution.description}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
