import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './lib/storyblok'

if (typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('_storyblok')) {
    const script = document.createElement('script')
    script.src = 'https://app.storyblok.com/f/storyblok-v2-latest.js'
    script.async = true
    document.head.appendChild(script)
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)
