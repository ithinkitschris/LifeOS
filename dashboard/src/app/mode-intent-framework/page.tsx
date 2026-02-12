'use client';

import { useEffect, useState } from 'react';
import { fetchDomain } from '@/lib/api';
import Link from 'next/link';

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

interface LifeDomain {
    id: string;
    name: string;
    description: string;
    order: number;
}

// Example modes for each life domain to illustrate fluidity
const DOMAIN_MODE_EXAMPLES: Record<string, string[]> = {
    'communication-connection': ['Thesis Discussion', 'Critique', 'Catch-up', 'Messaging', 'Deep Conversation', 'Quick Check-in'],
    'work-career': ['Focus Work', 'Meeting', 'Planning', 'Creative Session', 'Review', 'Brainstorming'],
    'health-wellness': ['Workout', 'Meditation', 'Recovery', 'Sleep Prep', 'Active Recovery', 'Health Check'],
    'navigation-mobility': ['Commute', 'Exploration', 'Errand Run', 'Travel', 'Walking Meeting', 'Transit'],
    'entertainment-media': ['Movie Night', 'Gaming', 'Reading', 'Music Discovery', 'Podcast', 'Browsing'],
    'life-management': ['Weekly Review', 'Financial Check', 'Home Maintenance', 'Planning', 'Admin Tasks', 'Organizing'],
    'personal-fulfillment': ['Learning', 'Creative Project', 'Skill Practice', 'Reflection', 'Journaling', 'Side Project'],
};

