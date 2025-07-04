import React, { useState } from 'react'
import { ExternalLink, Settings, AlertCircle, CheckCircle2, Copy, Eye, EyeOff } from 'lucide-react'

/**
 * DisqusSetupGuide Component
 * 
 * Provides step-by-step instructions for setting up Disqus
 * Shows when Disqus is not properly configured
 */
const DisqusSetupGuide = () => {
    const [showConfig, setShowConfig] = useState(false)
    const [copiedStep, setCopiedStep] = useState(null)

    const copyToClipboard = (text, stepId) => {
        navigator.clipboard.writeText(text)
        setCopiedStep(stepId)
        setTimeout(() => setCopiedStep(null), 2000)
    }

    const configExample = `export const disqusConfig = {
    shortname: 'your-actual-shortname', // Replace this
    siteUrl: 'https://your-website.com',
    devUrl: 'http://localhost:5173'
}`

    return (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Disqus Comments Setup Required
                        </h3>
                        <p className="text-blue-700 dark:text-blue-300 mb-4">
                            To enable comments on your blog, you need to configure Disqus. Follow these simple steps:
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3 p-4 bg-white dark:bg-dark-800 rounded-lg border border-blue-100 dark:border-blue-800">
                        <div className="w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            1
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Create a Disqus Account
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Visit Disqus and create an account, then register your website.
                            </p>
                            <a
                                href="https://disqus.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                            >
                                Go to Disqus <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3 p-4 bg-white dark:bg-dark-800 rounded-lg border border-blue-100 dark:border-blue-800">
                        <div className="w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            2
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Get Your Shortname
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                                After registering your site, you'll get a "shortname" - this is your unique identifier.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3 p-4 bg-white dark:bg-dark-800 rounded-lg border border-blue-100 dark:border-blue-800">
                        <div className="w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            3
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Update Configuration
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                                Edit the file <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">src/config/disqus.js</code> and replace the placeholder with your shortname.
                            </p>

                            <button
                                onClick={() => setShowConfig(!showConfig)}
                                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium mb-3"
                            >
                                {showConfig ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {showConfig ? 'Hide' : 'Show'} Configuration Example
                            </button>

                            {showConfig && (
                                <div className="relative">
                                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto border">
                                        <code>{configExample}</code>
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(configExample, 'config')}
                                        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        title="Copy to clipboard"
                                    >
                                        {copiedStep === 'config' ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Success message */}
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="text-green-700 dark:text-green-300 text-sm">
                            Once configured, comments will appear automatically on all your posts!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisqusSetupGuide
