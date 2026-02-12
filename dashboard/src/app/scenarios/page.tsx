'use client';

import { useEffect, useState } from 'react';
import {
  fetchScenarios,
  fetchScenario,
  deleteScenario,
  type Scenario,
  type ScenarioSummary,
} from '@/lib/api';

export default function ScenariosPage() {
  // Scenario list state
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [loadingScenarios, setLoadingScenarios] = useState(false);

  // Active scenario state
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [loadingScenario, setLoadingScenario] = useState(false);

  // Load scenarios on mount
  useEffect(() => {
    loadScenarios();
  }, []);

  async function loadScenarios() {
    setLoadingScenarios(true);
    try {
      const data = await fetchScenarios();
      setScenarios(data.scenarios);
    } catch (e) {
      console.error('Failed to load scenarios:', e);
    } finally {
      setLoadingScenarios(false);
    }
  }

  async function handleSelectScenario(id: string) {
    if (activeScenario?.id === id) return;

    setLoadingScenario(true);
    try {
      const scenario = await fetchScenario(id);
      setActiveScenario(scenario);
    } catch (e) {
      console.error('Failed to load scenario:', e);
    } finally {
      setLoadingScenario(false);
    }
  }

  async function handleDeleteScenario(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Delete this scenario?')) return;

    try {
      await deleteScenario(id);
      setScenarios((prev) => prev.filter((s) => s.id !== id));
      if (activeScenario?.id === id) {
        setActiveScenario(null);
      }
    } catch (e) {
      console.error('Failed to delete scenario:', e);
    }
  }

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <div className="h-screen flex">
      {/* Scenario List Sidebar */}
      <div className="w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Scenarios
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            YAML-based design artifacts
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingScenarios ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : scenarios.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No scenarios yet.
              <br />
              <br />
              Scenarios are YAML-based design artifacts extracted from conversations.
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  onClick={() => handleSelectScenario(scenario.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group ${activeScenario?.id === scenario.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {scenario.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatTime(scenario.updated_at)} · {scenario.status}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteScenario(scenario.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                      title="Delete scenario"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {activeScenario ? (
          <ScenarioViewer scenario={activeScenario} loading={loadingScenario} />
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Scenarios
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                View and manage YAML-based scenario artifacts extracted from conversations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Scenario Viewer Component
function ScenarioViewer({ scenario, loading }: { scenario: Scenario; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {scenario.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                {scenario.status}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                World v{scenario.context.world_version}
              </span>
              {scenario.metadata.setting && (
                <>
                  <span>{scenario.metadata.setting.date}</span>
                  <span>{scenario.metadata.setting.time}</span>
                  <span>{scenario.metadata.setting.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
        {/* Design Questions */}
        {scenario.metadata.design_questions && scenario.metadata.design_questions.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
              Design Questions
            </h3>
            <ul className="space-y-2">
              {scenario.metadata.design_questions.map((q, i) => (
                <li key={i} className="text-sm text-amber-800 dark:text-amber-300">
                  • {q}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scenario Content */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <MessageContent content={scenario.content} />
        </div>

        {/* Notes */}
        {scenario.notes && scenario.notes.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Notes
            </h3>
            <ul className="space-y-2">
              {scenario.notes.map((note, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                  • {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Render markdown-like content for scenario content
function MessageContent({ content }: { content: string }) {
  // Simple markdown-like rendering
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];
  let tableIndex = 0;

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="bg-gray-100 dark:bg-gray-700 rounded p-3 overflow-x-auto text-sm">
            <code>{codeContent.join('\n')}</code>
          </pre>
        );
        codeContent = [];
      }
      inCodeBlock = !inCodeBlock;
      inTable = false; // Exit table mode if in code block
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    // Detect table rows (lines with | separators)
    const isTableRow = line.trim().includes('|') && line.trim().split('|').length > 2;
    const isTableSeparator = /^\s*\|[\s\-:]+\|/.test(line.trim());

    if (isTableRow || isTableSeparator) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      if (!isTableSeparator) {
        tableRows.push(line);
      }
      return;
    } else if (inTable) {
      // End of table - render it
      if (tableRows.length > 0) {
        elements.push(renderTable(tableRows, tableIndex++));
        tableRows = [];
      }
      inTable = false;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h4 key={i} className="font-semibold mt-4 mb-2">{line.slice(4)}</h4>);
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i} className="font-bold mt-4 mb-2 text-lg">{line.slice(3)}</h3>);
    } else if (line.startsWith('# ')) {
      elements.push(<h2 key={i} className="font-bold mt-4 mb-2 text-xl">{line.slice(2)}</h2>);
    }
    // Horizontal rule
    else if (line === '---') {
      elements.push(<hr key={i} className="my-4 border-gray-200 dark:border-gray-600" />);
    }
    // List items
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 ml-2">
          <span className="text-gray-400">•</span>
          <span>{renderInlineFormatting(line.slice(2))}</span>
        </div>
      );
    }
    // Bold/italic text and regular paragraphs
    else if (line.trim()) {
      elements.push(<p key={i} className="mb-2">{renderInlineFormatting(line)}</p>);
    }
    // Empty lines
    else {
      elements.push(<div key={i} className="h-2" />);
    }
  });

  // Render any remaining table
  if (inTable && tableRows.length > 0) {
    elements.push(renderTable(tableRows, tableIndex));
  }

  return <>{elements}</>;
}

// Render a markdown table
function renderTable(rows: string[], key: number): React.ReactNode {
  if (rows.length === 0) return null;

  const parsedRows = rows.map(row => {
    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
    return cells;
  });

  if (parsedRows.length === 0) return null;

  const headerRow = parsedRows[0];
  const dataRows = parsedRows.slice(1);

  return (
    <div key={`table-${key}`} className="my-4 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            {headerRow.map((cell, i) => (
              <th key={i} className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-semibold">
                {renderInlineFormatting(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white dark:bg-gray-900">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm">
                  {renderInlineFormatting(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Render inline formatting (bold, italic)
function renderInlineFormatting(text: string): React.ReactNode {
  // Handle **bold** and *italic*
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    // Bold (must have both opening and closing **)
    const boldMatch = remaining.match(/\*\*([^*]+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(remaining.slice(0, boldMatch.index));
      }
      parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }

    // Italic (must have both opening and closing *, but not **)
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+?)\*(?!\*)/);
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) {
        parts.push(remaining.slice(0, italicMatch.index));
      }
      parts.push(<em key={key++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
      continue;
    }

    // No more matches - add remaining text as-is
    parts.push(remaining);
    break;
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
