'use client';

import { useEffect, useState } from 'react';
import { fetchDomains } from '@/lib/api';

interface Domain {
    id: string;
    name: string;
    description: string;
    status: string;
    version?: string;
}

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDomains()
            .then((data) => {
                // Convert domains object to array if needed
                const domainsArray = Array.isArray(data) ? data : Object.values(data.domains || data);
                setDomains(domainsArray);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-100 rounded-2xl w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded-xl w-2/3 mb-8"></div>
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
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
                    <h3 className="text-red-600 font-medium">Error loading domains</h3>
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                    <p className="text-red-500 text-sm mt-2">
                        Make sure the backend is running: <code className="bg-red-50 px-2 py-0.5 rounded-lg text-xs">cd backend && npm start</code>
                    </p>
                </div>
            </div>
        );
    }

    const lockedDomains = domains.filter(d => d.status === 'locked');
    const openDomains = domains.filter(d => d.status === 'open');

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">LifeOS Domains</h1>
                <p className="text-gray-400 mt-1.5 tracking-tight">
                    Core design areas defining LifeOS architecture and behavior
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-5 mb-10">
                <div className="glass-card p-5">
                    <div className="text-3xl font-semibold text-gray-900">{domains.length}</div>
                    <div className="text-sm text-gray-400 mt-1">Total Domains</div>
                </div>
                <div className="glass-card p-5">
                    <div className="text-3xl font-semibold gradient-text">{lockedDomains.length}</div>
                    <div className="text-sm text-gray-400 mt-1">Locked</div>
                </div>
                <div className="glass-card p-5">
                    <div className="text-3xl font-semibold text-emerald-500">{openDomains.length}</div>
                    <div className="text-sm text-gray-400 mt-1">Open</div>
                </div>
            </div>

            {/* Domains Grid */}
            <div className="space-y-8">
                {/* Locked Domains */}
                {lockedDomains.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Locked Domains</h2>
                        <p className="text-sm text-gray-500 mb-4">Design decisions that are finalized and shape the system</p>
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                            {lockedDomains.map((domain) => (
                                <a
                                    key={domain.id}
                                    href={`/domains/${domain.id}`}
                                    className="card card-interactive p-5"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{domain.name}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">{domain.description}</p>
                                            {domain.version && (
                                                <p className="text-xs text-gray-400 mt-2 font-mono">v{domain.version}</p>
                                            )}
                                        </div>
                                        <span className="badge-locked ml-3">
                                            {domain.status}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Open Domains */}
                {openDomains.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Open Domains</h2>
                        <p className="text-sm text-gray-500 mb-4">Areas still under exploration and refinement</p>
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                            {openDomains.map((domain) => (
                                <a
                                    key={domain.id}
                                    href={`/domains/${domain.id}`}
                                    className="card card-interactive p-5"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{domain.name}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">{domain.description}</p>
                                            {domain.version && (
                                                <p className="text-xs text-gray-400 mt-2 font-mono">v{domain.version}</p>
                                            )}
                                        </div>
                                        <span className="badge-open ml-3">
                                            {domain.status}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
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
