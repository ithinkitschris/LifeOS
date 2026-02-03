import React, { useState } from 'react';
import { highlightText } from '../utils/dataHelpers';
import { COLORS } from '../utils/constants';

export default function DataNode({ data, path = '', searchQuery = '', level = 0 }) {
    const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels

    if (data === null || data === undefined) {
        return (
            <span style={{ color: COLORS.null, fontStyle: 'italic' }}>
                null
            </span>
        );
    }

    if (Array.isArray(data)) {
        if (data.length === 0) {
            return (
                <span style={{ color: COLORS.null, fontStyle: 'italic' }}>
                    (empty array)
                </span>
            );
        }

        return (
            <div style={{ marginLeft: level * 20 }}>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px 4px',
                        marginRight: '4px',
                        fontSize: '12px',
                        color: '#666',
                    }}
                >
                    {isExpanded ? '▼' : '▶'}
                </button>
                <span style={{ color: COLORS.number, fontWeight: 'bold' }}>
                    [{data.length}]
                </span>
                {isExpanded && (
                    <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '4px' }}>
                        {data.map((item, index) => (
                            <li key={index} style={{ margin: '4px 0' }}>
                                <span style={{ color: '#e74c3c' }}>→</span>{' '}
                                <DataNode
                                    data={item}
                                    path={`${path}[${index}]`}
                                    searchQuery={searchQuery}
                                    level={level + 1}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    if (typeof data === 'object') {
        const keys = Object.keys(data);
        if (keys.length === 0) {
            return (
                <span style={{ color: COLORS.null, fontStyle: 'italic' }}>
                    (empty object)
                </span>
            );
        }

        return (
            <div style={{ marginLeft: level * 20 }}>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px 4px',
                        marginRight: '4px',
                        fontSize: '12px',
                        color: '#666',
                    }}
                >
                    {isExpanded ? '▼' : '▶'}
                </button>
                <span style={{ color: COLORS.number, fontWeight: 'bold' }}>
                    {'{'} {keys.length} {'}'}
                </span>
                {isExpanded && (
                    <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '4px' }}>
                        {keys.map(key => (
                            <li key={key} style={{ margin: '4px 0' }}>
                                <span style={{ color: COLORS.key, fontWeight: '600' }}>
                                    {highlightText(key, searchQuery)}:
                                </span>{' '}
                                <DataNode
                                    data={data[key]}
                                    path={path ? `${path}.${key}` : key}
                                    searchQuery={searchQuery}
                                    level={level + 1}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    // Primitive values
    const valueStyle = {
        color: typeof data === 'string' ? COLORS.string :
               typeof data === 'number' ? COLORS.number :
               typeof data === 'boolean' ? COLORS.boolean :
               COLORS.null,
        fontFamily: typeof data === 'number' || typeof data === 'boolean' 
            ? 'Monaco, "Courier New", monospace' 
            : 'inherit',
    };

    const displayValue = typeof data === 'string' ? `"${data}"` : String(data);

    return (
        <span
            onClick={() => {
                navigator.clipboard.writeText(String(data));
            }}
            title="Click to copy"
            style={{ ...valueStyle, cursor: 'pointer' }}
        >
            {highlightText(displayValue, searchQuery)}
        </span>
    );
}
