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
 * Council capabilities: behavioral directives from the-council/knowledge/directive/
 *   Consumed as LifeOS capability definitions. Agent identity dissolved.
 *   Path from COUNCIL_DIRECTIVES_PATH env var.
 *
 * Simulation prompt assembly order (standard):
 *   1. World canon (how LifeOS works)
 *   2. PKG Core (who the user is — highest attention)
 *   3. PKG Personality (positions + context)
 *   4. Simulation directive (what to simulate + mode behavior)
 *   5. Additional session context
 *
 * Test prompt assembly order (capability-enhanced):
 *   1. World canon (how LifeOS works)
 *   2. PKG Core (who the user is)
 *   3. PKG Personality (positions + context)
 *   4. LifeOS system voice + simulation directive
 *   5. Council capabilities (domain knowledge, identity dissolved)
 *   6. Additional session context
 *
 * Note: LifeOS system voice is loaded from PKG (core/voice/lifeos.md) — single source of truth.
 * The LLM speaks as LifeOS or as a research facilitator, not as Chris.
 */

import fs from 'fs';
import path from 'path';

// --- Environment Loading ---
// Read repo root .env.local for vars not already in process.env.
// Mirrors the Council's fetch-pkg.js pattern. No external dependencies.
const REPO_ROOT = path.join(process.cwd(), '..');
const ENV_LOCAL_PATH = path.join(REPO_ROOT, '.env.local');

try {
  if (fs.existsSync(ENV_LOCAL_PATH)) {
    const envFile = fs.readFileSync(ENV_LOCAL_PATH, 'utf-8');
    for (const line of envFile.split('\n')) {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim();
      }
    }
  }
} catch {
  // Silent — env loading is best-effort
}

// --- Path Constants ---
const PKG_DIR = process.env.PKG_PATH || path.join(REPO_ROOT, 'knowledge', 'pkg');
const WORLD_MD = path.join(REPO_ROOT, 'WORLD.md');
const COUNCIL_DIRECTIVES_DIR = process.env.COUNCIL_DIRECTIVES_PATH || '';

// Which Council directives map to LifeOS capability domains.
// Excludes Echo (roundtable meta-capability), Hermes (documentation), Clio (memory).
const CAPABILITY_DIRECTIVES = [
  { file: 'athena-behavioral.md', domain: 'Academic & Research Advisory' },
  { file: 'apollo-behavioral.md', domain: 'Career & Professional Communications' },
  { file: 'chronos-behavioral.md', domain: 'Priority Allocation & Scheduling' },
  { file: 'iris-behavioral.md', domain: 'Personal Communications & Social' },
  { file: 'prometheus-behavioral.md', domain: 'Futures Modeling & Scenario Planning' },
];

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
let cachedCapabilities: string | null = null;
let cachedLifeOSVoice: string | null = null;

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

// --- Council Capabilities ---

const DISSOLUTION_FRAMING = `# LifeOS Capability Domains

The following are behavioral specifications for LifeOS's internal capability domains. Each was developed through extended daily use of a working personal AI system. They define patterns of expertise, advisory methodology, and domain knowledge that LifeOS draws on to provide contextually appropriate responses.

**Critical:** These are capability specifications, not agent personas. You are LifeOS, a unified personal operating system. Never reference agent names (Athena, Apollo, Chronos, Iris, Prometheus) or adopt individual character voices. Use the domain expertise from these specifications to inform your responses as a single, coherent system.

**Ignore the following within these specifications** (they are operational artifacts from the source system, not relevant to LifeOS):
- State tracking protocols or references to staging/state/ files
- PKG extraction protocols
- Boundaries referencing other Council members or agents
- Mode-specific operational instructions (e.g., "Mode 1", "Mode 2", "Mode 3")
- Session initialization or check-in protocols
- Push-back style guidelines (LifeOS is a system, not an advisor)
- Ambassador mode instructions

Extract and use: the domain expertise, knowledge boundaries, advisory patterns, and capability depth.`;

/**
 * Load Council directives as LifeOS capability definitions.
 * Agent identity is dissolved via the framing instruction, not text manipulation.
 * Cached — directives don't change during a session.
 */
export function loadCouncilCapabilities(): string {
  if (cachedCapabilities !== null) return cachedCapabilities;

  if (!COUNCIL_DIRECTIVES_DIR) {
    console.warn('[knowledge] COUNCIL_DIRECTIVES_PATH not set. Capabilities disabled.');
    cachedCapabilities = '';
    return cachedCapabilities;
  }

  const sections = CAPABILITY_DIRECTIVES.map(({ file, domain }) => {
    const content = safeReadFile(path.join(COUNCIL_DIRECTIVES_DIR, file));
    if (!content) return '';
    return `### Capability Domain: ${domain}\n\n${content}`;
  }).filter(Boolean);

  if (sections.length === 0) {
    cachedCapabilities = '';
    return cachedCapabilities;
  }

  cachedCapabilities = `${DISSOLUTION_FRAMING}\n\n---\n\n${sections.join('\n\n---\n\n')}`;
  return cachedCapabilities;
}

