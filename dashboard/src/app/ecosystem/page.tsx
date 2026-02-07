'use client';

/*
 * Previous coded ecosystem diagram preserved below (commented out).
 * Replaced with static image per design decision.
 */

// const devices = {
//   tablet: {
//     name: 'Foldable Tablet',
//     role: 'Core Information Interface',
//     color: { bg: 'from-red-100 to-red-200', border: 'border-red-300', text: 'text-red-900', accent: 'bg-red-50' },
//     capabilities: [
//       'Orchestrator / Authenticator / Processor',
//       'Unfold for medium\u2013heavy load workflows',
//     ],
//   },
//   smartwatch: {
//     name: 'Neural Smartwatch',
//     role: null,
//     color: { bg: 'from-blue-100 to-blue-200', border: 'border-blue-300', text: 'text-blue-900', accent: 'bg-blue-50' },
//     capabilities: [
//       'Spatial I/O',
//       'High-Fidelity Gesture Control',
//       'High-Fidelity Haptic Interface',
//     ],
//     details: {
//       title: 'Real-Time State Detection',
//       items: [
//         { label: 'Real-Time State Detection', desc: 'Emotional state, cognitive load, stress levels' },
//         { label: 'Proactive Intervention Timing', desc: 'Knows when to intervene based on physiological readiness' },
//         { label: 'Health-Domain Integration', desc: null },
//       ],
//     },
//   },
//   glass: {
//     name: 'Glass',
//     role: 'Core Contextual Interface',
//     color: { bg: 'from-purple-100 to-purple-200', border: 'border-purple-300', text: 'text-purple-900', accent: 'bg-purple-50' },
//     capabilities: [
//       'Visual I/O',
//       'Gaze Detection',
//       'Contextual Perception',
//     ],
//     details: {
//       title: 'Multimodal Perception Core',
//       items: [
//         { label: 'Multimodal Perception Core', desc: 'Primary sensor for understanding user\u2019s environment, focus (gaze) and intent.' },
//         { label: 'Contextual Intelligence', desc: 'The "what, where, who, when" that powers world models' },
//         { label: 'Proactive Information Delivery', desc: 'Just-in-time knowledge at point of need' },
//       ],
//     },
//   },
//   earphones: {
//     name: 'Earphones',
//     role: null,
//     color: { bg: 'from-blue-100 to-blue-200', border: 'border-blue-300', text: 'text-blue-900', accent: 'bg-blue-50' },
//     capabilities: [
//       'Audio I/O',
//       'Secondary Contextual Perception',
//     ],
//     details: {
//       title: 'Ambient Intervention',
//       items: [
//         { label: 'Ambient Intervention', desc: 'Conversation transcription and sentiment analysis. Environmental sound classification (traffic, nature, crowds)' },
//         { label: 'Cognitive Support', desc: 'Memory retrieval, bias correction, social coaching' },
//       ],
//     },
//   },
// };

// function TabletIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25V4.5a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
//     </svg>
//   );
// }

// function WatchIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
//   );
// }

// function GlassIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
//   );
// }

// function EarphoneIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
//     </svg>
//   );
// }

// function ConnectionArrow({ direction = 'horizontal' }: { direction?: 'horizontal' | 'vertical' }) {
//   if (direction === 'vertical') {
//     return (
//       <div className="flex justify-center py-1">
//         <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
//         </svg>
//       </div>
//     );
//   }
//   return (
//     <div className="flex items-center px-1">
//       <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
//       </svg>
//     </div>
//   );
// }

export default function EcosystemPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Multimodal Ecosystem</h1>
        <p className="text-gray-400 mt-1.5 tracking-tight">The device ecosystem that powers LifeOS interaction in 2030</p>
      </div>

      <div className="glass-card p-2 overflow-hidden">
        <img
          src="/multimodal-ecosystem.png"
          alt="Multimodal Ecosystem — Information Interface and Peripheral Interface devices"
          className="w-full h-auto rounded-xl"
        />
      </div>
    </div>
  );
}
