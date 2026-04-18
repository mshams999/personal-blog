import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { HybridDataProvider } from './contexts/HybridDataContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import AnalyticsProvider from './components/AnalyticsProvider'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import SinglePostPage from './pages/SinglePostPage'
import CategoryPage from './pages/CategoryPage'
import AllCategoriesPage from './pages/AllCategoriesPage'
import CVPage from './pages/CVPage'
import AboutPage from './pages/AboutPage'
import AdminPage from './pages/AdminPage'
import NetWorthPage from './pages/NetWorthPage'
import ReadingLibrary from './pages/ReadingLibrary'
import LoginPage from './pages/LoginPage'
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

// Progressive-enhancement hook for the View Transitions API.
// On supported browsers, route changes will crossfade; otherwise it's a no-op.
const RouteTransitions = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        if (typeof document !== 'undefined' && 'startViewTransition' in document) {
            try {
                document.startViewTransition(() => { });
            } catch { /* ignore — older impls may throw when called empty */ }
        }
    }, [pathname]);
    return null;
}

function App() {
    // Initialize Google Analytics tracking
    useAnalytics()

    return (
        <ThemeProvider>
            <AuthProvider>
                <HybridDataProvider>
                    <AnalyticsProvider>
                        <div className="min-h-screen bg-paper text-ink transition-colors duration-300">
                            <ScrollToTop />
                            <RouteTransitions />
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/blog" element={<BlogPage />} />
                                    <Route path="/post/:slug" element={<SinglePostPage />} />
                                    <Route path="/category/:categorySlug" element={<CategoryPage />} />
                                    <Route path="/categories" element={<AllCategoriesPage />} />
                                    <Route path="/about" element={<AboutPage />} />
                                    <Route path="/cv" element={<CVPage />} />
                                    <Route path="/reading" element={<ReadingLibrary />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                                    <Route path="/net-worth" element={<ProtectedRoute><NetWorthPage /></ProtectedRoute>} />
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
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
