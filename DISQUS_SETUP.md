# Disqus Comments Setup Guide

This guide will help you set up Disqus comments for your blog.

## Prerequisites

- A Disqus account
- Admin access to your website

## Setup Steps

### 1. Create a Disqus Account

1. Go to [https://disqus.com/](https://disqus.com/)
2. Click "Get Started"
3. Choose "I want to install Disqus on my site"
4. Fill out the form with your website details:
   - **Website Name**: Your blog name
   - **Category**: Choose the most appropriate category
   - **Language**: Select your preferred language

### 2. Get Your Shortname

After creating your site on Disqus:

1. Go to your Disqus Admin panel
2. Navigate to Settings → General
3. Find your **Shortname** - this is a unique identifier for your site
4. Copy this shortname (e.g., "my-awesome-blog")

### 3. Configure Your Application

1. Open `src/config/disqus.js`
2. Replace `'your-disqus-shortname'` with your actual shortname:

```javascript
export const disqusConfig = {
    // Replace with your actual Disqus shortname
    shortname: 'my-awesome-blog', // Your shortname here
    
    // Update with your production domain
    siteUrl: 'https://yourdomain.com',
    
    // Development URL (keep as is for local testing)
    devUrl: 'http://localhost:5173'
}
```

3. Update the `siteUrl` to match your production domain

### 4. Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to any blog post
3. Scroll down to the comments section
4. You should see the Disqus comment form

### 5. Domain Configuration (Production)

When deploying to production:

1. In your Disqus Admin panel, go to Settings → General
2. Add your production domain to the "Website URL" field
3. In Settings → Advanced, add your domain to "Trusted Domains"

## Troubleshooting

### Comments Not Loading

1. **Check your shortname**: Make sure it's exactly as shown in your Disqus admin panel
2. **Domain issues**: Ensure your domain is added to Disqus trusted domains
3. **Browser console**: Check for any JavaScript errors
4. **Ad blockers**: Some ad blockers may block Disqus

### Development vs Production

- **Development**: Comments will work on `localhost:5173`
- **Production**: Make sure your production domain is configured in Disqus

### Common Issues

1. **"We were unable to load Disqus"**
   - Check your internet connection
   - Verify the shortname is correct
   - Check if the domain is trusted in Disqus settings

2. **Comments not syncing**
   - Disqus uses the page URL and identifier to link comments
   - Make sure your URLs are consistent

## Features Included

✅ **Comment threads** on individual posts  
✅ **Comment counts** on post cards  
✅ **Setup guide** shown when not configured  
✅ **Responsive design** that matches your theme  
✅ **Dark mode support**  

## File Structure

```
src/
├── config/
│   └── disqus.js              # Disqus configuration
├── components/
│   ├── DisqusComments.jsx     # Main comments component
│   ├── DisqusCommentCount.jsx # Comment count display
│   └── DisqusSetupGuide.jsx   # Setup instructions
└── pages/
    └── SinglePostPage.jsx     # Post page with comments
```

## Customization

### Styling
The Disqus components inherit your site's styling and support both light and dark themes.

### Language
You can change the language in `src/config/disqus.js`:

```javascript
export const getDisqusConfig = (post, currentUrl) => {
    return {
        url: currentUrl,
        identifier: post.slug,
        title: post.title,
        language: 'es' // Change to your preferred language code
    }
}
```

### Comment Moderation
Configure comment moderation in your Disqus admin panel under Settings → Moderation.

## Support

If you need help:
- [Disqus Help Center](https://help.disqus.com/)
- [Disqus React Documentation](https://github.com/disqus/disqus-react)

---

**Note**: After configuration, it may take a few minutes for comments to start appearing on your site.
