'use client';

import { useEffect, useState } from 'react';
import { fetchDomain } from '@/lib/api';

interface LifeDomain {
    id: string;
    name: string;
    description: string;
    order: number;
}

interface DomainDetail {
    id: string;
    name: string;
    description: string;
    status: string;
    version?: string;
    sections?: any[];
    key_characteristics?: string[];
    example_modes?: string[];
    constitutional_considerations?: string[];
    [key: string]: any;
}

export default function LifeDomainsPage() {
    const [domains, setDomains] = useState<LifeDomain[]>([]);
    const [domainDetails, setDomainDetails] = useState<Record<string, DomainDetail>>({});
    const [loading, setLoading] = useState(true);
    const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

    // The 7 life domain IDs (excluding modes and intents)
    const lifeDomainIds = [
        'navigation-mobility',
        'communication-connection',
        'entertainment-media',
        'life-management',
        'work-career',
        'health-wellness',
        'personal-fulfillment'
    ];

    useEffect(() => {
        fetch('/api/world/domains')
            .then(res => res.json())
            .then(async (data) => {
                // Filter to only life domains
                const lifeDomains = (data.domains || [])
                    .filter((d: LifeDomain) => lifeDomainIds.includes(d.id))
                    .sort((a: LifeDomain, b: LifeDomain) => a.order - b.order);
                setDomains(lifeDomains);

                // Fetch details for each domain
                const details: Record<string, DomainDetail> = {};
                await Promise.all(
                    lifeDomains.map(async (domain: LifeDomain) => {
                        try {
                            const detail = await fetchDomain(domain.id);
                            details[domain.id] = detail;
                        } catch (e) {
                            console.error(`Failed to load domain ${domain.id}:`, e);
                        }
                    })
                );
                setDomainDetails(details);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load domains:', err);
                setLoading(false);
            });
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

    const expandAll = () => {
        setExpandedDomains(new Set(domains.map(d => d.id)));
    };

    const collapseAll = () => {
        setExpandedDomains(new Set());
    };

    if (loading) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-100 rounded-2xl w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded-xl w-2/3 mb-8"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-3">
                    Life Domains
                </h1>
                <p className="text-gray-600 text-lg max-w-3xl">
                    The seven fundamental categories of human activity and attention in LifeOS.
                    Each domain can spawn countless contextual modes based on the user's specific situation.
                </p>
            </div>

            {/* Expand/Collapse Controls */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={expandAll}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Expand All
                </button>
                <button
                    onClick={collapseAll}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Collapse All
                </button>
            </div>

            {/* Domain Sections */}
            <div className="space-y-4">
                {domains.map((domain) => {
                    const detail = domainDetails[domain.id];
                    const isExpanded = expandedDomains.has(domain.id);

                    return (
                        <div
                            key={domain.id}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                        >
                            {/* Domain Header - Always Visible */}
                            <button
                                onClick={() => toggleDomain(domain.id)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-semibold">
                                        {domain.order}
                                    </span>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {domain.name}
                                        </h2>
                                        <p className="text-gray-500 text-sm mt-0.5">
                                            {domain.description}
                                        </p>
                                    </div>
                                </div>
                                <svg
                                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && detail && (
                                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                                    {/* Key Characteristics */}
                                    {detail.key_characteristics && detail.key_characteristics.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-medium text-gray-700 mb-3">Key Characteristics</h3>
                                            <ul className="space-y-2">
                                                {detail.key_characteristics.map((char: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <span className="text-violet-500 mt-0.5">•</span>
                                                        {char}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Example Modes - Fluid Mode Examples */}
                                    {detail.example_modes && detail.example_modes.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-medium text-gray-700 mb-3">Example Modes</h3>
                                            <p className="text-xs text-gray-500 mb-2">
                                                These are examples of fluid modes that can emerge within this domain:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {detail.example_modes.map((mode: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-sm border border-sky-100"
                                                    >
                                                        {mode}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Constitutional Considerations */}
                                    {detail.constitutional_considerations && detail.constitutional_considerations.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-medium text-gray-700 mb-3">Constitutional Considerations</h3>
                                            <ul className="space-y-2">
                                                {detail.constitutional_considerations.map((consideration: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <span className="text-amber-500 mt-0.5">→</span>
                                                        {consideration}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Sections */}
                                    {detail.sections && detail.sections.length > 0 && (
                                        <div className="space-y-4">
                                            {detail.sections.map((section: any) => (
                                                <div key={section.id} className="bg-gray-50 rounded-lg p-4">
                                                    <h4 className="font-medium text-gray-900 mb-2">{section.name}</h4>
                                                    {section.description && (
                                                        <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                                                    )}
                                                    {section.content && (
                                                        <p className="text-sm text-gray-700">{section.content}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Status and Version */}
                                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
                                        <span className={`px-2 py-1 rounded ${detail.status === 'locked' ? 'bg-emerald-50 text-emerald-600' :
                                                detail.status === 'open' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-gray-100 text-gray-500'
                                            }`}>
                                            {detail.status}
                                        </span>
                                        {detail.version && (
                                            <span className="font-mono">v{detail.version}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Summary Card */}
            <div className="mt-8 p-6 bg-gradient-to-r from-violet-50 to-sky-50 border border-violet-100 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Domains Are the Foundation
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                    Life Domains are stable categories that inform how LifeOS generates contextual modes.
                    Unlike fixed app categories, modes are <strong>fluid</strong>—they emerge naturally from the intersection
                    of a domain and the user's current situation. A domain like "Communication & Connection" can spawn
                    modes like "Thesis Discussion", "Catch-up", or "Quick Check-in" depending on context.
                </p>
            </div>
        </div>
    );
}
