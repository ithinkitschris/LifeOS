/**
 * Context Routes
 * Endpoints for querying the knowledge graph
 */

import { Router } from 'express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import yaml from 'js-yaml';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '..', '..', 'data', 'knowledge-graph');

// Helper to load YAML files
async function loadData(filename) {
  const filepath = join(DATA_DIR, filename);
  const content = await readFile(filepath, 'utf-8');
  return yaml.load(content);
}

// GET /api/context/identity
router.get('/identity', async (req, res) => {
  try {
    const data = await loadData('identity.yaml');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load identity data', message: err.message });
  }
});

// GET /api/context/relationships
router.get('/relationships', async (req, res) => {
  try {
    const data = await loadData('relationships.yaml');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load relationships data', message: err.message });
  }
});

// GET /api/context/relationships/:id
router.get('/relationships/:id', async (req, res) => {
  try {
    const data = await loadData('relationships.yaml');
    const allPeople = [...(data.inner_circle || []), ...(data.close_network || [])];
    const person = allPeople.find(p => p.id === req.params.id);

    if (!person) {
      return res.status(404).json({ error: 'Relationship not found', id: req.params.id });
    }

    res.json(person);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load relationship', message: err.message });
  }
});

// GET /api/context/behaviors
router.get('/behaviors', async (req, res) => {
  try {
    const data = await loadData('behaviors.yaml');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load behaviors data', message: err.message });
  }
});

// GET /api/context/calendar
router.get('/calendar', async (req, res) => {
  try {
    const data = await loadData('calendar.yaml');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load calendar data', message: err.message });
  }
});

// GET /api/context/locations
router.get('/locations', async (req, res) => {
  try {
    const data = await loadData('locations.yaml');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load locations data', message: err.message });
  }
});

// GET /api/context/locations/:id
router.get('/locations/:id', async (req, res) => {
  try {
    const data = await loadData('locations.yaml');
    const allLocations = {
      ...data.primary_locations,
      ...data.frequent_destinations
    };
    const location = allLocations[req.params.id];

    if (!location) {
      return res.status(404).json({ error: 'Location not found', id: req.params.id });
    }

    res.json(location);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load location', message: err.message });
  }
});

// GET /api/context/health
router.get('/health', async (req, res) => {
  try {
    const data = await loadData('health.yaml');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load health data', message: err.message });
  }
});

// GET /api/context/communications
router.get('/communications', async (req, res) => {
  try {
    const data = await loadData('communications.yaml');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load communications data', message: err.message });
  }
});


// GET /api/context/digital-history
router.get('/digital-history', async (req, res) => {
  try {
    const data = await loadData('digital-history.yaml');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load digital history data', message: err.message });
  }
});

