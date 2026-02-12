const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchWorld() {
  const res = await fetch(`${API_BASE}/api/world`);
  if (!res.ok) throw new Error('Failed to fetch world');
  return res.json();
}

export async function fetchMeta() {
  const res = await fetch(`${API_BASE}/api/world/meta`);
  if (!res.ok) throw new Error('Failed to fetch meta');
  return res.json();
}

export async function fetchSetting() {
  const res = await fetch(`${API_BASE}/api/world/setting`);
  if (!res.ok) throw new Error('Failed to fetch setting');
  return res.json();
}

export async function updateSetting(setting: any) {
  const res = await fetch(`${API_BASE}/api/world/setting`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(setting),
  });
  if (!res.ok) throw new Error('Failed to update setting');
  return res.json();
}

export async function fetchThesis() {
  const res = await fetch(`${API_BASE}/api/world/thesis`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Failed to fetch thesis: ${error.error || res.statusText}`);
  }
  return res.json();
}

export async function updateThesis(thesis: any) {
  const res = await fetch(`${API_BASE}/api/world/thesis`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(thesis),
  });
  if (!res.ok) throw new Error('Failed to update thesis');
  return res.json();
}

export async function fetchDomains() {
  const res = await fetch(`${API_BASE}/api/world/domains`);
  if (!res.ok) throw new Error('Failed to fetch domains');
  return res.json();
}

export async function fetchDomain(id: string) {
  const res = await fetch(`${API_BASE}/api/world/domains/${id}`);
  if (!res.ok) throw new Error('Failed to fetch domain');
  return res.json();
}

export async function updateDomain(id: string, domain: any) {
  const res = await fetch(`${API_BASE}/api/world/domains/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(domain),
  });
  if (!res.ok) throw new Error('Failed to update domain');
  return res.json();
}

export async function createDomain(domain: { id: string; name: string; description?: string }) {
  const res = await fetch(`${API_BASE}/api/world/domains`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(domain),
  });
  if (!res.ok) throw new Error('Failed to create domain');
  return res.json();
}

export async function deleteDomain(id: string) {
  const res = await fetch(`${API_BASE}/api/world/domains/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete domain');
  return res.json();
}

export async function fetchOpenQuestions() {
  const res = await fetch(`${API_BASE}/api/world/open-questions`);
  if (!res.ok) throw new Error('Failed to fetch open questions');
  return res.json();
}

export async function updateOpenQuestion(id: string, question: any) {
  const res = await fetch(`${API_BASE}/api/world/open-questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question),
  });
  if (!res.ok) throw new Error('Failed to update question');
  return res.json();
}

