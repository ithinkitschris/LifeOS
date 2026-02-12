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

## See Also
- [architecture-decisions.md](./architecture-decisions.md) - Detailed decision records (TODO)
