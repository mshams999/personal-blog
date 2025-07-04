import React from 'react'

/**
 * StyleGuidePage component showcasing the design system
 * 
 * Features:
 * - Typography examples
 * - Color palette display
 * - Component showcase
 * - Layout examples
 */
const StyleGuidePage = () => {
    return (
        <div className="min-h-screen py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                        Style Guide
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        A comprehensive guide to our design system and visual identity
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Typography */}
                    <section>
                        <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">
                            Typography
                        </h2>

                        <div className="card p-8">
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                                        Heading 1 - Nunito Bold
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        4xl, font-heading, font-bold
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-heading font-semibold text-gray-900 dark:text-white">
                                        Heading 2 - Nunito Semibold
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        3xl, font-heading, font-semibold
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                                        Heading 3 - Nunito Semibold
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        2xl, font-heading, font-semibold
                                    </p>
                                </div>

                                <div>
                                    <p className="text-base text-gray-700 dark:text-gray-300">
                                        Body text - Inter Regular. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        base, font-sans, regular
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Small text - Inter Regular. Used for captions, metadata, and secondary information.
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        sm, font-sans, regular
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Colors */}
                    <section>
                        <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">
                            Color Palette
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Primary Colors */}
                            <div className="card p-6">
                                <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-4">
                                    Primary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">primary-500</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-primary-400 rounded-full"></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">primary-400</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-primary-600 rounded-full"></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">primary-600</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gray Colors */}
                            <div className="card p-6">
                                <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-4">
                                    Gray
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border"></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">gray-100/800</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">gray-300/600</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gray-700 dark:bg-gray-300 rounded-full"></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">gray-700/300</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dark Colors */}
                            <div className="card p-6">
                                <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-4">
                                    Dark Theme
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-dark-800 rounded-full border"></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">dark-800</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-dark-700 rounded-full"></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">dark-700</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-dark-600 rounded-full"></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">dark-600</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Components */}
                    <section>
                        <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">
                            Components
                        </h2>

                        <div className="space-y-8">
                            {/* Buttons */}
                            <div className="card p-6">
                                <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-4">
                                    Buttons
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    <button className="btn-primary">Primary Button</button>
                                    <button className="btn-secondary">Secondary Button</button>
                                    <button className="btn-primary" disabled>Disabled Button</button>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="card p-6">
                                <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-4">
                                    Cards
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="card p-4">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Basic Card</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            This is a basic card component with rounded corners and subtle shadow.
                                        </p>
                                    </div>
                                    <div className="card card-hover p-4">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Hover Card</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            This card has hover effects with shadow and transform animations.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Elements */}
                            <div className="card p-6">
                                <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-4">
                                    Form Elements
                                </h3>
                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Text Input
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your text"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Textarea
                                        </label>
                                        <textarea
                                            placeholder="Enter your message"
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default StyleGuidePage
