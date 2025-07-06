import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { DataProvider } from './contexts/DataContext'
import Layout from './components/Layout'
import AnalyticsProvider from './components/AnalyticsProvider'
import HomePage from './pages/HomePage'
import HomePageTest from './pages/HomePageTest'
import SinglePostPage from './pages/SinglePostPage'
import CategoryPage from './pages/CategoryPage'
import AllCategoriesPage from './pages/AllCategoriesPage'
import CVPage from './pages/CVPage'
import { useAnalytics } from './hooks/useAnalytics'

/**
 * Main App component that sets up routing and provides global context
 * 
 * The app uses:
 * - ThemeProvider for light/dark mode functionality
 * - DataProvider for accessing blog data from info.json
 * - React Router for navigation between pages
 * - Layout component as a wrapper for consistent header/footer
 * - ScrollToTop functionality for better navigation experience
 */

// ScrollToTop component to reset scroll position on navigation
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    // Initialize Google Analytics tracking
    useAnalytics()

    return (
        <ThemeProvider>
            <DataProvider>
                <AnalyticsProvider>
                    <div className="min-h-screen bg-primary-50 dark:bg-dark-800 transition-colors duration-300">
                        <ScrollToTop />
                        <Layout>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/post/:slug" element={<SinglePostPage />} />
                                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                                <Route path="/categories" element={<AllCategoriesPage />} />
                                <Route path="/cv" element={<CVPage />} />
                            </Routes>
                        </Layout>
                    </div>
                </AnalyticsProvider>
            </DataProvider>
        </ThemeProvider>
    )
}

export default App
