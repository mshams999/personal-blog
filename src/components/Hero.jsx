import React from 'react'
import { MapPin, HeartPulse, Camera, FileText } from 'lucide-react'

/**
 * Hero section component for the blog homepage
 * Features a beautiful layout with personal photos and intro text
 */
const Hero = () => {
    return (
        <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Text Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                <span className="text-sm font-medium tracking-wide uppercase">Beyond the Chief Complaint:</span>
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                                Stories & Science <br />
                                <span className="text-primary-600 dark:text-primary-400">with Dr. Shams.</span>
                            </h1>

                            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                                Join me on this exciting journey through the world of medicine, healing, and human stories. From clinical cases to global health insights, from late-night call shifts to breakthroughs that save lives — this is where I share the raw, real, and remarkable life of being a doctor. Let's dive into medicine with heart, hustle, and a dose of humanity.
                            </p>
                        </div>

                        {/* Stats/Info */}
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <MapPin className="w-5 h-5 text-primary-500" />
                                <span className="text-sm font-medium">Based in Saudi Arabia</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <HeartPulse className="w-5 h-5 text-primary-500" />
                                <span className="text-sm font-medium">Health Physician</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <Camera className="w-5 h-5 text-primary-500" />
                                <span className="text-sm font-medium">Healthcare Storyteller</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="/cv" className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                <FileText className="w-5 h-5 mr-2" />
                                My CV
                            </a>
                        </div>
                    </div>

                    {/* Images Grid */}
                    <div className="relative">
                        {/* Main large image */}
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-dark-700">
                                <img
                                    src="/pictures/mohamed-profile.jpg"
                                    alt="Mohamed - Main Profile"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>

                            {/* Floating workspace image */}
                            <div className="absolute -left-8 -bottom-8 w-32 h-32 lg:w-40 lg:h-40 group">
                                <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl bg-gray-200 dark:bg-dark-700 border-4 border-white dark:border-dark-800 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                                    <img
                                        src="/pictures/hero-workspace.jpg"
                                        alt="Workspace Setup"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Floating travel image */}
                            <div className="absolute -right-6 top-8 w-24 h-24 lg:w-32 lg:h-32 group">
                                <div className="w-full h-full rounded-full overflow-hidden shadow-xl bg-gray-200 dark:bg-dark-700 border-4 border-white dark:border-dark-800 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                                    <img
                                        src="/pictures/hero-outdoor-selfie.jpg"
                                        alt="Travel Adventures"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Floating plane selfie */}
                            <div className="absolute -right-4 -bottom-12 w-28 h-28 lg:w-36 lg:h-36 group">
                                <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl bg-gray-200 dark:bg-dark-700 border-4 border-white dark:border-dark-800 transform rotate-6 hover:shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-12">
                                    <img
                                        src="/pictures/hero-plane-selfie.jpg"
                                        alt="Travel Moments"
                                        className="w-full h-full object-cover transform -rotate-6"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Decorative elements with animation */}
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-sm animate-pulse"></div>
                        <div className="absolute top-1/4 -right-8 w-8 h-8 bg-secondary-200 dark:bg-secondary-800/50 rounded-full blur-sm animate-bounce"></div>
                        <div className="absolute bottom-1/4 -left-6 w-6 h-6 bg-primary-200 dark:bg-primary-800/50 rounded-full blur-sm animate-pulse delay-1000"></div>
                    </div>
                </div>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg className="w-full h-8 lg:h-12 text-gray-50 dark:text-dark-900" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </section>
    )
}

export default Hero
