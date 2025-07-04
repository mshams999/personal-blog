import React from 'react'

const HomePageTest = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Homepage Test
                </h1>
                <div className="p-6 bg-white dark:bg-dark-700 rounded-lg shadow">
                    <p className="text-gray-600 dark:text-gray-300">
                        This is a test to see if the homepage loads properly.
                    </p>
                    <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <p className="text-green-800 dark:text-green-200">
                            ✅ Homepage is loading successfully!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePageTest
