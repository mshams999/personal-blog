import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon, Search, LogIn, LogOut, UserRound, ChevronDown, PenSquare } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useHybridData } from '../contexts/HybridDataContext'
import { useAuth } from '../context/AuthContext'
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
    { path: '/about', label: 'من أنا' },
    { path: '/reading', label: 'المكتبة' },
    { path: '/cv', label: 'السيرة' },
]

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const userMenuRef = useRef(null)
    const { theme, toggleTheme } = useTheme()
    const { user, loading, signOut } = useAuth()
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
        setIsUserMenuOpen(false)
    }, [location.pathname])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const navItems = useMemo(() => {
        const normalized = (navigation || [])
            .map((item) => {
                const path = item?.path || item?.href || item?.url
                const label = item?.label || item?.title || item?.name

                if (!path || !label) return null
                return { path, label }
            })
            .filter(Boolean)

        return normalized.length > 0 ? normalized : navFallback
    }, [navigation])

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    const userInitial = user?.displayName?.[0] || user?.email?.[0] || 'U'
    const ownerEmail = import.meta.env.VITE_OWNER_EMAIL
    const isOwner = !!user && (!ownerEmail || user.email === ownerEmail)

    const handleSignOut = async () => {
        await signOut()
        setIsUserMenuOpen(false)
        setIsMobileMenuOpen(false)
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
                                    key={`${item.path}-${item.label}`}
                                    to={item.path}
                                    className={`small-caps !text-[0.78rem] hover:text-ink transition-colors ${isActive(item.path) ? 'text-ink' : 'text-ink-muted'
                                        }`}
                                    style={{ textUnderlineOffset: '6px' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right cluster */}
                        <div className="flex items-center gap-1">
                            {!loading && !user && (
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-ink-muted hover:text-ink transition-colors"
                                    aria-label="تسجيل الدخول"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span className="hidden sm:inline font-display text-xs tracking-wide">تسجيل الدخول</span>
                                </Link>
                            )}

                            {!loading && user && (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen((v) => !v)}
                                        className="inline-flex items-center gap-1.5 p-1.5 sm:px-2 sm:py-1.5 text-ink-muted hover:text-ink transition-colors"
                                        aria-label="حساب المستخدم"
                                        aria-expanded={isUserMenuOpen}
                                    >
                                        <span className="w-7 h-7 rounded-full bg-ink/10 text-ink flex items-center justify-center text-xs font-semibold">
                                            {String(userInitial).toUpperCase()}
                                        </span>
                                        <span className="hidden sm:inline text-xs max-w-[7rem] truncate">{user.displayName || user.email}</span>
                                        <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-paper border border-rule rounded-2xl shadow-lg p-2 z-50">
                                            <div className="px-2.5 py-2 border-b border-rule">
                                                <p className="text-xs text-ink-muted">Signed in as</p>
                                                <p className="text-sm text-ink truncate">{user.email}</p>
                                            </div>
                                            {isOwner && (
                                                <>
                                                    <Link
                                                        to="/portal"
                                                        className="w-full mt-1 inline-flex items-center gap-2 px-2.5 py-2 rounded-xl text-sm text-ink hover:bg-ink/5 transition"
                                                    >
                                                        <span>Admin Portal</span>
                                                    </Link>
                                                    <Link
                                                        to="/net-worth"
                                                        className="w-full mt-1 inline-flex items-center gap-2 px-2.5 py-2 rounded-xl text-sm text-ink hover:bg-ink/5 transition"
                                                    >
                                                        <span>Net Worth Dashboard</span>
                                                    </Link>
                                                    <a
                                                        href="/admin/index.html"
                                                        className="w-full mt-1 inline-flex items-center gap-2 px-2.5 py-2 rounded-xl text-sm text-ink hover:bg-ink/5 transition"
                                                        onClick={() => {
                                                            setIsUserMenuOpen(false)
                                                            setIsMobileMenuOpen(false)
                                                        }}
                                                    >
                                                        <PenSquare className="w-4 h-4" />
                                                        <span>Tina Admin</span>
                                                    </a>
                                                </>
                                            )}
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full mt-1 inline-flex items-center gap-2 px-2.5 py-2 rounded-xl text-sm text-ink hover:bg-ink/5 transition"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

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
                            key={`${item.path}-${item.label}`}
                            to={item.path}
                            className={`font-display text-display-lg text-ink reveal-up delay-${Math.min(i + 1, 4)}`}
                        >
                            {item.label}
                            {isActive(item.path) && (
                                <span className="ms-3 inline-block w-2 h-2 rounded-full bg-accent align-middle" />
                            )}
                        </Link>
                    ))}

                    {!loading && !user && (
                        <Link
                            to="/login"
                            className="font-display text-display-lg text-ink reveal-up delay-4 inline-flex items-center gap-3"
                        >
                            <LogIn className="w-6 h-6" />
                            <span>تسجيل الدخول</span>
                        </Link>
                    )}

                    {!loading && user && (
                        <div className="reveal-up delay-4 space-y-4">
                            <div className="inline-flex items-center gap-3 text-ink">
                                <UserRound className="w-6 h-6" />
                                <span className="font-display text-2xl truncate max-w-full">{user.displayName || user.email}</span>
                            </div>
                            {isOwner && (
                                <>
                                    <Link
                                        to="/portal"
                                        className="font-display text-lg text-ink-muted hover:text-ink inline-flex items-center gap-2 transition-colors"
                                    >
                                        <span>Admin Portal</span>
                                    </Link>
                                    <Link
                                        to="/net-worth"
                                        className="font-display text-lg text-ink-muted hover:text-ink inline-flex items-center gap-2 transition-colors"
                                    >
                                        <span>Net Worth Dashboard</span>
                                    </Link>
                                    <a
                                        href="/admin/index.html"
                                        className="font-display text-lg text-ink-muted hover:text-ink inline-flex items-center gap-2 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <PenSquare className="w-5 h-5" />
                                        <span>Tina Admin</span>
                                    </a>
                                </>
                            )}
                            <button
                                onClick={handleSignOut}
                                className="font-display text-lg text-ink-muted hover:text-ink inline-flex items-center gap-2 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>تسجيل الخروج</span>
                            </button>
                        </div>
                    )}
                </nav>
            </div>

            {/* Spacer for fixed header */}
            <div className="h-16" aria-hidden="true" />
        </>
    )
}

export default Header
