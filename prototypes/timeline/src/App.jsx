import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = '/api';

/**
 * Mode name mapping to match design reference
 */
const MODE_LABELS = {
    restore: 'Restore',
    focus: 'Focus',
    navigation: 'Journey'
};

/**
 * Format time string (e.g., "08:00" to "08:00")
 */
function formatTime(timeStr) {
    // Remove seconds if present, keep HH:MM
    return timeStr.slice(0, 5);
}

/**
 * Get shortened title from timeline entry
 */
function getShortTitle(entry) {
    // Use the title field, or fall back to description snippet
    if (entry.title) {
        // Shorten long titles
        const title = entry.title;
        if (title.length > 40) {
            return title.slice(0, 40) + '...';
        }
        return title;
    }
    return entry.description?.slice(0, 40) || '';
}

function App() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timelineData, setTimelineData] = useState(null);

    useEffect(() => {
        async function fetchTimeline() {
            try {
                setLoading(true);
                setError(null);

                // Fetch timeline for the example day
                const res = await fetch(`${API_BASE}/context/timeline/2030-10-14`);
                if (!res.ok) {
                    throw new Error('Failed to fetch timeline');
                }

                const data = await res.json();
                setTimelineData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchTimeline();
    }, []);

    if (loading) {
        return <div className="loading">Loading timeline...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <h2>Connection Error</h2>
                <p>{error}</p>
                <p>Make sure the backend is running:</p>
                <code>cd backend && npm run dev</code>
            </div>
        );
    }

    const entries = timelineData?.timeline || [];

    return (
        <div className="timeline-container">
            {/* Status bar simulation */}
            <div className="status-bar">
                <span className="status-time">07:58</span>
                <span className="status-icons">
                    <span>▃▅▇</span>
                    <span>📶</span>
                    <span>🔋</span>
                </span>
            </div>

            {/* Timeline entries */}
            <div className="timeline-list">
                {entries.map((entry) => (
                    <div key={entry.id} className="timeline-entry">
                        <div className="entry-time">
                            {formatTime(entry.start_time)}
                        </div>
                        <div className="entry-card">
                            <div className="entry-mode">
                                {MODE_LABELS[entry.mode] || entry.mode}
                            </div>
                            <div className="entry-title">
                                {getShortTitle(entry)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
