import React from 'react';
import { CATEGORIES } from '../utils/constants';

export default function Sidebar({ activeSection, onSectionClick }) {
    return (
        <aside style={{
            width: '250px',
            background: '#2c3e50',
            color: 'white',
            padding: '20px',
            overflowY: 'auto',
            height: '100vh',
            position: 'sticky',
            top: 0,
        }}>
            <h2 style={{
                fontSize: '1.2em',
                marginBottom: '20px',
                fontWeight: '600',
                color: '#ecf0f1',
            }}>
                Knowledge Graph
            </h2>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {CATEGORIES.map(category => (
                        <li key={category.id} style={{ marginBottom: '8px' }}>
                            <button
                                onClick={() => onSectionClick(category.id)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 12px',
                                    background: activeSection === category.id 
                                        ? '#3498db' 
                                        : 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: activeSection === category.id ? '600' : '400',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    if (activeSection !== category.id) {
                                        e.target.style.background = '#34495e';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeSection !== category.id) {
                                        e.target.style.background = 'transparent';
                                    }
                                }}
                            >
                                {category.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
