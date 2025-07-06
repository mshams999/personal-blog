import React from 'react'

/**
 * Simple test HomePage component
 */
const HomePage = () => {
    return (
        <div style={{ minHeight: '200px', padding: '32px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e', marginBottom: '16px' }}>
                Test Page with Inline Styles
            </h1>
            <p style={{ fontSize: '1rem', color: '#a16207', marginTop: '16px' }}>
                If you can see this, React is working! Time: {new Date().toLocaleTimeString()}
            </p>
        </div>
    )
}

export default HomePage
