import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useHybridData } from '../contexts/HybridDataContext'
import { searchPosts } from '../utils/search'

/**
 * SearchBox component with dropdown results
 * 
 * Features:
 * - Real-time search as you type
 * - Dropdown with search results
 * - Click outside to close
 * - Keyboard navigation support
 * - Mock search functionality (can be replaced with Algolia)
 */
const SearchBox = ({ className = '', onClose }) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const searchRef = useRef(null)
    const inputRef = useRef(null)

    const { posts, getAuthorById, getCategoryById } = useHybridData()

    // Handle search
    useEffect(() => {
        if (query.trim() === '') {
            setResults([])
            setIsOpen(false)
            return
        }

        const searchResults = searchPosts(query, posts)
        setResults(searchResults)
        setIsOpen(searchResults.length > 0)
    }, [query, posts])

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleResultClick = () => {
        setQuery('')
        setResults([])
        setIsOpen(false)
        if (onClose) onClose()
    }

    const clearSearch = () => {
        setQuery('')
        setResults([])
        setIsOpen(false)
        inputRef.current?.focus()
    }

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="relative">
                <div className="absolute inset-y-0 end-0 pe-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="ابحث في المقالات..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pe-10 ps-10 py-2 border border-gray-300 dark:border-dark-600 rounded-full bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 start-0 ps-3 flex items-center"
                    >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full start-0 end-0 mt-2 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-gray-200 dark:border-dark-600 max-h-96 overflow-y-auto z-50">
                    <div className="p-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-100 dark:border-dark-600">
                            تم العثور على {results.length} {results.length === 1 ? 'نتيجة' : results.length === 2 ? 'نتيجتين' : 'نتائج'}
                        </div>
                        {results.map((post) => {
                            const author = getAuthorById(post.authorId)
                            const category = getCategoryById(post.categoryId)
                            return (
                                <Link
                                    key={post.id}
                                    to={`/post/${post.slug}`}
                                    onClick={handleResultClick}
                                    className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-dark-600 rounded-lg transition-colors"
                                >
                                    <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                            {post.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {category && (
                                                <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 rounded">
                                                    {category.name}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                بواسطة {author?.name || 'غير معروف'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchBox
