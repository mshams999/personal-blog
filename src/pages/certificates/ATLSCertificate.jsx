import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Building, Award, Download } from 'lucide-react'

/**
 * ATLS Certificate Page
 * Displays detailed information about the Advanced Trauma Life Support certification
 */
const ATLSCertificate = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-8" dir="ltr" lang="en">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Advanced Trauma Life Support</h1>
                                <p className="text-blue-100 text-lg">(ATLS) Certification</p>
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
                                        <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Issuing Organization</h3>
                                            <p className="text-gray-600 dark:text-gray-300">American College of Surgeons (ACS)</p>
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
                                            <p className="text-gray-600 dark:text-gray-300">2028</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Certificate Description */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About ATLS</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        Advanced Trauma Life Support (ATLS) is a training program for medical providers in the management of acute trauma cases.
                                        It teaches a systematic, concise approach to the care of a trauma patient, focusing on rapid assessment and treatment
                                        of life-threatening injuries within the first hour after injury.
                                    </p>
                                </div>

                                {/* Skills Covered */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Skills & Competencies</h3>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Primary and secondary trauma assessment</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Airway management and breathing support</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Shock recognition and management</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Trauma team leadership and coordination</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Certificate Image */}
                            <div className="lg:flex lg:items-center lg:justify-center">
                                <div className="bg-gray-100 dark:bg-dark-700 rounded-xl p-4 shadow-inner">
                                    <img
                                        src="/pictures/ATLS.jpg"
                                        alt="ATLS Certificate"
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/cv"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
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

export default ATLSCertificate
