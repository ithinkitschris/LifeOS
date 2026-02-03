'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchDomain } from '@/lib/api';

interface Domain {
  id: string;
  name: string;
  description: string;
  status: string;
  version: string;
  sections?: any[];
  principles?: any[];
  defined_modes?: any[];
  [key: string]: any;
}

export default function DomainPage() {
  const params = useParams();
  const id = params.id as string;

  const [domain, setDomain] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDomain(id)
        .then(setDomain)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium">Domain not found</h3>
          <a href="/domains" className="text-red-600 text-sm mt-2 hover:underline inline-block">
            ← Back to LifeOS
          </a>
        </div>
      </div>
    );
  }

  // Render based on domain type
  const renderContent = () => {
    switch (domain.id) {
      case 'architecture':
        return <ArchitectureContent domain={domain} />;
      case 'principles':
        return <PrinciplesContent domain={domain} />;
      case 'modes':
        return <ModesContent domain={domain} />;
      case 'intents':
        return <IntentsContent domain={domain} />;
      case 'devices':
        return <DevicesContent domain={domain} />;
      case 'constitution':
        return <ConstitutionContent domain={domain} />;
      case 'research':
        return <ResearchContent domain={domain} />;
      default:
        return <GenericContent domain={domain} />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <a href="/domains" className="text-sm text-gray-500 hover:text-sky-600 mb-3 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to LifeOS
        </a>
        <h1 className="text-2xl font-bold text-gray-900">{domain.name}</h1>
        <p className="text-gray-500 mt-1">{domain.description}</p>
      </div>

      {renderContent()}
    </div>
  );
}

