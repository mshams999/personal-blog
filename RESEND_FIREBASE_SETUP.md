# Resend + Firebase Functions Email Setup Guide

## ✅ DEPLOYMENT SUCCESSFUL!

**Status**: ✅ **FULLY WORKING** - The migration has been completed successfully! Both Firebase Functions are now deployed and operational.

**Function URLs**:
- sendWelcomeEmail: `https://us-central1-personal-blog-48d5c.cloudfunctions.net/sendWelcomeEmail`
- sendCustomEmail: `https://us-central1-personal-blog-48d5c.cloudfunctions.net/sendCustomEmail`

**What was accomplished**:
- ✅ EmailJS completely removed
- ✅ Resend + Firebase Functions deployed successfully  
- ✅ PowerShell compatibility ensured
- ✅ Error handling implemented
- ✅ Security configured with Firebase secrets
- ✅ **EMAIL SENDING WORKING** - Live testing confirms emails are being sent successfully
- ✅ **API Configuration Fixed** - Using Resend sandbox domain (`onboarding@resend.dev`)
- ✅ **Template Errors Fixed** - All undefined data issues resolved

**Live Test**: Open `newsletter-test-live.html` to test the system

---

This guide will help you set up automatic welcome emails using Resend and Firebase Functions for your newsletter subscribers.

## 🎯 What This Does

When someone subscribes to your newsletter:
1. ✅ They're added to your Firestore database
2. ✅ A Firebase Function is triggered to send a welcome email via Resend
3. ✅ Beautiful HTML email is sent with personalization
4. ✅ Subscription process continues normally even if email fails

## 📋 Prerequisites

- Firebase project with Firestore enabled
- Resend account (free tier available)
- Node.js 18+ installed
- Firebase CLI installed

## 🚀 Step-by-Step Setup

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Create Resend Account

