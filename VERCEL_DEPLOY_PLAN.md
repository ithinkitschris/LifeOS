# Vercel Deployment Plan — LifeOS Dashboard

## Context

The dashboard is a Next.js app (`dashboard/`) that proxies all `/api/*` requests to a local Express backend at `localhost:3001`. For Vercel, we create Next.js API route handlers that serve the same data as read-only endpoints from YAML/JSON files bundled at build time.

**Key constraint: local development must be completely unaffected.**

**Mechanism:** Switch `next.config.js` rewrites to use `beforeFiles` (which takes precedence over filesystem routes), applied only when `NODE_ENV === 'development'`. Locally, the rewrite wins and proxies to the real backend. On Vercel (`NODE_ENV=production`), the rewrite is empty and the Next.js API routes in `src/app/api/` handle all requests.

---

## Vercel Project Settings

In the Vercel dashboard, configure this project with:
- **Root Directory**: `dashboard`
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: leave as default (overridden by `dashboard/vercel.json`)
- **Output Directory**: leave as default (`.next`)

---

## Files to Create or Modify

### 1. `dashboard/next.config.js` — MODIFY

Replace entire file:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // In development, proxy all /api/* requests to the local backend.
    // In production (Vercel), the Next.js API route handlers in src/app/api/ serve data.
    if (process.env.NODE_ENV === 'development') {
      return {
        beforeFiles: [
          {
            source: '/api/:path*',
            destination: 'http://localhost:3001/api/:path*',
          },
        ],
      };
    }
    return { beforeFiles: [], afterFiles: [], fallback: [] };
  },
};

module.exports = nextConfig;
```

---

### 2. `dashboard/package.json` — MODIFY

Add to `dependencies`:

```json
"js-yaml": "^4.1.0",
"@types/js-yaml": "^4.0.9"
```

---

### 3. `dashboard/.gitignore` — MODIFY

Add at the end of the file:

```
# backend data (copied at Vercel build time, not committed)
/data
```

---

### 4. `dashboard/vercel.json` — CREATE

```json
{
  "buildCommand": "cp -r ../backend/data ./data && npm run build",
  "framework": "nextjs"
}
```

---

### 5. `dashboard/src/lib/data-loader.ts` — CREATE

```ts
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

// On Vercel, process.cwd() is the project root (dashboard/).
// The build command copies backend/data → dashboard/data before the build.
const DATA_ROOT = path.join(process.cwd(), 'data');

export const WORLD_PATH = path.join(DATA_ROOT, 'world');
export const KG_PATH = path.join(DATA_ROOT, 'knowledge-graph');
export const CONVERSATIONS_PATH = path.join(DATA_ROOT, 'conversations');
export const SCENARIOS_PATH = path.join(DATA_ROOT, 'scenarios');
export const PROTOTYPES_PATH = path.join(DATA_ROOT, 'prototypes');

export function loadYaml<T = unknown>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content) as T;
}

export function loadJson<T = unknown>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content) as T;
}
```

---

### 6. `dashboard/src/lib/readonly.ts` — CREATE

```ts
import { NextResponse } from 'next/server';

export function readOnly() {
  return NextResponse.json(
    { error: 'Read-only deployment. Write operations are not available.' },
    { status: 405, headers: { Allow: 'GET' } }
  );
}
```

---

### 7. `dashboard/src/app/api/world/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';

export async function GET() {
  try {
    const meta = loadYaml(path.join(WORLD_PATH, 'meta.yaml'));
    const setting = loadYaml(path.join(WORLD_PATH, 'setting.yaml'));
    const thesis = loadYaml(path.join(WORLD_PATH, 'thesis.yaml'));
    const devices = loadYaml(path.join(WORLD_PATH, 'devices.yaml'));
    const systemArchitecture = loadYaml(path.join(WORLD_PATH, 'system-architecture.yaml'));
    const providerIntegration = loadYaml(path.join(WORLD_PATH, 'provider-integration.yaml'));
    const openQuestions = loadYaml(path.join(WORLD_PATH, 'open-questions.yaml'));

    const domainsPath = path.join(WORLD_PATH, 'domains');
    const registry = loadYaml<{ domains: { id: string; file: string }[] }>(
      path.join(domainsPath, '_registry.yaml')
    );
    const domains: Record<string, unknown> = {};
    if (registry?.domains) {
      for (const ref of registry.domains) {
        try {
          domains[ref.id] = loadYaml(path.join(domainsPath, ref.file));
        } catch {}
      }
    }

    return NextResponse.json({
      meta, setting, thesis, devices, systemArchitecture,
      providerIntegration, domains, openQuestions,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load world state' }, { status: 500 });
  }
}
```

---

### 8. `dashboard/src/app/api/world/meta/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';

export async function GET() {
  try {
    return NextResponse.json(loadYaml(path.join(WORLD_PATH, 'meta.yaml')));
  } catch {
    return NextResponse.json({ error: 'Failed to load meta' }, { status: 500 });
  }
}
```

---

### 9. `dashboard/src/app/api/world/setting/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
  try {
    return NextResponse.json(loadYaml(path.join(WORLD_PATH, 'setting.yaml')));
  } catch {
    return NextResponse.json({ error: 'Failed to load setting' }, { status: 500 });
  }
}

export const PUT = readOnly;
```

---

### 10. `dashboard/src/app/api/world/thesis/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
  try {
    return NextResponse.json(loadYaml(path.join(WORLD_PATH, 'thesis.yaml')));
  } catch {
    return NextResponse.json({ error: 'Failed to load thesis' }, { status: 500 });
  }
}

