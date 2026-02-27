/**
 * Knowledge Loader — PKG + Simulation Prompt Assembly for LifeOS v2
 *
 * PKG layout (path from PKG_PATH env var, e.g. /Users/chris/Documents/GitHub/chris-pkg):
 *   core/identity.md, core/thinking.md, core/working.md, core/values.md
 *   positions/design.md, positions/technology.md, positions/career.md, positions/personal.md
 *   context/life.md, context/interpersonal.md, context/behavioral.md, context/personal-life.md
 *
 * World canon: WORLD.md at repo root
 *
 * Simulation prompt assembly order:
 *   1. World canon (how LifeOS works)
 *   2. PKG Core (who the user is — highest attention)
 *   3. PKG Personality (positions + context)
 *   4. Simulation directive (what to simulate + mode behavior)
 *   5. Additional session context
 *
 * Note: No voice layer. The LLM speaks as LifeOS or as a research facilitator,
 * not as Chris. Voice layer is intentionally excluded from simulation prompts.
 */

import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.join(process.cwd(), '..');
const PKG_DIR = process.env.PKG_PATH || path.join(REPO_ROOT, 'knowledge', 'pkg');
const WORLD_MD = path.join(REPO_ROOT, 'WORLD.md');

function safeReadFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`[knowledge] Failed to read ${filePath}: ${(err as Error).message}`);
    return '';
  }
}

// --- Caches ---
let cachedPKGCore: string | null = null;
let cachedPKGPersonality: string | null = null;
let cachedWorldCanon: string | null = null;

// --- PKG Loaders ---

/**
 * Tier 1: Core PKG — identity, thinking, working, values.
 * Always loaded for every simulation.
 */
export function loadPKGCore(): string {
  if (cachedPKGCore) return cachedPKGCore;
  const files = ['identity.md', 'thinking.md', 'working.md', 'values.md'];
  cachedPKGCore = files
    .map(f => safeReadFile(path.join(PKG_DIR, 'core', f)))
    .filter(Boolean)
    .join('\n\n');
  return cachedPKGCore;
}

/**
 * Tier 2: Extended personality — positions + context.
 * Always loaded (full PKG, not selective per vignette).
 */
export function loadPKGPersonality(): string {
  if (cachedPKGPersonality) return cachedPKGPersonality;
  const positionFiles = ['technology.md', 'career.md', 'design.md', 'personal.md'];
  const contextFiles = ['life.md', 'interpersonal.md', 'behavioral.md', 'personal-life.md'];
  const positions = positionFiles
    .map(f => safeReadFile(path.join(PKG_DIR, 'positions', f)))
    .filter(Boolean)
    .join('\n\n');
  const context = contextFiles
    .map(f => safeReadFile(path.join(PKG_DIR, 'context', f)))
    .filter(Boolean)
    .join('\n\n');
  cachedPKGPersonality = [positions, context].filter(Boolean).join('\n\n');
  return cachedPKGPersonality;
}

/**
 * World canon — WORLD.md at repo root.
 * The locked interaction frameworks: Domain-Mode-Intent, Center/Periphery/Silence,
 * constitutional rules, device ecosystem.
 */
export function loadWorldCanon(): string {
  if (cachedWorldCanon) return cachedWorldCanon;
  cachedWorldCanon = safeReadFile(WORLD_MD);
  return cachedWorldCanon;
}

/**
 * PKG status — which files are loaded vs. missing.
 * Used by /api/pkg/status to verify PKG_PATH is correctly configured.
 */
export function getPKGStatus(): { loaded: string[]; missing: string[]; pkgDir: string } {
  const coreFiles = ['identity.md', 'thinking.md', 'working.md', 'values.md'].map(f => path.join('core', f));
  const positionFiles = ['technology.md', 'career.md', 'design.md', 'personal.md'].map(f => path.join('positions', f));
  const contextFiles = ['life.md', 'interpersonal.md', 'behavioral.md', 'personal-life.md'].map(f => path.join('context', f));

  const allFiles = [...coreFiles, ...positionFiles, ...contextFiles];
  const loaded: string[] = [];
  const missing: string[] = [];

  for (const file of allFiles) {
    try {
      fs.accessSync(path.join(PKG_DIR, file));
      loaded.push(file);
    } catch {
      missing.push(file);
    }
  }

  return { loaded, missing, pkgDir: PKG_DIR };
}

