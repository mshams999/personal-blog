# Ruki Blog - Troubleshooting

## If you're seeing a white page, try these steps:

### 1. Check Browser Console
- Open your browser's developer tools (F12)
- Check the Console tab for any JavaScript errors
- Check the Network tab to see if files are loading

### 2. Verify Server is Running
- The development server should be running at `http://localhost:5173`
- Check the terminal output for any errors

### 3. Try Different Browser
- Try opening the site in a different browser
- Clear browser cache and cookies

### 4. Check Terminal Output
- Look for any build errors in the terminal
- Make sure all dependencies are installed

### 5. Manual Browser Test
- Open http://localhost:5173 in Chrome, Firefox, or Edge
- You should see "Ruki Blog Test" heading with text

### 6. Restore Full Application
If the test version works, we can restore the full application step by step.

## Current Status
- Server is running without errors
- Basic React setup is in place
- Issue might be with CSS imports or complex components

## Next Steps
1. Test with inline styles (current setup)
2. Add back CSS imports
3. Add back complex components
4. Debug specific component issues

## Disqus Comments Issues

### Comments Not Loading
- **Check Configuration**: Make sure your shortname is correctly set in `src/config/disqus.js`
- **Domain Setup**: Verify your domain is added to Disqus trusted domains
- **Ad Blockers**: Some ad blockers may block Disqus - try disabling them temporarily
- **Browser Console**: Check for JavaScript errors related to Disqus

### Setup Guide Showing Instead of Comments
- This means Disqus is not configured yet
- Follow the setup guide shown on the page
- Or check `DISQUS_SETUP.md` for detailed instructions

### Comment Counts Not Showing
- Make sure the same configuration is used for both comments and comment counts
- Check that the post URLs are consistent and accessible

For detailed Disqus setup instructions, see `DISQUS_SETUP.md`.
