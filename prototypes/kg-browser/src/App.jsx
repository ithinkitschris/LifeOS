import React, { useState, useEffect, useRef } from 'react';
import { useKnowledgeGraph } from './hooks/useKnowledgeGraph';
import { useSearch } from './hooks/useSearch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CATEGORIES } from './utils/constants';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import DataSection from './components/DataSection';

export default function App() {
    const { data, loading, error } = useKnowledgeGraph();
    const { searchQuery, setSearchQuery, matches, highlightedSections, totalMatches, clearSearch } = useSearch(data);
    const [expandedSections, setExpandedSections] = useLocalStorage('kg-browser-expanded', {});
    const [activeSection, setActiveSection] = useState('');
    const searchInputRef = useRef(null);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Focus search with '/' key
            if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
                const target = e.target;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    searchInputRef.current?.focus();
                }
            }

            // Clear search with Escape
            if (e.key === 'Escape' && searchQuery) {
                clearSearch();
            }

            // Expand all with Ctrl+E
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                const allExpanded = {};
                CATEGORIES.forEach(cat => {
                    allExpanded[cat.id] = true;
                });
                setExpandedSections(allExpanded);
            }

            // Collapse all with Ctrl+C (but not if they're typing in input)
            if (e.ctrlKey && e.key === 'c' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                setExpandedSections({});
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchQuery, clearSearch, setExpandedSections]);

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sections = CATEGORIES.map(cat => {
                const element = document.getElementById(cat.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return { id: cat.id, top: rect.top };
                }
                return null;
            }).filter(Boolean);

            const visibleSection = sections
                .filter(s => s.top <= 100)
                .sort((a, b) => b.top - a.top)[0];

            if (visibleSection) {
                setActiveSection(visibleSection.id);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, [data]);

    const handleSectionClick = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleExpandAll = () => {
        const allExpanded = {};
        CATEGORIES.forEach(cat => {
            allExpanded[cat.id] = true;
        });
        setExpandedSections(allExpanded);
    };

    const handleCollapseAll = () => {
        setExpandedSections({});
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: '#666',
            }}>
                Loading knowledge graph data...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: '#e74c3c',
            }}>
                Error: {error}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar activeSection={activeSection} onSectionClick={handleSectionClick} />
            
            <main style={{ flex: 1, background: '#f5f5f5' }}>
                <SearchBar
                    ref={searchInputRef}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    totalMatches={totalMatches}
                    onExpandAll={handleExpandAll}
                    onCollapseAll={handleCollapseAll}
                />
                
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '40px',
                }}>
                    <header style={{ marginBottom: '30px' }}>
                        <h1 style={{
                            color: '#2c3e50',
                            marginBottom: '10px',
                            fontSize: '2.5em',
                            borderBottom: '3px solid #3498db',
                            paddingBottom: '10px',
                        }}>
                            Knowledge Graph Reference
                        </h1>
                        <p style={{
                            color: '#7f8c8d',
                            fontSize: '1.1em',
                        }}>
                            Complete data reference for Marcus Chen's personal knowledge graph
                        </p>
                    </header>

                    {CATEGORIES.map(category => (
                        <DataSection
                            key={category.id}
                            categoryId={category.id}
                            categoryName={category.name}
                            data={data[category.id]}
                            searchQuery={searchQuery}
                            highlightedSections={highlightedSections}
                            defaultExpanded={false}
                            expandedSections={expandedSections}
                            setExpandedSections={setExpandedSections}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
