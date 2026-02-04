'use client';

import { useEffect, useState } from 'react';
import { fetchVersions, createVersion, restoreVersion, fetchMeta } from '@/lib/api';

interface Version {
  version: string;
  created: string;
  notes: string;
}

interface Meta {
  version: string;
  last_modified: string;
  changelog: Array<{ version: string; date: string; changes: string[] }>;
}

export default function VersionsPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newVersion, setNewVersion] = useState({ version: '', notes: '' });
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [versionsData, metaData] = await Promise.all([fetchVersions(), fetchMeta()]);
      setVersions(versionsData.versions);
      setMeta(metaData);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createVersion(newVersion.version, newVersion.notes);
      setShowCreate(false);
      setNewVersion({ version: '', notes: '' });
      loadData();
    } catch (e) {
      alert('Failed to create version');
    }
  };

  const handleRestore = async (version: string) => {
    if (!confirm(`Are you sure you want to restore to version ${version}? This will overwrite current state.`)) {
      return;
    }

    setRestoring(version);
    try {
      await restoreVersion(version);
      loadData();
      alert(`Restored to version ${version}`);
    } catch (e) {
      alert('Failed to restore version');
    } finally {
      setRestoring(null);
    }
  };

  // Suggest next version number
  const suggestNextVersion = () => {
    if (!meta) return '0.1.0';
    const parts = meta.version.split('.').map(Number);
    parts[2]++; // Increment patch
    return parts.join('.');
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Version History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track world canon evolution and restore previous states</p>
        </div>
        <button
          onClick={() => {
            setNewVersion({ version: suggestNextVersion(), notes: '' });
            setShowCreate(true);
          }}
          className="px-4 py-2 bg-lifeos-600 text-white rounded-lg hover:bg-lifeos-700 transition-colors"
        >
          + Create Snapshot
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create Version Snapshot</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Version</label>
                <input
                  type="text"
                  value={newVersion.version}
                  onChange={(e) => setNewVersion({ ...newVersion, version: e.target.value })}
                  placeholder="e.g., 0.2.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lifeos-500 font-mono"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Current version: {meta?.version}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Notes</label>
                <textarea
                  value={newVersion.notes}
                  onChange={(e) => setNewVersion({ ...newVersion, notes: e.target.value })}
                  placeholder="What changed in this version..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lifeos-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newVersion.version}
                className="px-4 py-2 bg-lifeos-600 text-white rounded-lg hover:bg-lifeos-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Current State */}
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg border border-sky-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-sky-700 uppercase tracking-wide">Current State</h2>
                <div className="text-3xl font-mono font-bold text-sky-900 mt-1">v{meta?.version}</div>
                <div className="text-sm text-sky-600 mt-1">Last modified: {meta?.last_modified}</div>
              </div>
              <div className="text-sky-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Changelog */}
          {meta?.changelog && meta.changelog.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Changelog</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100">
                {meta.changelog.slice().reverse().map((entry, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-300">v{entry.version}</span>
                      <span className="text-xs text-gray-400">{entry.date}</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {entry.changes.map((change, i) => (
                        <li key={i} className="text-sm text-gray-700 dark:text-gray-200">• {change}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Version Timeline */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Snapshots</h2>
          {versions.length > 0 ? (
            <div className="space-y-4">
              {versions.map((v, index) => (
                <div
                  key={v.version}
                  className={`bg-white rounded-lg border p-5 ${
                    v.version === meta?.version
                      ? 'border-sky-300 ring-2 ring-sky-100'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-mono font-medium text-gray-900 dark:text-gray-100">v{v.version}</span>
                        {v.version === meta?.version && (
                          <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Created: {new Date(v.created).toLocaleString()}
                      </div>
                      {v.notes && (
                        <p className="text-gray-700 dark:text-gray-200 mt-2 text-sm">{v.notes}</p>
                      )}
                    </div>

                    {v.version !== meta?.version && (
                      <button
                        onClick={() => handleRestore(v.version)}
                        disabled={restoring === v.version}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 disabled:opacity-50 transition-colors"
                      >
                        {restoring === v.version ? 'Restoring...' : 'Restore'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">No version snapshots yet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Create your first snapshot to start tracking world canon changes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
