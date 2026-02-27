/**
 * FS Data Loader — reads YAML/JSON directly from data/ at repo root.
 *
 * Replaces the static-data.json approach from v1.
 * All API routes use this module instead of data-loader.ts.
 *
 * Path resolution: process.cwd() = dashboard/, so repo root = ../
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const REPO_ROOT = path.join(process.cwd(), '..');
const DATA_DIR = path.join(REPO_ROOT, 'data');

export function readYaml<T = any>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return yaml.load(content) as T;
  } catch (err) {
    console.error(`[fs-data] Failed to read YAML ${filePath}: ${(err as Error).message}`);
    return null;
  }
}

export function readJson<T = any>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

export function writeJson(filePath: string, data: any): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function writeYaml(filePath: string, data: any): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, yaml.dump(data, { lineWidth: -1 }), 'utf-8');
}

// ── World ──────────────────────────────────────────────────────────────────────

export function getWorldMeta() {
  return readYaml(path.join(DATA_DIR, 'world', 'meta.yaml'));
}

export function getWorldSetting() {
  return readYaml(path.join(DATA_DIR, 'world', 'setting.yaml'));
}

export function saveWorldSetting(data: any) {
  writeYaml(path.join(DATA_DIR, 'world', 'setting.yaml'), data);
}

export function getWorldThesis() {
  return readYaml(path.join(DATA_DIR, 'world', 'thesis.yaml'));
}

export function saveWorldThesis(data: any) {
  writeYaml(path.join(DATA_DIR, 'world', 'thesis.yaml'), data);
}

export function getWorldOpenQuestions() {
  return readYaml(path.join(DATA_DIR, 'world', 'open-questions.yaml'));
}

export function saveWorldOpenQuestions(data: any) {
  writeYaml(path.join(DATA_DIR, 'world', 'open-questions.yaml'), data);
}

export function getDomainRegistry() {
  return readYaml<{ domains: Array<{ id: string; name: string; file: string; order: number }> }>(
    path.join(DATA_DIR, 'world', 'domains', '_registry.yaml')
  );
}

export function getDomain(id: string) {
  return readYaml(path.join(DATA_DIR, 'world', 'domains', `${id}.yaml`));
}

export function saveDomain(id: string, data: any) {
  writeYaml(path.join(DATA_DIR, 'world', 'domains', `${id}.yaml`), data);
}

export function getDomainsList(): { domains: any[] } {
  const registry = getDomainRegistry();
  if (!registry) return { domains: [] };
  const domains = registry.domains
    .map(entry => {
      const d = readYaml(path.join(DATA_DIR, 'world', 'domains', entry.file));
      return d ? { id: entry.id, name: entry.name, order: entry.order, ...d } : null;
    })
    .filter(Boolean);
  return { domains };
}

export function getFullWorld() {
  return {
    meta: getWorldMeta(),
    setting: getWorldSetting(),
    thesis: getWorldThesis(),
    openQuestions: getWorldOpenQuestions(),
    domains: getDomainsList().domains,
  };
}

// ── Versions ──────────────────────────────────────────────────────────────────

export function getVersionsList(): { versions: any[] } {
  const versionsDir = path.join(DATA_DIR, 'world', 'versions');
  try {
    const entries = fs.readdirSync(versionsDir, { withFileTypes: true });
    const versions = entries
      .filter(e => e.isDirectory())
      .map(e => {
        const snapshot = readJson(path.join(versionsDir, e.name, 'snapshot.json'));
        return snapshot ? { id: e.name, ...snapshot } : { id: e.name };
      })
      .sort((a, b) => new Date(b.created || 0).getTime() - new Date(a.created || 0).getTime());
    return { versions };
  } catch {
    return { versions: [] };
  }
}

export function getVersion(id: string) {
  return readJson(path.join(DATA_DIR, 'world', 'versions', id, 'snapshot.json'));
}

export function saveVersion(id: string, data: any) {
  writeJson(path.join(DATA_DIR, 'world', 'versions', id, 'snapshot.json'), data);
}

// ── Vignettes ─────────────────────────────────────────────────────────────────

export function getVignettesList(): { vignettes: any[] } {
  const vignettesDir = path.join(DATA_DIR, 'vignettes');
  try {
    const files = fs.readdirSync(vignettesDir).filter(f => f.endsWith('.yaml'));
    const vignettes = files
      .map(f => {
        const v = readYaml<any>(path.join(vignettesDir, f));
        if (!v) return null;
        return {
          id: v.id,
          title: v.title,
          status: v.status,
          simulation: v.simulation,
          created_at: v.created_at,
          updated_at: v.updated_at,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());
    return { vignettes };
  } catch {
    return { vignettes: [] };
  }
}

export function getVignette(id: string) {
  return readYaml(path.join(DATA_DIR, 'vignettes', `${id}.yaml`));
}

export function saveVignette(id: string, data: any) {
  writeYaml(path.join(DATA_DIR, 'vignettes', `${id}.yaml`), data);
}

export function deleteVignette(id: string) {
  const filePath = path.join(DATA_DIR, 'vignettes', `${id}.yaml`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

// ── Findings ──────────────────────────────────────────────────────────────────

export function getFindingsList(): { sessions: any[] } {
  const findingsDir = path.join(DATA_DIR, 'findings');
  try {
    const files = fs.readdirSync(findingsDir).filter(f => f.endsWith('.json'));
    const sessions = files
      .map(f => {
        const session = readJson<any>(path.join(findingsDir, f));
        if (!session) return null;
        return {
          id: session.id,
          vignette_id: session.vignette_id,
          vignette_title: session.vignette_title,
          mode: session.mode,
          started_at: session.started_at,
          reaction_count: (session.reactions || []).length,
          has_reflection: !!session.reflection,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
    return { sessions };
  } catch {
    return { sessions: [] };
  }
}

export function getFindingSession(id: string) {
  return readJson(path.join(DATA_DIR, 'findings', `${id}.json`));
}

export function saveFindingSession(id: string, data: any) {
  writeJson(path.join(DATA_DIR, 'findings', `${id}.json`), data);
}

export function getAllFindings(): any[] {
  const findingsDir = path.join(DATA_DIR, 'findings');
  try {
    const files = fs.readdirSync(findingsDir).filter(f => f.endsWith('.json'));
    return files.map(f => readJson(path.join(findingsDir, f))).filter(Boolean);
  } catch {
    return [];
  }
}

// ── Prototypes ────────────────────────────────────────────────────────────────

export function getPrototypeDays() {
  return readYaml(path.join(DATA_DIR, 'prototypes', 'days.yaml'));
}

export function getPrototypeRegistry() {
  return readYaml(path.join(DATA_DIR, 'prototypes', 'prototype-registry.yaml'));
}

export function savePrototypeDays(data: any) {
  writeYaml(path.join(DATA_DIR, 'prototypes', 'days.yaml'), data);
}
