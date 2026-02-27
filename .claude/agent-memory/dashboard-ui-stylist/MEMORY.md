# Dashboard UI Stylist — Agent Memory

## Design System Quick Reference

**Styling approach:** Tailwind CSS + custom CSS classes defined in `globals.css`. No CSS Modules or styled-components.

**Key CSS utility classes (globals.css):**
- `.glass` — glassmorphism panel (rgba(255,255,255,0.7) + blur(16px) + border 1px rgba(0,0,0,0.05))
- `.glass-card` — stronger glass card with shadow and rounded-[22px]
- `.btn-primary` — gradient blue pill button with shadow
- `.card` / `.card-interactive` — white card with hover shadow
- `.badge-locked` / `.badge-open` / `.badge-scaffolded` — status pill badges
- `.gradient-text` / `.gradient-text-purple` — gradient text fill
- `.nav-item` / `.nav-item-active` — sidebar nav link styles

**Color tokens (Tailwind config + @theme):**
- `lifeos-600` = `#0284c7` / `#008cff` (brand primary blue, varies)
- `lifeos-400` = `#38bdf8` (accent blue)
- CSS var `--gradient-blue`: 135deg #66d6ff → #008cff
- CSS var `--shadow-card`: subtle soft box shadow

**Spacing/radius tokens (CSS vars):**
- `--radius-card`: 22px → use `rounded-[22px]` or `rounded-2xl`
- `--radius-lg`: 16px → `rounded-2xl`
- `--radius-pill`: 9999px → `rounded-full`

**Typography conventions:**
- Section labels: `text-[10px] font-medium text-gray-400 uppercase tracking-wider`
- Body: `text-sm text-gray-600` / `text-gray-800`
- Headings: `text-base` or `text-2xl font-semibold text-gray-900 tracking-tight`
- Font stack: SF Pro Rounded, system-apple, fallbacks in body rule

## File Locations

| What | Where |
|------|-------|
| Global styles + design tokens | `dashboard/src/app/globals.css` |
| Tailwind config | `dashboard/tailwind.config.js` |
| Layout (sidebar integration) | `dashboard/src/app/layout.tsx` |
| Sidebar component | `dashboard/src/components/Sidebar.tsx` |
| API helper functions | `dashboard/src/lib/api.ts` |
| API base env var | `NEXT_PUBLIC_API_URL` (defaults to `''`) |

## Layout Patterns

**Full-viewport, no-outer-scroll layout:**
```tsx
<div className="h-screen flex flex-col overflow-hidden">
  <div className="flex-none ...">/* top bar */</div>
  <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">
    <div className="flex-1 glass rounded-2xl flex flex-col min-h-0 overflow-hidden">
      <div className="flex-none ...">/* header */</div>
      <div className="flex-1 overflow-y-auto ...">/* scrollable body */</div>
      <div className="flex-none ...">/* footer/input */</div>
    </div>
  </div>
</div>
```
Key: `min-h-0` on flex children prevents overflow blowout in nested flex columns.

## Patterns Confirmed

- Dark mode is permanently disabled: `@custom-variant dark (&:not(*))` — never add `dark:` variants
- Pre-existing TS errors exist in `.next/` cache and some API routes — new page errors are clean at zero
- Sidebar nav: add new links under relevant section heading in `Sidebar.tsx`; use `nav-item` class + SVG icon pattern
- `glass` class does NOT include border-radius — add `rounded-2xl` separately
- Streaming cursor blink: use `@keyframes blink` in globals.css + `animate-[blink_1s_step-end_infinite]`
- `btn-primary` uses `border-radius: var(--radius-pill)` so it's always pill-shaped

## Sidebar v2 Navigation Structure (current as of 2026-02-26)

Header: "LifeOS" / "Research Platform" (was "World of LifeOS" / "Bargaining with the Future")

Sections in order:
1. **Simulate** — `/simulate` (Simulation Runner), `/vignettes`, `/findings`
2. **World** — `/setting`, `/domains`, `/mode-intent-framework`, `/ecosystem`, `/architecture`
3. **Knowledge** — `/knowledge` (PKG Overview)
4. **Thesis** — `/thesis` (Structure), `/prototypes` (Work in Progress)

Footer: Versions link only — API URL text removed. Removed sections: Synthetic User, Generation.

## See Also
- `patterns.md` — extended component patterns (not yet created)
