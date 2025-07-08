import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Building, Award, Download, Trophy, Star, Sparkles } from 'lucide-react'

/**
 * Ma'aden Certificate of Excellence Page
 * Displays detailed information about the Certificate of Excellence from Ma'aden
 */
const MaadenCertificate = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-amber-900/20 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center space-x-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to CV</span>
                    </button>
                </div>

                {/* Certificate Header */}
                <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gradient-to-r from-yellow-400 to-orange-500">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white p-8 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                        <div className="absolute top-4 right-4">
                            <Sparkles className="w-8 h-8 text-yellow-200 animate-pulse" />
                        </div>
                        <div className="absolute bottom-4 left-4">
                            <Star className="w-6 h-6 text-yellow-200 animate-ping" />
                        </div>

                        <div className="flex items-center space-x-6 mb-6 relative z-10">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold drop-shadow-lg">Certificate of Excellence</h1>
                                <p className="text-yellow-100 text-xl font-medium">Outstanding Achievement Award</p>
                                <p className="text-yellow-200 text-lg">Ma'aden Wa'ad Al-Shamaal</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Certificate Details */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                                        <Building className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Issuing Organization</h3>
                                            <p className="text-amber-700 dark:text-amber-300 font-medium">Ma'aden Wa'ad Al-Shamaal</p>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">Leading Mining Company in Saudi Arabia</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                                        <Calendar className="w-6 h-6 text-green-600" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Award Period</h3>
                                            <p className="text-green-700 dark:text-green-300 font-medium">2024 - 2025</p>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">Annual Recognition Period</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                                        <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Recognition</h3>
                                            <p className="text-purple-700 dark:text-purple-300 font-medium">Certificate of Excellence</p>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">Highest Level Achievement Award</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Achievement Description */}
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-8 rounded-2xl border-2 border-amber-200 dark:border-amber-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-xl flex items-center space-x-2">
                                        <Trophy className="w-6 h-6 text-amber-600" />
                                        <span>About This Achievement</span>
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                        This Certificate of Excellence recognizes <strong>outstanding dedication and exceptional leadership in medical services</strong> provided during the 2024-2025 period at Ma'aden Wa'ad Al-Shamaal mining operations.
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        This prestigious award is presented to healthcare professionals who demonstrate unwavering commitment to employee health and safety,
                                        exceptional clinical expertise, and leadership qualities that significantly contribute to the overall wellbeing of the workforce
                                        in challenging industrial environments.
                                    </p>
                                </div>

                                {/* Key Achievements */}
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-xl">Key Achievements Recognized</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">Outstanding dedication to employee health and safety</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">Exceptional leadership in medical emergency response</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">Comprehensive medical services in industrial environment</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">Innovation in workplace health protocols</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">Mentorship and team development excellence</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Certificate Image - Larger Display */}
                            <div className="lg:flex lg:items-start lg:justify-center">
                                <div className="relative">
                                    {/* Decorative frame */}
                                    <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 rounded-3xl blur-lg opacity-75"></div>
                                    <div className="relative bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-2xl">
                                        <img
                                            src="/pictures/honor.jpg"
                                            alt="Ma'aden Certificate of Excellence"
                                            className="w-full h-auto rounded-xl shadow-xl border-4 border-gradient-to-r from-yellow-300 to-orange-400"
                                            style={{ minHeight: '400px', objectFit: 'contain' }}
                                        />
                                        {/* Certificate authenticity badge */}
                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 rounded-full shadow-lg">
                                            <Award className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-12 flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/cv"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to CV
                            </Link>
                            <button className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                <Download className="w-5 h-5" />
                                <span>Download Certificate</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MaadenCertificate
