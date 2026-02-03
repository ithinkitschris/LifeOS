import React, { useState, useEffect } from 'react';
import { useLifeOS } from './hooks/useLifeOS';
import './App.css';

/**
 * LifeOS Prototype Template
 * 
 * This is a starting point for building LifeOS prototypes.
 * It demonstrates how to:
 * - Connect to the LifeOS backend API
 * - Fetch context from the knowledge graph
 * - Display mode information
 * - Generate natural language explanations
 * 
 * Copy this template folder to /prototypes/active/your-prototype-name
 * and modify as needed.
 */

function App() {
  const { 
    loading, 
    error, 
    identity, 
    modes, 
    currentMode,
    setCurrentMode,
    getModeExplanation,
    getContext 
  } = useLifeOS();
  
  const [modeExplanation, setModeExplanation] = useState('');
  const [contextData, setContextData] = useState(null);

  // Fetch mode explanation when mode changes
  useEffect(() => {
    if (currentMode) {
      getModeExplanation(currentMode, 'entry', 'manual')
        .then(setModeExplanation)
        .catch(console.error);
    }
  }, [currentMode]);

  // Handle mode selection
  const handleModeSelect = async (modeId) => {
    setCurrentMode(modeId);
    
    // Fetch relevant context for the mode
    const context = await getContext(modeId);
    setContextData(context);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading LifeOS...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <p className="hint">Make sure the backend is running: <code>cd backend && npm start</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">LifeOS</h1>
          <span className="user-name">{identity?.basics?.name || 'User'}</span>
        </div>
      </header>

      {/* Mode Explanation Banner */}
      {modeExplanation && (
        <div className="mode-banner">
          <p>{modeExplanation}</p>
        </div>
      )}

      {/* Main Content */}
      <main className="main">
        {/* Mode Selector */}
        <section className="section">
          <h2 className="section-title">Current Mode</h2>
          <div className="mode-grid">
            {modes.map((mode) => (
              <button
                key={mode.id}
                className={`mode-card ${currentMode === mode.id ? 'active' : ''}`}
                onClick={() => handleModeSelect(mode.id)}
              >
                <span className="mode-name">{mode.name}</span>
                <span className="mode-description">{mode.description}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Context Display */}
        {contextData && (
          <section className="section">
            <h2 className="section-title">Context</h2>
            <div className="context-panel">
              <pre>{JSON.stringify(contextData, null, 2)}</pre>
            </div>
          </section>
        )}

        {/* Prototype Area - Replace this with your prototype content */}
        <section className="section">
          <h2 className="section-title">Prototype Area</h2>
          <div className="prototype-area">
            <p>Replace this area with your prototype content.</p>
            <p>This template provides the basic LifeOS API integration.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>LifeOS Prototype Platform • API: localhost:3001</p>
      </footer>
    </div>
  );
}

export default App;
