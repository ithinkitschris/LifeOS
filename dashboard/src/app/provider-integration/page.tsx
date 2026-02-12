'use client';

import { useEffect, useState } from 'react';

interface ProviderExample {
  id: string;
  name: string;
  category: string;
  traditional: string;
  lifeos: string;
}

export default function ProviderIntegrationPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const providerExamples: ProviderExample[] = [
    {
      id: 'spotify',
      name: 'Spotify',
      category: 'Music Streaming',
      traditional: 'Open Spotify app → Browse → Select playlist → Play',
      lifeos: 'Music intent surfaces in Rest mode → Orchestrator queries Spotify provider → Constitutional filter applies preferences → Playback UI generated',
    },
    {
      id: 'nyt',
      name: 'New York Times',
      category: 'News',
      traditional: 'Open NYT app → Scroll through headlines → Engagement-optimized feed → No alignment with reading values',
      lifeos: 'News surfaces in Periphery during morning → Verification layer validates sources → Constitutional filter removes clickbait → Summary generated matching your reading preferences',
    },
    {
      id: 'maps',
      name: 'Google Maps',
      category: 'Navigation',
      traditional: 'Open Maps → Enter destination → Choose route → Navigate',
      lifeos: 'Navigation mode auto-activates when calendar event approaches → Maps provider supplies route data → Orchestrator presents optimal route in Center → Travel intents available',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      category: 'Messaging',
      traditional: 'Check app for notifications → Context switch to respond → Re-enter previous task',
      lifeos: 'Message arrives → Constitutional triage determines layer (Center/Periphery/Silence) → Surfaces in current mode context → Response intent available when appropriate',
    },
  ];

  if (!isClient) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Beyond Apps: The Provider Integration Model</h1>
          <p className="text-gray-400 mt-1.5 tracking-tight">How LifeOS replaces the application paradigm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Beyond Apps: The Provider Integration Model</h1>
        <p className="text-gray-400 mt-1.5 tracking-tight">How LifeOS replaces the application paradigm</p>
      </div>

      {/* Hero Statement */}
      <div className="glass-card p-8 mb-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">The Paradigm Shift</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            In the traditional computing model, <strong>applications are the interface</strong>. Users must translate
            their goals into app selections, then operate within each app's constraints and business model.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            In LifeOS, <strong>brands and services become data providers</strong>, not direct interfaces. The Orchestrator
            aggregates verified information from providers and generates contextually appropriate UI to serve user
            intents—making the application layer obsolete.
          </p>
        </div>
      </div>

      {/* The Flow Diagram */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-6">The Three-Stage Flow</h2>

        <div className="space-y-6">
          {/* Stage 1: Providers */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">External Providers Supply Raw Data</h3>
              <p className="text-gray-600 mb-3">
                Brands and services (Spotify, NYT, WhatsApp, Maps, etc.) provide data, APIs, and capabilities.
                They have business models and agendas, but <strong>cannot directly reach the user</strong>.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Social Media</span>
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">News Outlets</span>
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Messaging</span>
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Navigation</span>
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Commerce</span>
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Entertainment</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* Stage 2: Information Integrity */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center">
              <span className="text-purple-600 font-semibold">2</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Information Integrity Stack Filters & Verifies</h3>
              <p className="text-gray-600 mb-3">
                Before external data reaches you, it passes through verification and constitutional filtering.
                This is <strong>the trust mechanism</strong> that protects users from manipulation.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Verification & Provenance:</strong>
                    <span className="text-gray-600 ml-1">Deepfake detection, source authentication, fact verification</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Constitutional Filtering:</strong>
                    <span className="text-gray-600 ml-1">Aligns verified data with your Personal Constitution values</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Information Augmentation (RAG):</strong>
                    <span className="text-gray-600 ml-1">Synthesizes verified data with personal context</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* Stage 3: Orchestrator */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center">
              <span className="text-green-600 font-semibold">3</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Orchestrator Generates Contextual UI & Intents</h3>
              <p className="text-gray-600 mb-3">
                The Orchestrator has <strong>final authority</strong> over what reaches you and how. It synthesizes
                verified information, applies your constitutional rules, and generates purpose-built interfaces
                based on current mode and available intents.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Determines current mode (context-aware stance)</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Surfaces relevant intents (available actions for this moment)</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Triages information into Center/Periphery/Silence layers</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Generates UI that serves the selected intent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Apps Become Obsolete */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Why Apps Become Obsolete</h2>
        <p className="text-gray-600 mb-6">
          When the orchestrator can determine context (mode), surface relevant capabilities (available intents),
          generate purpose-built interfaces (intent experiences), and filter manipulation (constitutional
          validation)—<strong>the app as intermediary is no longer necessary</strong>.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Traditional App Model */}
          <div className="border border-red-200 bg-red-50 rounded-2xl p-6">
            <h3 className="font-medium text-red-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Traditional App Model
            </h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>User selects app, then figures out task</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>General-purpose tool for many use cases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Business model may conflict with user goals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Persistent, always demanding attention</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Infinite engagement possible (no completion)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Context lives in user's head</span>
              </li>
            </ul>
          </div>

          {/* LifeOS Provider Model */}
          <div className="border border-green-200 bg-green-50 rounded-2xl p-6">
            <h3 className="font-medium text-green-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              LifeOS Provider Model
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>User selects intent based on goal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Specific goal accomplishment, not general tool</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Orchestrator filters for user goals, blocks manipulation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Available based on context (mode), not persistent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Bounded with completion designed in</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Context maintained by system, not user</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Provider Examples */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Concrete Examples</h2>
        <p className="text-gray-600 mb-6">
          How familiar services work as providers in LifeOS versus traditional apps:
        </p>

        <div className="space-y-6">
          {providerExamples.map((example) => (
            <div key={example.id} className="border border-gray-200 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">{example.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{example.category}</p>
              </div>

              {/* Comparison */}
              <div className="grid md:grid-cols-2 divide-x divide-gray-200">
                {/* Traditional */}
                <div className="p-6">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Traditional App</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{example.traditional}</p>
                </div>

                {/* LifeOS */}
                <div className="p-6 bg-blue-50/30">
                  <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-3">LifeOS Provider</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{example.lifeos}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Benefits */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">User Benefits</h2>
        <p className="text-gray-600 mb-6">
          The provider integration model delivers concrete benefits over the traditional app paradigm:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">No Context Switching</h3>
              <p className="text-sm text-gray-600">System maintains context. You don't mentally switch between apps—you select intents within coherent modes.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Protected from Manipulation</h3>
              <p className="text-sm text-gray-600">Information Integrity layer blocks dark patterns, engagement optimization, and algorithmic manipulation before it reaches you.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Constitutional Alignment</h3>
              <p className="text-sm text-gray-600">Every piece of information filtered through your Personal Constitution. System behavior aligns with your values, not provider business models.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Attention-Aware Triage</h3>
              <p className="text-sm text-gray-600">Information routed to Center, Periphery, or Silence based on current mode and constitutional rules—not notification counts.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Purpose-Built Interfaces</h3>
              <p className="text-sm text-gray-600">UI generated to serve specific intent, not general-purpose app. Bounded experiences with clear completion, not infinite feeds.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Multi-Provider Synthesis</h3>
              <p className="text-sm text-gray-600">Orchestrator can combine data from multiple providers in a single intent—no manual app switching required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
