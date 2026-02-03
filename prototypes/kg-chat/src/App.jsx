import React, { useState, useEffect } from 'react';

const API_BASE = '/api';

// The 7 domains of LifeOS with their query prompts
const DOMAINS = [
    {
        id: 'navigation_mobility',
        icon: '🚗',
        prompt: 'Navigate my world',
        query: 'Describe my locations, where I spend time, and how I move through my city. Include my home, workspace, and favorite spots.',
        apiDomains: ['locations', 'behaviors']
    },
    {
        id: 'communication_connection',
        icon: '💬',
        prompt: 'Explore my relationships',
        query: 'Tell me about the important people in my life, how I communicate with them, and my relationship patterns.',
        apiDomains: ['relationships', 'communications']
    },
    {
        id: 'entertainment_media',
        icon: '🎬',
        prompt: 'Discover my media preferences',
        query: 'What are my entertainment preferences? Describe my media consumption, the platforms I use, and my digital habits.',
        apiDomains: ['digitalHistory', 'behaviors']
    },
    {
        id: 'life_management',
        icon: '📋',
        prompt: 'Understand my schedule',
        query: 'How do I manage my life? Describe my daily schedule, temporal patterns, and organizational habits.',
        apiDomains: ['calendar', 'behaviors']
    },
    {
        id: 'work_career',
        icon: '💼',
        prompt: 'Review my work patterns',
        query: 'Describe my work and career. Include my occupation, productivity patterns, tools I use, and professional aspirations.',
        apiDomains: ['identity', 'behaviors']
    },
    {
        id: 'health_wellness',
        icon: '💓',
        prompt: 'Check my wellbeing',
        query: 'What does my health and wellness look like? Include my exercise patterns, sleep habits, stress indicators, and energy cycles.',
        apiDomains: ['health', 'behaviors']
    },
    {
        id: 'personal_fulfillment',
        icon: '✨',
        prompt: 'Reflect on who I am',
        query: 'Who am I? Describe my personality, values, aspirations, and what matters most to me in life.',
        apiDomains: ['identity', 'relationships']
    }
];

function App() {
    const [identity, setIdentity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [queryLoading, setQueryLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [customQuery, setCustomQuery] = useState('');
    const [error, setError] = useState(null);

    // Load identity data on mount
    useEffect(() => {
        async function loadIdentity() {
            try {
                const res = await fetch(`${API_BASE}/context/identity`);
                if (!res.ok) throw new Error('Failed to load identity');
                const data = await res.json();
                setIdentity(data);
            } catch (err) {
                console.error('Error loading identity:', err);
                setError('Failed to connect to LifeOS. Make sure the backend server is running.');
            } finally {
                setLoading(false);
            }
        }
        loadIdentity();
    }, []);

    // Generate intro paragraph based on identity
    const generateIntro = () => {
        if (!identity) return null;
        const { basics, personality, life_stage } = identity;
        return `You are ${basics.name}, a ${basics.age}-year-old ${basics.occupation.primary.toLowerCase()} living in ${basics.location.neighborhood}, ${basics.location.city}. ${personality.summary} Right now, you're navigating ${life_stage.major_pressures[0].toLowerCase()} while aspiring toward ${life_stage.aspirations[0].toLowerCase()}.`;
    };

    // Handle domain selection
    const handleDomainClick = async (domain) => {
        setError(null);
        setQueryLoading(true);
        setResponse(null);

        try {
            const res = await fetch(`${API_BASE}/llm/kg-query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: domain.query,
                    domains: domain.apiDomains
                })
            });

            if (!res.ok) {
                throw new Error('Query failed');
            }

            const data = await res.json();
            setResponse({
                query: domain.prompt,
                text: data.text,
                isStub: data.stub
            });
        } catch (err) {
            console.error('Query error:', err);
            setError('Failed to get response. Make sure the backend server is running.');
        } finally {
            setQueryLoading(false);
        }
    };

    // Handle custom query submission
    const handleCustomQuery = async (e) => {
        e.preventDefault();
        if (!customQuery.trim()) return;

        setError(null);
        setQueryLoading(true);
        setResponse(null);

        try {
            const res = await fetch(`${API_BASE}/llm/kg-query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: customQuery,
                    domains: ['all']
                })
            });

            if (!res.ok) {
                throw new Error('Query failed');
            }

            const data = await res.json();
            setResponse({
                query: customQuery,
                text: data.text,
                isStub: data.stub
            });
            setCustomQuery('');
        } catch (err) {
            console.error('Query error:', err);
            setError('Failed to get response. Make sure the backend server is running.');
        } finally {
            setQueryLoading(false);
        }
    };

    return (
        <div className="app-container">
            {/* Header */}
            <header className="header">
                <div className="header-badge">
                    <span>🧠</span>
                    <span>LifeOS Knowledge Graph</span>
                </div>
                <h1>Your Personal Context</h1>
            </header>

            {/* Intro Section */}
            <section className="intro">
                {loading ? (
                    <p className="loading">Loading your profile...</p>
                ) : error && !identity ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <p>{generateIntro()}</p>
                )}
            </section>

            {/* Domain Options */}
            <section className="domains-section">
                <p className="domains-label">Explore a domain</p>
                <div className="domains-grid">
                    {DOMAINS.map((domain) => (
                        <button
                            key={domain.id}
                            className="domain-btn"
                            onClick={() => handleDomainClick(domain)}
                            disabled={queryLoading || loading}
                        >
                            <span className="domain-icon">{domain.icon}</span>
                            <span className="domain-text">{domain.prompt}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Custom Query Input */}
            <section className="query-section">
                <p className="query-label">Or ask anything</p>
                <form className="query-input-wrapper" onSubmit={handleCustomQuery}>
                    <input
                        type="text"
                        className="query-input"
                        placeholder="Ask about your knowledge graph..."
                        value={customQuery}
                        onChange={(e) => setCustomQuery(e.target.value)}
                        disabled={queryLoading || loading}
                    />
                    <button
                        type="submit"
                        className="query-submit"
                        disabled={queryLoading || loading || !customQuery.trim()}
                    >
                        {queryLoading ? '...' : 'Ask'}
                    </button>
                </form>
            </section>

            {/* Response Section */}
            {(response || queryLoading || error) && (
                <section className="response-section">
                    <div className="response-container">
                        <div className="response-header">
                            <div className="response-icon">🤖</div>
                            <span className="response-title">
                                {response?.query || 'Thinking...'}
                            </span>
                        </div>
                        <div className="response-body">
                            {queryLoading ? (
                                <p className="response-text loading">
                                    <span className="loading-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </span>
                                    Querying your knowledge graph...
                                </p>
                            ) : error ? (
                                <p className="error-message">{error}</p>
                            ) : (
                                <p className="response-text">{response?.text}</p>
                            )}
                            {response?.isStub && (
                                <p className="response-text" style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.5 }}>
                                    Note: This is a stub response. Set ANTHROPIC_API_KEY for full LLM responses.
                                </p>
                            )}
                        </div>
                    </div>
                    {response && !queryLoading && (
                        <button className="clear-btn" onClick={() => setResponse(null)}>
                            Clear response
                        </button>
                    )}
                </section>
            )}
        </div>
    );
}

export default App;
