/**
 * LifeOS Backend Server
 * Main entry point for the prototype platform API
 */

// Load environment variables from .env file
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Route imports
import contextRoutes from './routes/context.js';
import modesRoutes from './routes/modes.js';
import orchestratorRoutes from './routes/orchestrator.js';
import llmRoutes from './routes/llm.js';
import worldRoutes from './routes/world.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging (development)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/context', contextRoutes);
app.use('/api/modes', modesRoutes);
app.use('/api/orchestrator', orchestratorRoutes);
app.use('/api/llm', llmRoutes);
app.use('/api/world', worldRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'LifeOS Prototype Platform API',
    version: '1.0.0',
    endpoints: {
      context: {
        'GET /api/context/identity': 'Get Marcus identity profile',
        'GET /api/context/relationships': 'Get relationships data',
        'GET /api/context/relationships/:id': 'Get specific relationship',
        'GET /api/context/behaviors': 'Get behavioral patterns',
        'GET /api/context/calendar': 'Get calendar patterns',
        'GET /api/context/locations': 'Get locations data',
        'GET /api/context/locations/:id': 'Get specific location',
        'GET /api/context/health': 'Get health/biometrics patterns',
        'GET /api/context/communications': 'Get communication patterns',
        'GET /api/context/digital-history': 'Get digital history summary',
        'GET /api/context/timeline': 'Get full day timeline data',
        'GET /api/context/timeline/:date': 'Get timeline for specific date',
        'GET /api/context/timeline/current': 'Get current timeline entry (use ?time=HH:MM)',
        'POST /api/context/query': 'RAG query across knowledge graph'
      },
      modes: {
        'GET /api/modes': 'List all mode definitions',
        'GET /api/modes/:id': 'Get specific mode definition',
        'GET /api/modes/:id/triage': 'Get triage rules for mode',
        'GET /api/modes/triage-rules': 'Get all triage rules'
      },
      constitution: {
        'GET /api/orchestrator/values': 'Get constitutional values',
        'GET /api/orchestrator/trade-offs': 'Get trade-off rules',
        'GET /api/orchestrator/boundaries': 'Get hard boundaries'
      },
      orchestrator: {
        'POST /api/orchestrator/evaluate': 'Evaluate mode for context (stub)',
        'POST /api/orchestrator/triage': 'Triage a notification (stub)'
      },
      llm: {
        'POST /api/llm/generate': 'Generate natural language',
        'POST /api/llm/explain-mode': 'Generate mode explanation',
        'POST /api/llm/explain-triage': 'Generate triage explanation'
      },
      world: {
        'GET /api/world': 'Get full world state',
        'GET /api/world/meta': 'Get version info',
        'GET /api/world/setting': 'Get 2030 world context',
        'PUT /api/world/setting': 'Update 2030 world context',
        'GET /api/world/thesis': 'Get thesis structure',
        'PUT /api/world/thesis': 'Update thesis structure',
        'GET /api/world/domains': 'List all domains',
        'GET /api/world/domains/:id': 'Get specific domain',
        'PUT /api/world/domains/:id': 'Update domain',
        'POST /api/world/domains': 'Create new domain',
        'DELETE /api/world/domains/:id': 'Delete domain',
        'GET /api/world/open-questions': 'List open questions',
        'GET /api/world/versions': 'List version snapshots',
        'POST /api/world/versions': 'Create version snapshot',
        'POST /api/world/versions/:version/restore': 'Restore to version'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `No route matches ${req.method} ${req.path}`,
    hint: 'GET /api for available endpoints'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   LifeOS Prototype Platform                                ║
║   Backend API Server                                       ║
║                                                            ║
║   Running on: http://localhost:${PORT}                       ║
║   API docs:   http://localhost:${PORT}/api                   ║
║   Health:     http://localhost:${PORT}/health                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
