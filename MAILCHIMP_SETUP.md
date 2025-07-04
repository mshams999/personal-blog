# MailChimp Newsletter Setup Guide

This guide will help you set up MailChimp for your newsletter functionality.

## Prerequisites

- A MailChimp account (free tier available)
- Basic understanding of environment variables

## Step-by-Step Setup

### 1. Create a MailChimp Account

1. Go to [https://mailchimp.com/](https://mailchimp.com/)
2. Sign up for a free account
3. Verify your email address
4. Complete your account setup

### 2. Create an Audience (Mailing List)

1. In your MailChimp dashboard, go to **Audience** → **All contacts**
2. Click **Create Audience**
3. Fill in the required information:
   - **Audience name**: Your blog name (e.g., "Ruki Blog Subscribers")
   - **Default "From" email**: Your email address
   - **Default "From" name**: Your name or blog name
   - **Contact information**: Your address (required by law)
4. Click **Save**

### 3. Get Your API Key

1. Go to **Account** → **Extras** → **API keys**
2. Click **Create A Key**
3. Give it a name (e.g., "Blog Newsletter")
4. Copy the generated API key
5. **Important**: Store this securely, you won't be able to see it again

### 4. Get Your Audience ID

1. Go to **Audience** → **All contacts**
2. Click **Settings** → **Audience name and defaults**
3. Look for **Audience ID** - copy this value

### 5. Get Your Server Prefix

Your server prefix is found in your API key. For example:
- If your API key ends with `-us1`, your server prefix is `us1`
- If your API key ends with `-us6`, your server prefix is `us6`

### 6. Create a Signup Form (Optional but Recommended)

1. Go to **Audience** → **Signup forms**
2. Click **Form builder**
3. Customize your form
4. Click **Save and publish**
5. Copy the signup form URL from the **Share it** section

## Configuration Methods

You have two options for configuration:

### Option 1: Environment Variables (Recommended for Production)

Create a `.env` file in your project root:

```env
REACT_APP_MAILCHIMP_API_KEY=your-api-key-here
REACT_APP_MAILCHIMP_SERVER_PREFIX=us1
REACT_APP_MAILCHIMP_AUDIENCE_ID=your-audience-id-here
REACT_APP_MAILCHIMP_SIGNUP_URL=your-signup-form-url-here
```

**Important**: 
- Add `.env` to your `.gitignore` file
- Never commit API keys to version control
- For deployment, set these as environment variables in your hosting platform

### Option 2: Direct Configuration (For Development Only)

Edit `src/config/mailchimp.js`:

```javascript
export const mailchimpConfig = {
    apiKey: 'your-actual-api-key-here',
    serverPrefix: 'us1', // or us2, us6, etc.
    audienceId: 'your-actual-audience-id-here',
    signupUrl: 'your-actual-signup-form-url-here'
}
```

## Implementation Details

The newsletter component supports two integration methods:

### Method 1: API Integration (Requires Backend)

For security reasons, direct API calls should be handled by your backend to avoid exposing API keys. The frontend component is prepared for this approach.

### Method 2: Hosted Form Integration (Current Implementation)

Uses MailChimp's hosted signup forms. This is:
- ✅ Secure (no API keys exposed)
- ✅ GDPR compliant
- ✅ Handles double opt-in automatically
- ✅ Works immediately without backend setup

## Features Included

### ✨ Frontend Features
- 📧 Email validation
- 👤 Optional first name field
- ⏳ Loading states
- ✅ Success messages
- ❌ Error handling
- 📱 Responsive design
- 🌙 Dark mode support
- ✔️ GDPR compliance checkbox
- 🔗 Social media integration

### 🛡️ Security Features
- No API keys exposed in frontend
- Form validation
- CSRF protection (when using hosted forms)
- Privacy policy integration

### 📊 Analytics
- MailChimp provides detailed analytics
- Subscriber growth tracking
- Email campaign performance
- Audience insights

## Testing Your Setup

1. **Development**: Test on `localhost:5173`
2. **Check the form**: Submit a test email
3. **Verify in MailChimp**: Check your audience for new subscribers
4. **Test unsubscribe**: Ensure unsubscribe links work

## Customization Options

### Form Fields
You can add more fields by modifying the Newsletter component:

```javascript
// Add to the form
<input
    type="text"
    placeholder="Last name"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    className="..."
/>
```

### Styling
The component uses Tailwind CSS and matches your site's theme automatically.

### Email Templates
Customize your MailChimp email templates:
1. Go to **Campaigns** → **Email templates**
2. Create or modify templates
3. Use MailChimp's drag-and-drop editor

## GDPR Compliance

The newsletter component includes:
- ✅ Explicit consent checkbox
- ✅ Links to privacy policy
- ✅ Clear subscription purpose
- ✅ Easy unsubscribe (handled by MailChimp)

## Troubleshooting

### Common Issues

1. **"MailChimp Setup Required" message**
   - Check your configuration in `src/config/mailchimp.js`
   - Ensure all placeholder values are replaced

2. **Form not working**
   - Verify your signup URL is correct
   - Check browser console for errors
   - Test with a different email address

3. **Subscribers not appearing**
   - Check your MailChimp audience
   - Look in "All contacts" not just "Subscribed"
   - Verify double opt-in settings

4. **CORS errors (if using API method)**
   - API calls must be made from your backend
   - Never expose API keys in frontend code

### Testing Checklist

- [ ] Newsletter form displays correctly
- [ ] Email validation works
- [ ] Success message appears after submission
- [ ] Error handling works for invalid emails
- [ ] GDPR checkbox is required
- [ ] Social links work correctly
- [ ] Form works on mobile devices
- [ ] Dark mode styling is correct

## Production Deployment

### Environment Variables Setup

**Vercel**:
```bash
vercel env add REACT_APP_MAILCHIMP_API_KEY
vercel env add REACT_APP_MAILCHIMP_SERVER_PREFIX
vercel env add REACT_APP_MAILCHIMP_AUDIENCE_ID
vercel env add REACT_APP_MAILCHIMP_SIGNUP_URL
```

**Netlify**:
1. Go to Site settings → Environment variables
2. Add each variable with its value

**Other platforms**: Check your hosting provider's documentation for environment variable setup.

## Support Resources

- [MailChimp Documentation](https://mailchimp.com/help/)
- [MailChimp API Reference](https://mailchimp.com/developer/marketing/api/)
- [GDPR Compliance Guide](https://mailchimp.com/help/about-the-general-data-protection-regulation/)

---

**Security Note**: Always use environment variables for production deployments. Never commit API keys to your repository.
