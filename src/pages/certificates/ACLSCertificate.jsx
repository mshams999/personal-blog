import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Building, Award, Download, Heart } from 'lucide-react'

/**
 * ACLS Certificate Page
 * Displays detailed information about the Advanced Cardiac Life Support certification
 */
const ACLSCertificate = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-8" dir="ltr" lang="en">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to CV</span>
                    </button>
                </div>

                {/* Certificate Header */}
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Advanced Cardiac Life Support</h1>
                                <p className="text-red-100 text-lg">(ACLS) Certification</p>
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
                                        <Building className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Issuing Organization</h3>
                                            <p className="text-gray-600 dark:text-gray-300">American Heart Association (AHA)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Issue Date</h3>
                                            <p className="text-gray-600 dark:text-gray-300">2024</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-red-600" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Expiration Date</h3>
                                            <p className="text-gray-600 dark:text-gray-300">2026</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Certificate Description */}
                                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About ACLS</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        Advanced Cardiac Life Support (ACLS) is an advanced course that builds on Basic Life Support (BLS) skills.
                                        It teaches healthcare providers advanced interventions for the treatment of cardiopulmonary arrest,
                                        acute arrhythmia, stroke, and other cardiovascular emergencies.
                                    </p>
                                </div>

                                {/* Skills Covered */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Skills & Competencies</h3>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span>Advanced airway management</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span>ECG rhythm recognition and interpretation</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span>Pharmacology for cardiovascular emergencies</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span>Team dynamics and effective communication</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span>Post-cardiac arrest care</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Certificate Image */}
                            <div className="lg:flex lg:items-center lg:justify-center">
                                <div className="bg-gray-100 dark:bg-dark-700 rounded-xl p-4 shadow-inner">
                                    <img
                                        src="/pictures/ACLS.jpg"
                                        alt="ACLS Certificate"
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/cv"
                                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Back to CV
                            </Link>
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
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

export default ACLSCertificate
