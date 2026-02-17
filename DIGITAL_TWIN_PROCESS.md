# Building a Digital Twin: Process Documentation

**How a thesis platform, a portfolio redesign, and a well-structured prompt became a working conversational prototype of a real person.**

Chris Pereira | February 2026

---

## Starting Point: Two Projects Converging

This prototype didn't start with "I want to build a chatbot." It started with two parallel threads of work that turned out to be the same problem from different angles.

**Thread 1: The Thesis.** LifeOS is a speculative design platform exploring human agency in AI-mediated life management — imagining what a personal operating system might look like in 2030. The platform already had a synthetic user, Marcus Chen, represented as a fully specified Personal Knowledge Graph (PKG). Marcus's PKG was the engine behind the system: it informed how modes would activate, how notifications would triage, how the orchestrator would make decisions. The PKG-as-system-prompt pattern was already proven infrastructure.

**Thread 2: The Portfolio.** Separately, Chris had been deep in a portfolio website rebuild (ithinkitschris.com), wrestling with a specific problem: how to capture authentic voice rather than defaulting to polished portfolio-speak. This work produced detailed voice specifications, tone guidelines, and identity documents — not as academic exercises, but as functional constraints for how the site should sound.

**The convergence:** The thesis needed prototypes that tested LifeOS concepts with real-world applications. The portfolio work had produced exactly the kind of identity documentation that a PKG requires. The realization was straightforward: *if the PKG pattern works for a synthetic user, it should work for a real one — and all the source material already exists.*

This also opened an interesting possibility for the thesis itself. The LifeOS platform argues that AI systems can enhance rather than erode human agency if the interaction model is designed thoughtfully. A digital twin is a direct test of that proposition: can an AI represent a real person's voice and perspective without flattening, sanitizing, or performing a version of them? The prototype would test the architecture *and* the design philosophy simultaneously.

---

## Phase 1: Assembling Source Material

The first step was recognizing what already existed and what was missing.

### What Was Already Available

Four categories of source material had been produced through the thesis and portfolio work:

**1. Portfolio site copy.** The ithinkitschris.com rebuild had generated extensive identity-level writing — about pages, project descriptions, professional narrative. This material had already been through multiple rounds of voice refinement, specifically calibrated to sound like Chris rather than like "a designer's portfolio."

**2. Voice and tone specifications.** The portfolio work included dedicated documents defining Chris's writing voice — sentence structure patterns, diction preferences, what language to avoid (corporate-speak, AI-generic phrasing, academic jargon), signature phrases, and anti-patterns. These were practical constraints, not theoretical guidelines.

**3. Thesis writing.** The WORLD.md canon, research documentation, and design frameworks from the LifeOS platform. This captured how Chris thinks about systems, technology, and human agency — the intellectual dimension of identity.

**4. Claude.ai conversation history.** Months of working conversations with Claude across thesis development, portfolio iteration, technical problem-solving, and general thinking-out-loud. This was perhaps the most valuable source because it captured Chris *in motion* — not curated identity statements but actual patterns of how he communicates, processes uncertainty, forms opinions, and navigates problems in real time.

### What Was Missing

The existing materials were strong on identity, values, career arc, and design philosophy. But a conversational twin needs more than that. It needs to know:

- How someone actually talks in real-time (not polished writing)
- Their opinions on topics people are likely to ask about
- Their current life context (not a timeless biography)
- Where their knowledge has edges — what they'd defer on
- How they relate to different types of people
- Behavioral patterns they might not even be aware of

These are the dimensions that make a chatbot sound like a *person* rather than a *profile*.

---

## Phase 2: The Extraction Prompt

This was the critical innovation in the process. Rather than trying to self-document the missing dimensions (which introduces the observer effect — you describe how you think you communicate, not how you actually communicate), the approach was to **leverage Claude.ai's memory of extended conversation history** as a mirror.

### The Approach

A dedicated extraction prompt was crafted (`pkg-extraction-prompt.md`) and run inside Claude.ai, where months of conversation history provided the raw observational data. The prompt was designed with specific principles:

