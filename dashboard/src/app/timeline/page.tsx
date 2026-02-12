'use client';

import { useEffect, useState } from 'react';
import { fetchPKGTimeline } from '@/lib/api';

export default function TimelinePage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPKGTimeline()
            .then((timeline) => setData(timeline))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-100 rounded-2xl w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded-xl w-2/3 mb-8"></div>
                    <div className="h-64 bg-gray-100 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="glass-card p-6">
                    <h3 className="text-red-600 font-medium">Error loading timeline data</h3>
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (!data?.days) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="glass-card p-6">
                    <p className="text-gray-500">No timeline data available</p>
                </div>
            </div>
        );
    }

    const days = Object.values(data.days) as any[];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Timeline</h1>
                <p className="text-gray-400 mt-1.5 tracking-tight">
                    Marcus Chen's daily timeline — modes, events, and context
                </p>
            </div>

            {/* Timeline Content */}
            <div className="glass-card overflow-hidden">
                <div className="p-6 space-y-6">
                    {days.map((day: any) => (
                        <div key={day.date}>
                            <div className="flex items-center gap-4 mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{day.date}</h3>
                                <span className="text-sm text-gray-500 capitalize">{day.day_of_week}</span>
                                {day.context?.day_theme && (
                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{day.context.day_theme}</span>
                                )}
                            </div>

                            {/* Day Context */}
                            {day.context && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        {day.context.weather && (
                                            <div>
                                                <span className="text-gray-500">Weather:</span>{' '}
                                                <span>{day.context.weather.temperature_celsius}°C, {day.context.weather.condition}</span>
                                            </div>
                                        )}
                                        {day.context.user_state?.stress_level && (
                                            <div>
                                                <span className="text-gray-500">Stress:</span>{' '}
                                                <span className={day.context.user_state.stress_level === 'elevated' ? 'text-red-600' : ''}>{day.context.user_state.stress_level}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Timeline Events */}
                            <div className="space-y-3">
                                {day.timeline?.map((event: any) => (
                                    <div key={event.id} className="flex gap-4">
                                        <div className="w-20 text-sm text-gray-500 pt-1">
                                            {event.start_time}
                                        </div>
                                        <div className={`flex-1 rounded-lg p-4 border ${event.mode === 'restore' ? 'bg-emerald-50 border-emerald-200' :
                                                event.mode === 'focus' ? 'bg-sky-50 border-sky-200' :
                                                    event.mode === 'navigation' ? 'bg-indigo-50 border-indigo-200' :
                                                        'bg-gray-50 border-gray-200'
                                            }`}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                                                    {event.description && <p className="text-sm text-gray-600 mt-1">{event.description}</p>}
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${event.mode === 'restore' ? 'bg-emerald-100 text-emerald-700' :
                                                        event.mode === 'focus' ? 'bg-sky-100 text-sky-700' :
                                                            event.mode === 'navigation' ? 'bg-indigo-100 text-indigo-700' :
                                                                'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {event.mode}
                                                </span>
                                            </div>

                                            {/* Available Intents */}
                                            {event.intents?.available && event.intents.available.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-200/50">
                                                    <div className="text-xs font-medium text-gray-500 mb-2">Available Intents</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {event.intents.available.map((intent: any) => (
                                                            <span key={intent.id} className="text-xs bg-white/50 text-gray-600 px-2 py-1 rounded">
                                                                {intent.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