export const PUT = readOnly;
```

---

### 11. `dashboard/src/app/api/world/domains/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
  try {
    const domainsPath = path.join(WORLD_PATH, 'domains');
    const registry = loadYaml<{ domains: { id: string; file: string }[] }>(
      path.join(domainsPath, '_registry.yaml')
    );
    const domains = (registry?.domains || []).map(ref => {
      try { return loadYaml(path.join(domainsPath, ref.file)); } catch { return null; }
    }).filter(Boolean);
    return NextResponse.json(domains);
  } catch {
    return NextResponse.json({ error: 'Failed to load domains' }, { status: 500 });
  }
}

export const POST = readOnly;
```

---

### 12. `dashboard/src/app/api/world/domains/[id]/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const domainsPath = path.join(WORLD_PATH, 'domains');
    const registry = loadYaml<{ domains: { id: string; file: string }[] }>(
      path.join(domainsPath, '_registry.yaml')
    );
    const ref = registry?.domains?.find(d => d.id === params.id);
    if (!ref) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    return NextResponse.json(loadYaml(path.join(domainsPath, ref.file)));
  } catch {
    return NextResponse.json({ error: 'Failed to load domain' }, { status: 500 });
  }
}

export const PUT = readOnly;
export const DELETE = readOnly;
```

---

### 13. `dashboard/src/app/api/world/open-questions/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
  try {
    return NextResponse.json(loadYaml(path.join(WORLD_PATH, 'open-questions.yaml')));
  } catch {
    return NextResponse.json({ error: 'Failed to load open questions' }, { status: 500 });
  }
}

export const POST = readOnly;
```

---

### 14. `dashboard/src/app/api/world/open-questions/[id]/route.ts` — CREATE

```ts
import { readOnly } from '@/lib/readonly';

export async function GET() {
  return readOnly();
}

export const PUT = readOnly;
export const DELETE = readOnly;
```

---

### 15. `dashboard/src/app/api/world/versions/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
  try {
    const versionsPath = path.join(WORLD_PATH, 'versions');
    if (!fs.existsSync(versionsPath)) return NextResponse.json([]);
    const files = fs.readdirSync(versionsPath).filter(f => f.endsWith('.yaml'));
    const versions = files.map(f => {
      try { return loadYaml(path.join(versionsPath, f)); } catch { return null; }
    }).filter(Boolean);
    return NextResponse.json(versions);
  } catch {
    return NextResponse.json({ error: 'Failed to load versions' }, { status: 500 });
  }
}

export const POST = readOnly;
```

---

### 16. `dashboard/src/app/api/world/versions/[version]/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';

export async function GET(_req: Request, { params }: { params: { version: string } }) {
  try {
    return NextResponse.json(loadYaml(path.join(WORLD_PATH, 'versions', `${params.version}.yaml`)));
  } catch {
    return NextResponse.json({ error: 'Version not found' }, { status: 404 });
  }
}
```

---

### 17. `dashboard/src/app/api/world/versions/[version]/restore/route.ts` — CREATE

```ts
import { readOnly } from '@/lib/readonly';
export const POST = readOnly;
```

---

### 18–26. Context routes — CREATE (9 files, same pattern)

For each file below, use the template and substitute the filename:

**Template:**
```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, KG_PATH } from '@/lib/data-loader';

