import React from 'react';

/**
 * Recursively indexes all keys and values in an object for fast search
 */
export function indexData(data, path = '', index = {}) {
    if (data === null || data === undefined) {
        return index;
    }

    if (Array.isArray(data)) {
        data.forEach((item, idx) => {
            indexData(item, `${path}[${idx}]`, index);
        });
        return index;
    }

    if (typeof data === 'object') {
        Object.keys(data).forEach(key => {
            const currentPath = path ? `${path}.${key}` : key;
            const value = data[key];
            
            // Index the key
            if (!index[currentPath]) {
                index[currentPath] = [];
            }
            index[currentPath].push({ path: currentPath, type: 'key', value: key });
            
            // Index the value
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                if (!index[String(value).toLowerCase()]) {
                    index[String(value).toLowerCase()] = [];
                }
                index[String(value).toLowerCase()].push({ path: currentPath, type: 'value', value });
            }
            
            // Recursively index nested objects
            indexData(value, currentPath, index);
        });
        return index;
    }

    return index;
}

/**
 * Finds all paths that match a search query
 */
export function searchData(data, query, path = '', matches = []) {
    if (!query || query.trim() === '') {
        return matches;
    }

    const lowerQuery = query.toLowerCase();

    if (data === null || data === undefined) {
        return matches;
    }

    if (Array.isArray(data)) {
        data.forEach((item, idx) => {
            searchData(item, query, `${path}[${idx}]`, matches);
        });
        return matches;
    }

    if (typeof data === 'object') {
        Object.keys(data).forEach(key => {
            const currentPath = path ? `${path}.${key}` : key;
            const value = data[key];
            
            // Check if key matches
            if (key.toLowerCase().includes(lowerQuery)) {
                matches.push({ path: currentPath, type: 'key', value: key });
            }
            
            // Check if value matches
            if (typeof value === 'string' && value.toLowerCase().includes(lowerQuery)) {
                matches.push({ path: currentPath, type: 'value', value });
            } else if (typeof value === 'number' && String(value).includes(lowerQuery)) {
                matches.push({ path: currentPath, type: 'value', value });
            }
            
            // Recursively search nested objects
            searchData(value, query, currentPath, matches);
        });
        return matches;
    }

    return matches;
}

/**
 * Highlights matching text in a string
 */
export function highlightText(text, query) {
    if (!query || query.trim() === '') {
        return text;
    }

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = String(text).split(regex);
    
    return parts.map((part, i) => 
        regex.test(part) ? (
            <mark key={i} style={{ backgroundColor: '#ffeb3b', padding: '0 2px' }}>
                {part}
            </mark>
        ) : part
    );
}

/**
 * Gets a value at a path in an object
 */
export function getValueAtPath(obj, path) {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
        if (key.includes('[')) {
            const [arrayKey, index] = key.split('[');
            const idx = parseInt(index.replace(']', ''));
            current = current[arrayKey];
            if (Array.isArray(current)) {
                current = current[idx];
            }
        } else {
            current = current?.[key];
        }
        if (current === undefined) return undefined;
    }
    
    return current;
}
