import React, { useState, useEffect, useRef } from 'react';

const API_BASE = '/api';

const CORRECTION_TYPES = [
    { value: 'voice_too_generic', label: 'Too generic / sounds like AI' },
    { value: 'wrong_opinion', label: 'Wrong opinion' },
    { value: 'wrong_knowledge', label: 'Wrong knowledge' },
    { value: 'too_formal', label: 'Too formal' },
    { value: 'too_casual', label: 'Too casual' },
    { value: 'missing_context', label: 'Missing context' },
    { value: 'other', label: 'Other' }
];

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [pkgVersion, setPkgVersion] = useState('compact');
    const [tokenUsage, setTokenUsage] = useState(null);
    const [error, setError] = useState(null);
    const [corrections, setCorrections] = useState({});
    const messagesEndRef = useRef(null);

    // Auto-scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setError(null);

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        const userInputValue = input; // save for request body

        // Add placeholder assistant message for streaming
        const streamingMessages = [...newMessages, { role: 'assistant', content: '' }];
        setMessages(streamingMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/llm/digital-twin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userInputValue,
                    history: newMessages,
                    pkg_version: pkgVersion
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from digital twin');
            }

            // Check if we got SSE or JSON (stub fallback)
            const contentType = response.headers.get('Content-Type') || '';
            if (!contentType.includes('text/event-stream')) {
                // Stub path: parse JSON as before
                const data = await response.json();
                const twinMessage = { role: 'assistant', content: data.text };
                setMessages([...newMessages, twinMessage]);
                setTokenUsage(data.usage || null);
                return;
            }

            // SSE streaming path
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // last line may be incomplete

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const jsonStr = line.slice(6).trim();
                    if (!jsonStr) continue;

                    let event;
                    try {
                        event = JSON.parse(jsonStr);
                    } catch {
                        continue;
                    }

                    if (event.type === 'delta') {
                        setMessages(prev => {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                ...updated[updated.length - 1],
                                content: updated[updated.length - 1].content + event.text
                            };
                            return updated;
                        });
                    } else if (event.type === 'done') {
                        setTokenUsage(event.usage);
                    } else if (event.type === 'error') {
                        setError('Stream error: ' + event.message);
                    }
                }
            }

        } catch (err) {
            console.error('Error:', err);
            setError('Failed to connect to digital twin. Make sure the backend server is running.');
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    const toggleCorrection = (idx) => {
        setCorrections(prev => ({
            ...prev,
            [idx]: {
                open: !prev[idx]?.open,
                text: prev[idx]?.text || '',
                type: prev[idx]?.type || 'other',
                submitting: false,
                submitted: prev[idx]?.submitted || false
            }
        }));
    };

    const submitCorrection = async (idx, msg) => {
        const corrState = corrections[idx];
        if (!corrState?.text?.trim()) return;

        setCorrections(prev => ({
            ...prev,
            [idx]: { ...prev[idx], submitting: true }
        }));

        const precedingUserMsg = messages.slice(0, idx).reverse().find(m => m.role === 'user');

        try {
            await fetch(`${API_BASE}/llm/digital-twin/corrections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message_index: idx,
                    original_response: msg.content,
                    correction: corrState.text,
                    correction_type: corrState.type,
                    user_message: precedingUserMsg?.content || '',
                    pkg_version: pkgVersion
                })
            });

            setCorrections(prev => ({
                ...prev,
                [idx]: { ...prev[idx], submitted: true, open: false, submitting: false }
            }));
        } catch (err) {
            console.error('Correction submit error:', err);
            setCorrections(prev => ({
                ...prev,
                [idx]: { ...prev[idx], submitting: false }
            }));
        }
    };

    const togglePkgVersion = (version) => {
        setPkgVersion(version);
        // Clear messages when switching versions to start fresh
        setMessages([]);
        setTokenUsage(null);
        setCorrections({});
    };

    return (
        <div className="app-container">
            {/* Header */}
            <header className="header">
                <div className="header-badge">
                    <span>🧬</span>
                    <span>Digital Twin</span>
                </div>
                <h1>Chat with Chris</h1>

                <div className="header-controls">
                    <div className="pkg-version-toggle">
                        <button
                            className={`toggle-btn ${pkgVersion === 'compact' ? 'active' : ''}`}
                            onClick={() => togglePkgVersion('compact')}
                        >
                            Compact PKG
                        </button>
                        <button
                            className={`toggle-btn ${pkgVersion === 'full' ? 'active' : ''}`}
                            onClick={() => togglePkgVersion('full')}
                        >
                            Full PKG
                        </button>
                    </div>
                    {tokenUsage && (
                        <div className="token-display">
                            📊 {tokenUsage.input_tokens + tokenUsage.output_tokens} tokens
                        </div>
                    )}
                </div>
            </header>

            {/* Messages */}
            <div className={`messages-container ${messages.length === 0 ? 'empty' : ''}`}>
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <h2>Start a conversation</h2>
                        <p>Ask about Chris's thoughts, experiences, or perspectives.</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.6 }}>
                            Using {pkgVersion === 'compact' ? 'compact' : 'full'} PKG
                        </p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role}`}>
                            <div className="message-content">
                                {msg.content}
                            </div>
                            {msg.role === 'assistant' && (
                                <div className="correction-zone">
                                    {corrections[idx]?.submitted ? (
                                        <span className="correction-badge" title="Correction logged">✓ noted</span>
                                    ) : (
                                        <button
                                            className={`thumbs-down-btn ${corrections[idx]?.open ? 'active' : ''}`}
                                            onClick={() => toggleCorrection(idx)}
                                            title="Flag this response"
                                            aria-label="Flag response as inaccurate"
                                        >
                                            👎
                                        </button>
                                    )}
                                    {corrections[idx]?.open && (
                                        <div className="correction-panel">
                                            <textarea
                                                className="correction-input"
                                                placeholder="What was wrong? What should it have said?"
                                                value={corrections[idx]?.text || ''}
                                                onChange={(e) => setCorrections(prev => ({
                                                    ...prev,
                                                    [idx]: { ...prev[idx], text: e.target.value }
                                                }))}
                                                rows={3}
                                                autoFocus
                                            />
                                            <div className="correction-footer">
                                                <select
                                                    className="correction-type-select"
                                                    value={corrections[idx]?.type || 'other'}
                                                    onChange={(e) => setCorrections(prev => ({
                                                        ...prev,
                                                        [idx]: { ...prev[idx], type: e.target.value }
                                                    }))}
                                                >
                                                    {CORRECTION_TYPES.map(t => (
                                                        <option key={t.value} value={t.value}>{t.label}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    className="correction-submit-btn"
                                                    onClick={() => submitCorrection(idx, msg)}
                                                    disabled={corrections[idx]?.submitting || !corrections[idx]?.text?.trim()}
                                                >
                                                    {corrections[idx]?.submitting ? 'Saving...' : 'Log correction'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}

                {loading && messages[messages.length - 1]?.content === '' && (
                    <div className="message twin">
                        <div className="message-content message-loading">
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                        </div>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
                <form className="input-wrapper" onSubmit={handleSendMessage}>
                    <textarea
                        className="message-input"
                        placeholder="Ask anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        disabled={loading}
                        rows="1"
                        style={{ minHeight: '48px' }}
                    />
                    <button
                        type="submit"
                        className="send-btn"
                        disabled={loading || !input.trim()}
                    >
                        <span>{loading ? '⏳' : '→'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default App;
