# Firebase Firestore Article View Tracking - Setup Guide

This guide explains how to set up Firebase Firestore for real-time article view tracking in your React blog.

## Overview

The Firebase integration provides:
- **Real-time view tracking** - Views are stored in Firestore and synced across devices
- **Offline support** - Falls back to localStorage when Firebase is unavailable
- **Analytics integration** - Combines with Google Analytics for comprehensive tracking
- **Performance optimized** - Bulk loading and smart caching

## Firebase Project Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "my-blog-analytics")
4. Enable Google Analytics (recommended)
5. Choose or create a Google Analytics account
6. Click "Create project"

### 2. Enable Firestore Database

1. In your Firebase project console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to your users
5. Click "Done"

### 3. Get Firebase Configuration

1. Go to Project Settings (gear icon) → General tab
2. Scroll down to "Your apps" section
3. Click "Web app" icon (`</>`)
4. Register your app with a nickname
5. Copy the configuration object

### 4. Set Up Environment Variables

Create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Firestore Security Rules

For development, update your Firestore rules:

```javascript
// Firestore Security Rules (Test Mode)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{document} {
      allow read, write: if true;
    }
  }
}
```

For production, use more restrictive rules:

```javascript
// Firestore Security Rules (Production)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{articleSlug} {
      // Allow anyone to read view counts
      allow read: if true;
      
      // Allow writes only for incrementing views
      allow create, update: if 
        // Only allow updating the views field
        request.resource.data.keys().hasAll(['views', 'lastViewed', 'slug']) &&
        // Views must be incremented by 1
        request.resource.data.views == resource.data.views + 1 ||
        // Or for new documents, views must be 1
        (resource == null && request.resource.data.views == 1);
    }
  }
}
```

## Database Structure

The Firestore collection is structured as follows:

```
articles (collection)
├── article-slug-1 (document)
│   ├── views: 42
│   ├── firstViewed: "2025-01-01T10:00:00.000Z"
│   ├── lastViewed: "2025-01-15T14:30:00.000Z"
│   └── slug: "article-slug-1"
├── article-slug-2 (document)
│   ├── views: 18
│   ├── firstViewed: "2025-01-02T09:15:00.000Z"
│   ├── lastViewed: "2025-01-15T16:45:00.000Z"
│   └── slug: "article-slug-2"
└── ...
```

## How It Works

### 1. View Tracking
- When a user visits an article page, `useArticleViews` hook automatically increments the view count
- Views are stored in Firestore with timestamps
- If Firestore is unavailable, falls back to localStorage

### 2. Display Components
- `ViewCounter` component shows real-time view counts
- `useFirebaseAnalytics` hook provides bulk view data for lists
- Formatted display (e.g., "1.2K views", "345 views")

### 3. Performance Features
- **Debouncing**: Prevents rapid-fire increments
- **Caching**: Smart local caching reduces Firestore reads
- **Bulk loading**: Efficient loading for article lists
- **Offline support**: Works without internet connection

## Usage Examples

### Single Article View Tracking
```jsx
import { useArticleViews } from '../hooks/useFirebaseViews'
import ViewCounter from '../components/ViewCounter'

const ArticlePage = ({ slug }) => {
  // Automatically track views on this page
  const { viewCount, loading } = useArticleViews(slug, true)
  
  return (
    <div>
      <h1>Article Title</h1>
      <ViewCounter 
        articleSlug={slug}
        shouldIncrement={false} // Already handled by hook
        size="md"
      />
    </div>
  )
}
```

### Article List with View Counts
```jsx
import { useBulkArticleViews } from '../hooks/useFirebaseViews'
import ViewCounter from '../components/ViewCounter'

const ArticleList = ({ articles }) => {
  const { viewCounts, loading } = useBulkArticleViews(articles)
  
  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          <ViewCounter 
            articleSlug={article.slug}
            fallbackCount={0}
            shouldIncrement={false}
            size="sm"
            variant="badge"
          />
        </div>
      ))}
    </div>
  )
}
```

## Testing

1. **Development Testing**:
   - Start your development server
   - Visit article pages and verify view counts increment
   - Check Firestore console for data

2. **Firestore Console**:
   - Go to Firestore Database in Firebase Console
   - Check the `articles` collection
   - Verify documents are created with correct structure

3. **Analytics Verification**:
   - Open browser dev tools
   - Check console for any Firebase errors
   - Verify analytics events are firing

## Troubleshooting

### Common Issues

1. **"Firebase not configured" warnings**:
   - Ensure all environment variables are set correctly
   - Check `.env` file is in project root
   - Restart development server after adding env vars

2. **Permission denied errors**:
   - Verify Firestore security rules
   - Check Firebase project settings
   - Ensure Firestore is enabled

3. **Views not incrementing**:
   - Check browser console for errors
   - Verify internet connection
   - Check if localStorage fallback is working

### Debug Mode

Enable debug logging by setting:
```env
VITE_FIREBASE_DEBUG=true
```

## Cost Considerations

### Firestore Pricing (Free Tier)
- **Reads**: 50,000 per day
- **Writes**: 20,000 per day
- **Deletes**: 20,000 per day
- **Storage**: 1 GB

For a typical blog:
- Each article view = 1 read + 1 write
- 10,000 monthly page views = well within free tier
- Use caching to reduce read operations

### Optimization Tips
1. **Batch operations** when possible
2. **Cache frequently accessed data**
3. **Use compound queries** for complex data needs
4. **Monitor usage** in Firebase Console

## Next Steps

After setup:
1. **Monitor analytics** in Firebase Console
2. **Set up alerts** for unusual traffic
3. **Implement caching** for better performance
4. **Add more tracking** (likes, shares, etc.)
5. **Create dashboards** for analytics visualization

## Support

For issues with this implementation:
- Check browser console for errors
- Verify Firebase configuration
- Test with Firestore rules simulator
- Monitor Firebase Console for quota limits