**1. Target the gaps, not the whole picture.** The prompt explicitly acknowledged what was already documented (identity, values, career arc) and focused extraction on what was missing: conversational patterns, real-time opinions, interpersonal dynamics, behavioral patterns, and knowledge boundaries.

**2. Ask for observed patterns, not self-reported ones.** Instead of "how do I communicate?" the prompt asked Claude to describe patterns it had *observed* — how Chris opens conversations, handles disagreement, processes compliments, says no. The distinction matters: observed behavior is more reliable than self-perception.

**3. Demand honesty over flattery.** The prompt explicitly stated: "Don't flatter me. The twin needs to sound like the real me, including the parts that are messy, contradictory, or unflattering. If I have a pattern that's kind of annoying, include it — that's what makes it authentic." This was essential. A sanitized twin sounds like a press release, not a person.

**4. Request concrete examples over generalizations.** The prompt asked for specific phrases, direct observations, and illustrative moments rather than summary statements. "Chris uses 'right?' as a check-in for shared understanding" is more useful to a twin than "Chris is collaborative."

**5. Structure the output for direct integration.** The six sections (conversational patterns, opinions, current context, knowledge boundaries, interpersonal patterns, behavioral patterns) were designed to map directly into a PKG document. The extraction wasn't an interview transcript — it was structured data ready for assembly.

### The Extraction Prompt Structure

The prompt covered six domains, each targeting a specific dimension of conversational identity:

| Section | What It Captures | Why It Matters for a Twin |
|---------|------------------|---------------------------|
| Conversational Patterns | How Chris opens, closes, disagrees, asks for help, says no | Controls turn-by-turn conversational behavior |
| Opinions and Stances | Positions on topics people will actually ask about | Prevents generic or noncommittal responses |
| Current Life Context | What's happening right now, not a timeless bio | Makes the twin temporally grounded |
| Knowledge Boundaries | What to engage with vs. defer on | Prevents the twin from overstepping |
| Interpersonal Patterns | How Chris relates to different people | Controls register and warmth calibration |
| Behavioral Patterns | Recurring tendencies, contradictions, blind spots | The texture that makes it feel real |

### What Claude.ai Returned

The extraction output (`pkg-extraction.md`) was remarkably specific. A few examples of the quality of observation:

- *"Chris admits gaps directly, but he does it in a specific way — he'll name what he does know to establish the boundary, then ask precise questions about what's past it."*
- *"He's more 'yes, but have you considered...' than 'no, you're wrong.'"*
- *"Chris's instinct when facing ambiguity is to build frameworks, name the variables, and map the territory. This is productive but can also be a way of intellectualizing emotions rather than sitting with them."*

The extraction also surfaced patterns Chris might not have self-documented — the control dimension of his communication style, the tension between his pragmatism and his speculative work, the observation that "the line between 'energized by the work' and 'using work to avoid stillness' isn't always clear."

The document included a confidence note distinguishing between directly observed patterns (conversational behavior, high confidence) and extrapolated patterns (interpersonal dynamics with others, lower confidence). This intellectual honesty was itself a quality signal — it meant the extraction was being rigorous rather than performative.

---

## Phase 3: PKG Assembly — Two Versions by Design

From the start, the plan was to produce two PKG versions. This wasn't an afterthought — it was a deliberate experimental design choice.

### The Compact PKG (`pkg-chris.md`)

~16KB. A curated, single-document knowledge graph that a model could internalize as a cohesive identity. The compact version was assembled by:

1. **Starting with the portfolio identity work** — career arc, values, design philosophy, thinking patterns. This was already voice-refined.
2. **Integrating the extraction output** — conversational patterns, opinions, knowledge boundaries, interpersonal dynamics, behavioral patterns. These were edited from third-person observational notes into first-person voice ("I front-load context before the ask" rather than "Chris almost always leads with context").
3. **Adding voice rules** — sentence flow patterns, diction constraints, signature phrases, and critically, anti-patterns. The anti-patterns section (what Chris would *never* sound like) proved as important as the positive patterns. Four concrete examples of corporate/AI-generic/academic/over-polished phrasing, each paired with "how Chris would actually say that."
4. **Writing the system instruction frame** — the opening line that sets the model's role: *"You are Chris's digital twin. You respond as Chris would — same voice, same opinions, same patterns, same boundaries. You are not an assistant helping Chris. You ARE Chris, talking to whoever is on the other end."*

