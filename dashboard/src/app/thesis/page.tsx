'use client';

import { useEffect, useState } from 'react';
import { fetchThesis, updateThesis } from '@/lib/api';

interface Thesis {
  id: string;
  name: string;
  description: string;
  problem_statement: string;
  diagnosis: string;
  solution: {
    name: string;
    summary: string;
  };
  core_tension: {
    summary: string;
    statement: string;
  };
  scope_and_limitations: string;
  contributions: Array<{ id: string; name: string; description: string }>;
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleSave(field, editValue)}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
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

export default function ThesisPage() {
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchThesis()
      .then(setThesis)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (field: string, value: string) => {
    if (!thesis) return;

    const updated = { ...thesis };
    const parts = field.split('.');
    let current: any = updated;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;

    try {
      const result = await updateThesis(updated);
      setThesis(result);
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

  if (!thesis) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{thesis.name}</h1>
        <p className="text-gray-500 mt-1">{thesis.description}</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Problem Statement */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Problem Statement</h2>
          <EditableText 
            field="problem_statement" 
            value={thesis.problem_statement || ''} 
            multiline 
            editing={editing}
            editValue={editValue}
            setEditValue={setEditValue}
            handleSave={handleSave}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
          />
        </div>

        {/* Diagnosis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis</h2>
          <EditableText 
            field="diagnosis" 
            value={thesis.diagnosis || ''} 
            multiline 
            editing={editing}
            editValue={editValue}
            setEditValue={setEditValue}
            handleSave={handleSave}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
          />
        </div>

        {/* Solution */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-2">Solution ({thesis.solution?.name})</h2>
          <EditableText 
            field="solution.summary" 
            value={thesis.solution?.summary || ''} 
            multiline 
            editing={editing}
            editValue={editValue}
            setEditValue={setEditValue}
            handleSave={handleSave}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
          />
        </div>

        {/* Core Tension */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 p-6">
          <h2 className="text-lg font-semibold text-orange-900 mb-4">Core Tension</h2>
          <div className="mb-4">
            <EditableText 
              field="core_tension.summary" 
              value={thesis.core_tension?.summary || ''} 
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
              value={thesis.core_tension?.statement || ''} 
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

        {/* Scope and Limitations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-indigo-900 mb-4">Thesis Scope and Limitations</h2>
          <EditableText 
            field="scope_and_limitations" 
            value={thesis.scope_and_limitations || ''} 
            multiline 
            editing={editing}
            editValue={editValue}
            setEditValue={setEditValue}
            handleSave={handleSave}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
          />
        </div>

        {/* Contributions */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
          <h2 className="text-lg font-semibold text-indigo-900 mb-4">Thesis Contribution</h2>
          <div className="space-y-4">
            {thesis.contributions?.map((item, index) => (
              <div key={item.id} className="bg-white rounded-lg border border-indigo-200 p-5">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-indigo-900 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
