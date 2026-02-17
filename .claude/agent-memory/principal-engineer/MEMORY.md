# LifeOS Platform - Principal Engineer Memory

## Architecture Overview
- **Backend**: Node.js/Express API at `backend/`, serves YAML from `backend/data/world/` and `backend/data/knowledge-graph/`
- **Dashboard**: Next.js React app at `dashboard/` (localhost:3000), uses Tailwind + glassmorphism design system
- **Data format**: YAML files, served as JSON via API endpoints
- **API**: localhost:3001, routes in `backend/api/routes/*.js` (ES modules)

## Dashboard Page Patterns
- Pages at `dashboard/src/app/{route}/page.tsx`, all `'use client'`
- Data-driven pages (thesis, setting, modes): fetch from API in useEffect, loading/error/content states
- Static pages (architecture, ecosystem): just render an image in a glass-card
- Shared layout with collapsible Sidebar component
- API functions in `dashboard/src/lib/api.ts`
- Design tokens in `dashboard/src/app/globals.css` (glass, glass-card, nav-item, badge-*, btn-primary)

## Sidebar Structure (in order)
- **Thesis**: Thesis, Open Questions
- **World**: 2030 Setting
- **LifeOS**: Modes, Intents, Multimodal Ecosystem, System Architecture, Domains
- **Synthetic User**: Marcus Chen
- **Testing**: Scenarios
- Footer: Versions

## Key YAML Files
- `backend/data/world/system-architecture.yaml` - Full cooperation stack with orchestrator, perception, cognition, personal context, information integrity
- `backend/data/world/thesis.yaml` - Research question, approach, contributions
- `backend/data/world/setting.yaml` - 2030 world context
- `backend/data/world/devices.yaml` - Multimodal ecosystem

## API Endpoints (world.js)
- `GET /api/world` - Full state
- `GET /api/world/system-architecture` - Architecture YAML
- `GET /api/world/thesis` - Thesis data
- `GET /api/world/setting` - Setting data
- `GET /api/world/domains/:id` - Domain by ID
- Domains stored in `backend/data/world/domains/` with `_registry.yaml`

## Design System
- Font: SF Pro Rounded
- Glassmorphism: `glass` (sidebar), `glass-card` (content cards)
- Gradients: blue (--gradient-blue), purple (--gradient-purple)
- Badges: badge-locked (amber), badge-open (green), badge-scaffolded (blue)
- Cards use --radius-card (22px), pills use --radius-pill (9999px)
- Page header pattern: h1 text-3xl + p text-gray-400 subtitle, mb-10

## Decisions Log
- 2026-02-07: Recommended `/information-flow` page as new top-level under LifeOS section. Hybrid approach: fetch data from existing system-architecture.yaml API, hardcode comparison examples in component. No new YAML file needed.

## Digital Twin Architecture (as of 2026-02-17)

### Current State
- PKG files: `pkg-chris.md` (16KB/~4K tokens) and `pkg-chris-full.md` (42KB/~10K tokens) at repo root
- Backend endpoint: `POST /api/llm/digital-twin` in `backend/api/routes/llm.js` (line 668)
- Frontend: `prototypes/digital-twin/src/App.jsx` - React chat UI with PKG version toggle
- Model: claude-sonnet-4-6, temp 0.7, max_tokens 512, prompt caching enabled
- No conversation persistence, no streaming, no correction mechanism yet

### PKG Design Insights
- PKG is prose-first holistic personality spec -- markdown is optimal for LLM consumption
- Sections are interconnected (Voice Rules constrain all output, Contradictions modify Values)
- Do NOT chunk the PKG for RAG -- always send full PKG as system prompt
- Hybrid approach recommended: markdown PKG (LLM-facing) + YAML metadata (tooling-facing)

### Recommended Evolution Path
1. Streaming responses (SSE) -> DONE
2. Conversation persistence -> 3. Correction logging -> DONE
4. Writing corpus collection -> 5. PKG metadata YAML -> 6. RAG only if corpus exceeds context
7. PKG diff proposals from corrections (thesis demo feature)

## Portfolio Website (nextjs-boilerplate repo)
- **Location:** `/Users/chris/Documents/GitHub/nextjs-boilerplate/`
- **Framework:** Next.js 16+ (App Router), React 19, Tailwind 3.4, Framer Motion 12, GSAP 3.12
- **Existing AI:** `/api/curate/route.js` — single-shot report generation, SSE via ReadableStream
- **Knowledge base:** `knowledge/` — identity.md, voice.md, chris-voice-spec.md, instructions.md, companies.md, projects/*.md
- **Knowledge loader:** `app/lib/knowledge.js` — exports loadIdentity(), loadVoice(), loadInstructions(), etc.
- **State:** 4 Context providers (VideoContext, BrowserContext, HideNavContext, ChangelogContext)
- **Styling:** Glass morphism (bg-white/5, backdrop-blur), dark mode via class strategy
- **Deployment:** Vercel with @vercel/analytics
- **AI-flow naming:** onboarding = questionnaire, orchestrator = /api/curate, intent = visitor type selection

### Portfolio Twin Integration Plan (2026-02-17)
- New `/api/chat/route.js` in portfolio repo (not proxy to lifeos backend) — Vercel deployment simplicity
- `ChatContext` provider (5th context) for cross-page state persistence
- Slide-out side panel UI from right edge, 400-440px, glass morphism
- Copy compact PKG to `knowledge/twin-pkg.md`, supplement with portfolio project context
- No corrections system in portfolio (thesis-only feature)
- Rate limiting: client cap (25/session) + server IP-based (30/hour)
- Onboarding context (intent, persona, company) flows into chat for persona-aware responses
- Estimated cost: ~$0.15-0.25 per 25-message conversation with prompt caching

## See Also
- [architecture-decisions.md](./architecture-decisions.md) - Detailed decision records (TODO)
