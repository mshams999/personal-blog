/**
 * Firebase Test Component
 * 
 * Simple component to test and debug Firebase Firestore integration
 * Use this component to verify Firebase configuration and view tracking
 */

import React, { useState } from 'react'
import { useArticleViews } from '../hooks/useFirebaseViews'
import { isFirestoreConfigured } from '../services/firestoreService'
import ViewCounter from './ViewCounter'

const FirebaseTest = () => {
    const [testSlug, setTestSlug] = useState('test-article')

    // Test the Firebase view tracking
    const { viewCount, loading, error, incrementView, refreshCount } = useArticleViews(
        testSlug,
        false // Don't auto-increment for testing
    )

    const handleManualIncrement = async () => {
        await incrementView()
        await refreshCount()
    }

    const handleRefresh = async () => {
        await refreshCount()
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Firebase Test Component</h2>

            {/* Configuration Status */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Configuration Status:</h3>
                <div className={`p-2 rounded ${isFirestoreConfigured() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    Firebase Firestore: {isFirestoreConfigured() ? '✅ Configured' : '⚠️ Not configured (using localStorage fallback)'}
                </div>
            </div>

            {/* Test Article Slug Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                    Test Article Slug:
                </label>
                <input
                    type="text"
                    value={testSlug}
                    onChange={(e) => setTestSlug(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter article slug to test"
                />
            </div>

            {/* View Count Display */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">View Count Test:</h3>
                <div className="flex items-center space-x-4">
                    <ViewCounter
                        articleSlug={testSlug}
                        shouldIncrement={false}
                        size="lg"
                        variant="badge"
                    />
                    {loading && <span className="text-blue-500">Loading...</span>}
                    {error && <span className="text-red-500">Error: {error}</span>}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Current count: {viewCount} views
                </p>
            </div>

            {/* Test Buttons */}
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={handleManualIncrement}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Increment View
                </button>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                    Refresh Count
                </button>
            </div>

            {/* Debug Info */}
            <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Debug Information:</h3>
                <div className="text-sm space-y-1">
                    <div>Environment Variables:</div>
                    <ul className="ml-4 space-y-1">
                        <li>VITE_FIREBASE_PROJECT_ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set'}</li>
                        <li>VITE_FIREBASE_API_KEY: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Not set'}</li>
                        <li>VITE_FIREBASE_AUTH_DOMAIN: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Not set'}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default FirebaseTest