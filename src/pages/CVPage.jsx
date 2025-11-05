import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Globe, Calendar, Award, Briefcase, GraduationCap, Code, Star, User, Rocket, Play, ExternalLink } from 'lucide-react'

/**
 * CV/Resume Page component
 * 
 * Features:
 * - Professional CV layout with photo
 * - Contact information
 * - Skills section in sidebar
 * - Experience timeline
 * - Education details
 * - Achievements and awards
 * - Modern, clean design with improved layout
 */
const CVPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-16 lg:py-20" dir="ltr" lang="en">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-white to-blue-50/50 dark:from-dark-700 dark:to-dark-800 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-10 border-l-8 border-blue-600 hover:shadow-blue-500/20 transition-all duration-500 relative overflow-hidden">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        {/* Name and Title */}
                        <div className="text-left">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                                Mohamed Shams Abdelaziz
                            </h1>
                            <p className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 font-semibold">
                                MBBCH - Emergency Medicine Doctor
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 lg:max-w-md shadow-lg border border-gray-200/50 dark:border-dark-600/50">
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-5 uppercase tracking-wider flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                Contact Information
                            </h3>
                            <div className="space-y-3.5">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    <Phone className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <span>+966053489204</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    <Mail className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <span className="break-all">shamsmohamed155@gmail.com</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <MapPin className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <span>Saudi Arabia</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Calendar className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <span>17 - 06 - 1996</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Globe className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <span>Egyptian</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Photo */}
                        <div className="bg-gradient-to-br from-white to-blue-50/50 dark:from-dark-700 dark:to-dark-800 rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-dark-600/50 hover:shadow-2xl transition-all duration-500">
                            <div className="w-36 h-36 mx-auto mb-5 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-300">
                                {/* Placeholder for photo - replace with actual image */}
                                <User className="w-20 h-20 text-blue-600 dark:text-blue-400" />
                                {/* When you have an actual photo, replace the above with:
                                <img 
                                    src="/path-to-your-photo.jpg" 
                                    alt="Mohamed Shams Abdelaziz"
                                    className="w-full h-full object-cover"
                                />
                                */}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Dr. Mohamed Shams</h3>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full inline-block">
                                Emergency Medicine
                            </p>
                        </div>

                        {/* Professional Summary */}
                        <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-dark-700 dark:to-dark-800 rounded-3xl shadow-xl p-6 border border-gray-200/50 dark:border-dark-600/50 hover:shadow-2xl transition-all duration-500">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-5 uppercase tracking-wide flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Professional Summary
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                Highly skilled and compassionate medical professional with extensive experience in emergency medicine and patient care. Proven track record in acute care management, trauma response, and clinical excellence across diverse healthcare environments.
                            </p>
                        </div>

                        {/* Education */}
                        <div className="bg-gradient-to-br from-white to-green-50/30 dark:from-dark-700 dark:to-dark-800 rounded-3xl shadow-xl p-6 border border-gray-200/50 dark:border-dark-600/50 hover:shadow-2xl transition-all duration-500">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-5 uppercase tracking-wide flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Education
                            </h2>
                            <div className="space-y-4">
                                {/* USMLE STEP 2 - Most recent, styled like Saudi medical licence */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <div className="text-gray-900 dark:text-white text-sm font-semibold">USMLE STEP 2</div>
                                            <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">United States Medical Licensing Examination</div>
                                            <div className="text-gray-500 dark:text-gray-400 text-xs">In process</div>
                                        </div>
                                    </div>
                                </div>

                                {/* USMLE STEP 1 - Second most recent, clickable */}
                                <Link
                                    to="/certificates/usmle-step1"
                                    className="block border-l-4 border-blue-500 pl-4 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                USMLE STEP I
                                            </h3>
                                            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">PASS - February 2025</p>
                                            <div className="mt-2 inline-flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                                                <span>View Certificate</span>
                                                <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* House Officer - Third, with Google Maps link */}
                                <div className="border-l-4 border-gray-300 pl-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                        House Officer
                                    </h3>
                                    <p className="text-blue-600 dark:text-blue-400 text-sm">February 2021</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <p className="text-gray-600 dark:text-gray-300 text-xs">Alexandria University</p>
                                        <a
                                            href="https://www.google.com/maps/place/9+Al+Bastmi,+Bab+Sharqi+WA+Wabour+Al+Meyah,+Bab+Shar',+Alexandria+Governorate+5372066,+Egypt"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                            title="View on Google Maps"
                                        >
                                            <MapPin className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>

                                {/* MBBCH - Oldest */}
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                        MBBCH
                                    </h3>
                                    <p className="text-blue-600 dark:text-blue-400 text-sm">October 2020</p>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs">Alexandria University</p>
                                </div>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="bg-gradient-to-br from-white to-pink-50/30 dark:from-dark-700 dark:to-dark-800 rounded-3xl shadow-xl p-6 border border-gray-200/50 dark:border-dark-600/50 hover:shadow-2xl transition-all duration-500">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-5 uppercase tracking-wide flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Languages
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white/60 dark:bg-dark-600/60 rounded-xl">
                                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Arabic</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">Native</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/60 dark:bg-dark-600/60 rounded-xl">
                                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">English</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">Fluent</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/60 dark:bg-dark-600/60 rounded-xl">
                                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">French</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">Conversational</span>
                                </div>
                            </div>
                        </div>

                        {/* Hobbies and Interests */}
                        <div className="bg-gradient-to-br from-white to-orange-50/30 dark:from-dark-700 dark:to-dark-800 rounded-3xl shadow-xl p-6 border border-gray-200/50 dark:border-dark-600/50 hover:shadow-2xl transition-all duration-500">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-5 uppercase tracking-wide flex items-center gap-2">
                                <Rocket className="h-5 w-5" />
                                Hobbies & Interests
                            </h2>
                            <div className="space-y-2">
                                <Link
                                    to="/reading"
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group cursor-pointer"
                                >
                                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                    <span className="text-gray-700 dark:text-gray-300 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Reading</span>
                                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">Freelancing</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">Continuing Medical Education</span>
                                </div>
                            </div>
                        </div>

                        {/* Training */}
                        <div className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-dark-700 dark:to-dark-800 rounded-3xl shadow-xl p-6 border border-gray-200/50 dark:border-dark-600/50 hover:shadow-2xl transition-all duration-500">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-5 uppercase tracking-wide flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Training
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">EUS interventional procedures MasterClass EAMBS</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">Liver Regeneration, current and future trends</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-gradient-to-br from-white to-cyan-50/30 dark:from-dark-700 dark:to-dark-800 rounded-3xl shadow-xl p-6 border border-gray-200/50 dark:border-dark-600/50 hover:shadow-2xl transition-all duration-500">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-5 uppercase tracking-wide flex items-center gap-2">
                                <Code className="h-5 w-5" />
                                Core Skills
                            </h2>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Emergency Medicine</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Trauma Management</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Critical Care</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Clinical Research</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Medical Documentation</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Patient Communication</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Honors */}
                        <div className="bg-gradient-to-br from-white to-amber-50/30 dark:from-dark-700 dark:to-dark-800 rounded-3xl shadow-xl p-6 border border-gray-200/50 dark:border-dark-600/50 hover:shadow-2xl transition-all duration-500">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-wide flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Honors & Awards
                            </h2>
                            <Link
                                to="/certificates/maaden"
                                className="block bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-2xl hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all duration-300 border-2 border-amber-200 dark:border-amber-700 hover:border-amber-300 dark:hover:border-amber-600 group cursor-pointer shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02]"
                            >
                                <div className="flex items-start justify-between space-x-3">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Award className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                                                Certificate of Excellence
                                            </h3>
                                            <p className="text-amber-700 dark:text-amber-300 font-medium">Ma'aden</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                                                Outstanding dedication and exceptional leadership in medical services (2024-2025)
                                            </p>
                                            <div className="mt-3 inline-flex items-center text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                                                <span>Click to view certificate</span>
                                                <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Experience */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Experience */}
                        <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-dark-700 dark:to-dark-800 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-200/50 dark:border-dark-600/50 hover:shadow-blue-500/20 transition-all duration-500">
                            <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-10 uppercase tracking-wide flex items-center gap-3">
                                <Briefcase className="h-7 w-7" />
                                Professional Experience
                            </h2>

                            {/* Timeline Container */}
                            <div className="relative">
                                {/* Central Timeline Line - Hidden on mobile, shown on lg screens */}
                                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-blue-200 dark:bg-blue-800"></div>
                                {/* Left Timeline Line - Visible on mobile only */}
                                <div className="lg:hidden absolute left-4 top-0 w-0.5 h-full bg-blue-200 dark:bg-blue-800"></div>

                                {/* Rocket Icon at Top - Continuous Improvement */}
                                <div className="absolute left-4 lg:left-1/2 transform lg:-translate-x-1/2 -top-6 z-20">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl animate-pulse border-2 border-white">
                                        <Rocket className="w-5 h-5 text-white transform rotate-45" />
                                    </div>
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity shadow-lg">
                                        🚀 Continuously Growing
                                    </div>
                                </div>

                                {/* Timeline Items */}
                                <div className="space-y-10 lg:space-y-16 pt-8">{/* Added pt-8 to give space for rocket */}
                                    {/* Item 1 - Right Side (Desktop) / Full Width (Mobile) */}
                                    <div className="relative flex flex-col lg:flex-row lg:items-center group">
                                        {/* Mobile & Desktop Layout */}
                                        <div className="lg:w-1/2 lg:pr-8 pl-16 lg:pl-0">
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 lg:p-7 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 shadow-lg hover:shadow-2xl">
                                                {/* Company Logo/Image */}
                                                <div className="mb-5">
                                                    <div className="w-full h-28 lg:h-36 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-blue-300 dark:ring-blue-700">
                                                        <img
                                                            src="/pictures/maaden.jpg"
                                                            alt="Ma'aden Company"
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                </div>
                                                {/* Text Content */}
                                                <h3 className="text-base lg:text-xl font-bold text-gray-900 dark:text-white mb-3">
                                                    Emergency Medicine Doctor
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm lg:text-base mb-4">
                                                    Ma'aden wa'ad al-shamaal
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2.5 text-sm leading-relaxed">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-500 mt-1">•</span>
                                                        <span>Assessed potential risks associated with hazardous materials in workplace environments</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-500 mt-1">•</span>
                                                        <span>Provided comprehensive general health services to diverse patient populations</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-500 mt-1">•</span>
                                                        <span>Managed emergency response protocols and safety procedures</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-5 lg:left-1/2 transform lg:-translate-x-1/2 top-8 lg:top-auto w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-3 lg:border-4 border-white dark:border-dark-700 z-10 shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
                                        {/* Date */}
                                        <div className="lg:w-1/2 lg:pl-8 pl-16 mt-4 lg:mt-0">
                                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 lg:px-5 lg:py-3 rounded-full text-xs lg:text-sm font-bold inline-block shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                                Feb 2024 - June 2025
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 2 - Left Side (Desktop) / Full Width (Mobile) */}
                                    <div className="relative flex flex-col lg:flex-row lg:items-center group">
                                        {/* Date - Mobile: bottom, Desktop: left */}
                                        <div className="lg:w-1/2 lg:pr-8 pl-16 lg:pl-0 order-2 lg:order-1 mt-4 lg:mt-0">
                                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 lg:px-5 lg:py-3 rounded-full text-xs lg:text-sm font-bold inline-block shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                                June 2022 - Oct 2023
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-5 lg:left-1/2 transform lg:-translate-x-1/2 top-8 lg:top-auto w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full border-3 lg:border-4 border-white dark:border-dark-700 z-10 shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
                                        {/* Content - Mobile: top, Desktop: right */}
                                        <div className="lg:w-1/2 lg:pl-8 pl-16 order-1 lg:order-2">
                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 lg:p-7 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 shadow-lg hover:shadow-2xl">
                                                {/* Company Logo/Image */}
                                                <div className="mb-5">
                                                    <div className="w-full h-28 lg:h-36 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-purple-300 dark:ring-purple-700">
                                                        <img
                                                            src="/pictures/edc.jpg"
                                                            alt="Egyptian Drilling Company"
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                </div>
                                                {/* Text Content */}
                                                <h3 className="text-base lg:text-xl font-bold text-gray-900 dark:text-white mb-3">
                                                    Emergency Medicine Doctor
                                                </h3>
                                                <p className="text-purple-600 dark:text-purple-400 font-bold text-sm lg:text-base mb-4">
                                                    Egyptian Drilling Company
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2.5 text-sm leading-relaxed">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-purple-500 mt-1">•</span>
                                                        <span>Excellence in emergency response and trauma management</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-purple-500 mt-1">•</span>
                                                        <span>Medical evacuation coordination and safety meetings</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-purple-500 mt-1">•</span>
                                                        <span>Health education and infection control protocols</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-purple-500 mt-1">•</span>
                                                        <span>Laboratory operations management and data documentation</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 3 - Right Side (Desktop) / Full Width (Mobile) */}
                                    <div className="relative flex flex-col lg:flex-row lg:items-center group">
                                        {/* Content */}
                                        <div className="lg:w-1/2 lg:pr-8 pl-16 lg:pl-0">
                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 lg:p-7 rounded-2xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 shadow-lg hover:shadow-2xl">
                                                {/* Company Logo/Image */}
                                                <div className="mb-5">
                                                    <div className="w-full h-28 lg:h-36 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-green-300 dark:ring-green-700">
                                                        <img
                                                            src="/pictures/petrofarah.png"
                                                            alt="Petrofarah Petroleum Co."
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                </div>
                                                {/* Text Content */}
                                                <h3 className="text-base lg:text-xl font-bold text-gray-900 dark:text-white mb-3">
                                                    Emergency Medicine Doctor
                                                </h3>
                                                <p className="text-green-600 dark:text-green-400 font-bold text-sm lg:text-base mb-4">
                                                    Petrofarah Petroleum Co. Apex Energy
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2.5 text-sm leading-relaxed">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-green-500 mt-1">•</span>
                                                        <span>Managed multiple projects ensuring timely completion</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-green-500 mt-1">•</span>
                                                        <span>Performed routine checkups and maintenance services</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-5 lg:left-1/2 transform lg:-translate-x-1/2 top-8 lg:top-auto w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full border-3 lg:border-4 border-white dark:border-dark-700 z-10 shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
                                        {/* Date */}
                                        <div className="lg:w-1/2 lg:pl-8 pl-16 mt-4 lg:mt-0">
                                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 lg:px-5 lg:py-3 rounded-full text-xs lg:text-sm font-bold inline-block shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                                July 2023 - Aug 2023
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 4 - Left Side (Desktop) / Full Width (Mobile) */}
                                    <div className="relative flex flex-col lg:flex-row lg:items-center group">
                                        {/* Date - Mobile: bottom, Desktop: left */}
                                        <div className="lg:w-1/2 lg:pr-8 pl-16 lg:pl-0 order-2 lg:order-1 mt-4 lg:mt-0">
                                            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 lg:px-5 lg:py-3 rounded-full text-xs lg:text-sm font-bold inline-block shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                                April 2022 - July 2023
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-5 lg:left-1/2 transform lg:-translate-x-1/2 top-8 lg:top-auto w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-orange-500 to-red-600 rounded-full border-3 lg:border-4 border-white dark:border-dark-700 z-10 shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
                                        {/* Content - Mobile: top, Desktop: right */}
                                        <div className="lg:w-1/2 lg:pl-8 pl-16 order-1 lg:order-2">
                                            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-5 lg:p-7 rounded-2xl border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 shadow-lg hover:shadow-2xl">
                                                <h3 className="text-base lg:text-xl font-bold text-gray-900 dark:text-white mb-3">
                                                    Emergency Medicine Doctor
                                                </h3>
                                                <p className="text-orange-600 dark:text-orange-400 font-bold text-sm lg:text-base mb-4">
                                                    Saad Hospital
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2.5 text-sm leading-relaxed">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-orange-500 mt-1">•</span>
                                                        <span>Rapid response to hospital codes with advanced resuscitation</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-orange-500 mt-1">•</span>
                                                        <span>Collaborative healthcare team coordination</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-orange-500 mt-1">•</span>
                                                        <span>Ensured continuity of patient care</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 5 - Right Side (Desktop) / Full Width (Mobile) */}
                                    <div className="relative flex flex-col lg:flex-row lg:items-center">
                                        {/* Content */}
                                        <div className="lg:w-1/2 lg:pr-8 lg:text-right pl-12 lg:pl-0">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 lg:p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2 text-left">
                                                    Emergency Medicine Doctor
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3 text-left">
                                                    Al-Amriah Hospital
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm text-left">
                                                    <li>• Critical care and immediate medical attention in emergencies</li>
                                                    <li>• Comprehensive patient documentation and record keeping</li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-4 lg:left-1/2 transform lg:-translate-x-1/2 top-6 lg:top-auto w-3 h-3 lg:w-4 lg:h-4 bg-blue-600 rounded-full border-2 lg:border-4 border-white dark:border-dark-700 z-10"></div>
                                        {/* Date */}
                                        <div className="lg:w-1/2 lg:pl-8 pl-12 mt-3 lg:mt-0">
                                            <div className="bg-blue-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium inline-block">
                                                April 2022 - June 2022
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 6 - Left Side (Desktop) / Full Width (Mobile) */}
                                    <div className="relative flex flex-col lg:flex-row lg:items-center">
                                        {/* Date - Mobile: bottom, Desktop: left */}
                                        <div className="lg:w-1/2 lg:pr-8 lg:text-right pl-12 lg:pl-0 order-2 lg:order-1 mt-3 lg:mt-0">
                                            <div className="bg-blue-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium inline-block">
                                                March 2022 - April 2022
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-4 lg:left-1/2 transform lg:-translate-x-1/2 top-6 lg:top-auto w-3 h-3 lg:w-4 lg:h-4 bg-blue-600 rounded-full border-2 lg:border-4 border-white dark:border-dark-700 z-10"></div>
                                        {/* Content - Mobile: top, Desktop: right */}
                                        <div className="lg:w-1/2 lg:pl-8 pl-12 order-1 lg:order-2">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 lg:p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2 text-left">
                                                    ICU Intern
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3 text-left">
                                                    Ras Elteen Hospital
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm text-left">
                                                    <li>• Intensive care experience with critically ill patients</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 7 - Right Side (Desktop) / Full Width (Mobile) */}
                                    <div className="relative flex flex-col lg:flex-row lg:items-center">
                                        {/* Content */}
                                        <div className="lg:w-1/2 lg:pr-8 lg:text-right pl-12 lg:pl-0">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 lg:p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2 text-left">
                                                    House Officer
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3 text-left">
                                                    Alexandria School of Medicine
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm text-left">
                                                    <li>• Hands-on experience in various medical specialties</li>
                                                    <li>• Comprehensive patient care and treatment</li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-4 lg:left-1/2 transform lg:-translate-x-1/2 top-6 lg:top-auto w-3 h-3 lg:w-4 lg:h-4 bg-blue-600 rounded-full border-2 lg:border-4 border-white dark:border-dark-700 z-10"></div>
                                        {/* Date */}
                                        <div className="lg:w-1/2 lg:pl-8 pl-12 mt-3 lg:mt-0">
                                            <div className="bg-blue-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium inline-block">
                                                March 2021 - Feb 2022
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Start Icon at Bottom - The Beginning */}
                                <div className="absolute left-4 lg:left-1/2 transform lg:-translate-x-1/2 -bottom-6 z-20">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                                        <Play className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity shadow-lg">
                                        ▶️ The Journey Begins
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Courses & Certifications */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Courses */}
                            <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-wide">
                                    Courses
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Introduction to the Principles and Practice of Clinical Research 2024-2025, NIH</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Python for Data Science and Machine Learning Bootcamp</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">R Programming A-Z™: R For Data Science With Real Exercises!</span>
                                    </div>
                                </div>
                            </div>

                            {/* Certifications */}
                            <div className="bg-gradient-to-br from-white to-green-50/30 dark:from-dark-700 dark:to-dark-800 rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-dark-600/50 hover:shadow-green-500/20 transition-all duration-500">
                                <h2 className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-8 uppercase tracking-wide flex items-center gap-3">
                                    <Award className="h-6 w-6" />
                                    Certifications
                                </h2>
                                <div className="space-y-4">
                                    {/* Saudi Medical License */}
                                    <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <div className="text-gray-900 dark:text-white text-sm font-semibold">Saudi medical licence examination</div>
                                            <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">Saudi Commission for Health Specialties</div>
                                            <div className="text-gray-500 dark:text-gray-400 text-xs">Issued Oct 2023 • Credential ID 23554578</div>
                                        </div>
                                    </div>

                                    {/* ATLS Certificate */}
                                    <Link
                                        to="/certificates/atls"
                                        className="flex items-center justify-between space-x-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group cursor-pointer"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-blue-600 transition-colors"></div>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Advanced Trauma Life Support (ATLS), ACS, 2024</span>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100" />
                                    </Link>

                                    {/* ACLS Certificate */}
                                    <Link
                                        to="/certificates/acls"
                                        className="flex items-center justify-between space-x-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group cursor-pointer"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-red-600 transition-colors"></div>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Advanced Cardiac Life Support (ACLS), AHA, 2024</span>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" />
                                    </Link>

                                    {/* BLS Certificate */}
                                    <Link
                                        to="/certificates/bls"
                                        className="flex items-center justify-between space-x-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 group cursor-pointer"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-green-600 transition-colors"></div>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Basic Life Support (BLS), AHA, 2024</span>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors opacity-0 group-hover:opacity-100" />
                                    </Link>

                                    {/* Other Certificates - Non-clickable for now */}
                                    <div className="flex items-start space-x-3 p-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Bloodborne Pathogens Certificate, NHCPS, 2021</span>
                                    </div>
                                    <div className="flex items-start space-x-3 p-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Mechanical Ventilation for COVID-19 Certificate</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download CV Button */}
                <div className="text-center mt-16 animate-fadeInUp">
                    <a
                        href="https://www.mediafire.com/file/iprsuzqsl3qe1ti/MOHAMED+SHAMS+CV.pdf/file"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-full transition-all duration-500 shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden"
                    >
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                        <Calendar className="relative z-10 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="relative z-10">Download Full CV as PDF</span>

                        {/* Download icon */}
                        <svg
                            className="relative z-10 w-5 h-5 transform group-hover:translate-y-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default CVPage
