'use client';

import { useEffect, useState } from 'react';
import { fetchDomains, fetchDomain } from '@/lib/api';

interface Domain {
  id: string;
  name: string;
  description: string;
  status: string;
  version: string;
  order: number;
  sections?: any[];
  devices?: any[];
  [key: string]: any;
}

const domainIcons: Record<string, React.ReactNode> = {
  architecture: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  principles: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  modes: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  intents: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  devices: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  constitution: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  research: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [architecture, setArchitecture] = useState<Domain | null>(null);
  const [devices, setDevices] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDomains().then((data) => setDomains(data.domains)),
      fetchDomain('architecture').then(setArchitecture).catch(() => null),
      fetchDomain('devices').then(setDevices).catch(() => null),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">LifeOS</h1>
        <p className="text-gray-500 mt-1">
          The canonical design decisions that define the system
        </p>
      </div>

      {/* System Architecture */}
      {architecture && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Architecture</h2>
          <ArchitectureContent domain={architecture} />
        </div>
      )}

      {/* Device Ecosystem */}
      {devices && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Device Ecosystem</h2>
          <DevicesContent domain={devices} />
        </div>
      )}

      {/* Other Domains */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Domains</h2>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          {domains
            .filter((domain) => 
              !['research', 'constitution', 'principles', 'intents', 'modes', 'architecture', 'devices'].includes(domain.id)
            )
            .sort((a, b) => a.order - b.order)
            .map((domain) => (
            <a
              key={domain.id}
              href={`/domains/${domain.id}`}
              className="group block bg-white rounded-lg border border-gray-200 p-5 hover:border-sky-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                  {domainIcons[domain.id] || (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-sky-700 transition-colors">
                    {domain.name}
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm">{domain.description}</p>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-sky-500 transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Architecture Content Component
// ============================================
function ArchitectureContent({ domain }: { domain: Domain }) {
  const sections = domain.sections || [];

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
      {sections.map((section: any) => (
        <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
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
// Devices Content Component
// ============================================
function DevicesContent({ domain }: { domain: Domain }) {
  const sections = domain.sections || [];
  const devices = domain.devices || [];

  return (
    <div className="space-y-8">
      {sections.length > 0 && (
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
          {sections.map((section: any) => (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.name}</h3>
              {section.description && (
                <p className="text-gray-600 mb-4">{section.description}</p>
              )}
              {section.content && (
                <p className="text-gray-700">{section.content.trim()}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {devices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Devices</h3>
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            {devices.map((device: any) => (
              <div key={device.id} className="bg-white rounded-lg border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900">{device.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{device.description}</p>
                {device.capabilities && (
                  <div className="mt-3">
                    <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Capabilities</h5>
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
