import React from 'react'
import Header from './Header'
import Footer from './Footer'

/**
 * Layout component that wraps all pages with consistent header and footer
 * 
 * Features:
 * - Responsive layout structure
 * - Consistent spacing and background
 * - Flexible main content area
 */
const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout
