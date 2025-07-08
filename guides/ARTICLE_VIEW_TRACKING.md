# Real Article View Tracking System

## Overview

The blog now features a complete real-time article view tracking system using Firebase Analytics and localStorage for persistence.

## How It Works

### 1. **Real View Tracking**
- Every time someone visits an article (`/post/slug`), the view count is incremented
- View counts are stored in localStorage for persistence across browser sessions
- Each view is tracked in Firebase Analytics for detailed analytics

### 2. **Local Storage Persistence**
- View counts are stored in `localStorage` under the key `'blog_article_views'`
- Data persists even when the browser is closed and reopened
- Automatic initialization for new articles based on publication date

### 3. **Real-time Updates**
- View counts update immediately when visiting articles
- HomePage automatically refreshes view counts when users return from reading
- "Top Posts" and "Popular" sections show articles sorted by actual view count

### 4. **Firebase Analytics Integration**
- Every article view is tracked in Firebase Analytics
- Custom events logged with article slug and view count
- Page views tracked for navigation analytics

## Features

✅ **Real View Counting**: Every article visit increments the actual view count  
✅ **Persistent Storage**: View counts saved in localStorage  
✅ **Auto-Sorting**: Posts automatically sorted by view count  
✅ **Real-time Updates**: View counts update immediately  
✅ **Firebase Tracking**: All data tracked in Firebase Analytics  
✅ **Cross-Session Persistence**: View counts survive browser restarts  

## View Count Display

- **Homepage**: Eye icon + formatted count (e.g., "1.2K views") in "Top Posts" and "Popular" sections
- **Article Pages**: View count shown in post metadata (e.g., "47 views")
- **Automatic Formatting**: Large numbers formatted as "1.2K", "2.3M", etc.

## Data Flow

1. **User visits article** → `incrementViewCount(slug)` called
2. **View count incremented** in localStorage
3. **Firebase Analytics event** logged
4. **HomePage refreshes** view counts when user returns
5. **Articles re-sorted** by new view counts automatically

## Technical Implementation

### Key Files:
- `src/hooks/useFirebaseAnalytics.js` - Main analytics hook and view counting logic
- `src/pages/SinglePostPage.jsx` - Increments view count on article visits
- `src/pages/HomePage.jsx` - Displays sorted articles by view count
- `src/components/AnalyticsProvider.jsx` - Tracks page navigation

### Storage Format:
```json
{
  "/post/article-slug-1": 127,
  "/post/article-slug-2": 89,
  "/post/article-slug-3": 156
}
```

The system is now fully functional and will track real article views from your visitors!
