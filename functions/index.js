const { onRequest } = require('firebase-functions/v2/https');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Resend (will be initialized properly when API key is available)
let resend = null;
const initializeResend = () => {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
};

/**
 * Send welcome email to new newsletter subscriber
 */
exports.sendWelcomeEmail = onRequest({
    cors: true,
    secrets: ['RESEND_API_KEY']
}, async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, firstName, templateData } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Initialize Resend if not already done
        const resendClient = initializeResend();
        if (!resendClient) {
            logger.error('Resend API key not configured');
            return res.status(500).json({
                success: false,
                error: 'Email service not configured'
            });
        }

        logger.info('Sending welcome email to:', email);

        // Create the HTML email template
        const htmlContent = generateWelcomeEmailHTML(templateData || {});

        // Send email using Resend
        const result = await resendClient.emails.send({
            from: 'Ruki Blog <onboarding@resend.dev>', // Resend verified domain
            reply_to: 'mohamedshams3467@gmail.com', // Your Gmail for replies
            to: [email],
            subject: `Welcome to ${templateData?.websiteName || 'Our Newsletter'} Newsletter! 🎉`,
            html: htmlContent,
        });

        logger.info('Welcome email sent successfully:', result);

        res.status(200).json({
            success: true,
            messageId: result.id,
            message: 'Welcome email sent successfully'
        });

    } catch (error) {
        logger.error('Error sending welcome email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Send custom email
 */
exports.sendCustomEmail = onRequest({
    cors: true,
    secrets: ['RESEND_API_KEY']
}, async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, subject, templateData, htmlContent } = req.body;

        if (!email || !subject) {
            return res.status(400).json({ error: 'Email and subject are required' });
        }

        // Initialize Resend if not already done
        const resendClient = initializeResend();
        if (!resendClient) {
            logger.error('Resend API key not configured');
            return res.status(500).json({
                success: false,
                error: 'Email service not configured'
            });
        }

        logger.info('Sending custom email to:', email);

        const result = await resendClient.emails.send({
            from: 'Ruki Blog <onboarding@resend.dev>', // Resend verified domain
            reply_to: 'mohamedshams3467@gmail.com', // Your Gmail for replies
            to: [email],
            subject: subject,
            html: htmlContent || generateDefaultEmailHTML(templateData || {}),
        });

        logger.info('Custom email sent successfully:', result);

        res.status(200).json({
            success: true,
            messageId: result.id,
            message: 'Email sent successfully'
        });

    } catch (error) {
        logger.error('Error sending custom email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Generate welcome email HTML template
 */
function generateWelcomeEmailHTML(templateData = {}) {
    const {
        subscriberName = 'there',
        senderName = 'Ruki Blog',
        websiteName = 'Ruki Blog',
        websiteUrl = 'https://rukiblog.com',
        unsubscribeUrl = '#',
        currentYear = new Date().getFullYear(),
        currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    } = templateData;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${websiteName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #4F46E5;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .header p {
            color: #666;
            font-size: 18px;
            margin: 0;
        }
        .content {
            margin-bottom: 30px;
        }
        .content h2 {
            color: #333;
            margin-top: 0;
            font-size: 24px;
        }
        .benefits {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .benefits ul {
            margin: 0;
            padding-left: 20px;
        }
        .benefits li {
            margin: 8px 0;
            color: #555;
        }
        .cta {
            text-align: center;
            margin: 30px 0;
        }
        .cta a {
            display: inline-block;
            background: #4F46E5;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .cta a:hover {
            background: #3730A3;
        }
        .footer {
            border-top: 1px solid #eee;
            padding-top: 20px;
            color: #666;
            font-size: 14px;
        }
        .footer a {
            color: #4F46E5;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🎉 Welcome to ${websiteName}!</h1>
            <p>Thank you for subscribing to our newsletter</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <h2>Hi ${subscriberName}! 👋</h2>
            
            <p>Welcome aboard! You've successfully subscribed to the <strong>${websiteName}</strong> newsletter.</p>
            
            <div class="benefits">
                <h3>Here's what you can expect:</h3>
                <ul>
                    <li>🚀 Latest blog posts and tutorials</li>
                    <li>💡 Exclusive insights and tips</li>
                    <li>🎯 Behind-the-scenes content</li>
                    <li>📚 Valuable resources and tools</li>
                    <li>🔔 Early access to new features</li>
                </ul>
            </div>
            
            <p>I'm excited to share my journey with you and help you grow in your tech career!</p>
        </div>

        <!-- Call to Action -->
        <div class="cta">
            <a href="${websiteUrl}">Visit The Blog</a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Best regards,<br>
            <strong>${senderName}</strong></p>
            
            <p style="margin-top: 20px;">
                <small>
                    You received this email because you subscribed to our newsletter on ${currentDate}.<br>
                    <a href="${unsubscribeUrl}">Unsubscribe</a> | 
                    <a href="${websiteUrl}">Visit Website</a>
                </small>
            </p>
            
            <p style="margin-top: 15px; text-align: center;">
                <small>© ${currentYear} ${websiteName}. All rights reserved.</small>
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Generate default email HTML template
 */
function generateDefaultEmailHTML(templateData = {}) {
    const {
        senderName = 'Ruki Blog',
        websiteName = 'Ruki Blog',
        websiteUrl = 'https://rukiblog.com',
        currentYear = new Date().getFullYear()
    } = templateData;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${websiteName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background: #ffffff;
            border-radius: 8px;
            padding: 30px;
        }
        .footer {
            border-top: 1px solid #eee;
            padding-top: 20px;
            color: #666;
            font-size: 14px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <!-- Email content will be inserted here -->
        </div>
        
        <div class="footer">
            <p>Best regards,<br><strong>${senderName}</strong></p>
            <p><small>© ${currentYear} ${websiteName}. All rights reserved.</small></p>
        </div>
    </div>
</body>
</html>
  `;
}
