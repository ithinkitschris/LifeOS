import React from 'react';

export default function MetaInfo({ meta }) {
    if (!meta || Object.keys(meta).length === 0) {
        return null;
    }

    return (
        <div style={{
            background: '#ecf0f1',
            padding: '10px 15px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '0.9em',
            color: '#555',
        }}>
            <strong style={{ color: '#2c3e50' }}>Schema Version:</strong> {meta.schema_version || 'N/A'} |{' '}
            <strong style={{ color: '#2c3e50' }}>Last Updated:</strong> {meta.last_updated || 'N/A'} |{' '}
            <strong style={{ color: '#2c3e50' }}>Data Type:</strong> {meta.data_type || 'N/A'}
            {meta.coverage && (
                <> | <strong style={{ color: '#2c3e50' }}>Coverage:</strong> {meta.coverage}</>
            )}
        </div>
    );
}
