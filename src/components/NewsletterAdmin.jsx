import React, { useState, useEffect } from 'react'
import {
    Users,
    Mail,
    TrendingUp,
    Download,
    Search,
    Calendar,
    AlertCircle,
    CheckCircle,
    Trash2
} from 'lucide-react'
import newsletterService from '../services/newsletterService'

/**
 * Newsletter Admin Panel
 * Manage newsletter subscribers and view analytics
 */
const NewsletterAdmin = () => {
    const [subscribers, setSubscribers] = useState([])
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [subscribersData, statsData] = await Promise.all([
                newsletterService.getAllSubscribers(),
                newsletterService.getStats()
            ])

            setSubscribers(subscribersData)
            setStats(statsData)
            setError('')
        } catch (error) {
            console.error('Error loading newsletter data:', error)
            setError('Failed to load newsletter data')
        } finally {
            setLoading(false)
        }
    }

    const handleUnsubscribe = async (email) => {
        if (!confirm(`Are you sure you want to unsubscribe ${email}?`)) {
            return
        }

        try {
            const result = await newsletterService.unsubscribe(email)
            if (result.success) {
                await loadData() // Reload data
            } else {
                setError(result.error)
            }
        } catch (error) {
            setError('Failed to unsubscribe user')
        }
    }

    const exportSubscribers = () => {
        const csvContent = [
            ['Email', 'First Name', 'Subscribed Date', 'Source'].join(','),
            ...subscribers.map(sub => [
                sub.email,
                sub.firstName || '',
                sub.subscribedAt?.toDate?.()?.toLocaleDateString() || '',
                sub.source || ''
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const filteredSubscribers = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.firstName && sub.firstName.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2">Loading newsletter data...</span>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Newsletter Dashboard
                </h1>
                <button
                    onClick={exportSubscribers}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.totalActiveSubscribers || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Recent (30 days)</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.recentSubscriptions || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.growthRate || 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 dark:border-dark-600">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Subscribers ({filteredSubscribers.length})
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search subscribers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-dark-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Subscriber
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Subscribed
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Source
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
                            {filteredSubscribers.map((subscriber) => (
                                <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {subscriber.firstName || 'No name'}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {subscriber.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {subscriber.subscribedAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                            {subscriber.source || 'website'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleUnsubscribe(subscriber.email)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredSubscribers.length === 0 && (
                        <div className="text-center py-12">
                            <Mail className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                No subscribers found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {searchTerm ? 'Try adjusting your search terms.' : 'Subscribers will appear here once people sign up for your newsletter.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NewsletterAdmin
