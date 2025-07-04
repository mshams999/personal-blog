import React from 'react'
import { Mail, Phone, MapPin, Globe, Calendar, Award, Briefcase, GraduationCap, Code, Star, User } from 'lucide-react'

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
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-blue-600">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        {/* Name and Title */}
                        <div className="text-center lg:text-left mb-6 lg:mb-0">
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                Mohamed Shams Abdelaziz
                            </h1>
                            <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">
                                MBBCH - Emergency Medicine Doctor
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-6 lg:max-w-md">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                                Contact Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Phone className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400" />
                                    <span>+966053489204</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Mail className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400" />
                                    <span>shamsmohamed155@gmail.com</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <MapPin className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400" />
                                    <span>Saudi Arabia, Turaif</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Calendar className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400" />
                                    <span>17 - 06 - 1996</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Globe className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400" />
                                    <span>Egyptian</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Photo */}
                        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6 text-center">
                            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center overflow-hidden shadow-lg">
                                {/* Placeholder for photo - replace with actual image */}
                                <User className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                                {/* When you have an actual photo, replace the above with:
                                <img 
                                    src="/path-to-your-photo.jpg" 
                                    alt="Mohamed Shams Abdelaziz"
                                    className="w-full h-full object-cover"
                                />
                                */}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dr. Mohamed Shams</h3>
                            <p className="text-sm text-blue-600 dark:text-blue-400">Emergency Medicine</p>
                        </div>

                        {/* Professional Summary */}
                        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wide">
                                Professional Summary
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                Highly skilled and compassionate medical professional with extensive experience in emergency medicine and patient care. Proven track record in acute care management, trauma response, and clinical excellence across diverse healthcare environments.
                            </p>
                        </div>

                        {/* Education */}
                        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wide">
                                Education
                            </h2>
                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                        USMLE STEP I
                                    </h3>
                                    <p className="text-blue-600 dark:text-blue-400 text-sm">PASS - February 2025</p>
                                </div>
                                <div className="border-l-4 border-gray-300 pl-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                        MBBCH
                                    </h3>
                                    <p className="text-blue-600 dark:text-blue-400 text-sm">October 2020</p>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs">Alexandria University</p>
                                </div>
                                <div className="border-l-4 border-gray-300 pl-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                        House Officer
                                    </h3>
                                    <p className="text-blue-600 dark:text-blue-400 text-sm">February 2021</p>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs">Alexandria University</p>
                                </div>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wide">
                                Languages
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">Arabic</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Native</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">English</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Fluent</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">French</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Conversational</span>
                                </div>
                            </div>
                        </div>

                        {/* Hobbies and Interests */}
                        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wide">
                                Hobbies & Interests
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">Reading</span>
                                </div>
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
                        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wide">
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
                        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wide">
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
                        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wide">
                                Honors & Awards
                            </h2>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <div className="flex items-start space-x-3">
                                    <Award className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                            Certificate of Excellence
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-xs">Ma'aden</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            Outstanding dedication and exceptional leadership in medical services (2024-2025)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Experience */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Experience */}
                        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-8 uppercase tracking-wide">
                                Professional Experience
                            </h2>

                            {/* Timeline Container */}
                            <div className="relative">
                                {/* Central Timeline Line */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-blue-200 dark:bg-blue-800"></div>

                                {/* Timeline Items */}
                                <div className="space-y-12">
                                    {/* Item 1 - Right Side */}
                                    <div className="relative flex items-center">
                                        <div className="w-1/2 pr-8 text-right">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    Emergency Medicine Doctor
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">
                                                    Ma'aden wa'ad al-shamaal
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
                                                    <li>• Assessed potential risks associated with hazardous materials in workplace environments</li>
                                                    <li>• Provided comprehensive general health services to diverse patient populations</li>
                                                    <li>• Managed emergency response protocols and safety procedures</li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-dark-700 z-10"></div>
                                        {/* Date */}
                                        <div className="w-1/2 pl-8">
                                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
                                                Feb 2024 - June 2025
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 2 - Left Side */}
                                    <div className="relative flex items-center">
                                        <div className="w-1/2 pr-8 text-right">
                                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
                                                June 2022 - Oct 2023
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-dark-700 z-10"></div>
                                        <div className="w-1/2 pl-8">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    Emergency Medicine Doctor
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">
                                                    Egyptian Drilling Company
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
                                                    <li>• Excellence in emergency response and trauma management</li>
                                                    <li>• Medical evacuation coordination and safety meetings</li>
                                                    <li>• Health education and infection control protocols</li>
                                                    <li>• Laboratory operations management and data documentation</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 3 - Right Side */}
                                    <div className="relative flex items-center">
                                        <div className="w-1/2 pr-8 text-right">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    Emergency Medicine Doctor
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">
                                                    Petrofarah Petroleum Co. Apex Energy
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
                                                    <li>• Managed multiple projects ensuring timely completion</li>
                                                    <li>• Performed routine checkups and maintenance services</li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-dark-700 z-10"></div>
                                        {/* Date */}
                                        <div className="w-1/2 pl-8">
                                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
                                                July 2023 - Aug 2023
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 4 - Left Side */}
                                    <div className="relative flex items-center">
                                        <div className="w-1/2 pr-8 text-right">
                                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
                                                April 2022 - July 2023
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-dark-700 z-10"></div>
                                        <div className="w-1/2 pl-8">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    Emergency Medicine Doctor
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">
                                                    Saad Hospital
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
                                                    <li>• Rapid response to hospital codes with advanced resuscitation</li>
                                                    <li>• Collaborative healthcare team coordination</li>
                                                    <li>• Ensured continuity of patient care</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 5 - Right Side */}
                                    <div className="relative flex items-center">
                                        <div className="w-1/2 pr-8 text-right">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    Emergency Medicine Doctor
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">
                                                    Al-Amriah Hospital
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
                                                    <li>• Critical care and immediate medical attention in emergencies</li>
                                                    <li>• Comprehensive patient documentation and record keeping</li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-dark-700 z-10"></div>
                                        {/* Date */}
                                        <div className="w-1/2 pl-8">
                                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
                                                April 2022 - June 2022
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 6 - Left Side */}
                                    <div className="relative flex items-center">
                                        <div className="w-1/2 pr-8 text-right">
                                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
                                                March 2022 - April 2022
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-dark-700 z-10"></div>
                                        <div className="w-1/2 pl-8">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    ICU Intern
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">
                                                    Ras Elteen Hospital
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
                                                    <li>• Intensive care experience with critically ill patients</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 7 - Right Side */}
                                    <div className="relative flex items-center">
                                        <div className="w-1/2 pr-8 text-right">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    House Officer
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">
                                                    Alexandria School of Medicine
                                                </p>
                                                <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
                                                    <li>• Hands-on experience in various medical specialties</li>
                                                    <li>• Comprehensive patient care and treatment</li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-dark-700 z-10"></div>
                                        {/* Date */}
                                        <div className="w-1/2 pl-8">
                                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
                                                March 2021 - Feb 2022
                                            </div>
                                        </div>
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
                            <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-wide">
                                    Certifications
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Advanced Trauma Life Support (ATLS), ACS, 2024</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Advanced Cardiac Life Support (ACLS), AHA, 2024</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Basic Life Support (BLS), AHA, 2024</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Bloodborne Pathogens Certificate, NHCPS, 2021</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Mechanical Ventilation for COVID-19 Certificate</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download CV Button */}
                <div className="text-center mt-12">
                    <a
                        href="https://www.mediafire.com/file/iprsuzqsl3qe1ti/MOHAMED+SHAMS+CV.pdf/file"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <Calendar className="h-5 w-5 mr-2" />
                        Download Full CV as PDF
                    </a>
                </div>
            </div>
        </div>
    )
}

export default CVPage