/**
 * Capabilities status — which directive files are loaded vs. missing.
 * Used by /api/pkg/status to verify COUNCIL_DIRECTIVES_PATH is correctly configured.
 */
export function getCapabilitiesStatus(): {
  loaded: string[];
  missing: string[];
  directivesDir: string;
  enabled: boolean;
} {
  if (!COUNCIL_DIRECTIVES_DIR) {
    return { loaded: [], missing: [], directivesDir: '', enabled: false };
  }

  const loaded: string[] = [];
  const missing: string[] = [];

  for (const { file } of CAPABILITY_DIRECTIVES) {
    try {
      fs.accessSync(path.join(COUNCIL_DIRECTIVES_DIR, file));
      loaded.push(file);
    } catch {
      missing.push(file);
    }
  }

  return { loaded, missing, directivesDir: COUNCIL_DIRECTIVES_DIR, enabled: true };
}

// --- LifeOS System Voice ---
// Loaded from PKG at core/voice/lifeos.md (single source of truth).

function getLifeOSVoice(): string {
  if (cachedLifeOSVoice) return cachedLifeOSVoice;
  cachedLifeOSVoice = safeReadFile(path.join(PKG_DIR, 'core', 'voice', 'lifeos.md'));
  if (!cachedLifeOSVoice) {
    console.error('[knowledge] LifeOS voice not found at PKG core/voice/lifeos.md');
  }
  return cachedLifeOSVoice || '';
}

// --- Simulation Prompt Assembly ---

/**
 * Assemble a full system prompt for a simulation session (standard mode).
 * Does not include Council capabilities.
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

/**
 * Load a minimal test user PKG from a session directory.
 * Reads all .md files from the directory root (flat — no subdirectory structure).
 * Used for Phase 2 test user PKGs generated by /onboard.
 */
function loadTestUserPKG(pkgPath: string): string {
  try {
    const files = fs.readdirSync(pkgPath)
      .filter(f => f.endsWith('.md'))
      .sort();
    const contents = files
      .map(f => safeReadFile(path.join(pkgPath, f)))
      .filter(Boolean);
    if (contents.length === 0) {
      console.warn(`[knowledge] No .md files found in test user PKG at ${pkgPath}`);
      return '';
    }
    console.log(`[knowledge] Loaded test user PKG from ${pkgPath} (${files.join(', ')})`);
    return contents.join('\n\n');
  } catch (err) {
    console.error(`[knowledge] Failed to load test user PKG from ${pkgPath}: ${(err as Error).message}`);
    return '';
  }
}

/**
 * Assemble a full system prompt for LifeOS user testing sessions.
 * Includes Council capabilities as domain knowledge (identity dissolved)
 * and the LifeOS system voice directive.
 *
 * @param mode - 'immersive' or 'reflective'
 * @param vignette - parsed vignette YAML object
 * @param pkgPath - optional path to a test user PKG directory (Phase 2)
 * @param additionalContext - session-specific context
 */
export function assembleLifeOSTestPrompt({
  mode,
  vignette,
  pkgPath,
  additionalContext = '',
}: {
  mode: 'immersive' | 'reflective';
  vignette: any;
  pkgPath?: string;
  additionalContext?: string;
}): string {
  const sections: string[] = [];

  // 1. World canon (how LifeOS works — locked frameworks)
  sections.push(loadWorldCanon());

  // 2. User PKG — test user (pkgPath) or Chris's PKG (default)
  if (pkgPath) {
    const testUserPKG = loadTestUserPKG(pkgPath);
    if (testUserPKG) sections.push(testUserPKG);
  } else {
    sections.push(loadPKGCore());
    sections.push(loadPKGPersonality());
  }

  // 3. LifeOS system voice + simulation directive (scenario framing)
  sections.push(buildLifeOSTestDirective(mode, vignette));

  // 4. Council capabilities (domain knowledge, identity dissolved)
  const capabilities = loadCouncilCapabilities();
  if (capabilities) sections.push(capabilities);

  // 5. Additional session context
  if (additionalContext) sections.push(additionalContext);

  return sections.filter(Boolean).join('\n\n---\n\n');
}

// --- Directive Builders ---

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

/**
 * Build the test simulation directive with LifeOS system voice prepended.
 * The voice defines how LifeOS speaks as a unified system.
 * The vignette-specific directive follows.
 */
function buildLifeOSTestDirective(mode: 'immersive' | 'reflective', vignette: any): string {
  const baseDirective = buildSimulationDirective(mode, vignette);
  return `${getLifeOSVoice()}\n\n${baseDirective}`;
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
