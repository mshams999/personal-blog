import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { HybridDataProvider } from './contexts/HybridDataContext'
import Layout from './components/Layout'
import AnalyticsProvider from './components/AnalyticsProvider'
import HomePage from './pages/HomePage'
import SinglePostPage from './pages/SinglePostPage'
import CategoryPage from './pages/CategoryPage'
import AllCategoriesPage from './pages/AllCategoriesPage'
import CVPage from './pages/CVPage'
import AdminPage from './pages/AdminPage'
import ReadingLibrary from './pages/ReadingLibrary'
import ATLSCertificate from './pages/certificates/ATLSCertificate'
import ACLSCertificate from './pages/certificates/ACLSCertificate'
import BLSCertificate from './pages/certificates/BLSCertificate'
import MaadenCertificate from './pages/certificates/MaadenCertificate'
import USMLEStep1Certificate from './pages/certificates/USMLEStep1Certificate'
import { useAnalytics } from './hooks/useAnalytics'

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
            <HybridDataProvider>
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
                                <Route path="/reading" element={<ReadingLibrary />} />
                                <Route path="/admin" element={<AdminPage />} />
                                {/* Certificate Routes */}
                                <Route path="/certificates/atls" element={<ATLSCertificate />} />
                                <Route path="/certificates/acls" element={<ACLSCertificate />} />
                                <Route path="/certificates/bls" element={<BLSCertificate />} />
                                <Route path="/certificates/maaden" element={<MaadenCertificate />} />
                                <Route path="/certificates/usmle-step1" element={<USMLEStep1Certificate />} />
                            </Routes>
                        </Layout>
                    </div>
                </AnalyticsProvider>
            </HybridDataProvider>
        </ThemeProvider>
    )
}

export default App
