/**
 * Orchestrator Routes
 * Endpoints for constitutional values and orchestration (stubbed for future)
 */

import { Router } from 'express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import yaml from 'js-yaml';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONSTITUTION_DIR = join(__dirname, '..', '..', 'data', 'constitution');
const MODES_DIR = join(__dirname, '..', '..', 'data', 'modes');

// Helper to load YAML files
async function loadYaml(dir, filename) {
  const filepath = join(dir, filename);
  const content = await readFile(filepath, 'utf-8');
  return yaml.load(content);
}

// ============================================
// CONSTITUTIONAL VALUES ENDPOINTS
// ============================================

// GET /api/orchestrator/values
// Get all constitutional values
router.get('/values', async (req, res) => {
  try {
    const data = await loadYaml(CONSTITUTION_DIR, 'values.yaml');
    res.json({
      core_values: data.core_values,
      autonomy_preferences: data.autonomy_preferences
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load values', message: err.message });
  }
});

// GET /api/orchestrator/values/:id
// Get specific value by ID
router.get('/values/:id', async (req, res) => {
  try {
    const data = await loadYaml(CONSTITUTION_DIR, 'values.yaml');
    const value = data.core_values.find(v => v.id === req.params.id);
    
    if (!value) {
      return res.status(404).json({ 
        error: 'Value not found', 
        id: req.params.id,
        available: data.core_values.map(v => v.id)
      });
    }
    
    res.json(value);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load value', message: err.message });
  }
});

// GET /api/orchestrator/trade-offs
// Get trade-off rules
router.get('/trade-offs', async (req, res) => {
  try {
    const data = await loadYaml(CONSTITUTION_DIR, 'values.yaml');
    res.json({ trade_off_rules: data.trade_off_rules });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load trade-offs', message: err.message });
  }
});

// GET /api/orchestrator/boundaries
// Get hard boundaries
router.get('/boundaries', async (req, res) => {
  try {
    const data = await loadYaml(CONSTITUTION_DIR, 'values.yaml');
    res.json({ hard_boundaries: data.hard_boundaries });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load boundaries', message: err.message });
  }
});

// GET /api/orchestrator/override-patterns
// Get override patterns
router.get('/override-patterns', async (req, res) => {
  try {
    const data = await loadYaml(CONSTITUTION_DIR, 'values.yaml');
    res.json({ override_patterns: data.override_patterns });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load override patterns', message: err.message });
  }
});

// ============================================
// ORCHESTRATION ENDPOINTS (STUBBED)
// These are placeholders for future real-time orchestration
// ============================================

// POST /api/orchestrator/evaluate
// Evaluate what mode should be active given current context
// STUBBED: Returns predetermined response based on scenario
router.post('/evaluate', async (req, res) => {
  try {
    const { 
      current_time,
      current_location,
      calendar_events = [],
      recent_activity,
      biometrics = {}
    } = req.body;
    
    // Load mode definitions for reference
    const modesData = await loadYaml(MODES_DIR, 'mode-definitions.yaml');
    
    // STUB: Simple rule-based evaluation
    // In future, this would be sophisticated orchestration logic
    
    let suggested_mode = 'neutral';
    let confidence = 0.5;
    let reasoning = [];
    
    // Simple time-based rules for stub
    const hour = current_time ? new Date(current_time).getHours() : new Date().getHours();
    
    if (hour >= 23 || hour < 7) {
      suggested_mode = 'rest';
      confidence = 0.85;
      reasoning.push('Late night/early morning hours suggest rest mode');
    } else if (hour >= 9 && hour <= 17) {
      // Check for calendar events
      if (calendar_events.some(e => e.type === 'focus_time')) {
        suggested_mode = 'focus';
        confidence = 0.8;
        reasoning.push('Scheduled focus time block');
      } else {
        suggested_mode = 'work';
        confidence = 0.7;
        reasoning.push('Standard work hours');
      }
    }
    
    // Location override
    if (current_location === 'social_venue') {
      suggested_mode = 'social';
      confidence = 0.75;
      reasoning.push('At social venue');
    }
    
    res.json({
      stub: true,
      note: 'This is a stubbed response. Real orchestration logic not yet implemented.',
      evaluation: {
        suggested_mode,
        confidence,
        reasoning,
        mode_details: modesData.modes[suggested_mode] ? {
          name: modesData.modes[suggested_mode].name,
          description: modesData.modes[suggested_mode].description
        } : null
      },
      input_received: {
        current_time,
        current_location,
        calendar_events_count: calendar_events.length,
        has_biometrics: Object.keys(biometrics).length > 0
      }
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Evaluation failed', message: err.message });
  }
});

// POST /api/orchestrator/triage
// Triage a notification to center/periphery/silence
// STUBBED: Returns predetermined response based on rules
router.post('/triage', async (req, res) => {
  try {
    const {
      notification,  // { from, type, content, urgency }
      current_mode,
      current_context = {}
    } = req.body;
    
    if (!notification) {
      return res.status(400).json({ error: 'Notification object is required' });
    }
    
    // Load triage rules
    const triageData = await loadYaml(MODES_DIR, 'triage-rules.yaml');
    const valuesData = await loadYaml(CONSTITUTION_DIR, 'values.yaml');
    
    // STUB: Simple rule-based triage
    let zone = 'silence';  // Default to silence
    let reasoning = [];
    let rules_applied = [];
    
    const { from, type, urgency } = notification;
    
    // Check always_center rules
    if (from === 'emma_zhao') {
      zone = current_mode === 'focus' ? 'periphery' : 'center';
      reasoning.push('Partner has high priority access');
      rules_applied.push('tier_1_always_accessible');
    } else if (urgency === 'emergency') {
      zone = 'center';
      reasoning.push('Emergency urgency level');
      rules_applied.push('always_center_emergency');
    } else if (type === 'calendar_reminder' && notification.minutes_until <= 15) {
      zone = 'center';
      reasoning.push('Imminent calendar event');
      rules_applied.push('always_center_imminent_commitment');
    }
    
    // Check always_silence rules
    if (type === 'promotional') {
      zone = 'silence';
      reasoning.push('Promotional content always silenced');
      rules_applied.push('always_silence_promotional');
    }
    
    // Mode-specific adjustments
    if (current_mode === 'focus' && zone !== 'center') {
      zone = 'silence';
      reasoning.push('Focus mode: aggressive silencing');
      rules_applied.push('focus_mode_protection');
    }
    
    if (current_mode === 'social') {
      if (urgency !== 'emergency') {
        zone = 'silence';
        reasoning.push('Social mode: presence priority');
        rules_applied.push('social_mode_presence');
      }
    }
    
    res.json({
      stub: true,
      note: 'This is a stubbed response. Real triage logic not yet implemented.',
      triage: {
        zone,
        reasoning,
        rules_applied
      },
      notification_received: notification,
      current_mode: current_mode || 'neutral'
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Triage failed', message: err.message });
  }
});

// POST /api/orchestrator/simulate
// Simulate a scenario through the orchestrator
// Useful for testing prototypes
router.post('/simulate', async (req, res) => {
  try {
    const {
      scenario_name,
      steps = []  // Array of { time, event_type, event_data }
    } = req.body;
    
    if (!scenario_name || steps.length === 0) {
      return res.status(400).json({ 
        error: 'scenario_name and steps array are required',
        example: {
          scenario_name: 'morning_commute',
          steps: [
            { time: '08:00', event_type: 'wake', event_data: {} },
            { time: '08:30', event_type: 'leave_home', event_data: { destination: 'rmit_studio' } }
          ]
        }
      });
    }
    
    // STUB: Just echo back the scenario with placeholder responses
    const simulation_results = steps.map((step, index) => ({
      step: index + 1,
      time: step.time,
      event: step.event_type,
      orchestrator_response: {
        stub: true,
        action: `Would process ${step.event_type} event`,
        mode_change: null,
        notifications_triaged: 0
      }
    }));
    
    res.json({
      stub: true,
      note: 'Simulation is stubbed. Returns placeholder responses.',
      scenario_name,
      steps_count: steps.length,
      results: simulation_results
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Simulation failed', message: err.message });
  }
});

export default router;
