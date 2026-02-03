import { useState, useMemo } from 'react';
import { searchData } from '../utils/dataHelpers';

export function useSearch(data) {
    const [searchQuery, setSearchQuery] = useState('');

    const matches = useMemo(() => {
        if (!searchQuery || !data) return new Map();

        const matchMap = new Map();
        
        Object.keys(data).forEach(categoryId => {
            const categoryData = data[categoryId];
            const categoryMatches = searchData(categoryData, searchQuery);
            
            if (categoryMatches.length > 0) {
                matchMap.set(categoryId, categoryMatches);
            }
        });

        return matchMap;
    }, [searchQuery, data]);

    const highlightedSections = useMemo(() => {
        return new Set(matches.keys());
    }, [matches]);

    const totalMatches = useMemo(() => {
        let total = 0;
        matches.forEach(matchList => {
            total += matchList.length;
        });
        return total;
    }, [matches]);

    const clearSearch = () => {
        setSearchQuery('');
    };

    return {
        searchQuery,
        setSearchQuery,
        matches,
        highlightedSections,
        totalMatches,
        clearSearch,
    };
}