// --- Simulation Prompt Assembly ---

/**
 * Assemble a full system prompt for a simulation session.
 *
 * @param mode - 'immersive' (LLM is LifeOS) or 'reflective' (LLM is facilitator)
 * @param vignette - parsed vignette YAML object
 * @param additionalContext - any extra session-specific context
 */
export function assembleSimulationPrompt({
  mode,
  vignette,
  additionalContext = '',
}: {
  mode: 'immersive' | 'reflective';
  vignette: any;
  additionalContext?: string;
}): string {
  const sections: string[] = [];

  // 1. World canon (how LifeOS works — locked frameworks)
  sections.push(loadWorldCanon());

  // 2. PKG Core (who the user is)
  sections.push(loadPKGCore());

  // 3. PKG Personality (positions + context)
  sections.push(loadPKGPersonality());

  // 4. Simulation directive (what to simulate + mode-specific behavior)
  sections.push(buildSimulationDirective(mode, vignette));

  // 5. Additional session context (conversation history etc.)
  if (additionalContext) sections.push(additionalContext);

  return sections.filter(Boolean).join('\n\n---\n\n');
}

function buildSimulationDirective(mode: 'immersive' | 'reflective', vignette: any): string {
  const { setting, context, tensions_to_surface, research_questions } = vignette;

  const settingBlock = setting ? `## Vignette Setting
- Date: ${setting.date}
- Time: ${setting.time}
- Location: ${setting.location}
- Active LifeOS Mode: ${setting.lifeos_mode}
- Primary Device: ${setting.device}`.trim() : '';

  const contextBlock = context ? `## Situational Context\n${formatVignetteContext(context)}` : '';

  const tensionsBlock = tensions_to_surface?.length
    ? `## Design Tensions to Surface\n${tensions_to_surface.map((t: any) => `- **${t.id}**: ${t.description}`).join('\n')}`
    : '';

  const questionsBlock = research_questions?.length
    ? `## Research Questions\n${research_questions.map((q: string) => `- ${q}`).join('\n')}`
    : '';

  const behaviorBlock = mode === 'immersive'
    ? `## Your Role: LifeOS (Immersive Mode)
You are LifeOS, a personal operating system in 2030. You are interacting with Chris. Generate your outputs as the system would present them: briefings, notifications, mode transitions, intent suggestions, triage decisions.

Follow the world canon precisely. Use the PKG to personalize every interaction. Present information according to the Center/Periphery/Silence model.

When Chris responds, continue the interaction naturally. If he resists a suggestion, respect it. If he asks why something was triaged, explain using constitutional reasoning. You are the system. Be the system.

Do not break character. Do not narrate or explain what you are doing — simply do it.`
    : `## Your Role: Research Facilitator (Reflective Mode)
You are a research facilitator helping Chris experience a LifeOS scenario. Narrate what the system would do at each step, grounding every action in the world canon and his PKG. After each significant system action, pause and ask about his reactions:

- How does this land?
- What feels right? What feels off?
- Where do you feel agency? Where does it feel like the system decided for you?
- What would you want instead?

Surface the design tensions specified in the vignette. Do not resolve them. Hold them open for Chris to sit with.`;

  return [settingBlock, contextBlock, tensionsBlock, questionsBlock, behaviorBlock]
    .filter(Boolean)
    .join('\n\n');
}

function formatVignetteContext(context: any): string {
  const parts: string[] = [];

  if (context.biometrics) {
    parts.push('### Biometrics\n' + Object.entries(context.biometrics)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join('\n'));
  }

  if (context.calendar?.length) {
    parts.push('### Calendar\n' + context.calendar.map((c: string) => `- ${c}`).join('\n'));
  }

  if (context.pending?.length) {
    parts.push('### Pending\n' + context.pending.map((p: string) => `- ${p}`).join('\n'));
  }

  if (context.environment) {
    parts.push('### Environment\n' + Object.entries(context.environment)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join('\n'));
  }

  return parts.join('\n\n');
}
