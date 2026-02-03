import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api';

/**
 * useLifeOS Hook
 * 
 * Provides easy access to the LifeOS backend API.
 * Handles data fetching, caching, and state management.
 */
export function useLifeOS() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [modes, setModes] = useState([]);
  const [currentMode, setCurrentMode] = useState(null);
  const [values, setValues] = useState(null);

  // Fetch initial data on mount
  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);
        setError(null);

        // Fetch identity
        const identityRes = await fetch(`${API_BASE}/context/identity`);
        if (!identityRes.ok) throw new Error('Failed to fetch identity');
        const identityData = await identityRes.json();
        setIdentity(identityData);

        // Fetch modes
        const modesRes = await fetch(`${API_BASE}/modes`);
        if (!modesRes.ok) throw new Error('Failed to fetch modes');
        const modesData = await modesRes.json();
        setModes(modesData.modes || []);

        // Fetch values
        const valuesRes = await fetch(`${API_BASE}/orchestrator/values`);
        if (!valuesRes.ok) throw new Error('Failed to fetch values');
        const valuesData = await valuesRes.json();
        setValues(valuesData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    initialize();
  }, []);

  /**
   * Get mode explanation from LLM
   */
  const getModeExplanation = useCallback(async (modeName, action = 'entry', trigger = 'manual') => {
    try {
      const res = await fetch(`${API_BASE}/llm/explain-mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode_name: modeName,
          action,
          trigger_type: trigger
        })
      });
      
      if (!res.ok) throw new Error('Failed to get mode explanation');
      const data = await res.json();
      return data.text;
    } catch (err) {
      console.error('getModeExplanation error:', err);
      return `Entering ${modeName} mode.`;
    }
  }, []);

  /**
   * Get assembled context for a scenario
   */
  const getContext = useCallback(async (scenario, params = {}) => {
    try {
      const res = await fetch(`${API_BASE}/context/assemble`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, params })
      });
      
      if (!res.ok) throw new Error('Failed to assemble context');
      return await res.json();
    } catch (err) {
      console.error('getContext error:', err);
      return null;
    }
  }, []);

  /**
   * Get relationship data
   */
  const getRelationship = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE}/context/relationships/${id}`);
      if (!res.ok) throw new Error('Relationship not found');
      return await res.json();
    } catch (err) {
      console.error('getRelationship error:', err);
      return null;
    }
  }, []);

  /**
   * Get all relationships
   */
  const getRelationships = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/context/relationships`);
      if (!res.ok) throw new Error('Failed to fetch relationships');
      return await res.json();
    } catch (err) {
      console.error('getRelationships error:', err);
      return null;
    }
  }, []);

  /**
   * Get location data
   */
  const getLocation = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE}/context/locations/${id}`);
      if (!res.ok) throw new Error('Location not found');
      return await res.json();
    } catch (err) {
      console.error('getLocation error:', err);
      return null;
    }
  }, []);

  /**
   * Get all locations
   */
  const getLocations = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/context/locations`);
      if (!res.ok) throw new Error('Failed to fetch locations');
      return await res.json();
    } catch (err) {
      console.error('getLocations error:', err);
      return null;
    }
  }, []);

  /**
   * Get mode details
   */
  const getMode = useCallback(async (modeId) => {
    try {
      const res = await fetch(`${API_BASE}/modes/${modeId}`);
      if (!res.ok) throw new Error('Mode not found');
      return await res.json();
    } catch (err) {
      console.error('getMode error:', err);
      return null;
    }
  }, []);

  /**
   * Get triage rules for a mode
   */
  const getModeTriage = useCallback(async (modeId) => {
    try {
      const res = await fetch(`${API_BASE}/modes/${modeId}/triage`);
      if (!res.ok) throw new Error('Triage rules not found');
      return await res.json();
    } catch (err) {
      console.error('getModeTriage error:', err);
      return null;
    }
  }, []);

  /**
   * Triage a notification (stubbed)
   */
  const triageNotification = useCallback(async (notification, mode) => {
    try {
      const res = await fetch(`${API_BASE}/orchestrator/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notification,
          current_mode: mode || currentMode
        })
      });
      
      if (!res.ok) throw new Error('Triage failed');
      return await res.json();
    } catch (err) {
      console.error('triageNotification error:', err);
      return null;
    }
  }, [currentMode]);

  /**
   * Generate natural language with LLM
   */
  const generateText = useCallback(async (prompt, options = {}) => {
    try {
      const res = await fetch(`${API_BASE}/llm/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          ...options
        })
      });
      
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      return data.text;
    } catch (err) {
      console.error('generateText error:', err);
      return null;
    }
  }, []);

  /**
   * Query the knowledge graph
   */
  const queryKnowledgeGraph = useCallback(async (query, domains = ['all']) => {
    try {
      const res = await fetch(`${API_BASE}/context/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, domains })
      });
      
      if (!res.ok) throw new Error('Query failed');
      return await res.json();
    } catch (err) {
      console.error('queryKnowledgeGraph error:', err);
      return null;
    }
  }, []);

  return {
    // State
    loading,
    error,
    identity,
    modes,
    currentMode,
    values,
    
    // Setters
    setCurrentMode,
    
    // Context methods
    getContext,
    getRelationship,
    getRelationships,
    getLocation,
    getLocations,
    queryKnowledgeGraph,
    
    // Mode methods
    getMode,
    getModeTriage,
    getModeExplanation,
    
    // Orchestrator methods
    triageNotification,
    
    // LLM methods
    generateText
  };
}

export default useLifeOS;
