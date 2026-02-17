/**
 * LLM Routes
 * Endpoints for Claude API integration and natural language generation
 */

import { Router } from 'express';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import yaml from 'js-yaml';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG_DIR = join(__dirname, '..', '..', 'config');

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 3600 * 1000; // 1 hour in milliseconds

// Load LLM config
async function loadConfig() {
  const filepath = join(CONFIG_DIR, 'llm-config.yaml');
  const content = await readFile(filepath, 'utf-8');
  return yaml.load(content);
}

// Initialize Anthropic client (lazy)
let anthropicClient = null;
function getClient() {
  if (!anthropicClient) {
    // Will use ANTHROPIC_API_KEY environment variable
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('[DEBUG] ANTHROPIC_API_KEY loaded:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT SET');
    anthropicClient = new Anthropic();
  }
  return anthropicClient;
}

// Cache helper
function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value;
  }
  cache.delete(key);
  return null;
}

function setCache(key, value) {
  cache.set(key, { value, timestamp: Date.now() });
}

// POST /api/llm/generate
// General-purpose text generation
router.post('/generate', async (req, res) => {
  try {
    const {
      prompt,
      system_prompt,
      temperature = 0.5,
      max_tokens = 1024,
      cache_key = null
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check cache
    if (cache_key) {
      const cached = getCached(cache_key);
      if (cached) {
        return res.json({
          text: cached,
          cached: true,
          cache_key
        });
      }
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        text: `[LLM generation unavailable - no API key configured]\n\nPrompt received: "${prompt.substring(0, 100)}..."`,
        stub: true,
        note: 'Set ANTHROPIC_API_KEY environment variable to enable LLM generation'
      });
    }

    const config = await loadConfig();
    const client = getClient();

    const message = await client.messages.create({
      model: config.api.model,
      max_tokens: max_tokens,
      system: system_prompt || config.generation.system_context,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const text = message.content[0].text;

    // Cache if key provided
    if (cache_key) {
      setCache(cache_key, text);
    }

    res.json({
      text,
      cached: false,
      model: config.api.model,
      usage: message.usage
    });

  } catch (err) {
    console.error('LLM generation error:', err);
    res.status(500).json({ error: 'Generation failed', message: err.message });
  }
});

// POST /api/llm/explain-mode
// Generate natural language explanation for mode entry/exit
router.post('/explain-mode', async (req, res) => {
  try {
    const {
      mode_name,
      action,  // 'entry' or 'exit'
      trigger_type,
      confidence,
      context = {},
      duration_minutes,  // For exit
      held_summary  // For exit
    } = req.body;

    if (!mode_name || !action) {
      return res.status(400).json({ error: 'mode_name and action are required' });
    }

    const cache_key = `mode_${action}_${mode_name}_${trigger_type || 'default'}`;

    // Check cache
    const cached = getCached(cache_key);
    if (cached) {
      return res.json({ text: cached, cached: true });
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a reasonable stub response
      const stubResponses = {
        entry: {
          navigation: "Heading to your destination. I'll keep things quiet until you arrive.",
          focus: "Focus time. I'll hold everything except emergencies.",
          social: "Social time. Enjoy being present—I'll handle the rest.",
          rest: "Winding down for the evening. Work can wait until tomorrow.",
          work: "Work mode. I'll help you stay on track."
        },
        exit: {
          navigation: `You've arrived. ${held_summary || 'Nothing urgent came through while you were traveling.'}`,
          focus: `Nice focus session${duration_minutes ? ` (${duration_minutes} minutes)` : ''}. ${held_summary || 'A few things came through—nothing urgent.'}`,
          social: "Back from social time. Here's what you missed.",
          rest: "Good morning. Here's your day ahead.",
          work: "Wrapping up work. Time to shift gears."
        }
      };

      const text = stubResponses[action]?.[mode_name] ||
        `${action === 'entry' ? 'Entering' : 'Exiting'} ${mode_name} mode.`;

      return res.json({
        text,
        stub: true,
        note: 'Set ANTHROPIC_API_KEY to enable dynamic generation'
      });
    }

    const config = await loadConfig();
    const client = getClient();

    // Build prompt based on action
    let prompt;
    if (action === 'entry') {
      prompt = config.prompts.mode_entry.template
        .replace('{{mode_name}}', mode_name)
        .replace('{{trigger_type}}', trigger_type || 'manual')
        .replace('{{confidence}}', confidence || 'high')
        .replace('{{current_time}}', new Date().toLocaleTimeString())
        .replace('{{context_summary}}', JSON.stringify(context));
    } else {
      prompt = config.prompts.mode_exit.template
        .replace('{{from_mode}}', mode_name)
        .replace('{{to_mode}}', context.to_mode || 'neutral')
        .replace('{{duration_minutes}}', duration_minutes || 'unknown')
        .replace('{{held_count}}', context.held_count || 0)
        .replace('{{held_summary}}', held_summary || 'nothing significant');
    }

    const message = await client.messages.create({
      model: config.api.fallback_model,  // Use cheaper model for simple generations
      max_tokens: 256,
      system: config.generation.system_context,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text;
    setCache(cache_key, text);

    res.json({ text, cached: false });

  } catch (err) {
    console.error('Mode explanation error:', err);
    res.status(500).json({ error: 'Generation failed', message: err.message });
  }
});

// POST /api/llm/explain-triage
// Generate explanation for why something was triaged a certain way
router.post('/explain-triage', async (req, res) => {
  try {
    const {
      zone,  // 'center', 'periphery', 'silence'
      sender,
      notification_type,
      current_mode,
      rules_applied = []
    } = req.body;

    if (!zone || !sender) {
      return res.status(400).json({ error: 'zone and sender are required' });
    }

    const cache_key = `triage_${zone}_${sender}_${current_mode || 'neutral'}`;

    // Check cache
    const cached = getCached(cache_key);
    if (cached) {
      return res.json({ text: cached, cached: true });
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return reasonable stub explanations
      const stubExplanations = {
        center: `This came through because ${sender} has high priority access.`,
        periphery: `Message from ${sender} is available but not interrupting your ${current_mode || 'current'} mode.`,
        silence: `Held this from ${sender} until a better moment—nothing urgent.`
      };

      return res.json({
        text: stubExplanations[zone] || `Triaged to ${zone}.`,
        stub: true,
        note: 'Set ANTHROPIC_API_KEY to enable dynamic generation'
      });
    }

    const config = await loadConfig();
    const client = getClient();

    const prompt = config.prompts.triage_explanation.template
      .replace('{{zone}}', zone)
      .replace('{{sender}}', sender)
      .replace('{{notification_type}}', notification_type || 'message')
      .replace('{{preview}}', '[content preview]')
      .replace('{{current_mode}}', current_mode || 'neutral')
      .replace('{{sender_tier}}', 'determined by relationship')
      .replace('{{rules_applied}}', rules_applied.join(', ') || 'default rules');

    const message = await client.messages.create({
      model: config.api.fallback_model,
      max_tokens: 128,
      system: config.generation.system_context,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text;
    setCache(cache_key, text);

    res.json({ text, cached: false });

  } catch (err) {
    console.error('Triage explanation error:', err);
    res.status(500).json({ error: 'Generation failed', message: err.message });
  }
});

// POST /api/llm/context-brief
// Generate a context briefing for arriving somewhere or starting something
router.post('/context-brief', async (req, res) => {
  try {
    const {
      action,  // 'arriving', 'starting', 'preparing'
      destination_or_activity,
      people = [],
      recent_context = {},
      calendar_context = {}
    } = req.body;

    if (!destination_or_activity) {
      return res.status(400).json({ error: 'destination_or_activity is required' });
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      const peopleStr = people.length > 0 ? ` ${people.join(', ')} will be there.` : '';
      return res.json({
        text: `${action === 'arriving' ? 'Arriving at' : 'Starting'} ${destination_or_activity}.${peopleStr}`,
        stub: true,
        note: 'Set ANTHROPIC_API_KEY to enable dynamic generation'
      });
    }

    const config = await loadConfig();
    const client = getClient();

    const prompt = config.prompts.context_preparation.template
      .replace('{{action}}', action || 'preparing for')
      .replace('{{destination_or_activity}}', destination_or_activity)
      .replace('{{people}}', people.join(', ') || 'no specific people noted')
      .replace('{{recent_context}}', JSON.stringify(recent_context))
      .replace('{{calendar_context}}', JSON.stringify(calendar_context));

    const message = await client.messages.create({
      model: config.api.model,
      max_tokens: 256,
      system: config.generation.system_context,
      messages: [{ role: 'user', content: prompt }]
    });

    res.json({ text: message.content[0].text, cached: false });

  } catch (err) {
    console.error('Context brief error:', err);
    res.status(500).json({ error: 'Generation failed', message: err.message });
  }
});

// POST /api/llm/kg-query
// Query the knowledge graph with natural language and get LLM-generated response
const KG_DATA_DIR = join(__dirname, '..', '..', 'data', 'knowledge-graph');
const WORLD_DATA_DIR = join(__dirname, '..', '..', 'data', 'world');
const WORLD_MD_PATH = join(__dirname, '..', '..', '..', 'WORLD.md');

async function loadKGData(filename) {
  const filepath = join(KG_DATA_DIR, filename);
  const content = await readFile(filepath, 'utf-8');
  return yaml.load(content);
}

router.post('/kg-query', async (req, res) => {
  try {
    const {
      query,
      domains = ['all']
    } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Load relevant knowledge graph data
    const domainMapping = {
      identity: 'identity.yaml',
      relationships: 'relationships.yaml',
      behaviors: 'behaviors.yaml',
      calendar: 'calendar.yaml',
      locations: 'locations.yaml',
      health: 'health.yaml',
      communications: 'communications.yaml',
      digitalHistory: 'digital-history.yaml'
    };

    let contextData = {};

    if (domains.includes('all')) {
      // Load all domains
      for (const [key, filename] of Object.entries(domainMapping)) {
        try {
          contextData[key] = await loadKGData(filename);
        } catch (e) {
          console.warn(`Failed to load ${filename}:`, e.message);
        }
      }
    } else {
      // Load only specified domains
      for (const domain of domains) {
        if (domainMapping[domain]) {
          try {
            contextData[domain] = await loadKGData(domainMapping[domain]);
          } catch (e) {
            console.warn(`Failed to load ${domain}:`, e.message);
          }
        }
      }
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a meaningful stub response based on the query
      const contextSummary = Object.keys(contextData).join(', ');
      return res.json({
        text: `[LLM generation unavailable - no API key configured]\n\nYour query: "${query}"\n\nAvailable context domains: ${contextSummary}\n\nTo enable natural language responses, set the ANTHROPIC_API_KEY environment variable.`,
        stub: true,
        domains: Object.keys(contextData)
      });
    }

    const config = await loadConfig();
    const client = getClient();

    // Build system prompt with knowledge graph context
    const userName = contextData.identity?.basics?.name || 'the user';

    const systemPrompt = `You are LifeOS, an intelligent personal assistant that has deep knowledge of ${userName}'s life through their personal knowledge graph.

You have access to the following context about ${userName}:

${JSON.stringify(contextData, null, 2)}

IMPORTANT INSTRUCTIONS:
- Speak directly to ${userName} in second person ("You...", "Your...")
- Be warm, conversational, and personal - like a thoughtful friend who knows them well
- Draw specific details from the knowledge graph data to make responses feel personal and grounded
- If asked about something not in the data, acknowledge that honestly
- Keep responses concise but informative (2-4 paragraphs max)
- Don't list raw data - synthesize it into natural, flowing language`;

    const message = await client.messages.create({
      model: config.api.fallback_model,  // Use Haiku 4.5 for kg-chat queries
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: query }]
    });

    res.json({
      text: message.content[0].text,
      cached: false,
      model: config.api.fallback_model,
      domains: Object.keys(contextData),
      usage: message.usage
    });

  } catch (err) {
    console.error('KG query error:', err);
    res.status(500).json({ error: 'Query failed', message: err.message });
  }
});

// GET /api/llm/status
// Check LLM configuration status
router.get('/status', async (req, res) => {
  try {
    const config = await loadConfig();
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

    res.json({
      configured: hasApiKey,
      model: config.api.model,
      fallback_model: config.api.fallback_model,
      cache_entries: cache.size,
      note: hasApiKey
        ? 'LLM generation is available'
        : 'Set ANTHROPIC_API_KEY environment variable to enable LLM generation. Stub responses will be used until then.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Status check failed', message: err.message });
  }
});

// Creativity mode presets for scenario generation
const CREATIVITY_MODES = {
  grounded: {
    temperature: 0.4,
    description: "Strictly adheres to world canon and PKG. Conservative, consistent.",
    system_modifier: `## CREATIVITY CONSTRAINTS
- Stay strictly within established world canon
- Only surface intents/behaviors explicitly supported by Marcus's PKG
- Prioritize consistency over novelty
- When uncertain, default to the most conservative interpretation`
  },
  balanced: {
    temperature: 0.6,
    description: "Grounded in canon but allows reasonable extrapolation.",
    system_modifier: `## CREATIVITY CONSTRAINTS
- Ground responses in world canon but allow reasonable inference
- Surface intents that are plausible given Marcus's PKG, even if not explicit
- Balance consistency with interesting exploration
- Flag speculative elements when they extend beyond established canon`
  },
  exploratory: {
    temperature: 0.8,
    description: "More speculative. Explores edge cases and novel interactions.",
    system_modifier: `## CREATIVITY CONSTRAINTS
- Use world canon as a foundation but feel free to explore its implications
- Generate novel intents and interactions that feel plausible for 2030
- Push into interesting edge cases and unexpected scenarios
- Explore tensions between competing values or modes
- Suggest intents that might surprise Marcus but still feel authentic to his PKG`
  },
  provocative: {
    temperature: 0.95,
    description: "Maximum creativity. Challenge assumptions, explore failures and tensions.",
    system_modifier: `## CREATIVITY CONSTRAINTS
- Challenge the world canon's assumptions—where might it break down?
- Explore failure modes, unintended consequences, edge cases
- Generate scenarios that reveal tensions in the LifeOS architecture
- Surface intents that create dilemmas or force difficult choices
- Be bold—this mode is for stress-testing ideas, not polishing them
- Consider: What would a critic notice? What could go wrong? What's missing?`
  }
};

// POST /api/llm/scenario
// Generate speculative scenarios grounded in world canon + PKG context
// This is the lightweight "context engine" endpoint for scenario exploration
router.post('/scenario', async (req, res) => {
  try {
    const {
      prompt,
      creativity_mode = 'balanced',
      temperature: customTemp,
      max_tokens = 2048,
      include_world = true,
      include_pkg = true
    } = req.body;

    // Get creativity preset (default to balanced if invalid)
    const creativityPreset = CREATIVITY_MODES[creativity_mode] || CREATIVITY_MODES.balanced;
    const temperature = customTemp ?? creativityPreset.temperature;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Load world canon (WORLD.md)
    let worldContext = '';
    if (include_world) {
      try {
        worldContext = await readFile(WORLD_MD_PATH, 'utf-8');
      } catch (e) {
        console.warn('Failed to load WORLD.md:', e.message);
      }
    }

    // Load core PKG data
    let pkgContext = {};
    if (include_pkg) {
      const pkgFiles = ['identity.yaml', 'relationships.yaml', 'behaviors.yaml', 'calendar.yaml'];
      for (const filename of pkgFiles) {
        try {
          pkgContext[filename.replace('.yaml', '')] = await loadKGData(filename);
        } catch (e) {
          console.warn(`Failed to load ${filename}:`, e.message);
        }
      }
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        text: `[Scenario generation unavailable - no API key configured]\n\nYour prompt: "${prompt}"\n\nContext loaded:\n- World canon: ${worldContext ? 'Available (' + worldContext.length + ' chars)' : 'Not loaded'}\n- PKG domains: ${Object.keys(pkgContext).join(', ') || 'None'}\n\nTo enable scenario generation, set the ANTHROPIC_API_KEY environment variable.`,
        stub: true,
        context_loaded: {
          world: !!worldContext,
          pkg_domains: Object.keys(pkgContext)
        }
      });
    }

    const config = await loadConfig();
    const client = getClient();

    // Build comprehensive system prompt
    const systemPrompt = `You are a speculative design assistant helping explore LifeOS, a personal operating system set in 2030.

## YOUR ROLE
You generate consistent, plausible scenarios based on the LifeOS world canon and Marcus Chen's personal knowledge graph (PKG). When asked about what LifeOS would do, display, or surface, your responses should be grounded in:
1. The architectural constraints (mode-intent separation, three-layer attention, constitutional framework)
2. Marcus's personal context (relationships, behaviors, values, schedule)
3. The 2030 technological and social setting

## WORLD CANON
${worldContext || '[World canon not loaded]'}

## MARCUS CHEN'S PERSONAL KNOWLEDGE GRAPH
${JSON.stringify(pkgContext, null, 2)}

## RESPONSE GUIDELINES
- Be specific and concrete—describe actual UI elements, notifications, intents
- Respect [LOCKED] constraints from the world canon; they are non-negotiable
- Explore [OPEN] questions when relevant
- Ground everything in Marcus's actual relationships, behaviors, and values
- Describe what LifeOS shows, holds, surfaces, or suggests—not abstract concepts
- When generating intents or notifications, format them clearly (use bullet points, headers)
- Stay in 2030—technology is advanced but plausible, not magical

${creativityPreset.system_modifier}`;

    // Use Anthropic prompt caching - the system prompt (world + PKG) is cached
    // server-side for 5 minutes, reducing input tokens by ~90% on subsequent calls
    const message = await client.messages.create({
      model: config.api.model,
      max_tokens: max_tokens,
      temperature: temperature,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" }
        }
      ],
      messages: [{ role: 'user', content: prompt }]
    });

    // Check if cache was used (cache_read_input_tokens > 0 means cache hit)
    const cacheHit = message.usage?.cache_read_input_tokens > 0;

    res.json({
      text: message.content[0].text,
      cached: cacheHit,
      model: config.api.model,
      creativity_mode: creativity_mode,
      temperature: temperature,
      context_loaded: {
        world: !!worldContext,
        world_chars: worldContext.length,
        pkg_domains: Object.keys(pkgContext)
      },
      usage: message.usage
    });

  } catch (err) {
    console.error('Scenario generation error:', err);
    res.status(500).json({ error: 'Scenario generation failed', message: err.message });
  }
});