export async function GET() {
  try {
    return NextResponse.json(loadYaml(path.join(KG_PATH, 'FILENAME')));
  } catch {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
```

| Route file | FILENAME |
|---|---|
| `dashboard/src/app/api/context/identity/route.ts` | `identity.yaml` |
| `dashboard/src/app/api/context/relationships/route.ts` | `relationships.yaml` |
| `dashboard/src/app/api/context/behaviors/route.ts` | `behaviors.yaml` |
| `dashboard/src/app/api/context/locations/route.ts` | `locations.yaml` |
| `dashboard/src/app/api/context/health/route.ts` | `health.yaml` |
| `dashboard/src/app/api/context/communications/route.ts` | `communications.yaml` |
| `dashboard/src/app/api/context/calendar/route.ts` | `calendar.yaml` |
| `dashboard/src/app/api/context/timeline/route.ts` | `timeline.yaml` |
| `dashboard/src/app/api/context/digital-history/route.ts` | `digital-history.yaml` |

---

### 27. `dashboard/src/app/api/context/knowledge-graph/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, KG_PATH } from '@/lib/data-loader';

export async function GET() {
  try {
    const files = [
      'identity.yaml', 'relationships.yaml', 'behaviors.yaml', 'health.yaml',
      'locations.yaml', 'calendar.yaml', 'communications.yaml', 'digital-history.yaml',
    ];
    const [identity, relationships, behaviors, health, locations, calendar, communications, digitalHistory] =
      files.map(f => loadYaml(path.join(KG_PATH, f)));
    return NextResponse.json({
      identity, relationships, behaviors, health,
      locations, calendar, communications, digitalHistory,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load knowledge graph' }, { status: 500 });
  }
}
```

---

### 28. `dashboard/src/app/api/conversations/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadJson, CONVERSATIONS_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
  try {
    const index = loadJson<{ conversations: any[] }>(path.join(CONVERSATIONS_PATH, 'index.json'));
    const sorted = (index.conversations || []).sort((a: any, b: any) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    return NextResponse.json({ conversations: sorted });
  } catch {
    return NextResponse.json({ conversations: [] });
  }
}

export const POST = readOnly;
```

---

### 29. `dashboard/src/app/api/conversations/[id]/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadJson, CONVERSATIONS_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json(loadJson(path.join(CONVERSATIONS_PATH, `${params.id}.json`)));
  } catch {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }
}

export const DELETE = readOnly;
```

---

### 30. `dashboard/src/app/api/conversations/[id]/messages/route.ts` — CREATE

```ts
import { readOnly } from '@/lib/readonly';
export const POST = readOnly;
```

---

### 31. `dashboard/src/app/api/scenarios/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { loadYaml, SCENARIOS_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
  try {
    if (!fs.existsSync(SCENARIOS_PATH)) return NextResponse.json({ scenarios: [] });
    const files = fs.readdirSync(SCENARIOS_PATH)
      .filter(f => f.endsWith('.yaml') && f !== '_registry.yaml');
    const scenarios = files.map(f => {
      try {
        const s = loadYaml<any>(path.join(SCENARIOS_PATH, f));
        if (!s) return null;
        return {
          id: s.id, title: s.title,
          status: s.status || 'active',
          created_at: s.created_at,
          updated_at: s.updated_at,
        };
      } catch { return null; }
    }).filter(Boolean);
    return NextResponse.json({ scenarios });
  } catch {
    return NextResponse.json({ error: 'Failed to load scenarios' }, { status: 500 });
  }
}

export const POST = readOnly;
```

---

### 32. `dashboard/src/app/api/scenarios/[id]/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, SCENARIOS_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json(loadYaml(path.join(SCENARIOS_PATH, `${params.id}.yaml`)));
  } catch {
    return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
  }
}

export const PUT = readOnly;
export const DELETE = readOnly;
```

---

### 33. `dashboard/src/app/api/days/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, PROTOTYPES_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
  try {
    const data = loadYaml<{ days: unknown[] }>(path.join(PROTOTYPES_PATH, 'days.yaml'));
    return NextResponse.json({ days: data?.days || [] });
  } catch {
    return NextResponse.json({ days: [] });
  }
}

export const POST = readOnly;
```

---

### 34. `dashboard/src/app/api/days/[date]/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, PROTOTYPES_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET(_req: Request, { params }: { params: { date: string } }) {
  try {
    const data = loadYaml<{ days: any[] }>(path.join(PROTOTYPES_PATH, 'days.yaml'));
    const day = (data?.days || []).find((d: any) => d.date === params.date);
    if (!day) return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    return NextResponse.json(day);
  } catch {
    return NextResponse.json({ error: 'Failed to load day' }, { status: 500 });
  }
}

export const DELETE = readOnly;
```

---

### 35. `dashboard/src/app/api/days/registry/prototypes/route.ts` — CREATE

```ts
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, PROTOTYPES_PATH } from '@/lib/data-loader';
import { readOnly } from '@/lib/readonly';

export async function GET() {
  try {
    const data = loadYaml<{ prototypes: unknown[] }>(
      path.join(PROTOTYPES_PATH, 'prototype-registry.yaml')
    );
    return NextResponse.json({ prototypes: data?.prototypes || [] });
  } catch {
    return NextResponse.json({ prototypes: [] });
  }
}

export const POST = readOnly;
```

---

## After Implementation

1. Run `npm install` in `dashboard/` to pick up the new `js-yaml` dependency.
2. Verify local dev still works: `cd dashboard && npm run dev` — all `/api/*` calls should still proxy to the backend at `localhost:3001`.
3. Push to GitHub and deploy via Vercel.

## Known Limitation

Prototype screenshots (images) are stored in `backend/data/prototypes/images/` and served by the Express backend as static files. The Vercel deployment will not serve these images unless the `buildCommand` in `vercel.json` is extended to also copy them to `dashboard/public/`. The prototypes page will load but images will be broken. This can be addressed in a follow-up.
