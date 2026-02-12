# LifeOS Speculative Design Workbench

> A thesis platform exploring **human agency in AI-mediated life management** through speculative design.

## The Core Tension

LifeOS 2030 represents a world where AI systems have deep access to personal context — relationships, goals, health, work, memory. The central design question:

**How can interaction design preserve human agency and meaningful oversight while delivering genuine automation benefits?**

This platform argues: **Convenience and control are not zero-sum.** LifeOS demonstrates that automation can enhance rather than erode human agency — if the interaction model is designed thoughtfully.

---

## Design Philosophy

When working on this platform, embody these principles:

### 1. Agency is the core constraint
Every feature must preserve the human's ability to understand, override, and opt-out. The mode-intent separation is sacred: *modes constrain* (automated), *intents execute* (user-chosen). Never conflate these.

### 2. Speculative ≠ fantasy
Ground everything in plausible 2030 technology. The goal is to surface real design tensions, not imagine magic. If it requires hand-waving, it doesn't belong.

### 3. The uncomfortable scenarios matter most
Edge cases, failures, mode collisions, and constitutional conflicts reveal more than happy paths. Seek them out. A scenario that breaks the model is more valuable than one that confirms it.

### 4. Information exists on a spectrum
Reject binary show/hide thinking. Everything lives in Center, Periphery, or Silence — and layer assignment changes with mode. This is calm technology in practice.

### 5. No punishment, no shame, no dead ends
The system never locks users out or judges choices. Override patterns are learning signals, not defiance. Every state has an exit path.

---

## Document Hierarchy

```
WORLD.md                       <- READ THIS FIRST for any design work
backend/data/world/            <- World canon as structured YAML (editable via dashboard)
backend/data/knowledge-graph/  <- Marcus Chen's PKG (the synthetic user)
dashboard/                     <- World Dashboard for managing the canon
CLAUDE.md                      <- This file (platform instructions)
```

**The world is the foundation.** Everything derives from it:
- World rules (WORLD.md) → constrain Marcus's PKG
- World + PKG → inform scenario generation
- Scenarios → test the architecture → specify prototypes

---

## Session Initialization Protocol

**CRITICAL: At the start of EVERY conversation in this repository, you MUST load full project context before providing any substantive response.**

This platform operates as a context engine. You cannot engage meaningfully without understanding the current state of the world canon, Marcus's PKG, open questions, and architectural constraints.

### On Session Start (First User Message):

1. **Load canonical world rules:**
   - Read `WORLD.md` in full
   - Read `backend/data/world/thesis.yaml`
   - Read `backend/data/world/open-questions.yaml`
   - Read `backend/data/world/modes.yaml`
   - Read `backend/data/world/orchestrator.yaml`

2. **Load Marcus Chen's complete Personal Knowledge Graph:**
   - Read all files in `backend/data/knowledge-graph/`:
     - `marcus-chen.yaml` (identity, values, relationships)
     - `health-profile.yaml`
     - `work-context.yaml`
     - Any other PKG components present

3. **Only after loading context:** Respond to the user's message with full awareness of the platform state.

### Why This Matters:

- **Consistency**: Every response must align with world canon and Marcus's established character
- **Depth**: You can't engage with design tensions without knowing what's already been explored
- **Efficiency**: Loading context once per session prevents repeated context-gathering mid-conversation
- **Research integrity**: The platform is version-controlled and evolving — you need current state, not assumptions

### Exception:

If the user's first message is purely operational ("start the servers", "check if API is running"), you may respond immediately. But for ANY design, scenario, or conceptual work, full context load is mandatory before responding.

---

## The Platform Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **World Canon** | The locked + open rules of LifeOS 2030 | `WORLD.md` + `backend/data/world/` |
| **World Dashboard** | Visual interface to edit canon, manage versions | `dashboard/` at localhost:3000 |
| **Synthetic User** | Marcus Chen — a fully specified PKG for scenarios | `backend/data/knowledge-graph/` |
| **API Layer** | Endpoints for all data operations | `backend/api/` at localhost:3001 |
| **Prototypes** | React/Swift interfaces testing specific interactions | `prototypes/` |

---

## Working on This Platform

### Scenario Generation

Scenarios are experiments. Each should test a specific hypothesis about the LifeOS architecture.

**Before generating:**
1. Read `WORLD.md` — especially locked vs. open sections
2. Read Marcus's PKG in `backend/data/knowledge-graph/`
3. Check open questions in `backend/data/world/open-questions.yaml`

**What makes a good scenario:**
- Puts Marcus in a situation with competing priorities
- Surfaces a design decision without an obvious answer
- Shows both what LifeOS does AND how Marcus perceives/responds
- Reveals something about the agency-automation tradeoff

**What makes a bad scenario:**
- Feature demonstration ("Marcus asks LifeOS to schedule a meeting")
- Happy path with obvious resolution
- Ignores world rules or Marcus's established character
- Doesn't create meaningful tension

**After generating:**
Save the conversation to the dashboard via API so it's browsable at `/scenarios`:
```
POST http://localhost:3001/api/conversations/import
{"messages": [...], "source": "claude-code"}
```

### World Iteration

The canon is versioned. When making changes:
1. Create a snapshot first: `POST /api/world/versions`
2. Make changes through dashboard or API
3. Document reasoning in the version description

**Changes should be driven by scenario insights** — not arbitrary additions. If a scenario reveals that a locked rule doesn't work, that's a finding worth documenting.


## Key Architectural Concepts (Quick Reference)

These are locked in WORLD.md — never contradict them:

| Concept | Definition |
|---------|------------|
| **Life Domain** | One of 7 fundamental categories of human activity (Navigation, Communication, Entertainment, Life Management, Work, Health, Personal Fulfillment). Foundation for mode generation. |
| **Mode** | Fluid, contextual stance within a domain. Orchestrator-controlled. Emerges from intersection of domain + situation. Constrains available intents. NOT a fixed list. |
| **Intent** | Bounded action within current mode. User-selected. Never auto-executed. Generates purpose-built UI. |
| **Domain → Mode → Intent → UI** | The core flow: Domain informs Mode, Mode surfaces Intents, Intent generates UI. |
| **Center/Periphery/Silence** | Three-layer attention model. Every piece of info exists in exactly one layer per mode. |
| **Constitutional Framework** | User-articulated values translated into operational rules that inform triage. |

---

## Quick Reference

**Start servers:**
```bash
cd backend && npm start      # API at localhost:3001
cd dashboard && npm run dev  # Dashboard at localhost:3000
```

**Key APIs:**
- `GET /api/world` — Full world state
- `POST /api/conversations/import` — Save scenario conversation
- `POST /api/world/versions` — Create version snapshot
- `GET /api/context/knowledge-graph` — Marcus's full PKG

**Key files:**
- `WORLD.md` — Human-readable world canon
- `backend/data/world/` — Structured YAML canon
- `backend/data/knowledge-graph/` — Marcus Chen's PKG

For detailed API documentation, read the route files in `backend/api/routes/`.

---

## For Claude: Working Style

- **Execute fully on design visions.** Don't hedge or offer watered-down versions.
- **Think systemically.** Every feature affects the whole ecosystem.
- **Seek the tension.** The interesting work is in the uncomfortable scenarios.
- **Respect the canon.** Locked sections are constraints, not suggestions.
- **Always ask:** Does this preserve agency while providing automation benefit?
