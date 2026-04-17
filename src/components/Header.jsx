import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon, Search } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useHybridData } from '../contexts/HybridDataContext'
import SearchBox from './SearchBox'

/**
 * Editorial Header
 *   - Paper-colored thin bar, hairline bottom rule after scroll
 *   - Serif wordmark with accent dot (no logo image)
 *   - Small-caps Inter nav links, underline-on-hover
 *   - Plain theme toggle + search + mobile slab menu
 */
const navFallback = [
    { path: '/', label: 'الرئيسية' },
    { path: '/blog', label: 'المقالات' },
    { path: '/categories', label: 'الأقسام' },
    { path: '/reading', label: 'المكتبة' },
    { path: '/cv', label: 'السيرة' },
]

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const { navigation = [] } = useHybridData() || {}
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 24)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        // close menu on route change
        setIsMobileMenuOpen(false)
        setIsSearchOpen(false)
    }, [location.pathname])

    const navItems = navigation && navigation.length > 0 ? navigation : navFallback

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    return (
        <>
            <header
                className={`fixed top-0 inset-x-0 z-50 bg-paper/95 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 ${isScrolled ? 'border-b border-rule' : 'border-b border-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Wordmark */}
                        <Link
                            to="/"
                            className="group flex items-baseline gap-1 font-display text-ink"
                            aria-label="الصفحة الرئيسية"
                        >
                            <span className="text-xl md:text-2xl font-semibold tracking-tight leading-none">
                                د. محمد شمس
                            </span>
                            <span
                                className="inline-block w-1.5 h-1.5 rounded-full bg-accent transition-transform group-hover:scale-125"
                                aria-hidden="true"
                            />
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-8" aria-label="التنقل الرئيسي">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`small-caps !text-[0.78rem] hover:text-ink transition-colors ${isActive(item.path) ? 'text-ink' : 'text-ink-muted'
                                        }`}
                                    style={{ textUnderlineOffset: '6px' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                                >
                                    {item.label || item.title}
                                </Link>
                            ))}
                        </nav>

                        {/* Right cluster */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsSearchOpen((v) => !v)}
                                className="p-2 text-ink-muted hover:text-ink transition-colors"
                                aria-label="بحث"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-ink-muted hover:text-ink transition-colors"
                                aria-label="تبديل الوضع"
                            >
                                {theme === 'dark'
                                    ? <Sun className="w-4 h-4" />
                                    : <Moon className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen((v) => !v)}
                                className="md:hidden p-2 text-ink-muted hover:text-ink transition-colors"
                                aria-label="القائمة"
                                aria-expanded={isMobileMenuOpen}
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Inline search */}
                {isSearchOpen && (
                    <div className="border-t border-rule bg-paper">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <SearchBox onClose={() => setIsSearchOpen(false)} />
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile slab menu */}
            <div
                className={`fixed inset-0 z-40 bg-paper transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                aria-hidden={!isMobileMenuOpen}
            >
                <div className="h-16" /> {/* Header spacer */}
                <nav
                    className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8"
                    aria-label="قائمة الجوال"
                >
                    {navItems.map((item, i) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`font-display text-display-lg text-ink reveal-up delay-${Math.min(i + 1, 4)}`}
                        >
                            {item.label || item.title}
                            {isActive(item.path) && (
                                <span className="ms-3 inline-block w-2 h-2 rounded-full bg-accent align-middle" />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Spacer for fixed header */}
            <div className="h-16" aria-hidden="true" />
        </>
    )
}

export default Header
