/**
 * Modes Routes
 * Endpoints for mode definitions and triage rules
 */

import { Router } from 'express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import yaml from 'js-yaml';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MODES_DIR = join(__dirname, '..', '..', 'data', 'modes');

// Helper to load YAML files
async function loadYaml(filename) {
  const filepath = join(MODES_DIR, filename);
  const content = await readFile(filepath, 'utf-8');
  return yaml.load(content);
}

// GET /api/modes
// List all mode definitions
router.get('/', async (req, res) => {
  try {
    const data = await loadYaml('mode-definitions.yaml');
    
    // Return summary list
    const modes = Object.entries(data.modes).map(([id, mode]) => ({
      id,
      name: mode.name,
      description: mode.description,
      icon: mode.icon
    }));
    
    res.json({ modes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load modes', message: err.message });
  }
});

// GET /api/modes/:id
// Get specific mode definition
router.get('/:id', async (req, res) => {
  try {
    const data = await loadYaml('mode-definitions.yaml');
    const mode = data.modes[req.params.id];
    
    if (!mode) {
      return res.status(404).json({ 
        error: 'Mode not found', 
        id: req.params.id,
        available: Object.keys(data.modes)
      });
    }
    
    res.json({ id: req.params.id, ...mode });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load mode', message: err.message });
  }
});

// GET /api/modes/:id/triage
// Get triage rules for a specific mode
router.get('/:id/triage', async (req, res) => {
  try {
    const modesData = await loadYaml('mode-definitions.yaml');
    const triageData = await loadYaml('triage-rules.yaml');
    
    const mode = modesData.modes[req.params.id];
    
    if (!mode) {
      return res.status(404).json({ 
        error: 'Mode not found', 
        id: req.params.id 
      });
    }
    
    // Combine mode-specific triage with global rules
    const triage = {
      mode_id: req.params.id,
      mode_name: mode.name,
      mode_specific: mode.triage,
      global_rules: {
        always_center: triageData.global_rules.always_center,
        always_silence: triageData.global_rules.always_silence
      },
      contact_priority: triageData.contact_priority
    };
    
    res.json(triage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load triage rules', message: err.message });
  }
});

// GET /api/modes/triage-rules
// Get all triage rules
router.get('/triage-rules', async (req, res) => {
  try {
    const data = await loadYaml('triage-rules.yaml');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load triage rules', message: err.message });
  }
});

// GET /api/modes/:id/constraints
// Get constraints (allowed/blocked intents) for a mode
router.get('/:id/constraints', async (req, res) => {
  try {
    const data = await loadYaml('mode-definitions.yaml');
    const mode = data.modes[req.params.id];
    
    if (!mode) {
      return res.status(404).json({ 
        error: 'Mode not found', 
        id: req.params.id 
      });
    }
    
    res.json({
      mode_id: req.params.id,
      mode_name: mode.name,
      constraints: mode.constraints
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load constraints', message: err.message });
  }
});

// GET /api/modes/:id/activation
// Get activation triggers and rules for a mode
router.get('/:id/activation', async (req, res) => {
  try {
    const data = await loadYaml('mode-definitions.yaml');
    const mode = data.modes[req.params.id];
    
    if (!mode) {
      return res.status(404).json({ 
        error: 'Mode not found', 
        id: req.params.id 
      });
    }
    
    res.json({
      mode_id: req.params.id,
      mode_name: mode.name,
      activation: mode.activation,
      deactivation: mode.deactivation
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load activation rules', message: err.message });
  }
});

export default router;
