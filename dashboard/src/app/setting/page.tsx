'use client';

import { useEffect, useState } from 'react';
import { fetchSetting } from '@/lib/api';

interface TechnologyItem {
    id: string;
    name: string;
    description: string;
}

interface PainPoint {
    id: string;
    name: string;
    description: string;
}

interface Capability {
    id: string;
    name: string;
    description: string;
}

interface SettingData {
    id: string;
    name: string;
    description: string;
    context: {
        year: number;
        summary: string;
        technological_landscape: TechnologyItem[];
        design_constraint: string;
    };
    solution: {
        name: string;
        summary: string;
        capabilities: Capability[];
        implication: string;
    };
}

export default function SettingPage() {
    const [setting, setSetting] = useState<SettingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSetting()
            .then(setSetting)
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
                    <h3 className="text-red-600 font-medium">Error loading setting data</h3>
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                    <p className="text-red-500 text-sm mt-2">
                        Make sure the backend is running: <code className="bg-red-50 px-2 py-0.5 rounded-lg text-xs">cd backend && npm start</code>
                    </p>
                </div>
            </div>
        );
    }

    if (!setting) return null;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{setting.name}</h1>
                <p className="text-gray-400 mt-1.5 tracking-tight">{setting.description}</p>
            </div>

            {/* Year Hero */}
            <div className="glass-card p-8 mb-8 bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-200">
                <div className="text-center">
                    <div className="text-6xl font-bold text-gray-900 mb-3">{setting.context.year}</div>
                    <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">{setting.context.summary}</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Technological Landscape */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Technological Landscape</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {setting.context.technological_landscape.map((tech) => (
                            <div key={tech.id} className="glass-card p-5">
                                <h3 className="font-semibold text-gray-900 mb-2">{tech.name}</h3>
                                <p className="text-sm text-gray-700 leading-relaxed">{tech.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="glass-card p-5 bg-amber-50 border border-amber-200">
                        <h3 className="font-medium text-amber-900 text-sm mb-2">Design Constraint</h3>
                        <p className="text-amber-800 text-sm leading-relaxed whitespace-pre-line">{setting.context.design_constraint}</p>
                    </div>
                </section>

                {/* Solution */}
                <section className="glass-card p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Solution: {setting.solution.name}</h2>
                    <p className="text-gray-800 leading-relaxed mb-6 whitespace-pre-line">{setting.solution.summary}</p>

                    <div className="mb-6">
                        <h3 className="font-medium text-gray-900 mb-3">Core Capabilities</h3>
                        <div className="space-y-3">
                            {setting.solution.capabilities.map((capability) => (
                                <div key={capability.id} className="bg-white/70 rounded-lg p-4">
                                    <h4 className="font-medium text-emerald-900 mb-1">{capability.name}</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{capability.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-emerald-300 pt-4">
                        <h3 className="font-medium text-emerald-900 mb-2">Implication</h3>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line italic">{setting.solution.implication}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
