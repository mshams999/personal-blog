/**
 * MailChimp Configuration
 * 
 * To set up MailChimp for your newsletter:
 * 1. Create a MailChimp account at https://mailchimp.com/
 * 2. Create an audience (mailing list)
 * 3. Get your API key from Account > Extras > API keys
 * 4. Get your audience ID from Audience > Settings > Audience name and defaults
 * 5. Replace the placeholder values below with your actual credentials
 * 6. For production, use environment variables instead of hardcoding
 */

export const mailchimpConfig = {
    // Replace with your MailChimp API key
    apiKey: process.env.REACT_APP_MAILCHIMP_API_KEY || 'your-mailchimp-api-key',

    // Replace with your MailChimp server prefix (e.g., 'us1', 'us2', etc.)
    serverPrefix: process.env.REACT_APP_MAILCHIMP_SERVER_PREFIX || 'us1',

    // Replace with your MailChimp audience ID
    audienceId: process.env.REACT_APP_MAILCHIMP_AUDIENCE_ID || 'your-audience-id',

    // Newsletter signup form endpoint (MailChimp hosted form)
    signupUrl: process.env.REACT_APP_MAILCHIMP_SIGNUP_URL || 'your-mailchimp-signup-url'
}

/**
 * Check if MailChimp is properly configured
 * @returns {boolean} True if all required fields are set
 */
export const isMailChimpConfigured = () => {
    return (
        mailchimpConfig.apiKey !== 'your-mailchimp-api-key' &&
        mailchimpConfig.audienceId !== 'your-audience-id' &&
        mailchimpConfig.signupUrl !== 'your-mailchimp-signup-url'
    )
}

/**
 * Generate MailChimp signup URL with prefilled data
 * @param {string} email - Email address to prefill
 * @returns {string} Complete signup URL
 */
export const getMailChimpSignupUrl = (email = '') => {
    if (email && mailchimpConfig.signupUrl !== 'your-mailchimp-signup-url') {
        const url = new URL(mailchimpConfig.signupUrl)
        url.searchParams.set('EMAIL', email)
        return url.toString()
    }
    return mailchimpConfig.signupUrl
}
