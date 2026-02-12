'use client';

import { useEffect, useState } from 'react';
import {
  fetchPKGIdentity,
  fetchPKGRelationships,
  fetchPKGBehaviors,
  fetchPKGLocations,
  fetchPKGHealth,
  fetchPKGCommunications,
  fetchPKGCalendar,
} from '@/lib/api';

interface PKGData {
  identity: any;
  relationships: any;
  behaviors: any;
  locations: any;
  health: any;
  communications: any;
  calendar: any;
}

type TabId = 'identity' | 'relationships' | 'behaviors' | 'locations' | 'health' | 'communications' | 'calendar';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: 'identity',
    label: 'Identity',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  },
  {
    id: 'relationships',
    label: 'Relationships',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
  },
  {
    id: 'behaviors',
    label: 'Behaviors',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  },
  {
    id: 'locations',
    label: 'Locations',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
  },
  {
    id: 'health',
    label: 'Health',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  },
  {
    id: 'communications',
    label: 'Communications',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  },
];

export default function PKGPage() {
  const [data, setData] = useState<PKGData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('identity');

  useEffect(() => {
    Promise.all([
      fetchPKGIdentity(),
      fetchPKGRelationships(),
      fetchPKGBehaviors(),
      fetchPKGLocations(),
      fetchPKGHealth(),
      fetchPKGCommunications(),
      fetchPKGCalendar(),
    ])
      .then(([identity, relationships, behaviors, locations, health, communications, calendar]) => {
        setData({ identity, relationships, behaviors, locations, health, communications, calendar });
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
          <div className="h-64 bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="glass-card p-6">
          <h3 className="text-red-600 font-medium">Error loading PKG data</h3>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Marcus Chen</h1>
        <p className="text-gray-400 mt-1.5 tracking-tight">
          Personal Knowledge Graph — The synthetic user for scenario testing
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4">
          <div className="text-2xl font-semibold text-gray-900">{data.identity?.basics?.age || '—'}</div>
          <div className="text-sm text-gray-400">Age</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-semibold text-gray-900">{data.relationships?.inner_circle?.length || 0}</div>
          <div className="text-sm text-gray-400">Inner Circle</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-semibold text-gray-900">{Object.keys(data.locations?.primary_locations || {}).length}</div>
          <div className="text-sm text-gray-400">Locations</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-semibold gradient-text">{Math.round((data.identity?.lifeos_relationship?.automation_preference || 0) * 100)}%</div>
          <div className="text-sm text-gray-400">Automation Pref</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-[#008cff] text-white shadow-lg shadow-sky-200/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {tab.icon}
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-card overflow-hidden">
        {activeTab === 'identity' && <IdentityTab data={data.identity} />}
        {activeTab === 'relationships' && <RelationshipsTab data={data.relationships} />}
        {activeTab === 'behaviors' && <BehaviorsTab data={data.behaviors} />}
        {activeTab === 'locations' && <LocationsTab data={data.locations} />}
        {activeTab === 'health' && <HealthTab data={data.health} />}
        {activeTab === 'communications' && <CommunicationsTab data={data.communications} />}
        {activeTab === 'calendar' && <CalendarTab data={data.calendar} />}
      </div>
    </div>
  );
}

// ============================================
// Identity Tab
// ============================================
function IdentityTab({ data }: { data: any }) {
  if (!data) return <div className="p-6 text-gray-500">No identity data</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Basics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basics</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoCard label="Name" value={data.basics?.name} />
          <InfoCard label="Age" value={data.basics?.age} />
          <InfoCard label="Birthday" value={data.basics?.birthday} />
          <InfoCard label="Pronouns" value={data.basics?.pronouns} />
          <InfoCard label="Primary Occupation" value={data.basics?.occupation?.primary} />
          <InfoCard label="Secondary" value={data.basics?.occupation?.secondary} />
          <InfoCard label="City" value={data.basics?.location?.city} />
          <InfoCard label="Neighborhood" value={data.basics?.location?.neighborhood} />
          <InfoCard label="University" value={data.basics?.location?.university} />
          <InfoCard label="Timezone" value={data.basics?.location?.timezone} />
        </div>
      </div>

      {/* Personality */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personality</h3>
        <div className="space-y-3">
          <TextCard label="Summary" value={data.personality?.summary} />
          <TextCard label="Communication Style" value={data.personality?.communication_style} />
          <TextCard label="Decision Making" value={data.personality?.decision_making} />
          <TextCard label="Stress Response" value={data.personality?.stress_response} />
          <TextCard label="Recovery Pattern" value={data.personality?.recovery_pattern} />
        </div>
      </div>

      {/* Life Stage */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Stage</h3>
        <InfoCard label="Current Stage" value={data.life_stage?.current?.replace(/_/g, ' ')} />
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Major Pressures</h4>
          <ul className="space-y-1">
            {data.life_stage?.major_pressures?.map((p: string, i: number) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-red-400">•</span> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Aspirations</h4>
          <ul className="space-y-1">
            {data.life_stage?.aspirations?.map((a: string, i: number) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-emerald-400">•</span> {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* LifeOS Relationship */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">LifeOS Relationship</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoCard label="Adoption Date" value={data.lifeos_relationship?.adoption_date} />
          <InfoCard label="Trust Level" value={data.lifeos_relationship?.trust_level} />
          <InfoCard label="Automation Preference" value={`${Math.round((data.lifeos_relationship?.automation_preference || 0) * 100)}%`} />
          <InfoCard label="Agency Preference" value={`${Math.round((data.lifeos_relationship?.agency_preference || 0) * 100)}%`} />
          <InfoCard label="Override Frequency" value={data.lifeos_relationship?.override_frequency} />
          <InfoCard label="Primary Value" value={data.lifeos_relationship?.primary_value} />
        </div>
        {data.lifeos_relationship?.notes && (
          <div className="mt-4 bg-sky-50 border border-sky-200 rounded-lg p-4">
            <p className="text-sm text-sky-800">{data.lifeos_relationship.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Relationships Tab
// ============================================
function RelationshipsTab({ data }: { data: any }) {
  if (!data) return <div className="p-6 text-gray-500">No relationships data</div>;

  return (
    <div className="p-6 space-y-8">
      {/* Inner Circle */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inner Circle</h3>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          {data.inner_circle?.map((person: any) => (
            <PersonCard key={person.id} person={person} tier="inner" />
          ))}
        </div>
      </div>

      {/* Close Network */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Close Network</h3>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          {data.close_network?.map((person: any) => (
            <PersonCard key={person.id} person={person} tier="close" />
          ))}
        </div>
      </div>

      {/* Relationship Patterns */}
      {data.relationship_patterns && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationship Patterns</h3>
          <div className="space-y-3">
            <TextCard label="Initiation Tendency" value={data.relationship_patterns.initiation_tendency} />
            <TextCard label="Conflict Style" value={data.relationship_patterns.conflict_style} />
            <TextCard label="Support Seeking" value={data.relationship_patterns.support_seeking} />
            <TextCard label="Social Energy" value={data.relationship_patterns.social_energy} />
          </div>
        </div>
      )}
    </div>
  );
}

function PersonCard({ person, tier }: { person: any; tier: 'inner' | 'close' }) {
  const bgColor = tier === 'inner' ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200' : 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200';

  return (
    <div className={`rounded-xl p-4 border ${bgColor}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{person.name}</h4>
          <p className="text-xs text-gray-500">{person.relationship?.replace(/_/g, ' ')}</p>
        </div>
        {person.lifeos_notes?.priority_level && (
          <span className={`text-xs px-2 py-1 rounded-full ${person.lifeos_notes.priority_level === 'highest' ? 'bg-rose-100 text-rose-700' :
              person.lifeos_notes.priority_level === 'high' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-600'
            }`}>
            {person.lifeos_notes.priority_level}
          </span>
        )}
      </div>
      {person.context && <p className="text-sm text-gray-600 mb-3">{person.context}</p>}

      {person.communication_patterns && (
        <div className="text-xs space-y-1 mb-3">
          <div className="text-gray-500">
            <span className="font-medium">Frequency:</span> {person.communication_patterns.frequency}
          </div>
          <div className="text-gray-500">
            <span className="font-medium">Channels:</span> {person.communication_patterns.preferred_channels?.join(', ')}
          </div>
        </div>
      )}

      {person.lifeos_notes?.special_rules && (
        <div className="bg-white/50 rounded-lg p-2 mt-2">
          <p className="text-xs text-gray-600 italic">{person.lifeos_notes.special_rules}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// Behaviors Tab
// ============================================
function BehaviorsTab({ data }: { data: any }) {
  if (!data) return <div className="p-6 text-gray-500">No behaviors data</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Temporal Patterns */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Temporal Patterns</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Daily Rhythm</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Wake:</span> <span>{data.temporal_patterns?.daily_rhythm?.wake_time}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Sleep:</span> <span>{data.temporal_patterns?.daily_rhythm?.sleep_time}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Peak Cognitive:</span> <span>{data.temporal_patterns?.daily_rhythm?.peak_cognitive?.join(', ')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Low Energy:</span> <span>{data.temporal_patterns?.daily_rhythm?.low_energy?.join(', ')}</span></div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Weekly Rhythm</h4>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">High Productivity:</span> <span className="ml-2">{data.temporal_patterns?.weekly_rhythm?.high_productivity_days?.join(', ')}</span></div>
              <div><span className="text-gray-500">Social Days:</span> <span className="ml-2">{data.temporal_patterns?.weekly_rhythm?.social_days?.join(', ')}</span></div>
              <div><span className="text-gray-500">Rest Days:</span> <span className="ml-2">{data.temporal_patterns?.weekly_rhythm?.rest_days?.join(', ')}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Patterns */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Patterns</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-emerald-800 mb-3">Productive Apps</h4>
            <div className="space-y-1">
              {Object.entries(data.digital_patterns?.productive_apps || {}).map(([app, use]) => (
                <div key={app} className="text-sm flex justify-between">
                  <span className="text-emerald-700 font-medium">{app}</span>
                  <span className="text-emerald-600">{String(use)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-amber-800 mb-3">Problematic Patterns</h4>
            <div className="space-y-2">
              {Object.entries(data.digital_patterns?.problematic_patterns || {}).map(([pattern, details]: [string, any]) => (
                <div key={pattern} className="text-sm">
                  <div className="text-amber-700 font-medium">{pattern.replace(/_/g, ' ')}</div>
                  <div className="text-amber-600 text-xs">{details.trigger}</div>
                  {details.lifeos_response && (
                    <div className="text-amber-500 text-xs italic mt-1">LifeOS: {details.lifeos_response}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Context Switching */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Context Switching Profile</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Tolerance:</span> <span className="ml-2 font-medium">{data.context_switching_profile?.tolerance}</span></div>
            <div><span className="text-gray-500">Recovery Time:</span> <span className="ml-2 font-medium">{data.context_switching_profile?.recovery_time}</span></div>
            <div className="col-span-2"><span className="text-gray-500">Worst Case:</span> <span className="ml-2">{data.context_switching_profile?.worst_case}</span></div>
            <div className="col-span-2"><span className="text-gray-500">Acceptable Interrupts:</span> <span className="ml-2">{data.context_switching_profile?.acceptable_interrupts?.join(', ')}</span></div>
          </div>
          {data.context_switching_profile?.lifeos_directive && (
            <div className="mt-3 bg-sky-50 border border-sky-200 rounded-lg p-3">
              <p className="text-sm text-sky-800"><span className="font-medium">LifeOS Directive:</span> {data.context_switching_profile.lifeos_directive}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Locations Tab
// ============================================
function LocationsTab({ data }: { data: any }) {
  if (!data) return <div className="p-6 text-gray-500">No locations data</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Primary Locations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Locations</h3>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          {Object.values(data.primary_locations || {}).map((loc: any) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </div>

      {/* Frequent Destinations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequent Destinations</h3>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          {Object.values(data.frequent_destinations || {}).map((loc: any) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </div>

      {/* Commute Routes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commute Routes</h3>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          {Object.entries(data.commute_routes || {}).map(([route, details]: [string, any]) => (
            <div key={route} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{route.replace(/_/g, ' → ')}</h4>
              <div className="text-sm space-y-1">
                {details.walk && <div><span className="text-gray-500">Walk:</span> {details.walk.duration_minutes} min</div>}
                {details.subway && <div><span className="text-gray-500">Subway:</span> {details.subway.duration_minutes} min ({details.subway.lines?.join(', ')})</div>}
                {details.method && <div><span className="text-gray-500">Method:</span> {details.method}</div>}
                {details.duration_minutes && <div><span className="text-gray-500">Duration:</span> {details.duration_minutes} min</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Behaviors */}
      {data.location_behaviors && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Behaviors</h3>
          <div className="space-y-3">
            {Object.entries(data.location_behaviors).map(([key, value]) => (
              <TextCard key={key} label={key.replace(/_/g, ' ')} value={String(value)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LocationCard({ location }: { location: any }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{location.name}</h4>
          <p className="text-xs text-gray-500">{location.type?.replace(/_/g, ' ')}</p>
        </div>
        {location.context?.work_suitability !== undefined && (
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
            Work: {Math.round(location.context.work_suitability * 100)}%
          </span>
        )}
      </div>
      {location.address && <p className="text-sm text-gray-600 mb-2">{location.address}</p>}
      {location.context?.notes && <p className="text-xs text-gray-500 italic">{location.context.notes}</p>}
      {location.typical_modes && (
        <div className="flex flex-wrap gap-1 mt-2">
          {location.typical_modes.map((mode: string) => (
            <span key={mode} className="text-xs bg-white/50 text-indigo-600 px-2 py-0.5 rounded">{mode}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Health Tab
// ============================================
function HealthTab({ data }: { data: any }) {
  if (!data) return <div className="p-6 text-gray-500">No health data</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Baseline Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Baseline Metrics</h3>
        <div className="grid grid-cols-2 2xl:grid-cols-4 gap-4">
          <MetricCard
            label="Resting HR"
            value={data.baseline_metrics?.resting_heart_rate?.average}
            unit="bpm"
            range={data.baseline_metrics?.resting_heart_rate?.healthy_range}
          />
          <MetricCard
            label="HRV"
            value={data.baseline_metrics?.hrv?.average}
            unit="ms"
            range={data.baseline_metrics?.hrv?.healthy_range}
          />
          <MetricCard
            label="Avg Sleep"
            value={data.baseline_metrics?.sleep?.actual_average}
            unit="hrs"
            target={data.baseline_metrics?.sleep?.target_hours}
          />
          <MetricCard
            label="Avg Steps"
            value={data.baseline_metrics?.activity?.actual_average}
            unit="steps"
            target={data.baseline_metrics?.activity?.daily_step_target}
          />
        </div>
      </div>

      {/* Stress Signature */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stress Signature</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-3">Biometric Indicators</h4>
            <ul className="space-y-1">
              {data.patterns?.stress_signature?.biometric_indicators?.map((ind: string, i: number) => (
                <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                  <span className="text-red-400">•</span> {ind}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-amber-800 mb-3">Behavioral Correlation</h4>
            <ul className="space-y-1">
              {data.patterns?.stress_signature?.behavioral_correlation?.map((beh: string, i: number) => (
                <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                  <span className="text-amber-400">•</span> {beh}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Energy Cycles */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Cycles</h3>
        <div className="grid grid-cols-2 2xl:grid-cols-4 gap-4">
          {Object.entries(data.patterns?.energy_cycles || {}).map(([period, details]: [string, any]) => (
            <div key={period} className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 capitalize mb-2">{period}</h4>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{Math.round((details.typical_energy || 0) * 100)}%</div>
              <p className="text-xs text-gray-500">Best for: {details.best_for?.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* LifeOS Health Directives */}
      {data.lifeos_health_directives && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">LifeOS Health Directives</h3>
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-sky-800 mb-3">Interventions</h4>
            <div className="space-y-2">
              {Object.entries(data.lifeos_health_directives.interventions || {}).map(([trigger, action]) => (
                <div key={trigger} className="text-sm">
                  <span className="text-sky-700 font-medium">{trigger.replace(/_/g, ' ')}:</span>{' '}
                  <span className="text-sky-600">{String(action)}</span>
                </div>
              ))}
            </div>
            <h4 className="text-sm font-medium text-sky-800 mt-4 mb-2">Boundaries</h4>
            <ul className="space-y-1">
              {data.lifeos_health_directives.boundaries?.map((b: string, i: number) => (
                <li key={i} className="text-sm text-sky-700 flex items-start gap-2">
                  <span className="text-sky-400">•</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, unit, range, target }: { label: string; value: any; unit: string; range?: number[]; target?: number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-gray-900">{value} <span className="text-sm font-normal text-gray-400">{unit}</span></div>
      {range && <div className="text-xs text-gray-400 mt-1">Range: {range[0]}-{range[1]}</div>}
      {target && <div className="text-xs text-gray-400 mt-1">Target: {target}</div>}
    </div>
  );
}

// ============================================
// Communications Tab
// ============================================
function CommunicationsTab({ data }: { data: any }) {
  if (!data) return <div className="p-6 text-gray-500">No communications data</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Channels */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Channels</h3>
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
          {Object.entries(data.channels || {}).map(([channel, details]: [string, any]) => (
            <div key={channel} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 capitalize mb-2">{channel}</h4>
              <p className="text-sm text-gray-500 mb-2">{details.primary_use}</p>
              {details.preference && <p className="text-xs text-gray-400 italic">{details.preference}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="grid grid-cols-2 2xl:grid-cols-4 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-emerald-800 mb-2">Always Immediate</h4>
            <ul className="space-y-1">
              {data.notification_preferences?.always_immediate?.map((item: string, i: number) => (
                <li key={i} className="text-xs text-emerald-700">{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-amber-800 mb-2">Batched</h4>
            <ul className="space-y-1">
              {data.notification_preferences?.batched?.map((item: string, i: number) => (
                <li key={i} className="text-xs text-amber-700">{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Silenced During Focus</h4>
            <ul className="space-y-1">
              {data.notification_preferences?.silenced_during_focus?.map((item: string, i: number) => (
                <li key={i} className="text-xs text-gray-600">{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">Never Silence</h4>
            <ul className="space-y-1">
              {data.notification_preferences?.never_silence?.map((item: string, i: number) => (
                <li key={i} className="text-xs text-red-700">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Triage Rules */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Triage Rules</h3>
        <div className="space-y-4">
          {data.triage_rules?.immediate_surface && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-emerald-800 mb-3">Immediate Surface</h4>
              <div className="space-y-2">
                {data.triage_rules.immediate_surface.map((rule: any, i: number) => (
                  <div key={i} className="text-sm">
                    <span className="text-emerald-700 font-medium">{rule.condition}</span>
                    <span className="text-emerald-600 ml-2">— {rule.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.triage_rules?.context_dependent && (
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-sky-800 mb-3">Context Dependent</h4>
              <div className="space-y-2">
                {data.triage_rules.context_dependent.map((rule: any, i: number) => (
                  <div key={i} className="text-sm">
                    <span className="text-sky-700 font-medium">{rule.condition}</span>
                    <span className="text-sky-600 ml-2">→ {rule.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Calendar Tab
// ============================================
function CalendarTab({ data }: { data: any }) {
  if (!data) return <div className="p-6 text-gray-500">No calendar data</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Recurring Commitments */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recurring Commitments</h3>
        {Object.entries(data.recurring_commitments || {}).map(([category, items]: [string, any]) => (
          <div key={category} className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 capitalize mb-2">{category}</h4>
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
              {items.map((item: any, i: number) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.day || item.days?.join(', ')} {item.time && `at ${item.time}`}
                  </div>
                  {item.location && <div className="text-xs text-gray-400">{item.location}</div>}
                  {item.notes && <div className="text-xs text-gray-400 italic mt-1">{item.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Milestones */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Milestones</h3>
        <div className="space-y-3">
          {data.upcoming_milestones?.map((milestone: any, i: number) => (
            <div key={i} className={`rounded-lg p-4 border ${milestone.stress_level === 'high' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
              }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                  <p className="text-sm text-gray-500">{milestone.date} {milestone.time && `at ${milestone.time}`}</p>
                </div>
                {milestone.stress_level && (
                  <span className={`text-xs px-2 py-1 rounded-full ${milestone.stress_level === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {milestone.stress_level} stress
                  </span>
                )}
              </div>
              {milestone.notes && <p className="text-sm text-gray-600 mt-2">{milestone.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Scheduling Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduling Preferences</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoCard label="Meeting Batching" value={data.scheduling_preferences?.meeting_batching ? 'Yes' : 'No'} />
          <InfoCard label="Preferred Meeting Days" value={data.scheduling_preferences?.preferred_meeting_days?.join(', ')} />
          <InfoCard label="Buffer Between Meetings" value={data.scheduling_preferences?.buffer_between_meetings} />
          <InfoCard label="Deep Work Protection" value={data.scheduling_preferences?.deep_work_protection?.join(', ')} />
        </div>
      </div>
    </div>
  );
}



// ============================================
// Shared Components
// ============================================
function InfoCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-medium text-gray-900">{value || '—'}</div>
    </div>
  );
}

function TextCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-sm text-gray-700">{value || '—'}</div>
    </div>
  );
}
