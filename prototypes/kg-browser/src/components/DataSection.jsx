import React, { useEffect } from 'react';
import DataNode from './DataNode';
import MetaInfo from './MetaInfo';

export default function DataSection({ 
    categoryId, 
    categoryName, 
    data, 
    searchQuery, 
    highlightedSections,
    defaultExpanded = false,
    expandedSections,
    setExpandedSections
}) {
    const isExpanded = expandedSections[categoryId] || defaultExpanded;
    const hasMatches = highlightedSections.has(categoryId);

    useEffect(() => {
        // Auto-expand if there are search matches
        if (hasMatches && searchQuery && !expandedSections[categoryId]) {
            setExpandedSections({ ...expandedSections, [categoryId]: true });
        }
    }, [hasMatches, searchQuery, categoryId, expandedSections, setExpandedSections]);

    const toggleExpanded = () => {
        setExpandedSections({ ...expandedSections, [categoryId]: !isExpanded });
    };

    if (!data) {
        return null;
    }

    const { meta, ...restData } = data;

    return (
        <section
            id={categoryId}
            style={{
                marginBottom: '40px',
                borderLeft: '4px solid #3498db',
                paddingLeft: '20px',
                scrollMarginTop: '80px',
            }}
        >
            <h2
                onClick={toggleExpanded}
                style={{
                    fontSize: '1.8em',
                    color: '#2c3e50',
                    marginBottom: '20px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: hasMatches ? '#fff3cd' : 'transparent',
                    padding: '8px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e8f4f8';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = hasMatches ? '#fff3cd' : 'transparent';
                }}
            >
                <span style={{ fontSize: '0.8em' }}>{isExpanded ? '▼' : '▶'}</span>
                {categoryName}
                {hasMatches && (
                    <span style={{
                        fontSize: '0.6em',
                        background: '#ff9800',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: 'normal',
                    }}>
                        {searchQuery ? 'Matches' : ''}
                    </span>
                )}
            </h2>

            {isExpanded && (
                <>
                    <MetaInfo meta={meta} />
                    <div style={{ marginTop: '10px' }}>
                        <DataNode
                            data={restData}
                            path={categoryId}
                            searchQuery={searchQuery}
                            level={0}
                        />
                    </div>
                </>
            )}
        </section>
    );
}
