# LifeOS Prototyping Platform

> **This platform serves a master's thesis in interaction design exploring human agency in AI systems.**

## Document Hierarchy

```
WORLD.md                    ← Canonical source of truth for LifeOS 2030
backend/data/world/         ← World canon as structured YAML (editable via dashboard)
backend/data/knowledge-graph/  ← Marcus Chen's PKG, derived from world rules
dashboard/                  ← World Dashboard (Next.js) for managing the canon
CLAUDE.md                   ← Platform instructions (this file)
```

**The world is the foundation.** Everything derives from it:
- World rules → constrain Marcus's PKG
- World + PKG → inform scenario generation
- Scenarios → specify prototypes

---

## What This Platform Is

A speculative design workbench for exploring LifeOS through:

1. **World Canon** (`backend/data/world/`) — The static, versioned truth of LifeOS 2030
2. **World Dashboard** (`dashboard/`) — Visual interface to manage the canon
3. **Synthetic User** (`backend/data/knowledge-graph/`) — Marcus Chen's PKG
4. **API Layer** (`backend/api/`) — Endpoints for all data
5. **Prototypes** (`prototypes/`) — React/Swift interfaces for testing

---

## Project Structure

```
lifeos-platform/
├── WORLD.md                      # Human-readable world canon (reference)
├── CLAUDE.md                     # This file
├── dashboard/                    # Next.js World Dashboard
│   ├── src/app/                  # Pages: overview, setting, domains, questions, versions
│   └── src/lib/api.ts            # API client
├── backend/
│   ├── api/
│   │   ├── server.js             # Express entry point
│   │   └── routes/
│   │       ├── world.js          # World canon CRUD + versioning
│   │       ├── context.js        # Knowledge graph queries
│   │       ├── modes.js          # Mode definitions
│   │       ├── orchestrator.js   # Constitutional values
│   │       └── llm.js            # Claude API integration
│   ├── data/
│   │   ├── world/                # World canon (YAML)
│   │   │   ├── meta.yaml         # Version info
│   │   │   ├── setting.yaml      # 2030 context
│   │   │   ├── domains/          # Architecture, principles, modes, etc.
│   │   │   ├── open-questions.yaml
│   │   │   └── versions/         # Snapshots
│   │   ├── knowledge-graph/      # Marcus Chen's PKG (JSON)
│   │   ├── modes/                # Mode definitions (YAML)
│   │   └── constitution/         # Values & rules (YAML)
│   └── config/
│       └── llm-config.yaml
└── prototypes/
    ├── templates/
    └── active/
```

---

## Quick Start

```bash
# 1. Start the backend API
cd backend && npm start
# API runs at http://localhost:3001

# 2. Start the World Dashboard
cd dashboard && npm run dev
# Dashboard runs at http://localhost:3000

# 3. (Optional) Enable LLM features
export ANTHROPIC_API_KEY=your-key
```

---

## World Dashboard

The dashboard at `http://localhost:3000` provides:

| View | Purpose |
|------|---------|
| **Overview** | Stats, thesis, domain cards, recent questions |
| **2030 Setting** | Edit the world context (technological/social landscape, problem, thesis) |
| **Domains** | Browse and edit domain content (architecture, modes, principles, etc.) |
| **Open Questions** | Manage unresolved design questions |
| **Versions** | Create snapshots, view history, restore previous states |

---

## API Quick Reference

**World Canon:**
- `GET /api/world` — Full world state
- `GET /api/world/setting` — 2030 context
- `GET /api/world/domains` — List domains
- `GET /api/world/domains/:id` — Domain detail
- `PUT /api/world/domains/:id` — Update domain
- `POST /api/world/domains` — Create domain
- `GET /api/world/open-questions` — Open questions
- `GET /api/world/versions` — Version history
- `POST /api/world/versions` — Create snapshot
- `POST /api/world/versions/:version/restore` — Restore

**Context (Marcus's PKG):**
- `GET /api/context/identity`
- `GET /api/context/relationships`
- `GET /api/context/knowledge-graph`

**Modes:**
- `GET /api/modes`
- `GET /api/modes/:id`

**LLM:**
- `POST /api/llm/generate`
- `POST /api/llm/scenario` ← **Scenario generation with full world + PKG context**

---

## Working With Claude

**For scenario generation:**
1. Claude reads `WORLD.md` + domain YAMLs for constraints
2. Claude reads Marcus's PKG for user context
3. Generate structured scenarios testing the architecture

**For world iteration:**
1. Use the dashboard to edit domains, questions, setting
2. Create version snapshots before major changes
3. Restore if needed

**For design exploration:**
1. Start from open questions in the dashboard
2. Generate scenarios that explore candidate approaches
3. Update world canon when decisions are made

**Style:**
- Execute fully on design visions
- Think systemically — how does this fit the ecosystem?
- Always ask: How does this preserve agency while providing automation benefit?
