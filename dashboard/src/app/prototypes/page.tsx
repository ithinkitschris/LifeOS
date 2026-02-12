'use client';

import { useEffect, useState, useRef } from 'react';
import {
  fetchDays,
  createDay,
  deleteDay,
  addPrototypeToDay,
  removePrototypeFromDay,
  uploadDayScreenshots,
  fetchPrototypeRegistry,
  type Day,
  type DayScreenshot,
  type PrototypeDefinition
} from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function PrototypesPage() {
  const [days, setDays] = useState<Day[]>([]);
  const [registry, setRegistry] = useState<PrototypeDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  // Expansion state
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [expandedPrototypes, setExpandedPrototypes] = useState<Record<string, boolean>>({});

  // UI state
  const [addingDay, setAddingDay] = useState(false);
  const [newDayDate, setNewDayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [addingPrototype, setAddingPrototype] = useState<string | null>(null);
  const [selectedPrototypeId, setSelectedPrototypeId] = useState<string>('');
  const [lightboxImage, setLightboxImage] = useState<DayScreenshot | null>(null);

  // Track aspect ratios for dynamic column spanning
  const [aspectRatios, setAspectRatios] = useState<Record<string, 'landscape' | 'portrait'>>({});

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    load();
  }, []);

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  async function load() {
    try {
      const [daysData, registryData] = await Promise.all([
        fetchDays(),
        fetchPrototypeRegistry()
      ]);

      setDays(daysData.days);
      setRegistry(registryData.prototypes);

      // Auto-expand days, but keep prototypes collapsed by default
      const expDays: Record<string, boolean> = {};

      daysData.days.forEach(day => {
        expDays[day.date] = true;
      });

      setExpandedDays(expDays);
    } catch (e) {
      console.error('Failed to load days:', e);
    } finally {
      setLoading(false);
    }
  }

  function toggleDay(date: string) {
    setExpandedDays(prev => ({ ...prev, [date]: !prev[date] }));
  }

  function togglePrototype(date: string, prototypeId: string) {
    const key = `${date}-${prototypeId}`;
    setExpandedPrototypes(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function isVideo(filename: string): boolean {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  function handleImageLoad(filename: string, event: React.SyntheticEvent<HTMLImageElement>) {
    const img = event.currentTarget;
    const orientation = img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait';
    setAspectRatios(prev => ({ ...prev, [filename]: orientation }));
  }

  function handleVideoLoad(filename: string, event: React.SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget;
    const orientation = video.videoWidth > video.videoHeight ? 'landscape' : 'portrait';
    setAspectRatios(prev => ({ ...prev, [filename]: orientation }));
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  async function handleCreateDay() {
    if (!newDayDate) return;
    try {
      await createDay(newDayDate);
      await load();
      setAddingDay(false);
      setNewDayDate(new Date().toISOString().split('T')[0]);
    } catch (e: any) {
      alert(e.message || 'Failed to create day');
    }
  }

  async function handleDeleteDay(date: string) {
    if (!confirm(`Delete ${date} and all its prototypes/frames?`)) return;
    try {
      await deleteDay(date);
      await load();
    } catch (e: any) {
      alert(e.message || 'Failed to delete day');
    }
  }

  async function handleAddPrototype(date: string) {
    if (!selectedPrototypeId) {
      alert('Please select a prototype');
      return;
    }

    try {
      await addPrototypeToDay(date, selectedPrototypeId);
      await load();
      setAddingPrototype(null);
      setSelectedPrototypeId('');
    } catch (e: any) {
      alert(e.message || 'Failed to add prototype');
    }
  }

  async function handleRemovePrototype(date: string, prototypeId: string) {
    if (!confirm(`Remove "${prototypeId}" and all its frames from ${date}?`)) return;
    try {
      await removePrototypeFromDay(date, prototypeId);
      await load();
    } catch (e: any) {
      alert(e.message || 'Failed to remove prototype');
    }
  }

  async function handleUpload(date: string, prototypeId: string, files: FileList | null) {
    if (!files || files.length === 0) return;
    try {
      await uploadDayScreenshots(date, prototypeId, files);
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
        <p className="text-sm text-gray-500 mt-1">Organized by day</p>
      </div>

      {/* Add Day Button */}
      <div className="mb-6">
        {addingDay ? (
          <div className="flex items-center gap-2 glass rounded-xl p-4">
            <input
              type="date"
              value={newDayDate}
              onChange={e => setNewDayDate(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
            <button
              onClick={handleCreateDay}
              className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Day
            </button>
            <button
              onClick={() => setAddingDay(false)}
              className="text-sm text-gray-400 hover:text-gray-600 px-3 py-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingDay(true)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-black/[0.03] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Day
          </button>
        )}
      </div>

      {/* Days List */}
      <div className="space-y-6">
        {days.length === 0 && (
          <div className="text-center py-12 glass rounded-2xl">
            <p className="text-gray-400 text-sm">No days recorded yet. Add a day to get started.</p>
          </div>
        )}

        {days.map(day => {
          const isDayExpanded = expandedDays[day.date];
          const totalFrames = day.prototypes.reduce((sum, p) => sum + p.screenshots.length, 0);

          return (
            <div key={day.date} className="glass rounded-2xl overflow-hidden">
              {/* Day Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
                <button
                  onClick={() => toggleDay(day.date)}
                  className="flex items-center gap-3 hover:text-gray-900 transition-colors flex-1"
                >
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isDayExpanded ? 'rotate-90' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <h2 className="text-lg font-medium text-gray-900">{formatDate(day.date)}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {day.prototypes.length} {day.prototypes.length === 1 ? 'prototype' : 'prototypes'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {totalFrames} frames
                  </span>
                </button>

                <button
                  onClick={() => handleDeleteDay(day.date)}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Day
                </button>
              </div>

              {/* Day Content */}
              {isDayExpanded && (
                <div className="px-6 pb-5">
                  {/* Add Prototype Button */}
                  <div className="py-4 border-b border-black/5">
                    {addingPrototype === day.date ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedPrototypeId}
                          onChange={e => setSelectedPrototypeId(e.target.value)}
                          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 flex-1"
                        >
                          <option value="">Select a prototype...</option>
                          {registry.map(proto => (
                            <option key={proto.id} value={proto.id}>
                              {proto.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAddPrototype(day.date)}
                          className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setAddingPrototype(null);
                            setSelectedPrototypeId('');
                          }}
                          className="text-sm text-gray-400 hover:text-gray-600 px-2 py-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingPrototype(day.date)}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-black/[0.03] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Prototype
                      </button>
                    )}
                  </div>

                  {/* Prototypes */}
                  {day.prototypes.length === 0 && (
                    <p className="text-sm text-gray-400 py-6">No prototypes for this day. Add one to start uploading frames.</p>
                  )}

                  {day.prototypes.map(proto => {
                    const protoKey = `${day.date}-${proto.id}`;
                    const isProtoExpanded = expandedPrototypes[protoKey];

                    return (
                      <div key={proto.id} className="mb-5 last:mb-0 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <button
                            onClick={() => togglePrototype(day.date, proto.id)}
                            className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                          >
                            <svg
                              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isProtoExpanded ? 'rotate-90' : ''}`}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <h3 className="text-[1.1rem] font-bold text-gray-700">{proto.name}</h3>
                          </button>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              {proto.screenshots.length} {proto.screenshots.length === 1 ? 'frame' : 'frames'}
                            </span>
                            <input
                              ref={el => { fileInputRefs.current[protoKey] = el; }}
                              type="file"
                              multiple
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={e => handleUpload(day.date, proto.id, e.target.files)}
                            />
                            <button
                              onClick={() => fileInputRefs.current[protoKey]?.click()}
                              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-black/[0.03] transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Upload
                            </button>
                            <button
                              onClick={() => handleRemovePrototype(day.date, proto.id)}
                              className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Frame grid */}
                        {isProtoExpanded && (proto.screenshots.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
                            {proto.screenshots.map(shot => {
                              // Videos always span full width of the grid
                              // Images span based on aspect ratio: landscape = 2 cols, portrait = 1 col
                              const isVideoFile = isVideo(shot.filename);
                              const isLandscape = aspectRatios[shot.filename] === 'landscape';
                              const spanClass = isVideoFile ? 'col-span-full' : (isLandscape ? 'col-span-2' : 'col-span-1');

                              return isVideoFile ? (
                                <video
                                  key={shot.filename}
                                  src={`${API_BASE}${shot.path}`}
                                  onClick={() => setLightboxImage(shot)}
                                  onLoadedMetadata={(e) => handleVideoLoad(shot.filename, e)}
                                  className={`hover:opacity-90 transition-opacity cursor-pointer max-h-[600px] w-full object-contain ${spanClass}`}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                />
                              ) : (
                                <img
                                  key={shot.filename}
                                  src={`${API_BASE}${shot.path}`}
                                  alt={shot.originalName}
                                  onClick={() => setLightboxImage(shot)}
                                  onLoad={(e) => handleImageLoad(shot.filename, e)}
                                  className={`hover:opacity-90 transition-opacity cursor-pointer max-h-[600px] w-full object-contain ${spanClass}`}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center">
                            <p className="text-sm text-gray-400">No frames yet</p>
                            <button
                              onClick={() => fileInputRefs.current[protoKey]?.click()}
                              className="text-sm text-blue-500 hover:text-blue-600 mt-1"
                            >
                              Upload images or videos
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {isVideo(lightboxImage.filename) ? (
            <video
              src={`${API_BASE}${lightboxImage.path}`}
              className="max-w-full max-h-full object-contain"
              controls
              autoPlay
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={`${API_BASE}${lightboxImage.path}`}
              alt={lightboxImage.originalName}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
}