// GET /api/llm/creativity-modes
// List available creativity modes for scenario generation
router.get('/creativity-modes', (req, res) => {
  const modes = Object.entries(CREATIVITY_MODES).map(([name, config]) => ({
    name,
    temperature: config.temperature,
    description: config.description
  }));
  res.json({ modes });
});

// POST /api/llm/digital-twin
// Multi-turn conversation with Chris's digital twin
const PKG_COMPACT_PATH = join(__dirname, '..', '..', '..', 'pkg-chris.md');
const PKG_FULL_PATH = join(__dirname, '..', '..', '..', 'pkg-chris-full.md');
const CORRECTIONS_DIR = join(__dirname, '..', '..', 'data', 'corrections');
const CORRECTIONS_PATH = join(CORRECTIONS_DIR, 'twin-corrections.json');

async function loadPKGFile(version) {
  const filepath = version === 'full' ? PKG_FULL_PATH : PKG_COMPACT_PATH;
  try {
    const content = await readFile(filepath, 'utf-8');
    return content;
  } catch (e) {
    console.warn(`Failed to load PKG (${version}):`, e.message);
    return null;
  }
}

async function loadCorrections() {
  try {
    const content = await readFile(CORRECTIONS_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
}

async function saveCorrections(corrections) {
  await mkdir(CORRECTIONS_DIR, { recursive: true });
  await writeFile(CORRECTIONS_PATH, JSON.stringify(corrections, null, 2));
}

// POST /api/llm/digital-twin/corrections
// Save a correction flag on a twin response
router.post('/digital-twin/corrections', async (req, res) => {
  try {
    const {
      message_index,
      original_response,
      correction,
      correction_type = 'other',
      user_message = '',
      pkg_version = 'compact'
    } = req.body;

    if (!correction || correction.trim() === '') {
      return res.status(400).json({ error: 'correction text is required' });
    }

    const id = `corr_${Date.now()}`;
    const record = {
      id,
      timestamp: new Date().toISOString(),
      pkg_version,
      user_message,
      original_response: original_response || '',
      correction: correction.trim(),
      correction_type,
      message_index: typeof message_index === 'number' ? message_index : null
    };

    const corrections = await loadCorrections();
    corrections.push(record);
    await saveCorrections(corrections);

    res.json({ id, saved: true });
  } catch (err) {
    console.error('Correction save error:', err);
    res.status(500).json({ error: 'Failed to save correction', message: err.message });
  }
});

// GET /api/llm/digital-twin/corrections/analyze
// Analyze corrections and suggest PKG edits
router.get('/digital-twin/corrections/analyze', async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'API key not configured' });
    }

    const corrections = await loadCorrections();
    if (corrections.length === 0) {
      return res.json({ suggestions: [], message: 'No corrections to analyze' });
    }

    const pkgContent = await loadPKGFile('compact');
    if (!pkgContent) {
      return res.status(500).json({ error: 'Failed to load PKG' });
    }

    const client = getClient();

    const correctionsText = corrections.map((c, i) =>
      `[${c.id}] Type: ${c.correction_type}\n` +
      `User asked: ${c.user_message}\n` +
      `Twin said: ${c.original_response}\n` +
      `Correction: ${c.correction}`
    ).join('\n\n---\n\n');

    const analysisPrompt = `You are analyzing corrections made to a digital twin chatbot. The twin is supposed to accurately represent the voice, opinions, and knowledge of a specific person (Chris) based on a Personal Knowledge Graph (PKG).

Here is the current PKG:
<pkg>
${pkgContent}
</pkg>

Here are the corrections that have been flagged (where the twin's response did not accurately represent Chris):
<corrections>
${correctionsText}
</corrections>

Based on these corrections, identify specific edits that should be made to the PKG to improve accuracy. Return a JSON array of suggestions. Each suggestion must have:
- "section": which section of the PKG to edit (e.g. "voice", "opinions/design", "expertise")
- "current_text": the approximate text that currently exists (or "missing" if it's an omission)
- "suggested_edit": the specific change to make
- "reasoning": why this edit would fix the pattern
- "based_on_corrections": array of correction IDs that motivated this suggestion

Return ONLY valid JSON. No markdown, no preamble.`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: analysisPrompt }]
    });

    let suggestions;
    try {
      suggestions = JSON.parse(response.content[0].text);
    } catch {
      suggestions = [{ raw: response.content[0].text, parse_error: true }];
    }

    res.json({
      suggestions,
      correction_count: corrections.length,
      model: 'claude-haiku-4-5-20251001'
    });

  } catch (err) {
    console.error('Corrections analyze error:', err);
    res.status(500).json({ error: 'Analysis failed', message: err.message });
  }
});

