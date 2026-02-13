/**
 * Static data loader — imports pre-generated JSON at build time.
 * No fs, path, or yaml imports — everything is a plain JS object bundled by webpack.
 *
 * In development, the beforeFiles rewrite sends all /api/* calls to the local backend,
 * so these functions are never actually called locally.
 */

import staticData from './static-data.json';

const data = staticData as any;

// ── World ──────────────────────────────────────────

export function getFullWorld() {
  return data.world.full;
}

export function getWorldMeta() {
  return data.world.meta;
}

export function getWorldSetting() {
  return data.world.setting;
}

export function getWorldThesis() {
  return data.world.thesis;
}

export function getWorldOpenQuestions() {
  return data.world.openQuestions;
}

export function getDomainsList() {
  return { domains: data.world.domainsList };
}

export function getDomain(id: string) {
  return data.world.domainsById[id] ?? null;
}

export function getDomainIds(): string[] {
  return Object.keys(data.world.domainsById);
}

export function getVersionsList() {
  return data.world.versionsList;
}

export function getVersion(id: string) {
  return data.world.versionsById[id] ?? null;
}

export function getVersionIds(): string[] {
  return Object.keys(data.world.versionsById);
}

// ── Knowledge Graph ────────────────────────────────

export function getKG(name: string) {
  return data.kg[name] ?? null;
}

export function getFullKG() {
  return {
    identity: data.kg.identity,
    relationships: data.kg.relationships,
    behaviors: data.kg.behaviors,
    health: data.kg.health,
    locations: data.kg.locations,
    calendar: data.kg.calendar,
    communications: data.kg.communications,
    digitalHistory: data.kg['digital-history'],
  };
}

// ── Conversations ──────────────────────────────────

export function getConversationsList() {
  const convs = [...(data.conversations.index.conversations || [])];
  convs.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  return { conversations: convs };
}

export function getConversation(id: string) {
  return data.conversations.byId[id] ?? null;
}

export function getConversationIds(): string[] {
  return Object.keys(data.conversations.byId);
}

// ── Scenarios ──────────────────────────────────────

export function getScenariosList() {
  return { scenarios: data.scenarios.list };
}

export function getScenario(id: string) {
  return data.scenarios.byId[id] ?? null;
}

export function getScenarioIds(): string[] {
  return Object.keys(data.scenarios.byId);
}

// ── Days / Prototypes ──────────────────────────────

export function getDaysList() {
  return { days: data.prototypes.days?.days ?? [] };
}

export function getDay(date: string) {
  const days = data.prototypes.days?.days ?? [];
  return days.find((d: any) => d.date === date) ?? null;
}

export function getDayDates(): string[] {
  return (data.prototypes.days?.days ?? []).map((d: any) => d.date);
}

export function getPrototypeRegistry() {
  return { prototypes: data.prototypes.registry?.prototypes ?? [] };
}
