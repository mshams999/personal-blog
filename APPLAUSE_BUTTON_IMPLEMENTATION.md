# Applause Button Integration

## Overview

The applause button functionality has been successfully integrated into the blog posts, allowing readers to show appreciation for articles by clicking to applaud. Each post has its own unique applause count tracked by URL.

## Implementation Details

### Components Added

1. **ApplauseButton.jsx** (`src/components/ApplauseButton.jsx`)
   - Custom React wrapper for the applause-button web component
   - Handles dynamic loading of CSS and JS files
   - Supports different sizes (sm, md, lg)
   - Includes loading placeholder
   - Customizable styling with theme colors

2. **Custom CSS** (`src/styles/applause-button.css`)
   - Theme-compatible styling
   - Dark mode support
   - Responsive design
   - Hover and animation effects

### Integration Points

The applause button appears in three locations on blog posts:

1. **Main Content Area**: Large button after the post content with explanatory text
2. **Desktop Sidebar**: Small button in the floating social sharing sidebar
3. **Mobile Action Bar**: Small button in the mobile action bar at the bottom

### Features

- **Unique Tracking**: Each post has a unique URL for applause tracking
- **Real-time Updates**: Applause count updates immediately when clicked
- **Multiple Clicks**: Users can click multiple times to give more applause
- **Persistent Storage**: Applause counts are stored via the external API
- **Loading States**: Shows placeholder while the component loads
- **Responsive Design**: Different sizes for different screen sizes
- **Theme Integration**: Matches the blog's pink color scheme
- **Dark Mode**: Supports dark mode with adjusted colors

### Technical Implementation

#### API Integration
- Uses `https://applause.chabouis.fr` as the default API endpoint
- Each post is identified by its full URL: `${window.location.origin}/post/${post.slug}`
- No authentication required - open API for demonstration

#### Styling
- Custom CSS variables for colors:
  - Primary: `#ec4899` (pink-500)
  - Hover: `#db2777` (pink-600)
  - Active: `#be185d` (pink-700)
- Three size variants:
  - Small (2.5rem): Sidebar and mobile
  - Medium (3.5rem): Default
  - Large (4rem): Main content area

#### Loading Strategy
- Dynamic loading of CSS and JS from CDN
- Graceful fallback with loading placeholder
- Error handling for failed script loads

### Usage Examples

```jsx
// Basic usage
<ApplauseButton url="https://example.com/post/my-article" />

// With custom size
<ApplauseButton 
  url="https://example.com/post/my-article"
  size="lg" 
/>

// With custom styling
<ApplauseButton 
  url="https://example.com/post/my-article"
  size="sm"
  className="custom-applause"
  style={{ margin: '0 auto' }}
/>
```

### Dependencies

- `applause-button`: npm package for the core functionality
- External CDN resources:
  - CSS: `https://unpkg.com/applause-button/dist/applause-button.css`
  - JS: `https://unpkg.com/applause-button/dist/applause-button.js`

### Configuration Options

The ApplauseButton component accepts these props:

- `url` (required): Unique identifier for the post
- `api`: API endpoint (defaults to `https://applause.chabouis.fr`)
- `size`: Size variant - 'sm', 'md', 'lg' (defaults to 'md')
- `className`: Additional CSS classes
- `style`: Inline styles object

### Future Enhancements

1. **Custom API**: Could be configured to use a custom backend API
2. **User Authentication**: Could integrate with user accounts for personalized tracking
3. **Analytics**: Could track applause data for analytics
4. **Animations**: Could add more sophisticated animations
5. **Sharing Integration**: Could integrate with social sharing when applauded

### Testing

To test the applause button:

1. Start the development server: `npm run dev`
2. Navigate to any blog post
3. Look for the applause button in three locations:
   - After the post content (large button)
   - In the right sidebar on desktop (small button)
   - In the mobile action bar (small button)
4. Click to applaud - the count should increment
5. Refresh the page - the count should persist

### Troubleshooting

If the applause button doesn't appear:
1. Check browser console for JavaScript errors
2. Verify CDN resources are loading
3. Check that the URL prop is being set correctly
4. Ensure the component is properly imported

If styling looks incorrect:
1. Check that custom CSS is being imported in `main.jsx`
2. Verify CSS custom properties are supported
3. Check for CSS conflicts with existing styles

## Files Modified

1. `src/components/ApplauseButton.jsx` - New component
2. `src/styles/applause-button.css` - New CSS file
3. `src/pages/SinglePostPage.jsx` - Added applause buttons in three locations
4. `src/main.jsx` - Added CSS import
5. `package.json` - Added applause-button dependency