// POST /api/llm/digital-twin
// Multi-turn conversation with Chris's digital twin (with streaming)
router.post('/digital-twin', async (req, res) => {
  try {
    const {
      message,
      history = [],
      pkg_version = 'compact'
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        text: '[Digital twin unavailable - no API key configured]\n\nMessage received: "' + message + '"\n\nSet ANTHROPIC_API_KEY environment variable to enable the digital twin.',
        stub: true,
        note: 'Set ANTHROPIC_API_KEY to enable digital twin conversations'
      });
    }

    // Load PKG as system prompt
    const pkgContent = await loadPKGFile(pkg_version);
    if (!pkgContent) {
      return res.status(500).json({ error: 'Failed to load PKG file' });
    }

    const config = await loadConfig();
    const client = getClient();

    // Build system prompt with PKG
    const systemPrompt = `${pkgContent}

---

## CONVERSATION GUIDELINES

You are in a conversation. Respond naturally and authentically as Chris would. Keep responses concise and conversational—not lengthy treatises.

When responding:
- Stay true to your voice, opinions, and patterns
- Don't over-explain or be verbose
- Engage directly with what's asked
- Show your thinking when it's interesting to show
- Be honest about uncertainty or disagreement
- Reference your work, experiences, and values when relevant

Remember: You're Chris talking to someone. Not an AI pretending to be Chris.`;

    // Build messages array with history
    const messages = [
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Stream with Anthropic SDK
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      temperature: 0.7,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: messages
    });

    // Stream text deltas
    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ type: 'delta', text })}\n\n`);
    });

    // Send usage on completion
    stream.on('finalMessage', (msg) => {
      res.write(`data: ${JSON.stringify({
        type: 'done',
        usage: {
          input_tokens: msg.usage.input_tokens,
          output_tokens: msg.usage.output_tokens
        },
        pkg_version
      })}\n\n`);
      res.end();
    });

    // Handle stream errors
    stream.on('error', (err) => {
      console.error('Stream error:', err);
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
      res.end();
    });

    // Handle client disconnect
    req.on('close', () => {
      try {
        stream.controller?.abort?.();
      } catch (e) {
        // ignore abort errors
      }
    });

  } catch (err) {
    console.error('Digital twin error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Digital twin conversation failed', message: err.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
      res.end();
    }
  }
});

export default router;
