import React from 'react'

const CategoryPage = ({ category }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {category}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Posts related to {category.toLowerCase()}
                    </p>
                    <div className="bg-white dark:bg-dark-700 rounded-2xl p-8 shadow-sm">
                        <p className="text-gray-600 dark:text-gray-300">
                            This category page is coming soon. We're working on bringing you amazing {category.toLowerCase()} content!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryPage
