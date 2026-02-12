'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchPrototypes, addPrototypeDay, deletePrototypeDay, uploadScreenshots } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Screenshot {
  filename: string;
  originalName: string;
  path: string;
  uploadedAt: string;
}

interface Day {
  date: string;
  screenshots: Screenshot[];
}

interface Prototype {
  id: string;
  name: string;
  days: Day[];
}

export default function PrototypesPage() {
  const [prototypes, setPrototypes] = useState<Prototype[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [addingDay, setAddingDay] = useState<string | null>(null);
  const [dayDate, setDayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await fetchPrototypes();
      setPrototypes(data.prototypes);
      // Auto-expand all by default
      const exp: Record<string, boolean> = {};
      data.prototypes.forEach((p: Prototype) => { exp[p.id] = true; });
      setExpanded(exp);
    } catch (e) {
      console.error('Failed to load prototypes:', e);
    } finally {
      setLoading(false);
    }
  }

  function toggle(id: string) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleAddDay(protoId: string) {
    if (!dayDate) return;
    try {
      await addPrototypeDay(protoId, dayDate);
      await load();
      setAddingDay(null);
    } catch (e: any) {
      alert(e.message || 'Failed to add day');
    }
  }

  async function handleDeleteDay(protoId: string, date: string) {
    if (!confirm(`Delete ${date} and all its screenshots?`)) return;
    try {
      await deletePrototypeDay(protoId, date);
      await load();
    } catch (e: any) {
      alert(e.message || 'Failed to delete day');
    }
  }

  async function handleUpload(protoId: string, date: string, files: FileList | null) {
    if (!files || files.length === 0) return;
    try {
      await uploadScreenshots(protoId, date, files);
      await load();
    } catch (e: any) {
      alert(e.message || 'Failed to upload');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-sm">Loading prototypes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Prototypes</h1>
        <p className="text-sm text-gray-500 mt-1">Screenshot gallery documenting prototype progress over time.</p>
      </div>

      <div className="space-y-6">
        {prototypes.map(proto => (
          <div key={proto.id} className="glass rounded-2xl overflow-hidden">
            {/* Prototype header */}
            <button
              onClick={() => toggle(proto.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-black/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${expanded[proto.id] ? 'rotate-90' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <h2 className="text-lg font-medium text-gray-900">{proto.name}</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {proto.days.length} {proto.days.length === 1 ? 'day' : 'days'}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {proto.days.reduce((sum, d) => sum + d.screenshots.length, 0)} screenshots
              </span>
            </button>

            {/* Expanded content */}
            {expanded[proto.id] && (
              <div className="border-t border-black/5 px-6 pb-5">
                {/* Add Day button */}
                <div className="py-3 flex items-center gap-2">
                  {addingDay === proto.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={dayDate}
                        onChange={e => setDayDate(e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      />
                      <button
                        onClick={() => handleAddDay(proto.id)}
                        className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddingDay(null)}
                        className="text-sm text-gray-400 hover:text-gray-600 px-2 py-1.5"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setDayDate(new Date().toISOString().split('T')[0]);
                        setAddingDay(proto.id);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-black/[0.03] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Day
                    </button>
                  )}
                </div>

                {/* Days */}
                {proto.days.length === 0 && (
                  <p className="text-sm text-gray-400 py-4">No days recorded yet. Add a day to start uploading screenshots.</p>
                )}

                {proto.days.map(day => (
                  <div key={day.date} className="mb-5 last:mb-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">{day.date}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {day.screenshots.length} {day.screenshots.length === 1 ? 'image' : 'images'}
                        </span>
                        <input
                          ref={el => { fileInputRefs.current[`${proto.id}-${day.date}`] = el; }}
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleUpload(proto.id, day.date, e.target.files)}
                        />
                        <button
                          onClick={() => fileInputRefs.current[`${proto.id}-${day.date}`]?.click()}
                          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-black/[0.03] transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Upload
                        </button>
                        <button
                          onClick={() => handleDeleteDay(proto.id, day.date)}
                          className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Screenshot grid */}
                    {day.screenshots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {day.screenshots.map(shot => (
                          <a
                            key={shot.filename}
                            href={`${API_BASE}${shot.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-video bg-gray-50 rounded-xl overflow-hidden border border-black/5 hover:border-black/10 transition-all hover:shadow-sm"
                          >
                            <img
                              src={`${API_BASE}${shot.path}`}
                              alt={shot.originalName}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[10px] text-white truncate">{shot.originalName}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <p className="text-sm text-gray-400">No screenshots yet</p>
                        <button
                          onClick={() => fileInputRefs.current[`${proto.id}-${day.date}`]?.click()}
                          className="text-sm text-blue-500 hover:text-blue-600 mt-1"
                        >
                          Upload images
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
