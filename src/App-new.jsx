import React from 'react'

function App() {
    console.log('🔥 App component is rendering successfully!')
    console.log('Document body:', document.body)
    console.log('Window location:', window.location.href)

    // Force the page to show something immediately
    React.useEffect(() => {
        console.log('🔥 App useEffect is running')
        document.title = 'React App is Working!'
    }, [])

    const testStyle = {
        backgroundColor: '#ff0000',
        color: '#ffffff',
        padding: '50px',
        minHeight: '100vh',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
    }

    return (
        <div style={testStyle}>
            <h1>🔥 REACT IS WORKING! 🔥</h1>
            <p>Time: {new Date().toLocaleString()}</p>
            <p>If you can see this red page, React is successfully rendering!</p>
            <button
                onClick={() => alert('Button clicked!')}
                style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}
            >
                Test Button
            </button>
        </div>
    )
}

export default App
