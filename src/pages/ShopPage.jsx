import React from 'react'

const ShopPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Shop
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Browse our curated collection
                    </p>
                    <div className="bg-white dark:bg-dark-700 rounded-2xl p-8 shadow-sm">
                        <p className="text-gray-600 dark:text-gray-300">
                            Our shop is coming soon. We're working on bringing you amazing products!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopPage
