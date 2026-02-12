export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          About this Website
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Understanding the World of LifeOS platform and how this interface supports thesis research
        </p>
      </div>

      <div className="space-y-6">
        {/* What is this website */}
        <section className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5">
            <h2 className="text-lg font-medium text-black">What is this Website?</h2>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-4 text-black/60 text-[12pt] leading-relaxed">
            <p>
              The <strong>World of LifeOS Website</strong> is an interactive interface for managing and exploring
              the canonical specification of LifeOS 2030—a speculative AI-mediated life management system designed
              to surface critical tensions between automation and human agency.
            </p>
            <p>
              This website serves as the <strong>single source of truth</strong> for the world canon, allowing
              direct manipulation of the conceptual architecture, synthetic user data, and evolving design questions
              that drive the thesis research.
            </p>
            <p>
              Unlike traditional documentation tools, this platform treats the world specification as living,
              versioned, and queryable—enabling rapid iteration while maintaining research integrity through
              snapshot versioning and clear provenance tracking.
            </p>
            </div>
          </div>
        </section>

        {/* The LifeOS Platform */}
        <section className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5">
            <h2 className="text-lg font-medium text-black">The LifeOS Platform</h2>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-4 text-black/60 text-[12pt] leading-relaxed">
            <p>
              The broader <strong>lifeos-platform</strong> repository is a thesis research tool exploring a
              fundamental design question:
            </p>
            <blockquote className="border-l-4 border-gray-300 pl-6 italic text-gray-700 my-6">
              How can interaction design preserve human agency and meaningful oversight while delivering
              genuine automation benefits?
            </blockquote>
            <p>
              LifeOS 2030 represents a world where AI systems have deep access to personal context—relationships,
              goals, health, work, memory. Rather than building the system itself, this platform creates the
              <strong> specification</strong> of that world to stress-test its conceptual architecture through
              scenario generation and prototype interfaces.
            </p>
            <p>
              The thesis argues: <strong>Convenience and control are not zero-sum.</strong> LifeOS demonstrates
              that automation can enhance rather than erode human agency—if the interaction model is designed
              thoughtfully around constraints that prioritize human decision-making.
            </p>
            </div>
          </div>
        </section>

        {/* Core Architecture */}
        <section className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5">
            <h2 className="text-lg font-medium text-black">Core Architectural Concepts</h2>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-6 text-black/60 text-[12pt]">
            <div>
              <h3 className="font-semibold text-black mb-2">The Mode–Intent Framework</h3>
              <p>
                The system operates on a strict separation between <strong>modes</strong> (fluid,
                orchestrator-controlled stances within a life domain) and <strong>intents</strong> (bounded,
                user-selected actions). This separation is the primary mechanism for preserving agency: the
                system constrains options, but never executes actions without explicit human choice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-2">Life Domains</h3>
              <p>
                Seven fundamental categories of human activity (Navigation, Communication, Entertainment,
                Life Management, Work, Health, Personal Fulfillment) serve as the foundation for mode generation.
                Each domain has distinct characteristics, common modes, and triage patterns.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-2">Center/Periphery/Silence</h3>
              <p>
                A three-layer attention model inspired by calm technology. Every piece of information exists
                in exactly one layer per mode. Layer assignment shifts contextually—what's in Center during
                "Focus Mode" may be Silenced during "Family Time."
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-2">Constitutional Framework</h3>
              <p>
                User-articulated values translated into operational rules that inform triage decisions.
                The constitution makes value tradeoffs explicit and auditable, allowing users to understand
                <em> why</em> the system surfaced (or suppressed) specific information.
              </p>
            </div>
          </div>
          </div>
        </section>

        {/* How this fits into the thesis */}
        <section className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5">
            <h2 className="text-lg font-medium text-black">How This Fits Into the Thesis</h2>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-4 text-black/60 text-[12pt] leading-relaxed">
            <p>
              This website and the broader platform serve multiple research functions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-black mb-2">World Canon Management</h4>
                <p className="text-[11pt]">
                  Maintain the "locked" architectural rules and "open" design questions that define the
                  LifeOS 2030 specification. Changes are versioned and traceable.
                </p>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-black mb-2">Synthetic User (PKG)</h4>
                <p className="text-[11pt]">
                  Marcus Chen's Personal Knowledge Graph provides a fully-specified user for testing scenarios.
                  His values, relationships, and behavioral patterns ground speculative designs in realistic constraints.
                </p>
              </div>
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-black mb-2">Scenario Generation</h4>
                <p className="text-[11pt]">
                  Generate and archive scenarios that stress-test the architecture. Good scenarios surface
                  design tensions without obvious resolutions—revealing where the model breaks or requires refinement.
                </p>
              </div>
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-semibold text-black mb-2">Prototype Documentation</h4>
                <p className="text-[11pt]">
                  Track interface prototypes chronologically. Screenshots and videos demonstrate how abstract
                  concepts (modes, intents, triage) manifest in concrete interaction patterns.
                </p>
              </div>
            </div>
            <p>
              The thesis emerges from the <strong>interplay</strong> between these components: world rules
              constrain Marcus's PKG, which informs scenario generation, which reveals architectural gaps,
              which drive prototype exploration, which surfaces new open questions, which update the world canon.
            </p>
            </div>
          </div>
        </section>

        {/* Design Philosophy - Hidden */}
        {/* <section className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Design Philosophy</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              When working within this platform, several principles guide the work:
            </p>
            <ul className="space-y-3 list-none">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">▸</span>
                <div>
                  <strong>Agency is the core constraint.</strong> Every feature must preserve the human's
                  ability to understand, override, and opt-out. The mode-intent separation is sacred.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">▸</span>
                <div>
                  <strong>Speculative ≠ fantasy.</strong> Everything grounds in plausible 2030 technology.
                  The goal is to surface real design tensions, not imagine magic.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">▸</span>
                <div>
                  <strong>The uncomfortable scenarios matter most.</strong> Edge cases, failures, mode collisions,
                  and constitutional conflicts reveal more than happy paths.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">▸</span>
                <div>
                  <strong>Information exists on a spectrum.</strong> Reject binary show/hide thinking.
                  Everything lives in Center, Periphery, or Silence—and layer assignment changes with mode.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">▸</span>
                <div>
                  <strong>No punishment, no shame, no dead ends.</strong> The system never locks users out
                  or judges choices. Override patterns are learning signals, not defiance.
                </div>
              </li>
            </ul>
          </div>
        </section> */}

        {/* Platform Components */}
        <section className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Platform Components</h2>
          <div className="space-y-4 text-gray-600">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-800">Component</th>
                  <th className="text-left py-3 font-semibold text-gray-800">Purpose</th>
                  <th className="text-left py-3 font-semibold text-gray-800">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 font-medium">World Canon</td>
                  <td className="py-3">The locked + open rules of LifeOS 2030</td>
                  <td className="py-3 text-xs font-mono text-gray-500">WORLD.md + backend/data/world/</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">World Website</td>
                  <td className="py-3">Visual interface to edit canon, manage versions</td>
                  <td className="py-3 text-xs font-mono text-gray-500">website/ (this interface)</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">Synthetic User</td>
                  <td className="py-3">Marcus Chen—a fully specified PKG for scenarios</td>
                  <td className="py-3 text-xs font-mono text-gray-500">backend/data/knowledge-graph/</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">API Layer</td>
                  <td className="py-3">Endpoints for all data operations</td>
                  <td className="py-3 text-xs font-mono text-gray-500">backend/api/ (port 3001)</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">Prototypes</td>
                  <td className="py-3">React/Swift interfaces testing specific interactions</td>
                  <td className="py-3 text-xs font-mono text-gray-500">Work in Progress section</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* The Research Loop - Hidden */}
        {/* <section className="glass rounded-2xl p-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Research Loop</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="font-medium">
              This platform enables a continuous research cycle:
            </p>
            <div className="flex flex-col space-y-3 my-6 pl-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">1</div>
                <span><strong>Define world rules</strong> in the canon (locked constraints + open questions)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">2</div>
                <span><strong>Specify Marcus's PKG</strong> to embody realistic user values and context</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">3</div>
                <span><strong>Generate scenarios</strong> that put Marcus in situations with competing priorities</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">4</div>
                <span><strong>Identify design tensions</strong> where the architecture breaks or feels unsatisfying</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">5</div>
                <span><strong>Build prototypes</strong> to explore interaction patterns for unresolved questions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">6</div>
                <span><strong>Refine the world canon</strong> based on insights—versioning to track evolution</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-semibold">↻</div>
                <span className="italic">Repeat, deepening understanding with each cycle</span>
              </div>
            </div>
            <p>
              The platform architecture makes this loop tractable: version control ensures you can always
              roll back, the API provides programmatic access to all data, and this website offers
              human-readable views for rapid exploration and editing.
            </p>
          </div>
        </section> */}

        {/* For Researchers - Hidden */}
        {/* <section className="glass rounded-2xl p-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">For Researchers & Collaborators</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              If you're exploring this platform as a reviewer, collaborator, or fellow researcher in
              speculative design or HCI:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                The <strong>Thesis → Structure</strong> page provides the high-level conceptual framework
              </li>
              <li>
                <strong>LifeOS</strong> pages detail the architectural components (domains, modes, intents, ecosystem)
              </li>
              <li>
                <strong>Marcus Chen</strong> demonstrates how a synthetic user grounds abstract concepts
              </li>
              <li>
                <strong>Scenarios</strong> show the system under stress—revealing where it works and where it breaks
              </li>
              <li>
                <strong>Work in Progress</strong> tracks prototype iterations chronologically
              </li>
              <li>
                <strong>Versions</strong> provide snapshots of the world canon at different points in the research timeline
              </li>
            </ul>
            <p className="mt-6 text-sm bg-blue-50 border border-blue-200 rounded-lg p-4">
              <strong>Note:</strong> This is a research tool, not a production system. The value lies in the
              <em> process</em> of specification and the design tensions it surfaces—not in building a functional
              LifeOS implementation.
            </p>
          </div>
        </section> */}
      </div>
    </div>
  );
}
