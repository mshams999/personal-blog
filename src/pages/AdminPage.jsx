import React from 'react'

const STORYBLOK_APP_URL = 'https://app.storyblok.com'

const AdminPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md mx-auto text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    Storyblok CMS
                </h1>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Content is managed in Storyblok. Open the Storyblok app to edit posts, pages, authors, categories, and site settings.
                </p>

                <a
                    href={STORYBLOK_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    Open Storyblok
                </a>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                    Tip: Append <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">?_storyblok</code> to any page URL inside the Storyblok Visual Editor to enable live preview.
                </div>
            </div>
        </div>
    )
}

export default AdminPage
