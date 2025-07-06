import React from 'react'

const DebugPage = () => {
    console.log('DebugPage is rendering')

    return (
        <div style={{
            backgroundColor: '#ff6b6b',
            color: 'white',
            padding: '50px',
            minHeight: '100vh',
            fontSize: '24px',
            textAlign: 'center'
        }}>
            <h1>🔥 DEBUG PAGE 🔥</h1>
            <p>If you can see this red page, React is working!</p>
            <p>Time: {new Date().toLocaleString()}</p>
        </div>
    )
}

export default DebugPage
