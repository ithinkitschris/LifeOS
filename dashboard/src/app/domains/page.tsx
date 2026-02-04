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
    defined_modes?: any[];
    [key: string]: any;
}

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

    // Known domain IDs from the registry
    const domainIds = ['modes', 'intents'];

    useEffect(() => {
        Promise.all(domainIds.map(id => fetchDomain(id)))
            .then(setDomains)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const toggleDomain = (id: string) => {
        setExpandedDomains(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    if (loading) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-100 rounded-2xl w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded-xl w-2/3 mb-8"></div>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
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
                    <h3 className="text-red-600 font-medium">Error loading domains</h3>
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                    <p className="text-red-500 text-sm mt-2">
                        Make sure the backend is running: <code className="bg-red-50 px-2 py-0.5 rounded-lg text-xs">cd backend && npm start</code>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">LifeOS Domains</h1>
                <p className="text-gray-400 mt-1.5 tracking-tight">
                    Core design areas defining LifeOS architecture and behavior
                </p>
            </div>

            {/* Domains List */}
            <div className="space-y-6">
                {domains.map((domain) => (
                    <DomainCard
                        key={domain.id}
                        domain={domain}
                        isExpanded={expandedDomains.has(domain.id)}
                        onToggle={() => toggleDomain(domain.id)}
                    />
                ))}

                {domains.length === 0 && (
                    <div className="glass-card p-10 text-center">
                        <div className="text-gray-400 mb-3">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-gray-700 font-medium mb-1">No domains yet</h3>
                        <p className="text-gray-500 text-sm">Domains will appear here as they are defined</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Domain Card Component
function DomainCard({ domain, isExpanded, onToggle }: { domain: Domain; isExpanded: boolean; onToggle: () => void }) {
    return (
        <div className="glass-card overflow-hidden">
            {/* Domain Header */}
            <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-semibold text-gray-900">{domain.name}</h2>
                            {domain.version && (
                                <span className="text-xs text-gray-400 font-mono">v{domain.version}</span>
                            )}
                        </div>
                        <p className="text-gray-600">{domain.description}</p>
                    </div>
                    <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-transform">
                        <svg
                            className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Domain Content */}
            {isExpanded && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {domain.id === 'modes' && <ModesContent domain={domain} />}
                    {domain.id === 'intents' && <IntentsContent domain={domain} />}
                </div>
            )}
        </div>
    );
}

// Modes Domain Content
function ModesContent({ domain }: { domain: Domain }) {
    const sections = domain.sections || [];
    const definedModes = domain.defined_modes || [];

    return (
        <div className="space-y-8">
            {/* Mechanics sections */}
            <div className="grid grid-cols-1 gap-6">
                {sections.map((section: any) => (
                    <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                            {section.description && (
                                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                            )}
                        </div>

                        <div className="p-6">
                            {/* Activation thresholds */}
                            {section.mechanics?.thresholds && (
                                <div className="space-y-3 mb-6">
                                    {section.mechanics.thresholds.map((t: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-shrink-0 w-16 text-center">
                                                <span className="text-lg font-mono font-bold text-sky-600">{t.value}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 text-sm">{t.type}</h4>
                                                <p className="text-xs text-gray-600 mt-0.5">{t.behavior}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {section.mechanics?.hysteresis_rationale && (
                                <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded">
                                    {section.mechanics.hysteresis_rationale.trim()}
                                </p>
                            )}

                            {/* Exit design */}
                            {section.invariant && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                                    <p className="text-emerald-800 font-medium">{section.invariant}</p>
                                </div>
                            )}

                            {section.friction_design && (
                                <ul className="space-y-2 mb-4">
                                    {section.friction_design.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-sky-500 mt-0.5">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {section.template && (
                                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                                    {section.template.trim()}
                                </div>
                            )}

                            {/* Mode collision approaches */}
                            {section.candidate_approaches && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            </div>

            {/* Defined Modes */}
            {definedModes.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Defined Modes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {definedModes.map((mode: any) => (
                            <div key={mode.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className={`px-6 py-4 border-b ${mode.status === 'defined' ? 'bg-emerald-50 border-emerald-100' :
                                    'bg-gray-50 border-gray-100'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-semibold text-gray-900">{mode.name}</h4>
                                        <span className={`text-xs px-2 py-1 rounded ${mode.status === 'defined' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-gray-200 text-gray-600'
                                            }`}>{mode.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{mode.purpose}</p>
                                </div>

                                <div className="p-6">
                                    {mode.activation_triggers && (
                                        <div className="mb-4">
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Activation Triggers</h5>
                                            <ul className="space-y-1">
                                                {mode.activation_triggers.map((trigger: string, i: number) => (
                                                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                        <span className="text-sky-500">→</span>
                                                        {trigger}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {mode.triage && (
                                        <div className="grid grid-cols-3 gap-3">
                                            {mode.triage.center && (
                                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                                    <h6 className="text-xs font-semibold text-emerald-800 uppercase mb-2">Center</h6>
                                                    <ul className="space-y-1">
                                                        {mode.triage.center.map((item: string, i: number) => (
                                                            <li key={i} className="text-xs text-emerald-700">{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {mode.triage.periphery && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <h6 className="text-xs font-semibold text-blue-800 uppercase mb-2">Periphery</h6>
                                                    <ul className="space-y-1">
                                                        {mode.triage.periphery.map((item: string, i: number) => (
                                                            <li key={i} className="text-xs text-blue-700">{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {mode.triage.silence && (
                                                <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                                                    <h6 className="text-xs font-semibold text-gray-700 uppercase mb-2">Silence</h6>
                                                    <ul className="space-y-1">
                                                        {mode.triage.silence.map((item: string, i: number) => (
                                                            <li key={i} className="text-xs text-gray-600">{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {mode.exit_conditions && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Exit Conditions</h5>
                                            <ul className="space-y-1">
                                                {mode.exit_conditions.map((cond: string, i: number) => (
                                                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                        <span className="text-gray-400">•</span>
                                                        {cond}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Intents Domain Content
function IntentsContent({ domain }: { domain: Domain }) {
    const sections = domain.sections || [];

    return (
        <div className="grid grid-cols-1 gap-6">
            {sections.map((section: any) => (
                <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
        </div>
    );
}
