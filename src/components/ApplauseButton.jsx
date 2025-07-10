import React, { useEffect, useRef, useState } from 'react'

/**
 * ApplauseButton component
 * 
 * A custom React wrapper for the applause-button web component.
 * Each post gets a unique applause count based on its URL.
 * 
 * @param {string} url - Unique identifier for the post (usually the full URL or slug)
 * @param {string} api - API endpoint for storing applause data
 * @param {string} className - Additional CSS classes
 * @param {object} style - Inline styles
 * @param {string} size - Size variant ('sm', 'md', 'lg')
 */
const ApplauseButton = ({ 
    url, 
    api = "https://applause.chabouis.fr", 
    className = "", 
    style = {},
    size = "md"
}) => {
    const applauseRef = useRef(null)
    const [isLoaded, setIsLoaded] = useState(false)

    // Size configurations
    const sizeConfig = {
        sm: { width: '2.5rem', height: '2.5rem' },
        md: { width: '3.5rem', height: '3.5rem' },
        lg: { width: '4rem', height: '4rem' }
    }

    useEffect(() => {
        // Load CSS first
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = 'https://unpkg.com/applause-button/dist/applause-button.css'
        
        if (!document.querySelector('link[href*="applause-button.css"]')) {
            document.head.appendChild(cssLink)
        }

        // Check if applause button script is already loaded
        const existingScript = document.querySelector('script[src*="applause-button.js"]')
        
        if (existingScript) {
            setIsLoaded(true)
            return
        }

        // Import the applause button script dynamically
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/applause-button/dist/applause-button.js'
        script.type = 'module'
        
        document.head.appendChild(script)

        // Set up the applause button once the script loads
        script.onload = () => {
            setIsLoaded(true)
        }

        script.onerror = () => {
            console.error('Failed to load applause-button script')
        }

        return () => {
            // Keep the script for other components that might need it
        }
    }, [])

    useEffect(() => {
        if (isLoaded && applauseRef.current && url) {
            // Configure the applause button
            applauseRef.current.setAttribute('url', url)
            applauseRef.current.setAttribute('api', api)
        }
    }, [isLoaded, url, api])

    if (!isLoaded) {
        // Loading placeholder
        return (
            <div 
                className={`inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
                style={{
                    ...sizeConfig[size],
                    ...style
                }}
            >
                <span className="text-xs text-gray-500">👏</span>
            </div>
        )
    }

    return (
        <applause-button
            ref={applauseRef}
            url={url}
            api={api}
            className={`applause-button ${className}`}
            style={{
                ...sizeConfig[size],
                '--applause-button-color': '#ec4899',
                '--applause-button-color-hover': '#db2777',
                '--applause-button-color-active': '#be185d',
                ...style
            }}
        />
    )
}

export default ApplauseButton
