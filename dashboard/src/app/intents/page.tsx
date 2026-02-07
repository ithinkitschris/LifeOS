'use client';

import { useEffect, useState } from 'react';
import { fetchDomain } from '@/lib/api';

interface Domain {
    id: string;
    name: string;
    description: string;
    status: string;
    version?: string;
    sections?: any[];
    [key: string]: any;
}

export default function IntentsPage() {
    const [domain, setDomain] = useState<Domain | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDomain('intents')
            .then(setDomain)
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
                            <div key={i} className="h-48 bg-gray-100 rounded-2xl"></div>
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
                    <h3 className="text-red-600 font-medium">Error loading intent framework</h3>
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                    <p className="text-red-500 text-sm mt-2">
                        Make sure the backend is running: <code className="bg-red-50 px-2 py-0.5 rounded-lg text-xs">cd backend && npm start</code>
                    </p>
                </div>
            </div>
        );
    }

    if (!domain) return null;

    const sections = domain.sections || [];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{domain.name}</h1>
                    {domain.version && (
                        <span className="text-xs text-gray-400 font-mono mt-1">v{domain.version}</span>
                    )}
                </div>
                <p className="text-gray-400 mt-1.5 tracking-tight">{domain.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {sections.map((section: any) => (
                    <div key={section.id} className="glass-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                            {section.description && (
                                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                            )}
                        </div>

                        <div className="p-6">
                            {/* Requirements */}
                            {section.requirements && (
                                <div className="grid md:grid-cols-2 gap-3 mb-4">
                                    {section.requirements.map((req: any) => (
                                        <div key={req.id} className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                                            <h4 className="font-medium text-sky-900">{req.name}</h4>
                                            <p className="text-sm text-sky-700 mt-1">{req.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {section.rationale && (
                                <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded">
                                    {section.rationale.trim()}
                                </p>
                            )}

                            {/* Comparison table */}
                            {section.comparison && (
                                <div className="overflow-hidden rounded-lg border border-gray-200 mt-4">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium text-gray-700">Aspect</th>
                                                <th className="px-4 py-3 text-left font-medium text-gray-700">Traditional App</th>
                                                <th className="px-4 py-3 text-left font-medium text-gray-700">LifeOS Intent</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {section.comparison.map((row: any, i: number) => (
                                                <tr key={i} className="bg-white">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{row.aspect}</td>
                                                    <td className="px-4 py-3 text-gray-600">{row.traditional_app}</td>
                                                    <td className="px-4 py-3 text-sky-700">{row.lifeos_intent}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Candidate approaches */}
                            {section.candidate_approaches && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                    {section.candidate_approaches.map((approach: any, i: number) => (
                                        <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                            <h4 className="font-medium text-amber-900 text-sm">{approach.name}</h4>
                                            <p className="text-xs text-amber-700 mt-1">{approach.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {sections.length === 0 && (
                    <div className="glass-card p-10 text-center">
                        <div className="text-gray-400 mb-3">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                            </svg>
                        </div>
                        <h3 className="text-gray-700 font-medium mb-1">No intent sections defined yet</h3>
                        <p className="text-gray-500 text-sm">Intent framework sections will appear here as they are defined</p>
                    </div>
                )}
            </div>
        </div>
    );
}
