'use client';

import { useEffect, useState } from 'react';
import { fetchOpenQuestions, createOpenQuestion, updateOpenQuestion, deleteOpenQuestion } from '@/lib/api';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Question {
  id: string;
  name: string;
  status: string;
  domain: string;
  question: string;
  notes: string;
  created: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ name: '', question: '', domain: 'architecture', notes: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    fetchOpenQuestions()
      .then((data) => setQuestions(data.questions))
      .finally(() => setLoading(false));
  };

  const handleCreate = async () => {
    try {
      await createOpenQuestion(newQuestion);
      setShowCreate(false);
      setNewQuestion({ name: '', question: '', domain: 'architecture', notes: '' });
      loadQuestions();
    } catch (e) {
      alert('Failed to create question');
    }
  };

  const handleStatusChange = async (q: Question, newStatus: string) => {
    try {
      await updateOpenQuestion(q.id, { ...q, status: newStatus });
      loadQuestions();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleNotesUpdate = async (q: Question, newNotes: string) => {
    try {
      await updateOpenQuestion(q.id, { ...q, notes: newNotes });
      setEditingId(null);
      loadQuestions();
    } catch (e) {
      alert('Failed to update notes');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteOpenQuestion(deleteConfirm);
      setDeleteConfirm(null);
      loadQuestions();
    } catch (e) {
      alert('Failed to delete question');
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const openQuestions = questions.filter((q) => q.status === 'open');
  const resolvedQuestions = questions.filter((q) => q.status !== 'open');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Open Questions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Unresolved design questions to explore through scenarios</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-lifeos-600 text-white rounded-lg hover:bg-lifeos-700 transition-colors"
        >
          + New Question
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Add Open Question</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
                <input
                  type="text"
                  value={newQuestion.name}
                  onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })}
                  placeholder="e.g., Multi-user Mode Conflicts"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lifeos-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Domain</label>
                <select
                  value={newQuestion.domain}
                  onChange={(e) => setNewQuestion({ ...newQuestion, domain: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lifeos-500"
                >
                  <option value="architecture">Architecture</option>
                  <option value="modes">Modes</option>
                  <option value="intents">Intents</option>
                  <option value="constitution">Constitution</option>
                  <option value="devices">Devices</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Question</label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="The specific design question to explore..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lifeos-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Notes</label>
                <textarea
                  value={newQuestion.notes}
                  onChange={(e) => setNewQuestion({ ...newQuestion, notes: e.target.value })}
                  placeholder="Context, candidate approaches, etc..."
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
                disabled={!newQuestion.name || !newQuestion.question}
                className="px-4 py-2 bg-lifeos-600 text-white rounded-lg hover:bg-lifeos-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open Questions */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Open ({openQuestions.length})
        </h2>
        <div className="space-y-4">
          {openQuestions.map((q) => (
            <div key={q.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      {q.id}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      {q.domain}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-2">{q.name}</h3>
                  <p className="text-gray-700 dark:text-gray-200 mt-2">{q.question}</p>

                  {/* Notes */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    {editingId === q.id ? (
                      <div>
                        <textarea
                          defaultValue={q.notes}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lifeos-500"
                          id={`notes-${q.id}`}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => {
                              const textarea = document.getElementById(`notes-${q.id}`) as HTMLTextAreaElement;
                              handleNotesUpdate(q, textarea.value);
                            }}
                            className="px-3 py-1 text-sm bg-lifeos-600 text-white rounded hover:bg-lifeos-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => setEditingId(q.id)}
                        className="cursor-pointer hover:bg-gray-50 dark:bg-gray-700 p-2 -m-2 rounded"
                      >
                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Notes</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {q.notes || <span className="italic text-gray-400">Click to add notes...</span>}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteConfirm(q.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-200 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleStatusChange(q, 'resolved')}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-4">Created: {q.created}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolved Questions */}
      {resolvedQuestions.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
            Resolved ({resolvedQuestions.length})
          </h2>
          <div className="space-y-4">
            {resolvedQuestions.map((q) => (
              <div key={q.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 p-6 opacity-75">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {q.id}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mt-2">{q.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{q.question}</p>
                  </div>
                  <button
                    onClick={() => handleStatusChange(q, 'open')}
                    className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-white"
                  >
                    Reopen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="Delete Question"
          message="Are you sure you want to delete this question? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
          severity="warning"
        />
      )}
    </div>
  );
}
