import { emailConfig, isEmailConfigured, getWelcomeEmailData } from '../config/email'

/**
 * Email Service for sending automated emails
 * Uses Resend via Firebase Functions for server-side email sending
 */
class EmailService {
    constructor() {
        this.isConfigured = isEmailConfigured()
    }

    /**
     * Send welcome email to new newsletter subscriber
     * @param {string} email - Subscriber email
     * @param {string} firstName - Subscriber first name (optional)
     * @returns {Promise<Object>} Email sending result
     */
    async sendWelcomeEmail(email, firstName = '') {
        if (!this.isConfigured) {
            return {
                success: false,
                error: 'Email service not configured',
                code: 'NOT_CONFIGURED'
            }
        }

        try {
            const emailData = getWelcomeEmailData(email, firstName)

            // Call Firebase Function to send email
            const response = await fetch(`${emailConfig.functionsUrl}/sendWelcomeEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailData.to,
                    firstName: firstName,
                    templateData: emailData.templateData
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (result.success) {
                return {
                    success: true,
                    messageId: result.messageId,
                    message: 'Welcome email sent successfully'
                }
            } else {
                throw new Error(result.error || 'Failed to send email')
            }

        } catch (error) {
            console.error('❌ Failed to send welcome email:', error)

            return {
                success: false,
                error: error.message || 'Failed to send email',
                code: 'SEND_ERROR'
            }
        }
    }

    /**
     * Send custom email via Firebase Functions
     * @param {string} email - Recipient email
     * @param {string} subject - Email subject
     * @param {Object} templateData - Email template data
     * @returns {Promise<Object>} Email sending result
     */
    async sendCustomEmail(email, subject, templateData) {
        if (!this.isConfigured) {
            return {
                success: false,
                error: 'Email service not configured',
                code: 'NOT_CONFIGURED'
            }
        }

        try {
            const response = await fetch(`${emailConfig.functionsUrl}/sendCustomEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    subject,
                    templateData
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            return {
                success: result.success,
                messageId: result.messageId,
                message: result.message || 'Email sent successfully'
            }

        } catch (error) {
            console.error('Failed to send custom email:', error)

            return {
                success: false,
                error: error.message || 'Failed to send email',
                code: 'SEND_ERROR'
            }
        }
    }

    /**
     * Test email configuration
     * @returns {boolean} True if email service is properly configured
     */
    isEmailServiceConfigured() {
        return this.isConfigured
    }

    /**
     * Get email service status
     * @returns {Object} Service status information
     */
    getServiceStatus() {
        return {
            configured: this.isConfigured,
            functionsUrl: this.isConfigured ? emailConfig.functionsUrl : 'Not configured',
            senderName: emailConfig.senderName,
            senderEmail: emailConfig.senderEmail,
            websiteName: emailConfig.websiteName,
            service: 'Resend + Firebase Functions'
        }
    }
}

export default new EmailService()
