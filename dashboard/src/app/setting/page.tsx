'use client';

import { useEffect, useState } from 'react';
import { fetchSetting, updateSetting } from '@/lib/api';

interface Setting {
  id: string;
  name: string;
  description: string;
  context: {
    year: number;
    summary: string;
    technological_landscape: Array<{ id: string; name: string; description: string }>;
    design_constraint: string;
  };
  problem_statement: {
    summary: string;
    diagnosis: string;
    pain_points: Array<{ id: string; name: string; description: string }>;
  };
  solution: {
    name: string;
    summary: string;
    capabilities: Array<{ id: string; name: string; description: string }>;
    implication: string;
  };
  core_tension: {
    summary: string;
    statement: string;
  };
}

interface EditableTextProps {
  field: string;
  value: string;
  multiline?: boolean;
  editing: string | null;
  editValue: string;
  setEditValue: (value: string) => void;
  handleSave: (field: string, value: string) => void;
  startEditing: (field: string, currentValue: string) => void;
  cancelEditing: () => void;
}

function EditableText({ field, value, multiline = false, editing, editValue, setEditValue, handleSave, startEditing, cancelEditing }: EditableTextProps) {
  const isEditing = editing === field;

  if (isEditing) {
    return (
      <div className="mt-2">
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleSave(field, editValue)}
            className="px-3 py-1 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            Save
          </button>
          <button
            onClick={cancelEditing}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => startEditing(field, value)}
      className="cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded transition-colors group"
    >
      <p className="text-gray-700 whitespace-pre-wrap">{value}</p>
      <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 ml-2">Click to edit</span>
    </div>
  );
}

export default function SettingPage() {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchSetting()
      .then(setSetting)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (field: string, value: string) => {
    if (!setting) return;

    const updated = { ...setting };
    const parts = field.split('.');
    let current: any = updated;

    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;

    try {
      const result = await updateSetting(updated);
      setSetting(result);
      setEditing(null);
    } catch (e) {
      alert('Failed to save changes');
    }
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditing(field);
    setEditValue(currentValue);
  };

  const cancelEditing = () => {
    setEditing(null);
    setEditValue('');
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!setting) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{setting.name}</h1>
        <p className="text-gray-500 mt-1">{setting.description}</p>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* World Context */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">World Context</h2>

            <div className="mb-6">
              <div className="text-5xl font-bold text-sky-600 mb-2">{setting.context.year}</div>
              <EditableText 
                field="context.summary" 
                value={setting.context.summary} 
                multiline 
                editing={editing}
                editValue={editValue}
                setEditValue={setEditValue}
                handleSave={handleSave}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Technological Landscape
              </h3>
              <div className="space-y-3">
                {setting.context.technological_landscape?.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Design Constraint
              </h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <EditableText 
                  field="context.design_constraint" 
                  value={setting.context.design_constraint} 
                  multiline 
                  editing={editing}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  handleSave={handleSave}
                  startEditing={startEditing}
                  cancelEditing={cancelEditing}
                />
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Problem Statement</h2>

            <div className="mb-6">
              <EditableText 
                field="problem_statement.summary" 
                value={setting.problem_statement.summary} 
                multiline 
                editing={editing}
                editValue={editValue}
                setEditValue={setEditValue}
                handleSave={handleSave}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Diagnosis
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <EditableText 
                  field="problem_statement.diagnosis" 
                  value={setting.problem_statement.diagnosis} 
                  multiline 
                  editing={editing}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  handleSave={handleSave}
                  startEditing={startEditing}
                  cancelEditing={cancelEditing}
                />
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Pain Points
            </h3>
            <div className="space-y-3">
              {setting.problem_statement.pain_points?.map((item) => (
                <div key={item.id} className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <h4 className="font-medium text-red-900">{item.name}</h4>
                  <p className="text-sm text-red-700 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Solution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Solution: {setting.solution?.name}</h2>
            <p className="text-gray-600 mb-6">{setting.solution?.summary}</p>

            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Capabilities
            </h3>
            <div className="space-y-3 mb-6">
              {setting.solution?.capabilities?.map((item) => (
                <div key={item.id} className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <h4 className="font-medium text-green-900">{item.name}</h4>
                  <p className="text-sm text-green-700 mt-1">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-green-100 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 uppercase tracking-wide mb-2">
                Implication
              </h3>
              <EditableText 
                field="solution.implication" 
                value={setting.solution?.implication || ''} 
                multiline 
                editing={editing}
                editValue={editValue}
                setEditValue={setEditValue}
                handleSave={handleSave}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
              />
            </div>
          </div>

          {/* Core Tension */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 p-6">
            <h2 className="text-lg font-semibold text-orange-900 mb-4">Core Tension</h2>

            <div className="mb-4">
              <EditableText 
                field="core_tension.summary" 
                value={setting.core_tension?.summary || ''} 
                multiline 
                editing={editing}
                editValue={editValue}
                setEditValue={setEditValue}
                handleSave={handleSave}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
              />
            </div>

            <div className="bg-white/50 rounded-lg p-4 border border-orange-200">
              <EditableText 
                field="core_tension.statement" 
                value={setting.core_tension?.statement || ''} 
                multiline 
                editing={editing}
                editValue={editValue}
                setEditValue={setEditValue}
                handleSave={handleSave}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
