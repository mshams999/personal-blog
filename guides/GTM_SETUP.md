# Google Tag Manager (GTM) Setup Guide

This guide will help you set up Google Tag Manager and Google Analytics for your blog.

## 📋 Prerequisites

- Google account
- Access to your website
- Basic understanding of web analytics

## 🚀 Step 1: Create GTM Account

1. **Visit Google Tag Manager**
   - Go to [https://tagmanager.google.com/](https://tagmanager.google.com/)
   - Sign in with your Google account

2. **Create Account**
   - Click "Create Account"
   - Account Name: Your website/company name
   - Country: Select your country
   - Container Name: Your website domain
   - Target Platform: **Web**
   - Click "Create"

3. **Get Your GTM ID**
   - After creation, you'll see your GTM container ID (format: `GTM-XXXXXXX`)
   - Copy this ID - you'll need it for configuration

## ⚙️ Step 2: Configure Your Website

1. **Update Environment Variables**
   ```bash
   # Edit your .env file
   VITE_GTM_ID=GTM-XXXXXXX  # Replace with your actual GTM ID
   ```

2. **Restart Development Server**
   ```bash
   npm run dev
   ```

## 📊 Step 3: Set Up Google Analytics in GTM

1. **Create Google Analytics Account**
   - Go to [https://analytics.google.com/](https://analytics.google.com/)
   - Create a new account and property for your website
   - Get your GA4 Measurement ID (format: `G-XXXXXXXXXX`)

2. **Add GA4 Tag in GTM**
   - In your GTM container, click "Tags" → "New"
   - Tag Configuration: **Google Analytics: GA4 Configuration**
   - Measurement ID: Enter your GA4 Measurement ID
   - Triggering: **All Pages**
   - Save and name the tag "GA4 Configuration"

3. **Add GA4 Event Tag**
   - Create another tag: **Google Analytics: GA4 Event**
   - Configuration Tag: Select your GA4 Configuration tag
   - Event Name: `{{Event}}`
   - Triggering: **All Custom Events**
   - Save and name the tag "GA4 Events"

## 🎯 Step 4: Configure Built-in Events

Your blog automatically tracks these events:

### Page Views
- **Event Name**: `page_view`
- **Triggers**: Automatically on every page load
- **Data**: page_title, page_location, page_path

### Blog Post Interactions
- **Event Name**: `blog_post_interaction`
- **Triggers**: Post views, clicks, shares
- **Data**: post_id, post_title, post_category, post_author

### Newsletter Interactions
- **Event Name**: `newsletter_interaction`
- **Triggers**: Subscribe attempts, success, errors
- **Data**: action, email_domain, source

### CV Interactions
- **Event Name**: `cv_interaction`
- **Triggers**: CV page views, download attempts
- **Data**: action, section_viewed

### Search Events
- **Event Name**: `search`
- **Triggers**: Search queries
- **Data**: search_term, results_count

## 🔧 Step 5: Custom Event Tracking

You can add custom tracking throughout your app:

```javascript
import { useGTM } from '../hooks/useGTM'

function MyComponent() {
  const { trackEvent, trackBlogPost } = useGTM()
  
  const handleButtonClick = () => {
    trackEvent('button_click', {
      button_name: 'subscribe',
      button_location: 'header'
    })
  }
  
  const handlePostView = (post) => {
    trackBlogPost('view', post)
  }
  
  return (
    <button onClick={handleButtonClick}>
      Subscribe
    </button>
  )
}
```

## 📱 Step 6: Test Your Setup

1. **GTM Preview Mode**
   - In GTM, click "Preview"
   - Enter your website URL
   - Navigate through your site to test tracking

2. **Google Analytics Real-Time**
   - In GA4, go to Reports → Real-time
   - Navigate your website in another tab
   - Verify events are appearing in real-time

3. **Browser Developer Tools**
   - Open browser dev tools
   - Check console for GTM debug messages
   - Verify `dataLayer` events in console

## 🚀 Step 7: Publish Your Container

1. **Submit Changes**
   - In GTM, click "Submit"
   - Add version name and description
   - Click "Publish"

2. **Verify Installation**
   - Use [Google Tag Assistant](https://tagassistant.google.com/)
   - Check that GTM and GA4 tags are firing correctly

## 📊 Available Analytics

Once set up, you'll have access to:

### Traffic Analytics
- Page views and unique visitors
- Traffic sources and referrals
- Geographic and demographic data
- Device and browser information

### Content Performance
- Most popular blog posts
- Time spent reading
- User engagement metrics
- Category performance

### Conversion Tracking
- Newsletter sign-ups
- CV downloads
- Blog post shares
- Search usage

### User Behavior
- Navigation patterns
- Scroll depth
- Exit pages
- Return visitor analysis

## 🔍 Troubleshooting

### GTM Not Loading
- Check that `VITE_GTM_ID` is correctly set in `.env`
- Restart development server after changing environment variables
- Verify GTM container is published

### Events Not Tracking
- Check browser console for GTM errors
- Use GTM Preview mode to debug
- Verify trigger conditions in GTM dashboard

### GA4 Data Missing
- Ensure GA4 Measurement ID is correct in GTM
- Check that GA4 tags are firing in GTM preview
- Allow 24-48 hours for data to populate in reports

## 🛡️ Privacy Considerations

- Review your privacy policy to include analytics tracking
- Consider implementing cookie consent if required by law
- Configure data retention settings in Google Analytics
- Set up IP anonymization if needed for GDPR compliance

## 📈 Advanced Features

### Custom Dimensions
- Set up custom dimensions in GA4 for blog categories
- Track author performance with custom metrics
- Monitor content themes and tags

### Conversion Goals
- Set up newsletter signup as a conversion
- Track CV download completions
- Monitor blog engagement goals

### Enhanced Ecommerce (if applicable)
- Track affiliate link clicks
- Monitor product recommendations
- Analyze purchase funnels

---

## ✅ Verification Checklist

- [ ] GTM container created and ID obtained
- [ ] GTM ID added to `.env` file
- [ ] Website restarted with new environment variables
- [ ] GA4 property created
- [ ] GA4 tags configured in GTM
- [ ] GTM container published
- [ ] Real-time tracking verified
- [ ] Custom events testing
- [ ] Privacy policy updated (if required)

Your Google Tag Manager and Analytics setup is now complete! 🎉
