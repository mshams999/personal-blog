# Google Analytics Setup Guide

This guide will help you set up Google Analytics 4 (GA4) for your blog - much simpler than Google Tag Manager!

## 📋 Prerequisites

- Google account
- Access to your website

## 🚀 Step 1: Create Google Analytics Account

1. **Visit Google Analytics**
   - Go to [https://analytics.google.com/](https://analytics.google.com/)
   - Sign in with your Google account

2. **Create Account**
   - Click "Start measuring"
   - Account name: Your website/company name
   - Data sharing settings: Choose your preferences
   - Click "Next"

3. **Create Property**
   - Property name: Your website name
   - Reporting time zone: Select your timezone
   - Currency: Select your currency
   - Click "Next"

4. **Business Information**
   - Industry category: Choose "Arts & Entertainment" or relevant category
   - Business size: Select appropriate size
   - How you plan to use Analytics: Select "Get insights into your customers"
   - Click "Create"

5. **Accept Terms of Service**
   - Review and accept the terms
   - Click "I Accept"

## ⚙️ Step 2: Get Your Measurement ID

1. **Set Up Data Stream**
   - Choose "Web" platform
   - Website URL: Enter your website URL (e.g., `https://yourdomain.com`)
   - Stream name: Your website name
   - Click "Create stream"

2. **Get Measurement ID**
   - After creating the stream, you'll see your **Measurement ID**
   - Format: `G-XXXXXXXXXX`
   - Copy this ID - you'll need it for configuration

## 🔧 Step 3: Configure Your Website

1. **Update Environment Variables**
   ```bash
   # Edit your .env file
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Replace with your actual Measurement ID
   ```

2. **Restart Development Server**
   ```bash
   npm run dev
   ```

## 📊 Step 4: Verify Installation

1. **Real-Time Reports**
   - In Google Analytics, go to **Reports** → **Real-time**
   - Open your website in another tab/browser
   - Navigate through a few pages
   - You should see activity in the real-time report

2. **Browser Developer Tools**
   - Open your website
   - Open browser developer tools (F12)
   - Check the **Console** tab for any Google Analytics debug messages
   - Check the **Network** tab for requests to `google-analytics.com`

3. **Google Analytics Debugger (Optional)**
   - Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
   - Enable it and reload your page
   - Check console for detailed GA debug information

## 📈 Available Analytics

Once set up, you'll automatically track:

### Automatic Tracking
- **Page views** - Every page visit
- **User sessions** - Visitor sessions and duration
- **Traffic sources** - Where visitors come from
- **Geographic data** - Country, city, language
- **Device information** - Desktop, mobile, browser type

### Custom Event Tracking
Your blog includes built-in tracking for:

- **Blog post interactions** - Post views, reading time
- **Newsletter signups** - Subscribe attempts and success
- **CV page visits** - CV views and interactions
- **Search usage** - Search queries and results
- **External link clicks** - Outbound link tracking
- **File downloads** - PDF downloads, etc.

## 🎯 Using Custom Tracking

Add custom tracking to your components:

```javascript
import { useAnalytics } from '../hooks/useAnalytics'

function MyComponent() {
  const { trackEvent, trackBlogPost } = useAnalytics()
  
  const handleClick = () => {
    trackEvent('button_click', {
      event_category: 'engagement',
      event_label: 'subscribe_button',
      button_location: 'header'
    })
  }
  
  const handlePostView = (post) => {
    trackBlogPost('view', post)
  }
  
  return <button onClick={handleClick}>Subscribe</button>
}
```

## 📊 Understanding Your Reports

### Audience Reports
- **Overview** - Visitors, sessions, bounce rate
- **Demographics** - Age and gender (if available)
- **Interests** - User interest categories
- **Geography** - Country and city data
- **Technology** - Browser, OS, device info

### Acquisition Reports
- **Traffic acquisition** - How users found your site
- **User acquisition** - First-time vs returning visitors
- **Campaigns** - Performance of marketing campaigns

### Engagement Reports
- **Events** - Custom events you're tracking
- **Pages and screens** - Most popular content
- **Landing pages** - Entry points to your site

### Monetization Reports
- **Ecommerce** - Sales data (if applicable)
- **Publisher ads** - Ad revenue (if using AdSense)

## 🔍 Key Metrics to Monitor

### Content Performance
- **Page views** - Most popular blog posts
- **Average engagement time** - How long people read
- **Bounce rate** - Single-page sessions
- **Scroll depth** - How far people read

### User Behavior
- **New vs returning users** - Audience loyalty
- **Session duration** - User engagement
- **Pages per session** - Content discovery
- **User flow** - Navigation patterns

### Conversion Tracking
- **Newsletter signups** - Email list growth
- **CV downloads** - Professional interest
- **External link clicks** - Referral success
- **Social shares** - Content virality

## 🛡️ Privacy Considerations

### GDPR Compliance
- Google Analytics is GDPR compliant by default
- IP addresses are anonymized automatically
- Consider adding a cookie consent banner if required
- Review data retention settings in GA4

### Data Settings
- **Data retention** - Set appropriate retention period
- **Data sharing** - Review Google's data sharing settings
- **User deletion** - Users can request data deletion
- **IP anonymization** - Enabled by default in our setup

## 🚀 Advanced Features (Optional)

### Enhanced Ecommerce
If you plan to sell products:
- Set up product tracking
- Monitor purchase funnels
- Track abandoned carts

### Custom Dimensions
- Track custom user properties
- Segment by blog categories
- Monitor author performance

### Goal Setup
- Define important actions as goals
- Track newsletter conversion rate
- Monitor content engagement goals

## 📱 Mobile App Tracking
If you create a mobile app later:
- Use the same GA4 property
- Add mobile app data streams
- Track cross-platform user journeys

---

## ✅ Verification Checklist

- [ ] Google Analytics account created
- [ ] GA4 property set up
- [ ] Measurement ID obtained
- [ ] Measurement ID added to `.env` file
- [ ] Development server restarted
- [ ] Real-time tracking verified
- [ ] Page views showing in GA4
- [ ] Custom events working (test newsletter signup)
- [ ] Privacy policy updated (if required)

Your Google Analytics setup is now complete! 🎉

## 🔧 Troubleshooting

### No Data in Reports
- Check that `VITE_GA_MEASUREMENT_ID` is correctly set
- Verify measurement ID format: `G-XXXXXXXXXX`
- Restart development server after env changes
- Allow 24-48 hours for data to appear in reports

### Real-Time Not Working
- Check browser console for errors
- Ensure ad blockers aren't blocking GA
- Try incognito/private browsing mode
- Verify measurement ID is correct

### Events Not Tracking
- Check browser console for GA debug messages
- Verify custom event code is executed
- Test with Google Analytics Debugger extension
- Ensure proper event parameter formatting

Need help? Check the [Google Analytics Help Center](https://support.google.com/analytics/) for more detailed troubleshooting.
