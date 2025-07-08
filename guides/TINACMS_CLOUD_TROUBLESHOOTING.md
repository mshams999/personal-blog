# TinaCMS Cloud Troubleshooting Guide

## Current Status ✅
- [x] TinaCMS files committed and pushed to GitHub
- [x] Schema updated to handle `info.json` file
- [x] Environment variables configured
- [x] Local development server working
- [x] Admin interface fixed (blank page issue resolved)

## Admin Interface Access
The TinaCMS admin interface can be accessed in two ways:

1. **Through your app route**: `http://localhost:5173/admin`
   - This shows a user-friendly interface with a button to access the CMS
   
2. **Direct admin access**: `http://localhost:5173/admin/index.html`
   - This is the actual TinaCMS editor interface

**Important**: You must run `npm run tina:dev` (not just `npm run dev`) to start both the Vite server and TinaCMS server simultaneously.

## Next Steps for TinaCloud Setup

### 1. Connect Repository in TinaCloud Dashboard
1. Go to [tina.io](https://tina.io) and sign in
2. Create a new project or go to your existing project
3. Click "Change Repository" → Select `mshams999/personal-blog`
4. Set the branch to `main`
5. Click "Save Configuration"

### 2. Configure Advanced Settings (if needed)
Since your `tina/` directory is in the root (not a monorepo), you should NOT need to change the "Path to Tina Config" setting. Leave it as default.

### 3. Refresh Statuses
1. In the TinaCloud dashboard, find the "Configuration" section
2. Click **"Refresh Statuses"**
3. Wait 30-60 seconds
4. If branches don't appear, reload the page
5. If still empty, try "Refresh Webhooks" under Advanced Settings

### 4. GitHub App Permissions Check
If branches still don't show:
1. In TinaCloud, click "Change Repository"
2. Re-select `mshams999/personal-blog` 
3. Ensure these permissions are granted:
   - Contents (read/write)
   - Metadata (read)
   - Pull requests (read/write)

### 5. Smoke Test
Once the branch appears in TinaCloud:
1. Run `npm run tina:dev` locally (this starts both Vite and TinaCMS servers)
2. Open `http://localhost:5173/admin` or `http://localhost:5173/admin/index.html`
3. Sign in with your TinaCloud account
4. Try creating a test post
5. Verify the commit appears on GitHub

## Troubleshooting: Blank Admin Page

**Issue**: The admin page shows a blank white screen
**Cause**: TinaCMS needs both the Vite dev server and TinaCMS server running

**Solution**:
1. Always use `npm run tina:dev` (not `npm run dev`)
2. This command starts both servers:
   - Vite dev server on `http://localhost:5173`
   - TinaCMS server on `http://localhost:4001`
3. Access admin via `http://localhost:5173/admin/index.html`

**If still blank**:
- Check browser console for errors
- Verify TinaCMS server is running (should see "TinaCMS Dev Server is active" message)
- Try clearing browser cache
- Ensure all TinaCMS dependencies are installed

## Common Issues & Solutions

### Issue: "No branches found"
**Solutions:**
- Ensure the repository URL is exactly `mshams999/personal-blog`
- Check that the `main` branch exists and has recent commits
- Try refreshing statuses multiple times
- Verify GitHub App permissions

### Issue: "Invalid branch" errors during build
**Solution:** The `GITHUB_BRANCH=main` and `TINA_PUBLIC_IS_LOCAL=true` environment variables should prevent this.

### Issue: Schema errors
**Solution:** Our schema has been updated to properly handle the `info.json` file. If you see schema errors, run `npm run tina:dev` to regenerate.

## Environment Variables Summary

Your `.env.local` file should contain:
```env
# TinaCMS Configuration
NEXT_PUBLIC_TINA_CLIENT_ID=faf2e041-206f-4336-9b34-3d515cea46f5
TINA_TOKEN=fe29d8520cf15a6456f913c6482548e456bf8a86
NEXT_PUBLIC_TINA_BRANCH=main
TINA_SEARCH_TOKEN=daf6410389fcd6c841542cd74f8daf27b33e5a05

# Environment variables for TinaCloud branch indexing
GITHUB_BRANCH=main
TINA_PUBLIC_IS_LOCAL=true
```

## Files Successfully Committed
- ✅ `tina/config.js` - Updated schema
- ✅ `tina/tina-lock.json` - Generated lock file
- ✅ `tina/__generated__/*` - Generated client files
- ✅ `public/admin/` - Admin interface
- ✅ `package.json` - Updated dependencies
- ✅ `package-lock.json` - Lock file

## Next Actions Required
1. **Go to TinaCloud dashboard** and connect the repository
2. **Refresh Statuses** to index the branch
3. **Test the admin interface** at `/admin`
4. **Create a test post** to verify the workflow

## Support Resources
- [TinaCMS Documentation](https://tina.io/docs/)
- [TinaCMS Discord](https://discord.gg/zumN63Ybpf)
- [GitHub Repository](https://github.com/mshams999/personal-blog)

---

**Status:** Ready for TinaCloud connection. All local files have been committed and pushed successfully.
