/**
 * Build-time script: reads all YAML/JSON data files from ./data/
 * and outputs a single src/lib/static-data.json that gets bundled by webpack.
 *
 * Run: node scripts/generate-static-data.mjs
 * Expects: ./data/ to exist (copied from ../backend/data by vercel.json buildCommand)
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const DATA_DIR = path.join(process.cwd(), 'data');
const OUT_FILE = path.join(process.cwd(), 'src', 'lib', 'static-data.json');

function loadYaml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content);
}

function loadJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function safeLoad(loader, filePath) {
  try { return loader(filePath); } catch { return null; }
}

// ── World data ──────────────────────────────────────────
const worldDir = path.join(DATA_DIR, 'world');

const meta = safeLoad(loadYaml, path.join(worldDir, 'meta.yaml'));
const setting = safeLoad(loadYaml, path.join(worldDir, 'setting.yaml'));
const thesis = safeLoad(loadYaml, path.join(worldDir, 'thesis.yaml'));
const devices = safeLoad(loadYaml, path.join(worldDir, 'devices.yaml'));
const systemArchitecture = safeLoad(loadYaml, path.join(worldDir, 'system-architecture.yaml'));
const providerIntegration = safeLoad(loadYaml, path.join(worldDir, 'provider-integration.yaml'));
const openQuestions = safeLoad(loadYaml, path.join(worldDir, 'open-questions.yaml'));

// Domains
const domainsDir = path.join(worldDir, 'domains');
const registry = safeLoad(loadYaml, path.join(domainsDir, '_registry.yaml'));
const domainsById = {};
// domainsList matches the backend's /api/world/domains shape: { id, name, file, order, description, status, version }
const domainsList = [];
if (registry?.domains) {
  for (const ref of registry.domains) {
    try {
      const d = loadYaml(path.join(domainsDir, ref.file));
      domainsById[ref.id] = d;
      domainsList.push({
        id: ref.id,
        name: ref.name,
        file: ref.file,
        order: ref.order,
        description: d?.description || '',
        status: d?.status || 'unknown',
        version: d?.version || '0.0.0',
      });
    } catch {}
  }
}

// Versions
const versionsDir = path.join(worldDir, 'versions');
const versionsList = [];
const versionsById = {};
if (fs.existsSync(versionsDir)) {
  const vFiles = fs.readdirSync(versionsDir).filter(f => f.endsWith('.yaml'));
  for (const f of vFiles) {
    try {
      const v = loadYaml(path.join(versionsDir, f));
      const id = f.replace('.yaml', '');
      versionsList.push(v);
      versionsById[id] = v;
    } catch {}
  }
}

// ── Knowledge Graph ─────────────────────────────────────
const kgDir = path.join(DATA_DIR, 'knowledge-graph');
const kgFiles = ['identity', 'relationships', 'behaviors', 'locations', 'health',
  'communications', 'calendar', 'timeline', 'digital-history'];
const kg = {};
for (const name of kgFiles) {
  kg[name] = safeLoad(loadYaml, path.join(kgDir, `${name}.yaml`));
}

// ── Conversations ───────────────────────────────────────
const convDir = path.join(DATA_DIR, 'conversations');
let convIndex = { conversations: [] };
const convById = {};
if (fs.existsSync(convDir)) {
  convIndex = safeLoad(loadJson, path.join(convDir, 'index.json')) || { conversations: [] };
  for (const c of convIndex.conversations) {
    try {
      convById[c.id] = loadJson(path.join(convDir, `${c.id}.json`));
    } catch {}
  }
}

// ── Scenarios ───────────────────────────────────────────
const scenDir = path.join(DATA_DIR, 'scenarios');
const scenariosList = [];
const scenariosById = {};
if (fs.existsSync(scenDir)) {
  const sFiles = fs.readdirSync(scenDir).filter(f => f.endsWith('.yaml') && f !== '_registry.yaml');
  for (const f of sFiles) {
    try {
      const s = loadYaml(path.join(scenDir, f));
      const id = f.replace('.yaml', '');
      scenariosById[id] = s;
      scenariosList.push({
        id: s.id || id, title: s.title,
        status: s.status || 'active',
        created_at: s.created_at, updated_at: s.updated_at,
      });
    } catch {}
  }
}

// ── Prototypes / Days ───────────────────────────────────
const protoDir = path.join(DATA_DIR, 'prototypes');
const days = safeLoad(loadYaml, path.join(protoDir, 'days.yaml'));
const protoRegistry = safeLoad(loadYaml, path.join(protoDir, 'prototype-registry.yaml'));

// ── Assemble output ─────────────────────────────────────
const output = {
  world: {
    full: { meta, setting, thesis, devices, systemArchitecture, providerIntegration, domains: domainsById, openQuestions: openQuestions?.questions || [] },
    meta,
    setting,
    thesis,
    devices,
    systemArchitecture,
    providerIntegration,
    openQuestions,
    domainsList,
    domainsById,
    registry,
    versionsList,
    versionsById,
  },
  kg,
  conversations: {
    index: convIndex,
    byId: convById,
  },
  scenarios: {
    list: scenariosList,
    byId: scenariosById,
  },
  prototypes: {
    days: days,
    registry: protoRegistry,
  },
};

fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 0));
console.log(`Static data written to ${OUT_FILE} (${(fs.statSync(OUT_FILE).size / 1024).toFixed(1)} KB)`);
