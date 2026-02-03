import { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils/constants';

export function useKnowledgeGraph() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const loadedData = {};
                
                for (const category of CATEGORIES) {
                    try {
                        const response = await fetch(`/data/${category.file}`);
                        if (!response.ok) {
                            throw new Error(`Failed to load ${category.file}`);
                        }
                        loadedData[category.id] = await response.json();
                    } catch (err) {
                        console.error(`Error loading ${category.file}:`, err);
                        setError(`Failed to load ${category.file}: ${err.message}`);
                    }
                }
                
                setData(loadedData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const reload = () => {
        setData({});
        setLoading(true);
        setError(null);
        // Trigger reload by re-running useEffect
        window.location.reload();
    };

    return { data, loading, error, reload };
}
