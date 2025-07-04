import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon, Search } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useData } from '../contexts/DataContext'
import SearchBox from './SearchBox'

/**
 * Header component matching the screenshot design
 * 
 * Features:
 * - Left: Hamburger menu
 * - Center: Navigation links with dropdowns
 * - Right: Search and Subscribe button
 * - Responsive design with scroll effects
 * - Mobile-friendly navigation
 */
const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const { siteMetadata, navigation } = useData()
    const location = useLocation()

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            setIsScrolled(scrollPosition > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
    }

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 dark:bg-dark-800/95 backdrop-blur-xl shadow-sm'
                : 'bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg'
                } border-b border-gray-200 dark:border-dark-600`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">


                        {/* Center: Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <div key={item.name} className="relative group">
                                    <Link
                                        to={item.href}
                                        className={`text-sm font-medium transition-colors px-4 py-2 rounded-lg ${location.pathname === item.href
                                            ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-dark-700'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>

                                    {/* Dropdown indicator for some items */}
                                    {(item.name === 'Features' || item.name === 'Beauty' || item.name === 'Shop') && (
                                        <div className="absolute top-full left-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <div className="bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-gray-200 dark:border-dark-600 p-2 min-w-48">
                                                <div className="text-xs text-gray-500 dark:text-gray-400 p-2">
                                                    Coming soon...
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Right: Search and Subscribe */}
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <button
                                    onClick={toggleSearch}
                                    className="hidden md:flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
                                >
                                    <Search className="h-4 w-4" />
                                    <span>Search</span>
                                </button>

                                {/* Mobile search button */}
                                <button
                                    onClick={toggleSearch}
                                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                    aria-label="Search"
                                >
                                    <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                </button>
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? (
                                    <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                ) : (
                                    <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                )}
                            </button>

                            {/* Subscribe Button */}
                            <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Overlay */}
                {isSearchOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-dark-800/95 backdrop-blur-xl border-b border-gray-200 dark:border-dark-600 shadow-lg">
                        <div className="max-w-2xl mx-auto p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Search</h3>
                                <button
                                    onClick={toggleSearch}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                </button>
                            </div>
                            <SearchBox onClose={() => setIsSearchOpen(false)} />
                        </div>
                    </div>
                )}

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-dark-800/95 backdrop-blur-xl border-b border-gray-200 dark:border-dark-600 shadow-lg">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h3>
                                <button
                                    onClick={toggleMobileMenu}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                </button>
                            </div>
                            <nav className="space-y-2">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${location.pathname === item.href
                                            ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-dark-700'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}
            </header>

            {/* Spacer to prevent content from hiding behind fixed header */}
            <div className="h-16"></div>
        </>
    )
}

export default Header