// GET /api/context/knowledge-graph
// Aggregated knowledge graph for visualization
router.get('/knowledge-graph', async (req, res) => {
  try {
    const [identity, relationships, behaviors, health, locations, calendar, communications, digitalHistory] = await Promise.all([
      loadData('identity.yaml'),
      loadData('relationships.yaml'),
      loadData('behaviors.yaml'),
      loadData('health.yaml'),
      loadData('locations.yaml'),
      loadData('calendar.yaml'),
      loadData('communications.yaml'),
      loadData('digital-history.yaml')
    ]);

    res.json({
      identity,
      relationships,
      behaviors,
      health,
      locations,
      calendar,
      communications,
      digitalHistory
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load knowledge graph data', message: err.message });
  }
});


// GET /api/context/timeline
// Get all timeline data
router.get('/timeline', async (req, res) => {
  try {
    const data = await loadData('timeline.yaml');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load timeline data', message: err.message });
  }
});

// GET /api/context/timeline/current
// Get current timeline entry based on simulated time
router.get('/timeline/current', async (req, res) => {
  try {
    const data = await loadData('timeline.yaml');
    // Default to the example day
    const date = req.query.date || '2030-10-14';
    const time = req.query.time || '09:00';

    const day = data.days[date];
    if (!day) {
      return res.status(404).json({ error: 'Day not found', date });
    }

    // Find the timeline entry that contains the given time
    const timeMinutes = timeToMinutes(time);
    const currentEntry = day.timeline.find(entry => {
      const startMinutes = timeToMinutes(entry.start_time);
      const endMinutes = timeToMinutes(entry.end_time);
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    });

    if (!currentEntry) {
      return res.status(404).json({ error: 'No timeline entry for this time', time });
    }

    res.json({
      date,
      time,
      day_context: day.context,
      current_entry: currentEntry
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get current timeline', message: err.message });
  }
});

// GET /api/context/timeline/:date
// Get timeline for a specific date
router.get('/timeline/:date', async (req, res) => {
  try {
    const data = await loadData('timeline.yaml');
    const day = data.days[req.params.date];

    if (!day) {
      return res.status(404).json({
        error: 'Day not found',
        date: req.params.date,
        available_dates: Object.keys(data.days)
      });
    }

    res.json(day);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load timeline for date', message: err.message });
  }
});

// Helper function to convert time string to minutes
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// POST /api/context/query
// RAG-style query across knowledge graph
router.post('/query', async (req, res) => {
  try {
    const { query, domains = ['all'], limit = 10 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Load all relevant data
    const dataSources = {
      identity: await loadData('identity.yaml'),
      relationships: await loadData('relationships.yaml'),
      behaviors: await loadData('behaviors.yaml'),
      calendar: await loadData('calendar.yaml'),
      locations: await loadData('locations.yaml'),
      health: await loadData('health.yaml'),
      communications: await loadData('communications.yaml'),
      digitalHistory: await loadData('digital-history.yaml')
    };

    // Simple keyword-based retrieval (could be enhanced with embeddings)
    const queryLower = query.toLowerCase();
    const results = [];

    // Search through each domain
    const searchDomain = (domain, data, path = '') => {
      if (typeof data === 'string') {
        if (data.toLowerCase().includes(queryLower)) {
          results.push({ domain, path, value: data, type: 'string' });
        }
      } else if (Array.isArray(data)) {
        data.forEach((item, index) => {
          searchDomain(domain, item, `${path}[${index}]`);
        });
      } else if (typeof data === 'object' && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
          if (key.toLowerCase().includes(queryLower)) {
            results.push({ domain, path: `${path}.${key}`, value, type: 'key_match' });
          }
          searchDomain(domain, value, `${path}.${key}`);
        });
      }
    };

    // Filter domains if specified
    const domainsToSearch = domains.includes('all')
      ? Object.keys(dataSources)
      : domains.filter(d => dataSources[d]);

    domainsToSearch.forEach(domain => {
      searchDomain(domain, dataSources[domain]);
    });

    res.json({
      query,
      domains: domainsToSearch,
      results: results.slice(0, limit),
      total: results.length
    });

  } catch (err) {
    res.status(500).json({ error: 'Query failed', message: err.message });
  }
});

// POST /api/context/assemble
// Assemble context for a specific scenario
router.post('/assemble', async (req, res) => {
  try {
    const {
      scenario,  // e.g., 'navigation', 'focus', 'social'
      params = {} // scenario-specific parameters
    } = req.body;

    if (!scenario) {
      return res.status(400).json({ error: 'Scenario is required' });
    }

    // Load base data
    const identity = await loadData('identity.yaml');
    const relationships = await loadData('relationships.yaml');
    const behaviors = await loadData('behaviors.yaml');
    const calendar = await loadData('calendar.yaml');
    const locations = await loadData('locations.yaml');
    const communications = await loadData('communications.yaml');

    // Assemble context based on scenario
    let context = {
      user: {
        name: identity.basics.name,
        automation_preference: identity.lifeos_relationship.automation_preference
      }
    };

    switch (scenario) {
      case 'navigation':
        const destination = params.destination_id
          ? (locations.primary_locations[params.destination_id] || locations.frequent_destinations[params.destination_id])
          : null;

        context = {
          ...context,
          scenario: 'navigation',
          destination,
          connected_people: destination?.connected_people?.map(id => {
            const allPeople = [...relationships.inner_circle, ...relationships.close_network];
            return allPeople.find(p => p.id === id);
          }).filter(Boolean),
          commute: params.destination_id ? locations.commute_routes[`home_to_${params.destination_id}`] : null,
          communication_context: {
            high_priority_contacts: relationships.inner_circle.map(p => p.id),
            response_expectations: communications.channels.messages.response_expectations
          }
        };
        break;

      case 'focus':
        context = {
          ...context,
          scenario: 'focus',
          peak_hours: behaviors.temporal_patterns.daily_rhythm.peak_cognitive,
          context_switching_tolerance: behaviors.context_switching_profile.tolerance,
          acceptable_interrupts: behaviors.context_switching_profile.acceptable_interrupts,
          work_patterns: behaviors.temporal_patterns.work_patterns
        };
        break;

      case 'social':
        const withPerson = params.with_person_id
          ? [...relationships.inner_circle, ...relationships.close_network].find(p => p.id === params.with_person_id)
          : null;

        context = {
          ...context,
          scenario: 'social',
          with_person: withPerson,
          social_energy: behaviors.location_patterns?.social_energy || 'introverted',
          relationship_patterns: relationships.relationship_patterns
        };
        break;

      default:
        context = {
          ...context,
          scenario: 'general',
          message: 'Unknown scenario, returning base context'
        };
    }

    res.json(context);

  } catch (err) {
    res.status(500).json({ error: 'Context assembly failed', message: err.message });
  }
});

export default router;
