/**
 * Scenarios API Routes
 * Manages YAML-based scenario artifacts - canonical design scenarios extracted from conversations
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const SCENARIOS_PATH = path.join(__dirname, '../../data/scenarios');

// Helper: Load YAML file
function loadYaml(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.load(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

// Helper: Save YAML file
function saveYaml(filePath, data) {
  try {
    const content = yaml.dump(data, {
      indent: 2,
      lineWidth: 100,
      noRefs: true
    });
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error.message);
    return false;
  }
}

// ============================================
// LIST SCENARIOS
// ============================================

// GET /api/scenarios - List all scenarios
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(SCENARIOS_PATH)) {
      return res.json({ scenarios: [] });
    }

    const files = fs.readdirSync(SCENARIOS_PATH)
      .filter(f => f.endsWith('.yaml') && f !== '_registry.yaml');

    const scenarios = files
      .map(filename => {
        try {
          const scenarioPath = path.join(SCENARIOS_PATH, filename);
          const scenario = loadYaml(scenarioPath);
          if (!scenario) return null;

          return {
            id: scenario.id,
            title: scenario.title,
            status: scenario.status || 'active',
            created_at: scenario.created_at || new Date().toISOString().split('T')[0],
            updated_at: scenario.updated_at || new Date().toISOString().split('T')[0]
          };
        } catch (error) {
          console.error(`Error processing scenario file ${filename}:`, error.message);
          return null;
        }
      })
      .filter(s => s !== null)
      .sort((a, b) => {
        try {
          const dateA = new Date(a.updated_at).getTime();
          const dateB = new Date(b.updated_at).getTime();
          return dateB - dateA;
        } catch (error) {
          return 0;
        }
      });

    res.json({ scenarios });
  } catch (error) {
    console.error('Error listing scenarios:', error);
    res.status(500).json({ error: 'Failed to list scenarios', details: error.message });
  }
});

// ============================================
// GET SINGLE SCENARIO
// ============================================

// GET /api/scenarios/:id - Get full scenario
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const scenarioPath = path.join(SCENARIOS_PATH, `${id}.yaml`);

  if (!fs.existsSync(scenarioPath)) {
    return res.status(404).json({
      error: 'Scenario not found',
      id
    });
  }

  const scenario = loadYaml(scenarioPath);
  if (!scenario) {
    return res.status(500).json({ error: 'Failed to load scenario' });
  }

  res.json(scenario);
});

// ============================================
// CREATE SCENARIO
// ============================================

// POST /api/scenarios - Create new scenario
router.post('/', (req, res) => {
  const { id, title, status, context, metadata, content, notes } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: 'id and title are required' });
  }

  // Check if scenario already exists
  const scenarioPath = path.join(SCENARIOS_PATH, `${id}.yaml`);
  if (fs.existsSync(scenarioPath)) {
    return res.status(409).json({ error: 'Scenario already exists' });
  }

  const now = new Date().toISOString().split('T')[0];
  const scenario = {
    id,
    title,
    status: status || 'active',
    created_at: now,
    updated_at: now,
    context: context || {},
    metadata: metadata || {},
    content: content || '',
    notes: notes || []
  };

  if (saveYaml(scenarioPath, scenario)) {
    res.status(201).json(scenario);
  } else {
    res.status(500).json({ error: 'Failed to create scenario' });
  }
});

// ============================================
// UPDATE SCENARIO
// ============================================

// PUT /api/scenarios/:id - Update scenario
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const scenarioPath = path.join(SCENARIOS_PATH, `${id}.yaml`);

  if (!fs.existsSync(scenarioPath)) {
    return res.status(404).json({ error: 'Scenario not found' });
  }

  const existing = loadYaml(scenarioPath);
  if (!existing) {
    return res.status(500).json({ error: 'Failed to load existing scenario' });
  }

  // Update fields, preserving id and timestamps
  const updated = {
    ...existing,
    ...req.body,
    id, // Ensure ID cannot be changed
    created_at: existing.created_at, // Preserve creation date
    updated_at: new Date().toISOString().split('T')[0]
  };

  if (saveYaml(scenarioPath, updated)) {
    res.json(updated);
  } else {
    res.status(500).json({ error: 'Failed to update scenario' });
  }
});

// ============================================
// DELETE SCENARIO
// ============================================

// DELETE /api/scenarios/:id - Delete scenario
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const scenarioPath = path.join(SCENARIOS_PATH, `${id}.yaml`);

  if (!fs.existsSync(scenarioPath)) {
    return res.status(404).json({ error: 'Scenario not found' });
  }

  try {
    fs.unlinkSync(scenarioPath);
    res.json({ message: 'Scenario deleted', id });
  } catch (error) {
    console.error(`Failed to delete ${scenarioPath}:`, error.message);
    res.status(500).json({ error: 'Failed to delete scenario' });
  }
});

export default router;
