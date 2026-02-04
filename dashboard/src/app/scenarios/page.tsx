'use client';

import { useEffect, useState, useRef } from 'react';
import {
  fetchConversations,
  createConversation,
  fetchConversation,
  sendMessage,
  deleteConversation,
  type Conversation,
  type ConversationSummary,
  type ConversationMessage,
} from '@/lib/api';

export default function ScenariosPage() {
  // Conversation list state
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Active conversation state
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(false);

  // Message input state
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversation list on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [inputValue]);

  async function loadConversations() {
    try {
      const data = await fetchConversations();
      setConversations(data.conversations);
    } catch (e) {
      console.error('Failed to load conversations:', e);
    } finally {
      setLoadingList(false);
    }
  }

  async function handleNewConversation() {
    try {
      const conversation = await createConversation();
      setConversations((prev) => [
        {
          id: conversation.id,
          title: conversation.title,
          created_at: conversation.created_at,
          updated_at: conversation.updated_at,
          message_count: 0,
        },
        ...prev,
      ]);
      setActiveConversation(conversation);
      inputRef.current?.focus();
    } catch (e) {
      console.error('Failed to create conversation:', e);
    }
  }

  async function handleSelectConversation(id: string) {
    if (activeConversation?.id === id) return;

    setLoadingConversation(true);
    try {
      const conversation = await fetchConversation(id);
      setActiveConversation(conversation);
    } catch (e) {
      console.error('Failed to load conversation:', e);
    } finally {
      setLoadingConversation(false);
    }
  }

  async function handleDeleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;

    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversation?.id === id) {
        setActiveConversation(null);
      }
    } catch (e) {
      console.error('Failed to delete conversation:', e);
    }
  }

  async function handleSendMessage() {
    if (!inputValue.trim() || !activeConversation || sending) return;

    const content = inputValue.trim();
    setInputValue('');
    setSending(true);

    // Optimistically add user message
    const tempUserMessage: ConversationMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setActiveConversation((prev) =>
      prev ? { ...prev, messages: [...prev.messages, tempUserMessage] } : null
    );

    try {
      const response = await sendMessage(activeConversation.id, content);

      // Update with actual response
      setActiveConversation((prev) => {
        if (!prev) return null;
        // Replace the optimistic user message and add assistant response
        const messagesWithoutOptimistic = prev.messages.slice(0, -1);
        return {
          ...prev,
          title: response.conversation.title,
          updated_at: response.conversation.updated_at,
          messages: [
            ...messagesWithoutOptimistic,
            response.userMessage,
            response.assistantMessage,
          ],
        };
      });

      // Update conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
              ...c,
              title: response.conversation.title,
              updated_at: response.conversation.updated_at,
              message_count: c.message_count + 2,
            }
            : c
        ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      );
    } catch (e) {
      console.error('Failed to send message:', e);
      // Revert optimistic update
      setActiveConversation((prev) =>
        prev ? { ...prev, messages: prev.messages.slice(0, -1) } : null
      );
      setInputValue(content);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
      {/* Conversation List Sidebar */}
      <div className="w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Scenario
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No conversations yet.
              <br />
              Start a new scenario to begin.
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group ${activeConversation?.id === conv.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {conv.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatTime(conv.updated_at)} · {conv.message_count} messages
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                      title="Delete conversation"
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

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-gray-900 dark:text-gray-100">
                  {activeConversation.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    World v{activeConversation.context.world_version}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    {activeConversation.context.pkg_domains.length} PKG domains
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingConversation ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                </div>
              ) : activeConversation.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-sm">Start by describing a scenario...</p>
                    <p className="text-xs mt-2 text-gray-400">
                      e.g., "Marcus is in focus mode when Emma texts him about dinner plans"
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {activeConversation.messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                  {sending && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center flex-shrink-0">
                        <span className="text-sky-600 dark:text-sky-400 text-sm font-medium">L</span>
                      </div>
                      <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">Generating scenario...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe a scenario to explore..."
                  className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  rows={1}
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || sending}
                  className="px-4 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Scenario Explorer
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                Generate speculative scenarios grounded in the LifeOS world canon and Marcus's personal knowledge graph.
              </p>
              <button
                onClick={handleNewConversation}
                className="mt-6 px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                Start New Scenario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Chat Message Component
function ChatMessage({ message }: { message: ConversationMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
            ? 'bg-gray-200 dark:bg-gray-600'
            : 'bg-sky-100 dark:bg-sky-900'
          }`}
      >
        <span
          className={`text-sm font-medium ${isUser
              ? 'text-gray-600 dark:text-gray-300'
              : 'text-sky-600 dark:text-sky-400'
            }`}
        >
          {isUser ? 'Y' : 'L'}
        </span>
      </div>
      <div
        className={`flex-1 rounded-lg p-4 ${isUser
            ? 'bg-sky-600 text-white'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          }`}
      >
        <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'dark:prose-invert'}`}>
          {isUser ? (
            <p className="m-0">{message.content}</p>
          ) : (
            <MessageContent content={message.content} />
          )}
        </div>
      </div>
    </div>
  );
}

// Render markdown-like content for assistant messages
function MessageContent({ content }: { content: string }) {
  // Simple markdown-like rendering
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];

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
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
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

  return <>{elements}</>;
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
