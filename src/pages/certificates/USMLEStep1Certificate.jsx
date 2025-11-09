import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Building, Award, Download, GraduationCap, Star, Sparkles, Trophy } from 'lucide-react'

/**
 * USMLE Step 1 Certificate Page
 * Displays detailed information about the USMLE Step 1 examination pass
 */
const USMLEStep1Certificate = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 py-8" dir="ltr" lang="en">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to CV</span>
                    </button>
                </div>

                {/* Certificate Header */}
                <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gradient-to-r from-blue-400 to-purple-500">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                        <div className="absolute top-4 right-4">
                            <Sparkles className="w-8 h-8 text-blue-200 animate-pulse" />
                        </div>
                        <div className="absolute bottom-4 left-4">
                            <Star className="w-6 h-6 text-purple-200 animate-ping" />
                        </div>
                        <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2">
                            <Star className="w-4 h-4 text-indigo-200 animate-pulse" style={{ animationDelay: '1s' }} />
                        </div>

                        <div className="flex items-center gap-6 mb-6 relative z-10">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold drop-shadow-lg">USMLE Step 1</h1>
                                <p className="text-blue-100 text-xl font-medium">United States Medical Licensing Examination</p>
                                <p className="text-blue-200 text-lg">PASS - February 2025</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Certificate Details */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                                        <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Examination Authority</h3>
                                            <p className="text-blue-700 dark:text-blue-300 font-medium">United States Medical Licensing Examination</p>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">National Board of Medical Examiners (NBME)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                                        <Calendar className="w-6 h-6 text-green-600" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Examination Date</h3>
                                            <p className="text-green-700 dark:text-green-300 font-medium">February 2025</p>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">Successfully Passed</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                                        <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Achievement Level</h3>
                                            <p className="text-purple-700 dark:text-purple-300 font-medium">PASS</p>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">Step 1 Examination</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Achievement Description */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl border-2 border-blue-200 dark:border-blue-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-xl flex items-center gap-2">
                                        <GraduationCap className="w-6 h-6 text-blue-600" />
                                        <span>About USMLE Step 1</span>
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                        The <strong>United States Medical Licensing Examination (USMLE) Step 1</strong> is a comprehensive
                                        examination that assesses whether medical students and graduates understand and can apply important
                                        concepts of the basic sciences to the practice of medicine.
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        Passing USMLE Step 1 is a crucial milestone for medical graduates seeking to practice medicine in the United States.
                                        This examination demonstrates mastery of fundamental medical knowledge and is a prerequisite for medical licensure
                                        and residency training in the US healthcare system.
                                    </p>
                                </div>

                                {/* Key Knowledge Areas */}
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-xl">Knowledge Areas Assessed</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">Anatomy and Cell Biology</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">Biochemistry and Molecular Biology</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">Microbiology and Immunology</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">Pathology and Pathophysiology</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">Pharmacology and Therapeutics</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">Physiology and Biophysics</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Certificate Image - Larger Display with Shine Effect */}
                            <div className="lg:flex lg:items-start lg:justify-center">
                                <div className="relative">
                                    {/* Enhanced Shine Effect */}
                                    <div className="absolute -inset-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 rounded-3xl blur-2xl opacity-75 animate-pulse"></div>
                                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-400 rounded-3xl blur-xl opacity-50"></div>

                                    {/* Main certificate container */}
                                    <div className="relative bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-2xl">
                                        {/* Shine overlay animation */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shine"></div>

                                        <img
                                            src="/pictures/step1.jpg"
                                            alt="USMLE Step 1 Certificate"
                                            loading="lazy"
                                            className="w-full h-auto rounded-xl shadow-xl border-4 border-gradient-to-r from-blue-300 to-purple-400 transform hover:scale-105 transition-transform duration-500"
                                            style={{ minHeight: '400px', objectFit: 'contain' }}
                                        />

                                        {/* Success badge */}
                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                                            <Award className="w-6 h-6" />
                                        </div>

                                        {/* Sparkle effects */}
                                        <div className="absolute top-4 left-4 text-blue-400 animate-pulse">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div className="absolute bottom-4 right-4 text-purple-400 animate-ping">
                                            <Star className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-12 flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/cv"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to CV
                            </Link>
                            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
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

export default USMLEStep1Certificate
