/**
 * Conversations Routes
 * CRUD operations for scenario generation conversations
 */

import { Router } from 'express';
import { readFile, writeFile, unlink } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Anthropic from '@anthropic-ai/sdk';
import yaml from 'js-yaml';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '..', '..', 'data', 'conversations');
const INDEX_PATH = join(DATA_DIR, 'index.json');
const WORLD_MD_PATH = join(__dirname, '..', '..', '..', 'WORLD.md');
const KG_DIR = join(__dirname, '..', '..', 'data', 'knowledge-graph');
const CONFIG_DIR = join(__dirname, '..', '..', 'config');
const WORLD_DIR = join(__dirname, '..', '..', 'data', 'world');

// Initialize Anthropic client (lazy)
let anthropicClient = null;
function getClient() {
  if (!anthropicClient) {
    anthropicClient = new Anthropic();
  }
  return anthropicClient;
}

// Load LLM config
async function loadConfig() {
  const filepath = join(CONFIG_DIR, 'llm-config.yaml');
  const content = await readFile(filepath, 'utf-8');
  return yaml.load(content);
}

// Load knowledge graph data
async function loadKGData(filename) {
  const filepath = join(KG_DIR, filename);
  const content = await readFile(filepath, 'utf-8');
  return JSON.parse(content);
}

// Load index
async function loadIndex() {
  try {
    const content = await readFile(INDEX_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return { conversations: [] };
  }
}

// Save index
async function saveIndex(index) {
  await writeFile(INDEX_PATH, JSON.stringify(index, null, 2));
}

// Load single conversation
async function loadConversation(id) {
  const filepath = join(DATA_DIR, `${id}.json`);
  const content = await readFile(filepath, 'utf-8');
  return JSON.parse(content);
}

// Save single conversation
async function saveConversation(conversation) {
  const filepath = join(DATA_DIR, `${conversation.id}.json`);
  await writeFile(filepath, JSON.stringify(conversation, null, 2));
}

// Generate title from first message
function generateTitle(content) {
  // Take first 50 chars, cut at word boundary
  const truncated = content.slice(0, 60);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 40) {
    return truncated.slice(0, lastSpace) + '...';
  }
  return truncated.length < content.length ? truncated + '...' : truncated;
}

// Generate unique ID
function generateId() {
  return `conv_${Date.now()}`;
}