// ============================================
// Architecture Domain
// ============================================
function ArchitectureContent({ domain }: { domain: Domain }) {
  const sections = domain.sections || [];

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
      {sections.map((section: any) => (
        <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">{section.name}</h2>
            {section.description && (
              <p className="text-sm text-gray-600 mt-1">{section.description}</p>
            )}
          </div>

          <div className="p-6">
            {section.content && (
              <p className="text-gray-700 mb-6 leading-relaxed">{section.content.trim()}</p>
            )}

            {/* Mode-Intent Concepts */}
            {section.concepts && (
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {section.concepts.map((concept: any) => (
                  <div key={concept.id} className={`rounded-lg p-4 ${
                    concept.id === 'mode' ? 'bg-amber-50 border border-amber-200' : 'bg-sky-50 border border-sky-200'
                  }`}>
                    <h4 className={`font-semibold ${concept.id === 'mode' ? 'text-amber-900' : 'text-sky-900'}`}>
                      {concept.name}
                    </h4>
                    <p className={`text-sm mt-1 ${concept.id === 'mode' ? 'text-amber-800' : 'text-sky-800'}`}>
                      {concept.definition}
                    </p>
                    <div className="mt-3 text-xs space-y-1">
                      <div className={concept.id === 'mode' ? 'text-amber-700' : 'text-sky-700'}>
                        <span className="font-medium">Controlled by:</span> {concept.controlled_by}
                      </div>
                      <div className={concept.id === 'mode' ? 'text-amber-700' : 'text-sky-700'}>
                        <span className="font-medium">Characteristic:</span> {concept.characteristic}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Invariants */}
            {section.invariants && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Design Invariants</h4>
                <ul className="space-y-2">
                  {section.invariants.map((inv: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-sky-500 mt-0.5">•</span>
                      {inv}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Three-Layer Attention */}
            {section.layers && (
              <div className="space-y-3 mb-6">
                {section.layers.map((layer: any) => (
                  <div key={layer.id} className={`rounded-lg p-4 border ${
                    layer.id === 'center' ? 'bg-emerald-50 border-emerald-200' :
                    layer.id === 'periphery' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-100 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold ${
                        layer.id === 'center' ? 'text-emerald-900' :
                        layer.id === 'periphery' ? 'text-blue-900' :
                        'text-gray-700'
                      }`}>{layer.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        layer.id === 'center' ? 'bg-emerald-100 text-emerald-700' :
                        layer.id === 'periphery' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-200 text-gray-600'
                      }`}>{layer.visibility}</span>
                    </div>
                    <p className={`text-sm mt-1 ${
                      layer.id === 'center' ? 'text-emerald-800' :
                      layer.id === 'periphery' ? 'text-blue-800' :
                      'text-gray-600'
                    }`}>{layer.definition}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Rules */}
            {section.rules && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Rules</h4>
                <ul className="space-y-2">
                  {section.rules.map((rule: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-sky-500 mt-0.5">{i + 1}.</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Flow stages */}
            {section.flow && (
              <div className="space-y-3 mb-6">
                {section.flow.map((stage: any, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                      <p className="text-sm text-gray-600 mt-0.5">{stage.role}</p>
                      {stage.notes && (
                        <p className="text-xs text-gray-500 mt-1 italic">{stage.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.why_apps_become_obsolete && (
              <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-medium text-sky-800 mb-2">Why Apps Become Obsolete</h4>
                <p className="text-sm text-sky-700">{section.why_apps_become_obsolete.trim()}</p>
              </div>
            )}

            {/* Dashboard zones */}
            {section.zones && (
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {section.zones.map((zone: any) => (
                  <div key={zone.id} className={`rounded-lg p-4 border ${
                    zone.id === 'past' ? 'bg-gray-50 border-gray-200' :
                    zone.id === 'present' ? 'bg-sky-50 border-sky-200' :
                    'bg-indigo-50 border-indigo-200'
                  }`}>
                    <h4 className={`font-semibold text-sm ${
                      zone.id === 'past' ? 'text-gray-700' :
                      zone.id === 'present' ? 'text-sky-800' :
                      'text-indigo-800'
                    }`}>{zone.name}</h4>
                    <p className={`text-xs mt-2 ${
                      zone.id === 'past' ? 'text-gray-600' :
                      zone.id === 'present' ? 'text-sky-700' :
                      'text-indigo-700'
                    }`}>{zone.content}</p>
                    <p className={`text-xs mt-2 italic ${
                      zone.id === 'past' ? 'text-gray-500' :
                      zone.id === 'present' ? 'text-sky-600' :
                      'text-indigo-600'
                    }`}>{zone.purpose}</p>
                  </div>
                ))}
              </div>
            )}

            {section.properties && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Properties</h4>
                <ul className="space-y-2">
                  {section.properties.map((prop: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-sky-500 mt-0.5">✓</span>
                      {prop}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Principles Domain
// ============================================
function PrinciplesContent({ domain }: { domain: Domain }) {
  const principles = domain.principles || [];

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
      {principles.map((principle: any) => (
        <div key={principle.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-sky-50 to-white">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-sm font-bold">
                {principle.number}
              </span>
              <h2 className="text-lg font-semibold text-gray-900">{principle.name}</h2>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-700 font-medium mb-4">{principle.summary}</p>

            {principle.details && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {principle.details.trim()}
              </p>
            )}

            {principle.implications && principle.implications.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-amber-800 mb-2">Design Implications</h4>
                <ul className="space-y-1.5">
                  {principle.implications.map((imp: string, i: number) => (
                    <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                      <span className="text-amber-500">→</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Modes Domain
// ============================================
function ModesContent({ domain }: { domain: Domain }) {
  const sections = domain.sections || [];
  const definedModes = domain.defined_modes || [];

  return (
    <div className="space-y-8">
      {/* Mechanics sections */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {sections.map((section: any) => (
        <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">{section.name}</h2>
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
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
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
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            {definedModes.map((mode: any) => (
              <div key={mode.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className={`px-6 py-4 border-b ${
                  mode.status === 'defined' ? 'bg-emerald-50 border-emerald-100' :
                  mode.status === 'scaffolded' ? 'bg-gray-50 border-gray-100' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{mode.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      mode.status === 'defined' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-200 text-gray-600'
                    }`}>{mode.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{mode.purpose}</p>
                </div>

                <div className="p-6">
                  {mode.activation_triggers && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Activation Triggers</h4>
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
                    <div className="grid md:grid-cols-3 gap-3">
                      {mode.triage.center && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                          <h5 className="text-xs font-semibold text-emerald-800 uppercase mb-2">Center</h5>
                          <ul className="space-y-1">
                            {mode.triage.center.map((item: string, i: number) => (
                              <li key={i} className="text-xs text-emerald-700">{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {mode.triage.periphery && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h5 className="text-xs font-semibold text-blue-800 uppercase mb-2">Periphery</h5>
                          <ul className="space-y-1">
                            {mode.triage.periphery.map((item: string, i: number) => (
                              <li key={i} className="text-xs text-blue-700">{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {mode.triage.silence && (
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                          <h5 className="text-xs font-semibold text-gray-700 uppercase mb-2">Silence</h5>
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
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Exit Conditions</h4>
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

// ============================================
// Intents Domain
// ============================================
function IntentsContent({ domain }: { domain: Domain }) {
  const sections = domain.sections || [];

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
      {sections.map((section: any) => (
        <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">{section.name}</h2>
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
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Aspect</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Traditional App</th>
                      <th className="px-4 py-3 text-left font-medium text-sky-700">LifeOS Intent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {section.comparison.map((row: any, i: number) => (
                      <tr key={i}>
                        <td className="px-4 py-3 font-medium text-gray-900">{row.aspect}</td>
                        <td className="px-4 py-3 text-gray-500">{row.traditional_app}</td>
                        <td className="px-4 py-3 text-sky-700">{row.lifeos_intent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Candidate approaches for open questions */}
            {section.candidate_approaches && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-amber-800">Candidate Approaches</h4>
                {section.candidate_approaches.map((approach: any, i: number) => (
                  <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <h5 className="font-medium text-amber-900 text-sm">{approach.name}</h5>
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

// ============================================
// Devices Domain
// ============================================
function DevicesContent({ domain }: { domain: Domain }) {
  const sections = domain.sections || [];
  const devices = domain.devices || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {sections.map((section: any) => (
          <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.name}</h2>
            {section.description && (
              <p className="text-gray-600 mb-4">{section.description}</p>
            )}
            {section.content && (
              <p className="text-gray-700">{section.content.trim()}</p>
            )}
          </div>
        ))}
      </div>

      {devices.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Device Ecosystem</h2>
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            {devices.map((device: any) => (
              <div key={device.id} className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900">{device.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{device.description}</p>
                {device.capabilities && (
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Capabilities</h4>
                    <div className="flex flex-wrap gap-1">
                      {device.capabilities.map((cap: string, i: number) => (
                        <span key={i} className="text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Constitution Domain
// ============================================
function ConstitutionContent({ domain }: { domain: Domain }) {
  const sections = domain.sections || [];
  const values = domain.values || [];
  const rules = domain.rules || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {sections.map((section: any) => (
          <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.name}</h2>
            {section.description && (
              <p className="text-gray-600 mb-4">{section.description}</p>
            )}
            {section.content && (
              <p className="text-gray-700">{section.content.trim()}</p>
            )}
          </div>
        ))}
      </div>

      {values.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Constitutional Values</h2>
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
            {values.map((value: any) => (
              <div key={value.id} className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900">{value.name}</h3>
                <p className="text-sm text-indigo-700 mt-1">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {rules.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Constitutional Rules</h2>
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
            {rules.map((rule: any, i: number) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-gray-700">{rule.description || rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Research Domain
// ============================================
function ResearchContent({ domain }: { domain: Domain }) {
  const sections = domain.sections || [];
  const questions = domain.questions || domain.research_questions || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {sections.map((section: any) => (
          <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.name}</h2>
            {section.description && (
              <p className="text-gray-600 mb-4">{section.description}</p>
            )}
            {section.content && (
              <p className="text-gray-700">{section.content.trim()}</p>
            )}
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Research Questions</h2>
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
            {questions.map((q: any, i: number) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-900">{q.question || q}</p>
                {q.context && (
                  <p className="text-sm text-amber-700 mt-2">{q.context}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Generic Content (fallback)
// ============================================
function GenericContent({ domain }: { domain: Domain }) {
  const sections = domain.sections || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {sections.map((section: any) => (
        <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.name}</h2>
          {section.description && (
            <p className="text-gray-600 mb-4">{section.description}</p>
          )}
          {section.content && (
            <p className="text-gray-700 whitespace-pre-wrap">{section.content.trim()}</p>
          )}
        </div>
      ))}
      </div>

      {/* Render any other top-level arrays or objects */}
      {Object.entries(domain)
        .filter(([key]) => !['id', 'name', 'description', 'status', 'version', 'sections'].includes(key))
        .filter(([, value]) => Array.isArray(value) && value.length > 0)
        .map(([key, value]) => (
          <div key={key}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
              {key.replace(/_/g, ' ')}
            </h2>
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
              {(value as any[]).map((item: any, i: number) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  {typeof item === 'string' ? (
                    <p className="text-gray-700">{item}</p>
                  ) : (
                    <>
                      {item.name && <h3 className="font-semibold text-gray-900">{item.name}</h3>}
                      {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
