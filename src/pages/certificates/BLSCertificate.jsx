import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Building, Award, Download, HeartHandshake } from 'lucide-react'

/**
 * BLS Certificate Page
 * Displays detailed information about the Basic Life Support certification
 */
const BLSCertificate = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-8" dir="ltr" lang="en">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to CV</span>
                    </button>
                </div>

                {/* Certificate Header */}
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <HeartHandshake className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Basic Life Support</h1>
                                <p className="text-green-100 text-lg">(BLS) Certification</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Certificate Details */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Building className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Issuing Organization</h3>
                                            <p className="text-gray-600 dark:text-gray-300">American Heart Association (AHA)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Issue Date</h3>
                                            <p className="text-gray-600 dark:text-gray-300">2024</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-red-600 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Expiration Date</h3>
                                            <p className="text-gray-600 dark:text-gray-300">2025</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Certificate Description */}
                                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About BLS</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        Basic Life Support (BLS) is the foundation for saving lives after cardiac arrest.
                                        This certification course teaches both single-rescuer and team basic life support skills
                                        for application in both prehospital and in-facility environments, with a focus on
                                        high-quality CPR and team dynamics.
                                    </p>
                                </div>

                                {/* Skills Covered */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Skills & Competencies</h3>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                            <span>High-quality CPR for adults, children, and infants</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                            <span>AED (Automated External Defibrillator) use</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                            <span>Relief of choking in responsive victims</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                            <span>Effective team communication and dynamics</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                            <span>Recognition of cardiac arrest and breathing emergencies</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Certificate Image */}
                            <div className="lg:flex lg:items-center lg:justify-center">
                                <div className="bg-gray-100 dark:bg-dark-700 rounded-xl p-4 shadow-inner">
                                    <img
                                        src="/pictures/BLS.jpg"
                                        alt="BLS Certificate"
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/cv"
                                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Back to CV
                            </Link>
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                                <span>Download Certificate</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BLSCertificate
