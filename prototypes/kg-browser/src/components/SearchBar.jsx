import React, { forwardRef } from 'react';

const SearchBar = forwardRef(function SearchBar({ 
    searchQuery, 
    setSearchQuery, 
    totalMatches,
    onExpandAll,
    onCollapseAll 
}, ref) {
    return (
        <div style={{
            position: 'sticky',
            top: 0,
            background: 'white',
            padding: '20px',
            borderBottom: '2px solid #e0e0e0',
            zIndex: 100,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
            <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto',
            }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <input
                        ref={ref}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search knowledge graph... (Press '/' to focus)"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '16px',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#3498db';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ddd';
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                color: '#999',
                                padding: '4px 8px',
                            }}
                            title="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>
                {searchQuery && totalMatches > 0 && (
                    <div style={{
                        padding: '8px 16px',
                        background: '#3498db',
                        color: 'white',
                        borderRadius: '8px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                    }}>
                        {totalMatches} match{totalMatches !== 1 ? 'es' : ''}
                    </div>
                )}
                <button
                    onClick={onExpandAll}
                    style={{
                        padding: '12px 20px',
                        background: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                    }}
                    title="Expand all sections (Ctrl+E)"
                >
                    Expand All
                </button>
                <button
                    onClick={onCollapseAll}
                    style={{
                        padding: '12px 20px',
                        background: '#95a5a6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                    }}
                    title="Collapse all sections (Ctrl+C)"
                >
                    Collapse All
                </button>
            </div>
        </div>
    );
});

export default SearchBar;