export async function createOpenQuestion(question: { name: string; question: string; domain?: string; notes?: string }) {
  const res = await fetch(`${API_BASE}/api/world/open-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question),
  });
  if (!res.ok) throw new Error('Failed to create question');
  return res.json();
}

export async function deleteOpenQuestion(id: string) {
  const res = await fetch(`${API_BASE}/api/world/open-questions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete question');
  return res.json();
}

export async function fetchVersions() {
  const res = await fetch(`${API_BASE}/api/world/versions`);
  if (!res.ok) throw new Error('Failed to fetch versions');
  return res.json();
}

export async function createVersion(version: string, notes?: string) {
  const res = await fetch(`${API_BASE}/api/world/versions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version, notes }),
  });
  if (!res.ok) throw new Error('Failed to create version');
  return res.json();
}

export async function restoreVersion(version: string) {
  const res = await fetch(`${API_BASE}/api/world/versions/${version}/restore`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to restore version');
  return res.json();
}

// ============================================
// Conversations API
// ============================================

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  context: {
    world_version: string;
    pkg_domains: string[];
  };
  messages: ConversationMessage[];
}

export async function fetchConversations(): Promise<{ conversations: ConversationSummary[] }> {
  const res = await fetch(`${API_BASE}/api/conversations`);
  if (!res.ok) throw new Error('Failed to fetch conversations');
  return res.json();
}

export async function createConversation(): Promise<Conversation> {
  const res = await fetch(`${API_BASE}/api/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to create conversation');
  return res.json();
}

export async function fetchConversation(id: string): Promise<Conversation> {
  const res = await fetch(`${API_BASE}/api/conversations/${id}`);
  if (!res.ok) throw new Error('Failed to fetch conversation');
  return res.json();
}

export async function sendMessage(conversationId: string, content: string): Promise<{
  userMessage: ConversationMessage;
  assistantMessage: ConversationMessage;
  conversation: { id: string; title: string; updated_at: string };
}> {
  const res = await fetch(`${API_BASE}/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function deleteConversation(id: string): Promise<{ success: boolean; deleted: string }> {
  const res = await fetch(`${API_BASE}/api/conversations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete conversation');
  return res.json();
}

// ============================================
// PKG (Personal Knowledge Graph) API
// ============================================

export async function fetchPKGIdentity() {
  const res = await fetch(`${API_BASE}/api/context/identity`);
  if (!res.ok) throw new Error('Failed to fetch identity');
  return res.json();
}

export async function fetchPKGRelationships() {
  const res = await fetch(`${API_BASE}/api/context/relationships`);
  if (!res.ok) throw new Error('Failed to fetch relationships');
  return res.json();
}

export async function fetchPKGBehaviors() {
  const res = await fetch(`${API_BASE}/api/context/behaviors`);
  if (!res.ok) throw new Error('Failed to fetch behaviors');
  return res.json();
}

export async function fetchPKGLocations() {
  const res = await fetch(`${API_BASE}/api/context/locations`);
  if (!res.ok) throw new Error('Failed to fetch locations');
  return res.json();
}

export async function fetchPKGHealth() {
  const res = await fetch(`${API_BASE}/api/context/health`);
  if (!res.ok) throw new Error('Failed to fetch health');
  return res.json();
}

export async function fetchPKGCommunications() {
  const res = await fetch(`${API_BASE}/api/context/communications`);
  if (!res.ok) throw new Error('Failed to fetch communications');
  return res.json();
}

export async function fetchPKGCalendar() {
  const res = await fetch(`${API_BASE}/api/context/calendar`);
  if (!res.ok) throw new Error('Failed to fetch calendar');
  return res.json();
}

export async function fetchPKGTimeline() {
  const res = await fetch(`${API_BASE}/api/context/timeline`);
  if (!res.ok) throw new Error('Failed to fetch timeline');
  return res.json();
}

export async function fetchPKGDigitalHistory() {
  const res = await fetch(`${API_BASE}/api/context/digital-history`);
  if (!res.ok) throw new Error('Failed to fetch digital history');
  return res.json();
}

export async function fetchFullKnowledgeGraph() {
  const res = await fetch(`${API_BASE}/api/context/knowledge-graph`);
  if (!res.ok) throw new Error('Failed to fetch knowledge graph');
  return res.json();
}

// ============================================
// Prototypes API
// ============================================

export async function fetchPrototypes() {
  const res = await fetch(`${API_BASE}/api/prototypes`);
  if (!res.ok) throw new Error('Failed to fetch prototypes');
  return res.json();
}

export async function addPrototypeDay(prototypeId: string, date: string) {
  const res = await fetch(`${API_BASE}/api/prototypes/${prototypeId}/days`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date }),
  });
  if (!res.ok) throw new Error('Failed to add day');
  return res.json();
}

export async function deletePrototypeDay(prototypeId: string, date: string) {
  const res = await fetch(`${API_BASE}/api/prototypes/${prototypeId}/days/${date}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete day');
  return res.json();
}

export async function uploadScreenshots(prototypeId: string, date: string, files: FileList | File[]) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  const res = await fetch(`${API_BASE}/api/prototypes/${prototypeId}/days/${date}/screenshots`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload screenshots');
  return res.json();
}