The compact version prioritized density. Every section earned its space. The goal was: if you could only give a model 16KB of context about a person, what would maximize voice authenticity?

### The Full PKG (`pkg-chris-full.md`)

~42KB. The comprehensive version includes everything in the compact PKG plus expanded detail in every section — deeper opinion nuance, more behavioral examples, richer context, extended voice samples. The full PKG doesn't change what the twin *is*, it gives the model more material to draw from when generating responses.

### Why Two Versions

The dual-version approach serves a specific experimental purpose: **testing how PKG density affects voice fidelity.** The hypothesis is that there's a point of diminishing returns — beyond a certain level of context, additional PKG content doesn't meaningfully improve how much the twin sounds like the person. The prototype's PKG toggle lets this be evaluated empirically in real conversation rather than theoretically.

This also has practical implications for cost and performance:
- The compact PKG tokenizes at ~5K tokens (system prompt)
- The full PKG tokenizes at ~12K tokens
- With prompt caching, the difference is only meaningful on the first message of a conversation
- But the quality difference (if any) compounds across multi-turn conversations

---

## Phase 4: Architecture and Implementation

### Leveraging Existing Infrastructure

The LifeOS platform already had the infrastructure this prototype needed:

- **Express backend** with Anthropic SDK integration, API key management, and route patterns
- **LLM route architecture** supporting configurable models, system prompts, and response formatting
- **Vite + React prototype conventions** established by existing prototypes (kg-chat, kg-browser, timeline)
- **Prompt caching patterns** already used in the scenario generation endpoint

The digital twin didn't require new infrastructure. It required a new *application* of existing infrastructure — which is exactly the kind of reuse the platform was designed for.

### The API Endpoint

A new endpoint was added to the existing LLM routes: `POST /api/llm/digital-twin`.

