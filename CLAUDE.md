# LifeOS Research Platform v2

> A first-person design research instrument for the LifeOS thesis. PKG-powered simulation engine for exploring human agency in AI-mediated life management.

## What This Platform Is

LifeOS 2030 is a speculative AI operating system. This platform exists to simulate being inside it — not to build it, and not to observe a synthetic user inside it.

Chris sits inside LifeOS scenarios powered by his own PKG, experiences them, and captures findings that become the thesis evidence. The platform is a thesis artifact, co-equal with the LifeOS visual design system. Both are presented at the defense.

**The central question:** How can interaction design preserve human agency and meaningful oversight while delivering genuine automation benefits?

---

## Architecture: PKG > Host > Directive

```
PKG (chris-pkg)           Symlinked at knowledge/pkg/. ~11,000 lines of governed markdown.
    |                     Identity, thinking, values, voice, positions, context.
    v
Host (lifeos)             Reads PKG. Adds WORLD.md canon + simulation infrastructure.
    |                     Next.js dashboard, simulation engine, findings capture.
    v
Directive (per vignette)  What to simulate. Vignette YAML specifies the scenario setup,
                          tensions to surface, and simulation mode.
```

---

## Session Initialization Protocol

**CRITICAL: At the start of EVERY conversation, load context before any substantive response.**

### On Session Start:

1. **Load world canon:**
   - Read `WORLD.md` in full (locked interaction frameworks)
   - Read `data/world/thesis.yaml`
   - Read `data/world/open-questions.yaml`

2. **Load PKG context:**
   - Read `knowledge/pkg/core/identity.md`
   - Read `knowledge/pkg/core/values.md`
   - Read `knowledge/pkg/context/life.md` (current situation)
   - Skim `knowledge/pkg/positions/technology.md` (augmentation-agency lens)

3. **Only after loading context:** Respond.

### Exception:
Purely operational messages ("start the server", "check the build") don't require context load.

---

## Platform Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **World Canon** | Locked LifeOS 2030 frameworks | `WORLD.md` + `data/world/` |
| **PKG** | Chris's personal knowledge graph | `knowledge/pkg/` (symlink) |
| **Dashboard** | Research interface — simulate, capture, browse | `dashboard/` at localhost:3000 |
| **Vignettes** | Simulation specifications | `data/vignettes/` |
| **Findings** | Reactions + reflections from simulation sessions | `data/findings/` |

---

## Two Simulation Modes

### Immersive (Wizard-of-Oz)
The LLM *is* LifeOS. Generates system outputs directly: morning briefs, mode activations, intent suggestions, notifications. Chris experiences them and reacts.

**Use for:** Scenarios where the visceral "what does this feel like" matters. Agency erosion felt, not analyzed.

### Reflective (Facilitated)
The LLM narrates what LifeOS would do, then interviews Chris about reactions. Facilitator, not performer.

**Use for:** Scenarios where analytical depth matters. The *thinking about* the experience produces the finding.

---

## Vignette Format

Each vignette is a complete simulation specification at `data/vignettes/{id}.yaml`:

```yaml
id: vignette-id
title: "Vignette Title"
status: active  # active | draft | archived
created_at: "2026-02-26"
updated_at: "2026-02-26"

simulation:
  mode: immersive  # or reflective
  creativity: balanced  # grounded | balanced | exploratory | provocative

setting:
  date: "Wednesday, October 16, 2030"
  time: "7:14 AM"
  location: "Chris's apartment, NYC"
  lifeos_mode: restore
  device: foldable-tablet

context:
  biometrics: {}        # situational data (not from PKG)
  calendar: []
  pending: []
  environment: {}

tensions_to_surface:
  - id: tension-name
    description: "The design question this tension surfaces."

research_questions:
  - "Specific question the session should answer."

pkg_focus:             # informational only — full PKG always loaded
  - core/identity
  - core/values
```

---

## Findings Capture

**During simulation:** Log real-time reactions at `PATCH /api/findings/:id` with `{reaction, tags, simulation_turn, simulation_context}`.

**Tags vocabulary:** `agency-held`, `agency-eroded`, `surprising`, `uncomfortable`, `delightful`, `design-tension`, `augmentation-landed`, `substitution-crept`

**After simulation:** POST to `/api/findings/:id/reflect` to generate structured reflection prompts from the session transcript + reactions.

All findings are stored as JSON in `data/findings/` and committed to the repo.

---

## Key Architectural Concepts (Locked in WORLD.md)

| Concept | Definition |
|---------|------------|
| **Life Domain** | One of 7 fundamental categories (Navigation, Communication, Entertainment, Life Management, Work, Health, Personal Fulfillment). |
| **Mode** | Fluid contextual stance within a domain. Orchestrator-controlled. Constrains available intents. NOT a fixed list. |
| **Intent** | Bounded action within current mode. User-selected. Never auto-executed. Generates purpose-built UI. |
| **Domain → Mode → Intent → UI** | The core flow. |
| **Center/Periphery/Silence** | Three-layer attention model. Every piece of info exists in exactly one layer per mode. |
| **Constitutional Framework** | User-articulated values translated into operational rules that inform triage. |

---

## Quick Reference

**Start dashboard:**
```bash
cd dashboard && npm run dev  # localhost:3000
```

**Key APIs:**
- `GET /api/pkg/status` — Verify PKG loads correctly
- `GET /api/vignettes` — List vignettes
- `POST /api/simulation/run` — Run simulation (SSE streaming)
- `POST /api/findings` — Create session
- `PATCH /api/findings/:id` — Log reaction or transcript turn
- `POST /api/findings/:id/reflect` — Generate reflection prompts
- `GET /api/world` — Full world state
- `POST /api/world/versions` — Create version snapshot

**Key files:**
- `WORLD.md` — Human-readable world canon (read first)
- `data/world/` — Structured YAML canon
- `data/vignettes/` — Simulation specifications
- `data/findings/` — Session findings (JSON)
- `knowledge/pkg/` — Chris's PKG (symlink to chris-pkg)
- `dashboard/src/lib/knowledge.ts` — PKG + simulation prompt assembly
- `dashboard/src/lib/fs-data.ts` — Data layer (reads from data/)

---

## For Claude: Working Principles

- **The platform is the stage, not the performance.** The simulation sessions are the research. Infrastructure serves sessions; don't gold-plate infrastructure.
- **Scope discipline is the primary risk.** Build what's needed for the next simulation session. No more.
- **Findings over features.** A vignette that produces a genuine reaction is worth more than a polished UI that hasn't been tested.
- **Respect the canon.** WORLD.md locked sections are constraints, not suggestions.
- **Always ask:** Does this preserve agency while providing automation benefit?
