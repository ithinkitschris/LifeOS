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
