'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Vignette {
  id: string;
  title: string;
  description?: string;
  domain?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type SimMode = 'immersive' | 'reflective';

const REACTION_TAGS = [
  { id: 'agency-held',         label: 'Agency Held',        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  { id: 'agency-eroded',       label: 'Agency Eroded',      color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' },
  { id: 'surprising',          label: 'Surprising',         color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { id: 'uncomfortable',       label: 'Uncomfortable',      color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' },
  { id: 'delightful',          label: 'Delightful',         color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
  { id: 'design-tension',      label: 'Design Tension',     color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
  { id: 'augmentation-landed', label: 'Augmentation Landed', color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' },
  { id: 'substitution-crept',  label: 'Substitution Crept', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' },
] as const;

type TagId = typeof REACTION_TAGS[number]['id'];

interface LoggedReaction {
  id: string;
  text: string;
  tags: TagId[];
  turn: number;
  timestamp: string;
}

interface ReflectionPrompt {
  prompt: string;
  theme?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SimulatePage() {
  // Vignette selection
  const [vignettes, setVignettes]           = useState<Vignette[]>([]);
  const [selectedVignette, setSelectedVignette] = useState<string>('');
  const [mode, setMode]                     = useState<SimMode>('immersive');
  const [loadingVignettes, setLoadingVignettes] = useState(true);

  // Session state
  const [sessionId, setSessionId]           = useState<string | null>(null);
  const [started, setStarted]               = useState(false);
  const [ended, setEnded]                   = useState(false);

  // Conversation
  const [messages, setMessages]             = useState<Message[]>([]);
  const [inputText, setInputText]           = useState('');
  const [streaming, setStreaming]           = useState(false);
  const [streamBuffer, setStreamBuffer]     = useState('');

  // Reaction capture
  const [reactionText, setReactionText]     = useState('');
  const [selectedTags, setSelectedTags]     = useState<TagId[]>([]);
  const [reactions, setReactions]           = useState<LoggedReaction[]>([]);
  const [loggingReaction, setLoggingReaction] = useState(false);

  // Post-session reflection
  const [reflections, setReflections]       = useState<ReflectionPrompt[]>([]);
  const [loadingReflections, setLoadingReflections] = useState(false);

  const conversationEndRef = useRef<HTMLDivElement>(null);
  const inputRef           = useRef<HTMLTextAreaElement>(null);
  const abortRef           = useRef<AbortController | null>(null);

  // ── Load vignettes on mount ────────────────────────────────────────────────

  useEffect(() => {
    async function loadVignettes() {
      try {
        const res = await fetch(`${API_BASE}/api/vignettes`);
        if (res.ok) {
          const data = await res.json();
          const list: Vignette[] = data.vignettes ?? data ?? [];
          setVignettes(list);
          if (list.length > 0) setSelectedVignette(list[0].id);
        }
      } catch {
        // API not available — surface a placeholder so the page is usable
        setVignettes([{ id: 'demo', title: 'Demo vignette (API offline)' }]);
        setSelectedVignette('demo');
      } finally {
        setLoadingVignettes(false);
      }
    }
    loadVignettes();
  }, []);

  // ── Auto-scroll conversation ───────────────────────────────────────────────

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamBuffer]);

  // ── SSE streaming helper ───────────────────────────────────────────────────

  const streamSimulation = useCallback(async (
    vignetteId: string,
    simMode: SimMode,
    history: Message[],
  ): Promise<void> => {
    const controller = new AbortController();
    abortRef.current = controller;

    setStreaming(true);
    setStreamBuffer('');

    try {
      const res = await fetch(`${API_BASE}/api/simulation/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vignette_id: vignetteId, mode: simMode, messages: history }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`Simulation request failed: ${res.status}`);
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (!payload) continue;

          try {
            const event = JSON.parse(payload);
            if (event.type === 'text') {
              accumulated += event.text;
              setStreamBuffer(accumulated);
            } else if (event.type === 'done') {
              // Commit streamed content to messages array
              setMessages(prev => [...prev, { role: 'assistant', content: accumulated }]);
              setStreamBuffer('');
            }
          } catch {
            // Malformed SSE chunk — skip
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        // Surface a graceful error message in the conversation
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '[Connection error — the simulation API may be offline. Check the backend is running at localhost:3001.]',
        }]);
      }
    } finally {
      setStreaming(false);
      setStreamBuffer('');
      abortRef.current = null;
    }
  }, []);

  // ── Begin simulation ───────────────────────────────────────────────────────

  const handleBegin = useCallback(async () => {
    if (!selectedVignette) return;

    // 1. Create a findings session
    let sid: string | null = null;
    try {
      const res = await fetch(`${API_BASE}/api/findings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vignette_id: selectedVignette, mode }),
      });
      if (res.ok) {
        const data = await res.json();
        sid = data.id ?? data.session_id ?? data.finding?.id ?? null;
      }
    } catch {
      // Session creation failed — continue without persisting reactions
    }

    setSessionId(sid);
    setStarted(true);
    setMessages([]);
    setReactions([]);
    setReflections([]);
    setEnded(false);

    // 2. Kick off the opening turn with empty history (the API provides the opening)
    await streamSimulation(selectedVignette, mode, []);
  }, [selectedVignette, mode, streamSimulation]);

  // ── Send a user message ────────────────────────────────────────────────────

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || streaming || !started || ended) return;

    const userMsg: Message = { role: 'user', content: text };
    const updatedHistory   = [...messages, userMsg];

    setMessages(updatedHistory);
    setInputText('');

    await streamSimulation(selectedVignette, mode, updatedHistory);
  }, [inputText, streaming, started, ended, messages, selectedVignette, mode, streamSimulation]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Log a reaction ────────────────────────────────────────────────────────

  const handleLogReaction = useCallback(async () => {
    if (!reactionText.trim() && selectedTags.length === 0) return;

    const currentTurn = messages.length;
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');

    const reaction: LoggedReaction = {
      id:        crypto.randomUUID(),
      text:      reactionText.trim(),
      tags:      selectedTags,
      turn:      currentTurn,
      timestamp: new Date().toISOString(),
    };

    setLoggingReaction(true);
    try {
      if (sessionId) {
        await fetch(`${API_BASE}/api/findings/${sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reaction:           reaction.text,
            tags:               reaction.tags,
            simulation_turn:    currentTurn,
            simulation_context: lastAssistant?.content ?? '',
          }),
        });
      }
    } catch {
      // Non-fatal — still add locally
    } finally {
      setLoggingReaction(false);
    }

    // Prepend so newest is first
    setReactions(prev => [reaction, ...prev]);
    setReactionText('');
    setSelectedTags([]);
  }, [reactionText, selectedTags, messages, sessionId]);

  // ── End session & fetch reflections ───────────────────────────────────────

  const handleEndSession = useCallback(async () => {
    abortRef.current?.abort();
    setEnded(true);

    if (!sessionId) return;

    setLoadingReflections(true);
    try {
      const res = await fetch(`${API_BASE}/api/findings/${sessionId}/reflect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, reactions }),
      });
      if (res.ok) {
        const data = await res.json();
        const prompts: ReflectionPrompt[] = data.prompts ?? data.reflections ?? [];
        setReflections(prompts);
      }
    } catch {
      setReflections([
        { prompt: 'What surprised you most about how LifeOS handled this situation?', theme: 'Agency' },
        { prompt: 'At what moment did you feel most in control — or least?', theme: 'Control' },
        { prompt: 'Was there a point where automation felt helpful versus intrusive?', theme: 'Design tension' },
      ]);
    } finally {
      setLoadingReflections(false);
    }
  }, [sessionId, messages, reactions]);

  // ── Tag toggle ─────────────────────────────────────────────────────────────

  const toggleTag = (tag: TagId) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // ── Active vignette label ──────────────────────────────────────────────────

  const activeVignette = vignettes.find(v => v.id === selectedVignette);

  // ────────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────────

  return (
    /* Full-viewport layout — no outer scroll; panels scroll independently */
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50/50">

      {/* ── Top control bar ── */}
      <div className="flex-none flex items-center gap-3 px-6 py-3 border-b border-black/[0.05] bg-white/80 backdrop-blur-sm">

        {/* Vignette selector */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
            Vignette
          </label>
          {loadingVignettes ? (
            <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <select
              value={selectedVignette}
              onChange={e => setSelectedVignette(e.target.value)}
              disabled={started}
              className="flex-1 max-w-xs text-sm text-gray-800 bg-white border border-black/[0.08] rounded-lg px-3 py-1.5 appearance-none cursor-pointer
                         focus:outline-none focus:border-lifeos-400 focus:ring-2 focus:ring-lifeos-400/10
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {vignettes.map(v => (
                <option key={v.id} value={v.id}>{v.title}</option>
              ))}
            </select>
          )}
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Mode</label>
          <div className="flex rounded-lg border border-black/[0.08] overflow-hidden text-xs font-medium">
            {(['immersive', 'reflective'] as SimMode[]).map(m => (
              <button
                key={m}
                onClick={() => !started && setMode(m)}
                disabled={started}
                className={`px-3 py-1.5 capitalize transition-colors duration-100 disabled:cursor-not-allowed
                  ${mode === m
                    ? 'bg-lifeos-600 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Session controls */}
        <div className="flex items-center gap-2">
          {!started ? (
            <button
              onClick={handleBegin}
              disabled={!selectedVignette || loadingVignettes}
              className="btn-primary px-4 py-1.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Begin
            </button>
          ) : !ended ? (
            <button
              onClick={handleEndSession}
              className="px-4 py-1.5 text-sm font-medium text-gray-600 border border-black/[0.08] rounded-full
                         hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-150"
            >
              End Session
            </button>
          ) : (
            <button
              onClick={() => {
                setStarted(false);
                setEnded(false);
                setMessages([]);
                setReactions([]);
                setReflections([]);
                setSessionId(null);
              }}
              className="px-4 py-1.5 text-sm font-medium text-gray-600 border border-black/[0.08] rounded-full hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Two-panel body ── */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">

        {/* ══ LEFT PANEL — Simulation conversation ═══════════════════════════ */}
        <div className="flex-1 glass rounded-2xl flex flex-col min-h-0 overflow-hidden shadow-[var(--shadow-card)]">

          {/* Panel header */}
          <div className="flex-none flex items-center justify-between px-5 py-4 border-b border-black/[0.05]">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-gray-900 tracking-tight truncate">
                {activeVignette?.title ?? 'Select a vignette'}
              </h2>
              {activeVignette?.description && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{activeVignette.description}</p>
              )}
            </div>
            {/* Mode badge */}
            <span
              className={`flex-none ml-3 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full
                ${mode === 'immersive'
                  ? 'bg-lifeos-100 text-lifeos-700'
                  : 'bg-purple-50 text-purple-600'
                }`}
            >
              {mode}
            </span>
          </div>

          {/* Message thread — scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
            {!started && (
              /* Empty state */
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-12 h-12 rounded-2xl bg-lifeos-50 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-lifeos-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">
                  Choose a vignette and mode, then press <strong className="text-gray-600">Begin</strong> to start.
                </p>
              </div>
            )}

            {/* Committed messages */}
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}

            {/* Streaming assistant message */}
            {streaming && streamBuffer && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 bg-white border border-black/[0.06] shadow-[var(--shadow-card)]">
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{streamBuffer}</p>
                  {/* Blinking cursor */}
                  <span className="inline-block w-0.5 h-3.5 bg-lifeos-500 ml-0.5 animate-[blink_1s_step-end_infinite] align-middle" />
                </div>
              </div>
            )}

            {/* Loading indicator when streaming but no buffer yet */}
            {streaming && !streamBuffer && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-black/[0.06] rounded-2xl rounded-tl-sm shadow-[var(--shadow-card)]">
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={conversationEndRef} />
          </div>

          {/* Input bar */}
          <div className="flex-none border-t border-black/[0.05] px-4 py-3">
            {ended ? (
              <p className="text-center text-xs text-gray-400 py-1">
                Session ended — review reactions and reflections on the right.
              </p>
            ) : (
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder={
                    !started
                      ? 'Press Begin to start the simulation…'
                      : mode === 'immersive'
                      ? 'Reply to LifeOS…'
                      : 'Respond to the scenario…'
                  }
                  disabled={!started || streaming || ended}
                  rows={1}
                  className="flex-1 resize-none text-sm text-gray-800 bg-white/80 border border-black/[0.08] rounded-xl px-3.5 py-2.5
                             placeholder:text-gray-300 focus:outline-none focus:border-lifeos-400 focus:ring-2 focus:ring-lifeos-400/10
                             disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed
                             max-h-32 overflow-y-auto"
                  style={{ minHeight: '42px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!started || streaming || ended || !inputText.trim()}
                  className="flex-none btn-primary px-4 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══ RIGHT PANEL — Reaction capture ════════════════════════════════ */}
        <div className="w-80 flex flex-col gap-3 min-h-0 overflow-hidden">

          {/* Reaction input card */}
          <div className="glass rounded-2xl flex flex-col shadow-[var(--shadow-card)]">
            <div className="px-5 pt-4 pb-3 border-b border-black/[0.05]">
              <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Reactions</h3>
            </div>

            <div className="px-4 py-3 space-y-3">
              {/* Reaction text */}
              <textarea
                value={reactionText}
                onChange={e => setReactionText(e.target.value)}
                placeholder="What are you noticing right now?"
                rows={3}
                className="w-full resize-none text-sm text-gray-800 bg-white/80 border border-black/[0.08] rounded-xl px-3.5 py-2.5
                           placeholder:text-gray-300 focus:outline-none focus:border-lifeos-400 focus:ring-2 focus:ring-lifeos-400/10
                           leading-relaxed"
              />

              {/* Tag chips */}
              <div className="flex flex-wrap gap-1.5">
                {REACTION_TAGS.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded-full border transition-all duration-100
                      ${selectedTags.includes(tag.id)
                        ? tag.color + ' ring-1 ring-current/30'
                        : 'bg-white text-gray-400 border-black/[0.08] hover:text-gray-600 hover:border-black/[0.15]'
                      }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              {/* Log button */}
              <button
                onClick={handleLogReaction}
                disabled={loggingReaction || (!reactionText.trim() && selectedTags.length === 0)}
                className="w-full btn-primary py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loggingReaction ? 'Logging…' : 'Log Reaction'}
              </button>
            </div>
          </div>

          {/* Logged reactions — scrollable */}
          <div className="flex-1 glass rounded-2xl flex flex-col min-h-0 overflow-hidden shadow-[var(--shadow-card)]">
            <div className="flex-none flex items-center justify-between px-5 pt-4 pb-3 border-b border-black/[0.05]">
              <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Log</h3>
              {reactions.length > 0 && (
                <span className="text-[10px] text-gray-400">{reactions.length} captured</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 min-h-0">
              {reactions.length === 0 ? (
                <p className="text-xs text-gray-300 text-center py-6">
                  No reactions logged yet.
                </p>
              ) : (
                reactions.map(r => (
                  <ReactionCard key={r.id} reaction={r} />
                ))
              )}
            </div>
          </div>

          {/* Reflection section — shown only after session ends */}
          {ended && (
            <div className="glass rounded-2xl flex flex-col shadow-[var(--shadow-card)]">
              <div className="px-5 pt-4 pb-3 border-b border-black/[0.05]">
                <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Reflection</h3>
              </div>

              <div className="px-4 py-3 space-y-2">
                {loadingReflections ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : reflections.length === 0 ? (
                  <p className="text-xs text-gray-400">No reflection prompts returned.</p>
                ) : (
                  reflections.map((r, i) => (
                    <div key={i} className="p-3 bg-white/70 rounded-xl border border-black/[0.05]">
                      {r.theme && (
                        <p className="text-[10px] font-medium text-lifeos-600 uppercase tracking-wider mb-1">
                          {r.theme}
                        </p>
                      )}
                      <p className="text-xs text-gray-700 leading-relaxed">{r.prompt}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
          ${isUser
            ? 'bg-lifeos-600 text-white rounded-tr-sm shadow-[0_2px_8px_rgba(0,140,255,0.25)]'
            : 'bg-white text-gray-800 rounded-tl-sm border border-black/[0.06] shadow-[var(--shadow-card)]'
          }`}
      >
        {message.content}
      </div>
    </div>
  );
}

function ReactionCard({ reaction }: { reaction: LoggedReaction }) {
  const time = new Date(reaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="bg-white/70 rounded-xl border border-black/[0.05] px-3 py-2.5 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400">Turn {reaction.turn} · {time}</span>
      </div>
      {reaction.text && (
        <p className="text-xs text-gray-700 leading-relaxed">{reaction.text}</p>
      )}
      {reaction.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {reaction.tags.map(tid => {
            const tagDef = REACTION_TAGS.find(t => t.id === tid);
            return tagDef ? (
              <span
                key={tid}
                className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full border ${tagDef.color}`}
              >
                {tagDef.label}
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
