import React from 'react'

/**
 * Admin Page Component for TinaCMS
 * 
 * Note: TinaCMS admin interface should be accessed directly via
 * the generated admin files when running `npm run tina:dev`
 * 
 * The actual admin interface is served at:
 * - http://localhost:5173/admin/index.html (when TinaCMS dev server is running)
 */
const AdminPage = () => {
    const handleGoToAdmin = () => {
        // Open the TinaCMS admin in the same window
        window.location.href = '/admin/index.html'
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md mx-auto text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    TinaCMS Admin
                </h1>

                <div className="mb-6">
                    <svg className="w-16 h-16 mx-auto mb-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                    </svg>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Access the TinaCMS visual editor to manage your blog content.
                </p>

                <button
                    onClick={handleGoToAdmin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    Open CMS Admin
                </button>

                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Note:</strong> Make sure the TinaCMS dev server is running
                        with <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">npm run tina:dev</code>
                    </p>
                </div>

                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <p>Direct link: <a href="/admin/index.html" className="text-blue-600 hover:underline">/admin/index.html</a></p>
                </div>
            </div>
        </div>
    )
}

export default AdminPage
