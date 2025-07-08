/**
 * Email Configuration for Resend + Firebase Functions
 * 
 * To set up automatic welcome emails:
 * 1. Create a Resend account at https://resend.com/
 * 2. Get your Resend API key
 * 3. Set up Firebase Functions for server-side email sending
 * 4. Add the configuration to your .env file
 */

export const emailConfig = {
    // Resend API Key (used in Firebase Functions only)
    resendApiKey: import.meta.env.VITE_RESEND_API_KEY || 'your-resend-api-key',

    // Firebase Functions URL for email sending
    functionsUrl: import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || 'your-functions-url',

    // Default sender information
    senderName: import.meta.env.VITE_SITE_NAME || 'Ruki Blog',
    senderEmail: import.meta.env.VITE_SENDER_EMAIL || 'noreply@yoursite.com',

    // Website information for email template
    websiteUrl: import.meta.env.VITE_SITE_URL || 'https://yoursite.com',
    websiteName: import.meta.env.VITE_SITE_NAME || 'Ruki Blog'
}

/**
 * Check if email service is properly configured
 * @returns {boolean} True if all required fields are set
 */
export const isEmailConfigured = () => {
    return (
        emailConfig.functionsUrl !== 'your-functions-url' &&
        emailConfig.senderEmail !== 'noreply@yoursite.com'
    )
}

/**
 * Get welcome email template data
 * @param {string} email - Subscriber email
 * @param {string} firstName - Subscriber first name
 * @returns {Object} Template data
 */
export const getWelcomeEmailData = (email, firstName = '') => {
    const displayName = firstName || 'there'

    return {
        to: email,
        subject: `Welcome to ${emailConfig.websiteName} Newsletter! 🎉`,
        templateData: {
            subscriberName: displayName,
            senderName: emailConfig.senderName,
            websiteName: emailConfig.websiteName,
            websiteUrl: emailConfig.websiteUrl,
            unsubscribeUrl: `${emailConfig.websiteUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
            currentYear: new Date().getFullYear(),
            currentDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }
    }
}