export default function ModeIntentFrameworkPage() {
    const [modesData, setModesData] = useState<Domain | null>(null);
    const [intentsData, setIntentsData] = useState<Domain | null>(null);
    const [lifeDomains, setLifeDomains] = useState<LifeDomain[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'modes' | 'intents'>('overview');
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            fetchDomain('modes'),
            fetchDomain('intents'),
            fetch('http://localhost:3001/api/world/domains').then(r => r.json())
        ])
            .then(([modes, intents, domainsRes]) => {
                setModesData(modes);
                setIntentsData(intents);
                // Filter out modes and intents from life domains list
                const actualLifeDomains = (domainsRes.domains || [])
                    .filter((d: LifeDomain) => d.id !== 'modes' && d.id !== 'intents')
                    .sort((a: LifeDomain, b: LifeDomain) => a.order - b.order);
                setLifeDomains(actualLifeDomains);
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
                    <h3 className="text-red-600 font-medium">Error loading Mode–Intent Framework</h3>
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                    <p className="text-red-500 text-sm mt-2">
                        Make sure the backend is running: <code className="bg-red-50 px-2 py-0.5 rounded-lg text-xs">cd backend && npm start</code>
                    </p>
                </div>
            </div>
        );
    }

    const modesSections = modesData?.sections || [];
    const definedModes = modesData?.defined_modes || [];
    const intentsSections = intentsData?.sections || [];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Mode–Intent Framework</h1>
                    {modesData?.version && (
                        <span className="text-xs text-gray-400 font-mono mt-1">v{modesData.version}</span>
                    )}
                </div>
                <p className="text-gray-400 mt-1.5 tracking-tight max-w-3xl">
                    The core interaction pattern of LifeOS: Life Domains inform contextual Modes, which surface relevant Intents that dynamically generate the user interface.
                </p>
            </div>

            {/* Core Flow Visualization */}
            <div className="glass-card overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 via-sky-50 to-emerald-50">
                    <h3 className="text-lg font-semibold text-gray-900">The Framework Flow</h3>
                    <p className="text-sm text-gray-600 mt-1">How LifeOS determines what to show you, when</p>
                </div>
                <div className="p-6">
                    {/* Flow diagram */}
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 relative">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-7 h-7 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-semibold">1</span>
                                <h4 className="font-semibold text-violet-900">Life Domain</h4>
                            </div>
                            <p className="text-sm text-violet-700">
                                The 7 fundamental categories of human activity—your life areas.
                            </p>
                            <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                                <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 relative">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-7 h-7 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-semibold">2</span>
                                <h4 className="font-semibold text-sky-900">Mode</h4>
                            </div>
                            <p className="text-sm text-sky-700">
                                A fluid, contextual stance activated within a domain based on your current situation.
                            </p>
                            <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                                <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 relative">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-semibold">3</span>
                                <h4 className="font-semibold text-indigo-900">Intent</h4>
                            </div>
                            <p className="text-sm text-indigo-700">
                                Available actions relevant to this moment, surfaced by the active mode.
                            </p>
                            <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                                <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-7 h-7 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-semibold">4</span>
                                <h4 className="font-semibold text-emerald-900">UI</h4>
                            </div>
                            <p className="text-sm text-emerald-700">
                                Dynamically generated interface showing only what matters for this moment.
                            </p>
                        </div>
                    </div>

                    {/* Compact flow summary */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 text-center flex items-center justify-center flex-wrap gap-2">
                            <span className="font-medium text-violet-700 bg-violet-100 px-2 py-0.5 rounded">Domain</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-gray-500 text-xs">informs</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium text-sky-700 bg-sky-100 px-2 py-0.5 rounded">Mode</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-gray-500 text-xs">surfaces</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">Intent</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-gray-500 text-xs">generates</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">UI</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Modes are Fluid - Key Concept */}
            <div className="glass-card overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100 bg-amber-50">
                    <h3 className="text-lg font-semibold text-gray-900">Modes are Fluid</h3>
                    <p className="text-sm text-gray-600 mt-1">Mode names emerge from context, not a fixed list</p>
                </div>
                <div className="p-6">
                    <p className="text-gray-600 mb-6">
                        Unlike traditional app categories, <strong>modes are not fixed</strong>. Each life domain can spawn numerous contextual modes based on what the user is doing.
                        A mode name like "Thesis Discussion" or "Quick Check-in" emerges naturally from the intersection of domain and situation.
                    </p>

                    {/* Interactive Domain → Mode Explorer */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h4 className="font-medium text-gray-700 text-sm">Explore Domain → Mode Examples</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Click a domain to see example modes that could emerge</p>
                        </div>
                        <div className="p-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {lifeDomains.map((domain) => (
                                    <button
                                        key={domain.id}
                                        onClick={() => setSelectedDomain(selectedDomain === domain.id ? null : domain.id)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedDomain === domain.id
                                            ? 'bg-violet-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {domain.name}
                                    </button>
                                ))}
                            </div>

                            {selectedDomain && (
                                <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 animate-fadeIn">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-sm font-medium text-violet-700">
                                            {lifeDomains.find(d => d.id === selectedDomain)?.name}
                                        </span>
                                        <span className="text-gray-400">→</span>
                                        <span className="text-sm text-gray-600">possible modes:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(DOMAIN_MODE_EXAMPLES[selectedDomain] || ['Custom Mode 1', 'Custom Mode 2', 'Custom Mode 3']).map((mode, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm"
                                            >
                                                {mode}
                                            </span>
                                        ))}
                                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm italic">
                                            + infinite more...
                                        </span>
                                    </div>
                                </div>
                            )}

                            {!selectedDomain && (
                                <div className="text-center py-6 text-gray-400 text-sm">
                                    Select a life domain above to see example modes
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'overview'
                        ? 'text-sky-600 border-b-2 border-sky-500 -mb-px'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('modes')}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'modes'
                        ? 'text-sky-600 border-b-2 border-sky-500 -mb-px'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Mode Mechanics
                </button>
                <button
                    onClick={() => setActiveTab('intents')}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'intents'
                        ? 'text-sky-600 border-b-2 border-sky-500 -mb-px'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Intent Mechanics
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Life Domains Grid */}
                    <div className="glass-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-violet-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">The 7 Life Domains</h3>
                                    <p className="text-sm text-gray-600 mt-1">Foundation for all mode generation</p>
                                </div>
                                <Link href="/domains" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                                    View details →
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                {lifeDomains.map((domain) => (
                                    <div
                                        key={domain.id}
                                        className="p-3 rounded-lg bg-gradient-to-br from-violet-50 to-white border border-violet-100 text-center hover:shadow-md transition-shadow"
                                    >
                                        <div className="text-xs text-violet-400 font-mono mb-1">{domain.order}</div>
                                        <h4 className="font-medium text-gray-900 text-sm leading-tight">{domain.name}</h4>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Each domain can spawn countless contextual modes based on the user's specific situation and activity
                            </p>
                        </div>
                    </div>

                    {/* Modes Summary */}
                    <div className="glass-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-sky-50">
                            <h3 className="text-lg font-semibold text-gray-900">About Modes</h3>
                            <p className="text-sm text-gray-600 mt-1">{modesData?.description}</p>
                        </div>
                        <div className="p-6">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-800 mb-2">What a Mode Is</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-500 mt-0.5">✓</span>
                                            A contextual stance at a moment in time
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-500 mt-0.5">✓</span>
                                            Fluid and emergent from the domain + situation
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-500 mt-0.5">✓</span>
                                            Determines which intents are relevant
                                        </li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-800 mb-2">What a Mode Is NOT</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 mt-0.5">✗</span>
                                            A fixed category or app
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 mt-0.5">✗</span>
                                            A simple on/off state
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 mt-0.5">✗</span>
                                            The same as a life domain
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {definedModes.length > 0 && (
                                <>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Example Defined Modes:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {definedModes.slice(0, 6).map((mode: any) => (
                                            <div key={mode.id} className={`p-3 rounded-lg border ${mode.status === 'defined' ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'
                                                }`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-medium text-gray-900 text-sm">{mode.name}</h4>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${mode.status === 'defined' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                                                        }`}>{mode.status}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 line-clamp-2">{mode.purpose}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {definedModes.length > 6 && (
                                        <button
                                            onClick={() => setActiveTab('modes')}
                                            className="mt-4 text-sm text-sky-600 hover:text-sky-700 font-medium"
                                        >
                                            View all {definedModes.length} defined modes →
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Intents Summary */}
                    <div className="glass-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-indigo-50">
                            <h3 className="text-lg font-semibold text-gray-900">About Intents</h3>
                            <p className="text-sm text-gray-600 mt-1">{intentsData?.description}</p>
                        </div>
                        <div className="p-6">
                            <div className="p-4 bg-gray-50 rounded-lg mb-4">
                                <p className="text-sm text-gray-700">
                                    Intents are <strong>available actions</strong> that the current mode deems relevant.
                                    When a mode is active, it filters the universe of possible intents down to just what matters right now.
                                    These intents then generate the actual UI the user sees.
                                </p>
                            </div>

                            {intentsSections.length > 0 ? (
                                <div className="space-y-3">
                                    {intentsSections.slice(0, 3).map((section: any) => (
                                        <div key={section.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                                            <h4 className="font-medium text-gray-900 text-sm">{section.name}</h4>
                                            {section.description && (
                                                <p className="text-xs text-gray-600 mt-1">{section.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No intent sections defined yet.</p>
                            )}
                            {intentsSections.length > 3 && (
                                <button
                                    onClick={() => setActiveTab('intents')}
                                    className="mt-4 text-sm text-sky-600 hover:text-sky-700 font-medium"
                                >
                                    View all {intentsSections.length} intent sections →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modes Tab */}
            {activeTab === 'modes' && (
                <div className="space-y-8">
                    {/* Mechanics sections */}
                    <div className="grid grid-cols-1 gap-6">
                        {modesSections.map((section: any) => (
                            <div key={section.id} className="glass-card overflow-hidden">
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
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Defined Modes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {definedModes.map((mode: any) => (
                                    <div key={mode.id} className="glass-card overflow-hidden">
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
            )}

            {/* Intents Tab */}
            {activeTab === 'intents' && (
                <div className="grid grid-cols-1 gap-6">
                    {intentsSections.map((section: any) => (
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

                    {intentsSections.length === 0 && (
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
            )}
        </div>
    );
}