1. Go to [https://resend.com/](https://resend.com/)
2. Sign up for a free account
3. Verify your email address
4. Go to **API Keys** section
5. Create a new API key
6. **Important**: Copy and save your API key securely

### Step 3: Initialize Firebase Functions

In your project root directory:

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Select:
# - Functions: Configure a Cloud Functions directory
# - Use existing project (select your Firebase project)
# - JavaScript (for this guide)
# - Install dependencies: Yes
```

### Step 4: Configure Environment Variables

#### For Local Development
Create or update your `.env` file:

```env
# Resend + Firebase Functions Configuration
VITE_RESEND_API_KEY=your-resend-api-key-here
VITE_FIREBASE_FUNCTIONS_URL=http://localhost:5001/your-project/us-central1
VITE_SITE_NAME=Ruki Blog
VITE_SITE_URL=https://yoursite.com
VITE_SENDER_EMAIL=noreply@yoursite.com
```

#### For Firebase Functions
Set the Resend API key as a secret:

```bash
# Set Resend API key as Firebase secret
firebase functions:secrets:set RESEND_API_KEY

# When prompted, enter your Resend API key

# Set sender email as environment variable
firebase functions:config:set email.sender="mohamedshams3467@gmail.com"
```

### Step 5: Deploy Firebase Functions

```bash
# Install dependencies in functions directory
cd functions
npm install

# Return to project root
cd ..

# Deploy functions
firebase deploy --only functions
```

### Step 6: Update Environment Variables for Production

After deployment, update your `.env` file with the production Functions URL:

```env
VITE_FIREBASE_FUNCTIONS_URL=https://us-central1-your-project.cloudfunctions.net
```

Replace `your-project` with your actual Firebase project ID.

### Step 7: Restart Development Server

```bash
npm run dev
```

## 🧪 Testing Your Setup

### 1. Test Locally with Emulators

```bash
# Start Firebase emulators
firebase emulators:start --only functions

# In another terminal, start your app
npm run dev
```

### 2. Test Welcome Email

1. Visit your website
2. Subscribe to the newsletter with a test email
3. Check the email inbox for the welcome message
4. Monitor browser console for success/error messages

### 3. Test Page

Visit: `http://localhost:5173/welcome-email-test.html`

## 📧 Email Template Customization

The email template is defined in `functions/index.js` in the `generateWelcomeEmailHTML` function. You can customize:

- **HTML Structure**: Modify the HTML template
- **Styling**: Update the inline CSS styles
- **Content**: Change the welcome message and benefits
- **Branding**: Add your logo and brand colors

### Example Customization

```javascript
// In functions/index.js, modify the generateWelcomeEmailHTML function
function generateWelcomeEmailHTML(templateData) {
  // Add your custom HTML here
  return `
    <!DOCTYPE html>
    <html>
      <!-- Your custom email template -->
    </html>
  `;
}
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_RESEND_API_KEY` | Resend API key | `re_abc123...` |
| `VITE_FIREBASE_FUNCTIONS_URL` | Firebase Functions base URL | `https://us-central1-project.cloudfunctions.net` |
| `VITE_SITE_NAME` | Your website name | `Ruki Blog` |
| `VITE_SITE_URL` | Your website URL | `https://rukiblog.com` |
| `VITE_SENDER_EMAIL` | Sender email address | `noreply@rukiblog.com` |

### Firebase Secrets

Set these in Firebase Functions:

```bash
# Resend API key (required)
firebase functions:secrets:set RESEND_API_KEY

# Sender email (optional, can use environment variable)
firebase functions:config:set email.sender="noreply@yoursite.com"
```

## 🔍 Monitoring and Debugging

### Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Functions** section
4. Monitor function executions and logs

### Local Debugging

```bash
# Start emulators with debug output
firebase emulators:start --only functions --debug

# View function logs
firebase functions:log
```

### Browser Console

Monitor these messages:
- `✅ Welcome email sent successfully`
- `❌ Failed to send welcome email`
- `📧 Email service configured: true/false`

## 📊 Email Analytics

### Resend Dashboard

- Track email delivery rates
- Monitor bounce rates
- View open rates (if enabled)
- Check spam complaints

### Firebase Analytics

- Function execution counts
- Error rates
- Performance metrics

## 🚨 Troubleshooting

### Common Issues

1. **"Email service not configured" message**
   - Check environment variables are set correctly
   - Restart development server after changes
   - Verify Firebase Functions URL is correct

2. **Functions not deploying**
   - Check Node.js version (requires 18+)
   - Verify Firebase CLI is latest version
   - Check for syntax errors in functions/index.js

3. **Emails not sending**
   - Verify Resend API key is valid
   - Check Firebase Functions logs for errors
   - Ensure sender email domain is verified in Resend

4. **CORS errors**
   - Functions are configured with CORS enabled
   - Check browser network tab for detailed errors

### Error Codes

- `NOT_CONFIGURED` - Email service not set up
- `SEND_ERROR` - Failed to send email
- `HTTP 405` - Wrong request method
- `HTTP 400` - Missing required parameters

## 💰 Pricing

### Resend Free Tier
- 3,000 emails/month
- 100 emails/day
- All features included

### Firebase Functions Free Tier
- 2M invocations/month
- 400,000 GB-seconds/month
- 200,000 CPU-seconds/month

### Scaling Up
- Resend paid plans start at $20/month for 50,000 emails
- Firebase Functions billing based on usage
- Monitor costs in respective dashboards

## 🔒 Security Best Practices

1. **Never expose API keys in frontend code**
   - Use Firebase Functions for server-side operations
   - Store sensitive data in Firebase secrets

2. **Validate input data**
   - Functions include basic validation
   - Add additional validation as needed

3. **Rate limiting**
   - Resend has built-in rate limiting
   - Consider adding additional limits in functions

4. **Domain verification**
   - Verify your domain in Resend for better deliverability
   - Set up SPF and DKIM records

## 🎉 Production Deployment

### Hosting Platform Environment Variables

**Vercel:**
```bash
vercel env add VITE_RESEND_API_KEY
vercel env add VITE_FIREBASE_FUNCTIONS_URL
vercel env add VITE_SITE_NAME
vercel env add VITE_SITE_URL
vercel env add VITE_SENDER_EMAIL
```

**Netlify:**
1. Go to Site settings → Environment variables
2. Add each variable with its value

### Domain Setup

1. **Verify your domain in Resend:**
   - Add your domain in Resend dashboard
   - Add required DNS records (SPF, DKIM)
   - Verify domain ownership

2. **Update sender email:**
   - Use your verified domain
   - Update environment variables
   - Redeploy functions

## 🎯 Next Steps

1. **Customize Email Template**
   - Add your branding and logo
   - Modify content and styling
   - Test with different email clients

2. **Add More Email Types**
   - Password reset emails
   - Newsletter digest emails
   - Notification emails

3. **Enhanced Analytics**
   - Track email open rates
   - Monitor click-through rates
   - A/B test different templates

4. **Advanced Features**
   - Email scheduling
   - Personalized content
   - Automated email sequences

## 🎉 You're All Set!

Your newsletter now sends beautiful, professional welcome emails automatically using Resend and Firebase Functions!

**Benefits of this setup:**
- ✅ Server-side email sending (secure)
- ✅ Professional email delivery
- ✅ Scalable architecture
- ✅ Detailed analytics
- ✅ High deliverability rates
- ✅ Cost-effective for most use cases

Need help? Check the Firebase Functions logs and browser console for detailed error messages.
