import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon, Search, Github, Linkedin, Twitter, Facebook, Mail } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useHybridData } from '../contexts/HybridDataContext'
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
    const { siteMetadata = {}, navigation = [] } = useHybridData() || {}
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
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled
                ? 'bg-white/90 dark:bg-dark-800/90 backdrop-blur-2xl shadow-xl shadow-gray-200/20 dark:shadow-dark-900/30 border-b border-gray-200/50 dark:border-dark-600/50'
                : 'bg-white/70 dark:bg-dark-800/70 backdrop-blur-xl border-b border-gray-200/30 dark:border-dark-600/30'
                }`}>
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>

                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-1 left-1/4 w-2 h-2 bg-primary-400/20 rounded-full animate-pulse"></div>
                    <div className="absolute -top-0.5 right-1/3 w-1 h-1 bg-secondary-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute -top-1 right-1/4 w-1.5 h-1.5 bg-primary-300/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Logo */}
                        <div className="flex items-center">
                            {/* Logo */}
                            <Link to="/" className="flex items-center group">
                                <div className="relative overflow-hidden rounded-xl">
                                    {/* Desktop Logo */}
                                    <img
                                        src="/pictures/logo.png"
                                        alt="Logo"
                                        loading="lazy"
                                        className="hidden md:block h-10 w-auto transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                                    />
                                    {/* Mobile Logo */}
                                    <img
                                        src="/pictures/logo-mobile.png"
                                        alt="Logo"
                                        loading="lazy"
                                        className="md:hidden h-16 w-auto transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/10 group-hover:to-transparent transition-all duration-300"></div>
                                </div>
                            </Link>
                        </div>

                        {/* Center: Navigation */}
                        <nav className="hidden md:flex items-center gap-2">
                            {navigation?.map((item) => (
                                <div key={item.name} className="relative group">
                                    <Link
                                        to={item.href}
                                        className={`text-sm font-medium transition-all duration-300 px-4 py-2 rounded-xl relative overflow-hidden group ${location.pathname === item.href
                                            ? 'text-primary-600 dark:text-primary-400 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 shadow-lg'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-dark-700 dark:hover:to-dark-600 hover:shadow-md hover:scale-105'
                                            }`}
                                    >
                                        <span className="relative z-10">{item.name}</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                    </Link>

                                    {/* Enhanced Dropdown indicator */}
                                    {(item.name === 'Features' || item.name === 'Beauty' || item.name === 'Shop' || item.name === 'المميزات' || item.name === 'الجمال' || item.name === 'المتجر') && (
                                        <div className="absolute top-full start-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto z-50">
                                            <div className="bg-white/95 dark:bg-dark-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-dark-600/50 p-4 min-w-48">
                                                <div className="text-xs text-gray-500 dark:text-gray-400 p-2 text-center">
                                                    <div className="animate-pulse">قريباً...</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Right: Search, Theme Toggle, and Mobile Menu */}
                        <div className="flex items-center gap-3">
                            {/* Desktop Search */}
                            <button
                                onClick={toggleSearch}
                                className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-dark-700 dark:hover:to-dark-600 hover:shadow-md hover:scale-105 group"
                            >
                                <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                                <span>بحث</span>
                            </button>

                            {/* Desktop Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="hidden md:block p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden"
                                aria-label="Toggle theme"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                {theme === 'light' ? (
                                    <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300 transition-all duration-300 group-hover:text-blue-600 group-hover:rotate-12 relative z-10" />
                                ) : (
                                    <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300 transition-all duration-300 group-hover:text-yellow-500 group-hover:rotate-12 relative z-10" />
                                )}
                            </button>

                            {/* Mobile menu button - Moved to the right */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-200 hover:scale-105 active:scale-95 relative z-50"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-transform duration-200" />
                                ) : (
                                    <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-transform duration-200" />
                                )}
                            </button>

                            {/* Social Media Icons */}
                            <div className="hidden lg:flex items-center gap-1">
                                {siteMetadata?.authors?.[0]?.social && (
                                    <>
                                        {siteMetadata.authors[0].social.github && (
                                            <a
                                                href={siteMetadata.authors[0].social.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-300 group hover:scale-110 active:scale-95 relative overflow-hidden"
                                                aria-label="GitHub"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/0 via-gray-900/10 to-gray-900/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                <Github className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-all duration-300 relative z-10" />
                                            </a>
                                        )}
                                        {siteMetadata.authors[0].social.linkedin && (
                                            <a
                                                href={siteMetadata.authors[0].social.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-300 group hover:scale-110 active:scale-95 relative overflow-hidden"
                                                aria-label="LinkedIn"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                <Linkedin className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-all duration-300 relative z-10" />
                                            </a>
                                        )}
                                        {siteMetadata.authors[0].social.twitter && (
                                            <a
                                                href={siteMetadata.authors[0].social.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-300 group hover:scale-110 active:scale-95 relative overflow-hidden"
                                                aria-label="Twitter"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-sky-400/0 via-sky-400/10 to-sky-400/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                <Twitter className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-sky-400 transition-all duration-300 relative z-10" />
                                            </a>
                                        )}
                                        {siteMetadata.authors[0].social.facebook && (
                                            <a
                                                href={siteMetadata.authors[0].social.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-300 group hover:scale-110 active:scale-95 relative overflow-hidden"
                                                aria-label="Facebook"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                <Facebook className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-all duration-300 relative z-10" />
                                            </a>
                                        )}
                                        {siteMetadata.authors[0].social.email && (
                                            <a
                                                href={`mailto:${siteMetadata.authors[0].social.email}`}
                                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-300 group hover:scale-110 active:scale-95 relative overflow-hidden"
                                                aria-label="Email"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-green-500 transition-all duration-300 relative z-10" />
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Search Overlay */}
                {isSearchOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-dark-800/95 backdrop-blur-2xl border-b border-gray-200/50 dark:border-dark-600/50 shadow-2xl animate-in slide-in-from-top-2 duration-300">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/20 dark:to-transparent"></div>
                        <div className="max-w-2xl mx-auto p-6 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">بحث</h3>
                                <button
                                    onClick={toggleSearch}
                                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-300 hover:scale-105 active:scale-95 group"
                                >
                                    <X className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-transform duration-300 group-hover:rotate-90" />
                                </button>
                            </div>
                            <SearchBox onClose={() => setIsSearchOpen(false)} />
                        </div>
                    </div>
                )}

                {/* Enhanced Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-600 shadow-2xl animate-in slide-in-from-top-2 duration-300 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/20 to-transparent dark:from-primary-900/10 dark:to-transparent pointer-events-none"></div>
                        <div className="p-6 relative z-10">
                            {/* Search Bar and Theme Toggle */}
                            <div className="mb-6 space-y-4">
                                {/* Search Input */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 end-0 pe-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="ابحث في المقالات..."
                                        onClick={() => {
                                            setIsSearchOpen(true)
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="w-full pe-12 ps-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                                        readOnly
                                    />
                                </div>

                                {/* Theme Toggle Button */}
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-2xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-all duration-300 shadow-sm hover:shadow-md group"
                                >
                                    <div className="flex items-center gap-3">
                                        {theme === 'light' ? (
                                            <>
                                                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-all duration-300 group-hover:text-blue-600 group-hover:rotate-12" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">الوضع الداكن</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-all duration-300 group-hover:text-yellow-500 group-hover:rotate-12" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">الوضع الفاتح</span>
                                            </>
                                        )}
                                    </div>
                                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300'}`}>
                                        <div className={`absolute top-0.5 start-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${theme === 'dark' ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <nav className="space-y-2">
                                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">التنقل</h3>
                                {navigation?.map((item, index) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] animate-in slide-in-from-left-3 ${location.pathname === item.href
                                            ? 'text-primary-600 dark:text-primary-400 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 shadow-md'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-dark-700 dark:hover:to-dark-600 hover:shadow-sm'
                                            }`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {/* Enhanced Mobile Social Media Icons */}
                                <div className="pt-4 mt-4 border-t border-gray-200/50 dark:border-dark-600/50">
                                    <h4 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent">تواصل</h4>
                                    <div className="flex items-center justify-center gap-4 px-4">
                                        {siteMetadata?.authors?.[0]?.social && (
                                            <>
                                                {siteMetadata.authors[0].social.github && (
                                                    <a
                                                        href={siteMetadata.authors[0].social.github}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-300 group hover:scale-110 active:scale-95 relative overflow-hidden"
                                                        aria-label="GitHub"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/0 via-gray-900/10 to-gray-900/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                        <Github className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-all duration-300 relative z-10" />
                                                    </a>
                                                )}
                                                {siteMetadata.authors[0].social.linkedin && (
                                                    <a
                                                        href={siteMetadata.authors[0].social.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-300 group hover:scale-110 active:scale-95 relative overflow-hidden"
                                                        aria-label="LinkedIn"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                        <Linkedin className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-all duration-300 relative z-10" />
                                                    </a>
                                                )}
                                                {siteMetadata.authors[0].social.twitter && (
                                                    <a
                                                        href={siteMetadata.authors[0].social.twitter}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-300 group hover:scale-110 active:scale-95 relative overflow-hidden"
                                                        aria-label="Twitter"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/0 via-sky-400/10 to-sky-400/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                        <Twitter className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-sky-400 transition-all duration-300 relative z-10" />
                                                    </a>
                                                )}
                                                {siteMetadata.authors[0].social.facebook && (
                                                    <a
                                                        href={siteMetadata.authors[0].social.facebook}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-300 group hover:scale-110 active:scale-95 relative overflow-hidden"
                                                        aria-label="Facebook"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                        <Facebook className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-all duration-300 relative z-10" />
                                                    </a>
                                                )}
                                                {siteMetadata.authors[0].social.email && (
                                                    <a
                                                        href={`mailto:${siteMetadata.authors[0].social.email}`}
                                                        className="p-3 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-300 group hover:scale-110 active:scale-95 relative overflow-hidden"
                                                        aria-label="Email"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                        <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-green-500 transition-all duration-300 relative z-10" />
                                                    </a>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                )}
            </header>

            {/* Enhanced Spacer with gradient transition */}
            <div className="h-16 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-dark-800/30 dark:to-transparent"></div>
        </>
    )
}

export default Header