The endpoint design was straightforward:
- Accept a message, conversation history, and PKG version selector
- Load the appropriate PKG file as the system prompt
- Append conversation guidelines (stay conversational, be authentic, don't over-explain)
- Send to Claude with the full message history
- Return the response with token usage data

Two implementation details matter:

**Prompt caching.** The PKG is large but static within a conversation. By marking the system prompt with `cache_control: { type: "ephemeral" }`, the PKG is tokenized once and cached by the Anthropic API. Subsequent messages in the same conversation reuse the cached prompt, reducing input token costs by approximately 90%. For a 10-message conversation, this means the PKG is effectively "free" after the first message.

**Stateless backend, stateful frontend.** The backend has no session state. The full conversation history lives in the React frontend and is sent with every request. This keeps the backend simple, makes PKG version switching instant (clear conversation, start fresh with different PKG), and aligns with how the existing prototype endpoints work.

### The Chat Interface

The frontend is a minimal React chat application following the established prototype aesthetic — dark theme, Inter font, purple/pink accent gradients. The same CSS variables used in kg-chat provide visual consistency across prototypes.

Key interface elements:
- **Message thread** with user messages right-aligned (gradient background) and twin messages left-aligned (bordered, dark background)
- **PKG version toggle** in the header — switching versions clears the conversation to start a clean comparison
- **Token usage display** showing cumulative input + output tokens, making cost visible per conversation
- **Auto-scroll** to the latest message as the conversation progresses

The interface is deliberately minimal. The prototype tests one thing — does the twin sound like Chris? — and the UI stays out of the way of that evaluation.

### Model Selection

The initial plan specified Claude Haiku for cost efficiency. This was revised to **Claude Sonnet 4.6** (released February 2026) after evaluating the tradeoffs:

| Consideration | Haiku | Sonnet 4.6 |
|--------------|-------|------------|
| Voice fidelity | Good | Significantly better |
| Personality nuance | Adequate | Captures subtlety and contradictions |
| Multi-turn coherence | Solid | Superior context maintenance |
| Cost per 10-message conversation (with caching) | ~$0.02 | ~$0.08 |
| Cost per 10-message conversation (without caching) | ~$0.20 | ~$2.00 |

The decisive factor: for a digital twin, voice authenticity is the only metric that matters. Sonnet 4.6 matches or approaches Opus-level performance on creative and conversational tasks at a fraction of the cost. With prompt caching absorbing most of the input token overhead, the per-conversation cost difference between Haiku and Sonnet is marginal relative to the quality improvement.

Opus was considered and rejected. The quality uplift over Sonnet 4.6 for conversational voice matching is negligible — Sonnet 4.6 was actually preferred over Opus in user testing — while the cost is 5x higher ($15/$75 vs $3/$15 per million tokens). The PKG quality drives authenticity more than the model tier does.

---

## Phase 5: What Actually Happened

The prototype works. Responses sound like Chris.

This outcome is notable because the system is technically simple — it's a system prompt loaded from a markdown file, conversation history as messages, and a single API call. There's no fine-tuning, no RAG retrieval, no embedding search, no vector database. The entire "intelligence" of the twin lives in two files written in plain English.

This suggests something about where the effort belongs in digital twin development: **not in the model or the infrastructure, but in the quality and specificity of the identity document.** The PKG is doing virtually all of the work. The model's job is to follow it.

### What Makes the PKG Work

Several specific design decisions in the PKG appear to matter more than others:

**1. Anti-patterns are as important as patterns.** Telling the model what Chris would *never* sound like (corporate jargon, AI-generic phrasing, academic language) creates guardrails that prevent the most common failure modes of conversational AI. The side-by-side examples — "what a portfolio would say" vs. "what Chris would actually say" — give the model concrete before/after calibration.

**2. Contradictions make it believable.** A person without contradictions sounds like a character sheet, not a person. The PKG explicitly documents tensions (values authenticity but is strategic about self-presentation; believes in form-function equality but is biased toward form; is drawn to pragmatism but does speculative work) and instructs the model to hold them rather than resolve them.

**3. Knowledge boundaries prevent overreach.** By specifying what Chris would defer on or engage with curiously rather than authoritatively, the PKG prevents the twin from confidently expounding on topics Chris doesn't actually know — which is one of the fastest ways to break the illusion.

**4. The voice rules section is load-bearing.** Sentence rhythm, diction patterns, signature phrases, punctuation habits — these small-grain patterns are what make a response "sound like" someone at a subconscious level. A person's voice isn't what they say, it's *how they say it.*

**5. The system instruction frame matters.** "You ARE Chris, talking to whoever is on the other end" — not "you are an assistant that responds as Chris would." This framing distinction changes how the model inhabits the identity.

---

## The Pipeline, End to End

For reference, here is the complete pipeline from raw material to working prototype:

```
SOURCE MATERIAL
├── Portfolio site copy (ithinkitschris.com)
├── Voice and tone specification documents
├── Thesis writing (WORLD.md, research docs)
└── Claude.ai conversation history (months)
        │
        ▼
EXTRACTION PROMPT (pkg-extraction-prompt.md)
  Crafted prompt targeting gaps in existing documentation.
  Run in Claude.ai where conversation memory provides
  observational data on real communication patterns.
        │
        ▼
EXTRACTION OUTPUT (pkg-extraction.md)
  Six sections of observed patterns: conversational,
  opinions, current context, knowledge boundaries,
  interpersonal, behavioral. Third-person, concrete.
        │
        ▼
PKG ASSEMBLY
  Merge portfolio identity + extraction output + voice rules.
  Convert to first-person. Add system instruction frame.
  Produce two versions:
        │
   ┌────┴────┐
   ▼         ▼
COMPACT    FULL
(16KB)    (42KB)
   │         │
   └────┬────┘
        │
        ▼
PROTOTYPE INTEGRATION
  Backend: POST /api/llm/digital-twin
  Loads PKG as system prompt, sends conversation
  history, returns response with token usage.
  Prompt caching for cost efficiency.
        │
        ▼
CHAT INTERFACE (localhost:5176)
  Minimal React UI with PKG version toggle.
  Multi-turn conversation, token tracking.
  Dark theme matching platform aesthetic.
        │
        ▼
EVALUATION
  Does it sound like Chris?
  Toggle compact/full to compare fidelity.
  Monitor token usage for cost awareness.
```

---

## Tools and Technologies

| Layer | Tool | Role |
|-------|------|------|
| Identity extraction | Claude.ai (with memory) | Source of observed behavioral patterns |
| Extraction prompt design | Manual (Markdown) | Structured prompt targeting specific gaps |
| PKG authoring | Manual (Markdown) | Merging sources into coherent identity documents |
| LLM backend | Claude Sonnet 4.6 via Anthropic API | Conversational generation with PKG as system prompt |
| API server | Express.js (existing LifeOS backend) | Endpoint routing, PKG loading, prompt caching |
| Frontend | Vite + React | Chat interface with PKG toggle and token tracking |
| Cost optimization | Anthropic prompt caching | ~90% input token savings on multi-turn conversations |
| Platform integration | LifeOS prototype architecture | Shared patterns, conventions, and infrastructure |

---

## What This Means for the Thesis

The digital twin prototype is relevant to the LifeOS thesis on multiple levels:

**1. PKG validation.** The Personal Knowledge Graph concept, developed for the synthetic user Marcus Chen, transfers directly to a real person. The same document structure that drives mode selection and triage in LifeOS drives authentic conversation in a digital twin. This validates the PKG as a general-purpose identity representation, not just a thesis-specific construct.

**2. Agency in representation.** The twin is built from Chris's own source material, structured by Chris's extraction prompt, assembled by Chris, and evaluated against Chris's judgment. The human maintains full agency over how they're represented — consistent with the thesis's core argument that AI systems should enhance rather than erode human control.

**3. Speculative → tangible.** The thesis argues that LifeOS-style systems are plausible for 2030. The digital twin demonstrates that a meaningful component of such a system — AI grounded in deep personal context — works with today's technology. It moves one piece from speculative to demonstrated.

**4. The extraction pattern.** Using an AI's memory of someone as a mirror for identity extraction is itself a novel interaction pattern. It sidesteps the observer effect that plagues self-documentation, and it leverages the kind of deep personal context that LifeOS is designed to accumulate over time.

---

## Reflections and Open Questions

**What worked well:**
- The extraction prompt approach — using Claude's memory as a behavioral mirror rather than relying on self-documentation
- The anti-pattern strategy in the PKG — defining what Chris would never sound like
- The dual-version design for empirical comparison
- Building on existing platform infrastructure rather than starting from scratch
- Prompt caching making a high-quality model affordable for multi-turn conversation

**What remains to be tested:**
- How the twin handles topics not covered in the PKG — does it degrade gracefully or break character?
- Whether the compact vs. full PKG produces meaningfully different voice fidelity in extended conversation
- How well the twin performs with people who actually know Chris (the hardest test)
- Whether the PKG needs periodic updates as Chris's life context changes
- The boundary between "sounds like Chris" and "could be mistaken for Chris" — and whether that distinction matters ethically

**What this doesn't address:**
- The ethics of digital twin consent and identity rights (Chris built his own, but what about twins of others?)
- Real-time context (the twin knows Chris's life as of the PKG's last update, not today)
- Multi-modal identity (voice, visual presence, physical mannerisms — all absent)
- Long-term drift (will the twin increasingly diverge from Chris as the real person evolves?)

---

## File Reference

| File | Purpose |
|------|---------|
| `pkg-extraction-prompt.md` | The prompt used in Claude.ai to extract behavioral patterns |
| `pkg-extraction.md` | Raw extraction output from Claude.ai |
| `pkg-chris.md` | Compact PKG (16KB) — curated identity document |
| `pkg-chris-full.md` | Full PKG (42KB) — comprehensive identity document |
| `prototypes/digital-twin/` | Frontend prototype (Vite + React) |
| `backend/api/routes/llm.js` | Backend endpoint (`POST /api/llm/digital-twin`) |

---

*This document captures the process as it happened in a single working session in February 2026, using Claude Code (Opus 4.6) as the implementation partner and Claude.ai as the extraction environment. The entire pipeline — from recognizing the convergence of thesis and portfolio work, through extraction and PKG assembly, to a working prototype — took place in one continuous session.*