// GET /api/conversations - List all conversations
router.get('/', async (req, res) => {
  try {
    const index = await loadIndex();
    // Sort by updated_at descending (most recent first)
    const sorted = index.conversations.sort((a, b) =>
      new Date(b.updated_at) - new Date(a.updated_at)
    );
    res.json({ conversations: sorted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load conversations', message: err.message });
  }
});

// POST /api/conversations - Create new conversation
router.post('/', async (req, res) => {
  try {
    const id = generateId();
    const now = new Date().toISOString();

    // Load world meta for version info
    let worldVersion = 'unknown';
    try {
      const metaContent = await readFile(join(WORLD_DIR, 'meta.yaml'), 'utf-8');
      const meta = yaml.load(metaContent);
      worldVersion = meta.version || 'unknown';
    } catch (e) {
      console.warn('Could not load world meta:', e.message);
    }

    const conversation = {
      id,
      title: 'New conversation',
      created_at: now,
      updated_at: now,
      context: {
        world_version: worldVersion,
        pkg_domains: ['identity', 'relationships', 'behaviors', 'calendar']
      },
      messages: []
    };

    // Save conversation file
    await saveConversation(conversation);

    // Update index
    const index = await loadIndex();
    index.conversations.push({
      id,
      title: conversation.title,
      created_at: now,
      updated_at: now,
      message_count: 0
    });
    await saveIndex(index);

    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create conversation', message: err.message });
  }
});

// POST /api/conversations/import - Import pre-generated conversation (from Claude Code)
router.post('/import', async (req, res) => {
  try {
    const { title, messages, source } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const id = generateId();
    const now = new Date().toISOString();

    // Load world meta for version info
    let worldVersion = 'unknown';
    try {
      const metaContent = await readFile(join(WORLD_DIR, 'meta.yaml'), 'utf-8');
      const meta = yaml.load(metaContent);
      worldVersion = meta.version || 'unknown';
    } catch (e) {
      console.warn('Could not load world meta:', e.message);
    }

    // Add timestamps to messages if not present
    const processedMessages = messages.map((m, idx) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp || new Date(Date.now() + idx).toISOString()
    }));

    // Generate title from first user message if not provided
    const firstUserMessage = processedMessages.find(m => m.role === 'user');
    const conversationTitle = title || (firstUserMessage ? generateTitle(firstUserMessage.content) : 'Imported conversation');

    const conversation = {
      id,
      title: conversationTitle,
      created_at: now,
      updated_at: now,
      context: {
        world_version: worldVersion,
        pkg_domains: ['identity', 'relationships', 'behaviors', 'calendar'],
        source: source || 'claude-code'
      },
      messages: processedMessages
    };

    // Save conversation file
    await saveConversation(conversation);

    // Update index
    const index = await loadIndex();
    index.conversations.push({
      id,
      title: conversationTitle,
      created_at: now,
      updated_at: now,
      message_count: processedMessages.length
    });
    await saveIndex(index);

    res.status(201).json({
      success: true,
      conversation: {
        id,
        title: conversationTitle,
        message_count: processedMessages.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to import conversation', message: err.message });
  }
});

// POST /api/conversations/:id/import - Append messages to existing conversation (from Claude Code)
router.post('/:id/import', async (req, res) => {
  try {
    const { messages } = req.body;
    const conversationId = req.params.id;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Load existing conversation
    let conversation;
    try {
      conversation = await loadConversation(conversationId);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      throw err;
    }

    const now = new Date().toISOString();

    // Add timestamps to new messages if not present
    const processedMessages = messages.map((m, idx) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp || new Date(Date.now() + idx).toISOString()
    }));

    // Append new messages
    conversation.messages.push(...processedMessages);
    conversation.updated_at = now;

    // Save conversation
    await saveConversation(conversation);

    // Update index
    const index = await loadIndex();
    const indexEntry = index.conversations.find(c => c.id === conversationId);
    if (indexEntry) {
      indexEntry.updated_at = now;
      indexEntry.message_count = conversation.messages.length;
    }
    await saveIndex(index);

    res.json({
      success: true,
      conversation: {
        id: conversationId,
        title: conversation.title,
        message_count: conversation.messages.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to append messages', message: err.message });
  }
});

// GET /api/conversations/:id - Get single conversation
router.get('/:id', async (req, res) => {
  try {
    const conversation = await loadConversation(req.params.id);
    res.json(conversation);
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.status(404).json({ error: 'Conversation not found' });
    } else {
      res.status(500).json({ error: 'Failed to load conversation', message: err.message });
    }
  }
});

// POST /api/conversations/:id/messages - Add message and get response
router.post('/:id/messages', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Load conversation
    const conversation = await loadConversation(req.params.id);
    const now = new Date().toISOString();

    // Add user message
    const userMessage = {
      role: 'user',
      content,
      timestamp: now
    };
    conversation.messages.push(userMessage);

    // Update title if this is the first message
    if (conversation.messages.length === 1) {
      conversation.title = generateTitle(content);
    }

    // Generate assistant response
    let assistantContent = '';

    if (!process.env.ANTHROPIC_API_KEY) {
      assistantContent = `[Scenario generation unavailable - no API key configured]\n\nYour prompt: "${content}"`;
    } else {
      // Load world context
      let worldContext = '';
      try {
        worldContext = await readFile(WORLD_MD_PATH, 'utf-8');
      } catch (e) {
        console.warn('Failed to load WORLD.md:', e.message);
      }

      // Load PKG context
      let pkgContext = {};
      const pkgFiles = ['identity.json', 'relationships.json', 'behaviors.json', 'calendar.json'];
      for (const filename of pkgFiles) {
        try {
          pkgContext[filename.replace('.json', '')] = await loadKGData(filename);
        } catch (e) {
          console.warn(`Failed to load ${filename}:`, e.message);
        }
      }

      // Build system prompt
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
- Stay in 2030—technology is advanced but plausible, not magical`;

      // Build messages array from conversation history
      const apiMessages = conversation.messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const config = await loadConfig();
      const client = getClient();

      // Call Claude with prompt caching
      const message = await client.messages.create({
        model: config.api.model,
        max_tokens: 2048,
        temperature: 0.6,
        system: [
          {
            type: "text",
            text: systemPrompt,
            cache_control: { type: "ephemeral" }
          }
        ],
        messages: apiMessages
      });

      assistantContent = message.content[0].text;
    }

    // Add assistant message
    const assistantMessage = {
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date().toISOString()
    };
    conversation.messages.push(assistantMessage);

    // Update conversation metadata
    conversation.updated_at = new Date().toISOString();

    // Save conversation
    await saveConversation(conversation);

    // Update index
    const index = await loadIndex();
    const indexEntry = index.conversations.find(c => c.id === conversation.id);
    if (indexEntry) {
      indexEntry.title = conversation.title;
      indexEntry.updated_at = conversation.updated_at;
      indexEntry.message_count = conversation.messages.length;
    }
    await saveIndex(index);

    res.json({
      userMessage,
      assistantMessage,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        updated_at: conversation.updated_at
      }
    });
  } catch (err) {
    console.error('Message error:', err);
    res.status(500).json({ error: 'Failed to process message', message: err.message });
  }
});

// DELETE /api/conversations/:id - Delete conversation
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Delete conversation file
    const filepath = join(DATA_DIR, `${id}.json`);
    await unlink(filepath);

    // Update index
    const index = await loadIndex();
    index.conversations = index.conversations.filter(c => c.id !== id);
    await saveIndex(index);

    res.json({ success: true, deleted: id });
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.status(404).json({ error: 'Conversation not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete conversation', message: err.message });
    }
  }
});

export default router;
