# Complete Setup Guide: Disqus → Firebase Cloud Function Sync

## What You're Building

A system that automatically syncs Disqus comment counts to Firebase every 5 minutes using a Cloud Function. Your blog will display counts from Firebase (fast, real-time) while the Cloud Function keeps them synced with Disqus (automatic, no client code needed).

## Setup Steps (15 minutes total)

### ✅ Step 1: Deploy Firestore Rules (1 minute)

You already did this! Your Firestore rules now allow reading comment counts.

### ✅ Step 2: Get Disqus API Key (2 minutes)

1. Go to https://disqus.com/api/applications/
2. Click **"Register New Application"**
3. Fill in:
   - **Label**: "Blog Comment Sync"
   - **Description**: "Sync comment counts to Firebase"
   - **Website**: Your blog URL
4. Click **"Register my application"**
5. **Copy your API Key** (the public key shown at the top)

### 📝 Step 3: Set Firebase Secret (1 minute)

In your terminal:

```bash
firebase functions:secrets:set DISQUS_API_KEY
```

When prompted, paste your Disqus API key and press Enter.

### 🚀 Step 4: Deploy Cloud Function (2 minutes)

```bash
firebase deploy --only functions
```

Wait for deployment to complete. You'll see:
```
✔ Deploy complete!
```

### 🎯 Step 5: Initialize Your Posts (5 minutes)

You have 3 options:

#### Option A: Web Interface (Easiest)

1. Open `http://localhost:5173/init-comments.html` in your browser
2. Update the Firebase config in the file with your credentials
3. Enter your post slugs (one per line)
4. Click **"Initialize Comment Counts"**
5. Wait for completion

#### Option B: Browser Console

On your blog homepage, open console (F12):

```javascript
// Import setup utility
const { setupCommentCounts } = await import('/src/utils/setupCommentCounts.js')

// Get your posts (adjust based on your setup)
const posts = /* your posts array */

// Initialize
await setupCommentCounts(posts)
```

#### Option C: Node Script

1. Download service account key from Firebase Console
2. Save as `serviceAccountKey.json` in project root
3. Update post slugs in `scripts/init-comment-counts.js`
4. Run:
```bash
node scripts/init-comment-counts.js
```

### ⏱️ Step 6: Wait for First Sync (5 minutes)

The Cloud Function runs every 5 minutes. Wait 5 minutes, then verify:

```bash
firebase functions:log --only syncDisqusComments
```

You should see:
```
🔄 Starting Disqus comment sync...
✅ Synced post-slug-1: 5 comments
✅ Synced post-slug-2: 12 comments
🎉 Sync complete!
```

### 🔍 Step 7: Verify in Firebase Console

1. Go to https://console.firebase.google.com
2. Select your project
3. Click **Firestore Database**
4. Open **commentCounts** collection
5. You should see documents with `count` values from Disqus

### 🎨 Step 8: Update Your Components

Replace Disqus components with Firebase components:

#### HomePage.jsx

```jsx
// OLD - Remove this
import DisqusCommentCount from '../components/DisqusCommentCount'
import { useDisqusCommentCounts } from '../hooks/useDisqusCommentCounts'

// NEW - Add this
import FirebaseCommentCount from '../components/FirebaseCommentCount'
import { useCommentCounts } from '../hooks/useCommentCounts'

// In your component
const { sortedByComments, getCommentCount } = useCommentCounts(posts)

// In JSX
<FirebaseCommentCount post={post} />
```

#### SinglePostPage.jsx

```jsx
// OLD
import DisqusCommentCount from '../components/DisqusCommentCount'

// NEW
import FirebaseCommentCount from '../components/FirebaseCommentCount'

// In JSX
<FirebaseCommentCount post={post} showIcon={false} />
```

### ✅ Step 9: Test It!

1. Open your blog
2. Comment counts should load instantly from Firebase
3. Add a comment on Disqus
4. Wait 5 minutes
5. Refresh your blog - count should update!

## What Each Part Does

### Cloud Function (`functions/index.js`)

```
syncDisqusComments (Scheduled):
  - Runs every 5 minutes automatically
  - Fetches counts from Disqus API
  - Updates Firebase Firestore
  - Logs progress

syncDisqusCommentsManual (HTTP):
  - Manual trigger endpoint
  - Same logic as scheduled function
  - Returns JSON response with results
```

### Firebase Hook (`src/hooks/useCommentCounts.js`)

```
useCommentCount(slug):
  - Real-time listener for single post
  - Updates automatically when Firebase changes
  - No polling needed

useCommentCounts(posts):
  - Real-time listeners for multiple posts
  - Sorts by comment count
  - Returns getCommentCount helper
```

### Component (`src/components/FirebaseCommentCount.jsx`)

```
<FirebaseCommentCount post={post} />
  - Displays count from Firebase
  - Real-time updates
  - Loading state
  - Customizable display
```

## Manual Sync (When Needed)

### Option 1: HTTP Endpoint

```bash
curl https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/syncDisqusCommentsManual
```

### Option 2: Firebase Console

1. Go to Functions in Firebase Console
2. Find `syncDisqusCommentsManual`
3. Copy the trigger URL
4. Open in browser or use curl

### Option 3: Scheduled Trigger

Just wait for the next 5-minute interval.

## Monitoring

### View Logs

```bash
# Live logs
firebase functions:log --only syncDisqusComments --follow

# Recent logs
firebase functions:log --only syncDisqusComments --limit 20
```

### Firebase Console

1. Go to Firebase Console
2. Click **Functions**
3. Click **syncDisqusComments**
4. View metrics and logs

## Troubleshooting

### Function not syncing?

Check logs:
```bash
firebase functions:log --only syncDisqusComments
```

Common issues:
- API key not set: Run `firebase functions:secrets:set DISQUS_API_KEY`
- Wrong shortname: Update in `functions/index.js`
- No posts initialized: Run Step 5 again
- Rate limiting: Disqus limits to 1000 requests/hour

### Counts not updating in app?

1. Verify Firebase config in your app
2. Check browser console for errors
3. Verify Firestore rules deployed
4. Check if documents exist in Firestore

### "No posts found" error?

Initialize posts first (Step 5).

## Configuration

### Change Sync Frequency

Edit `functions/index.js`:

```javascript
schedule: 'every 10 minutes',  // or 'every 1 hours', etc.
```

Redeploy:
```bash
firebase deploy --only functions:syncDisqusComments
```

### Change Disqus Shortname

Edit `functions/index.js`:

```javascript
const DISQUS_SHORTNAME = 'your-shortname-here';
```

### Add More Post Sources

Edit function to fetch from your CMS:

```javascript
// Instead of reading from commentCounts collection
const postsFromCMS = await fetchPostsFromTinaCMS();

for (const post of postsFromCMS) {
    // sync logic
}
```

## Costs

### Firebase Cloud Functions
- **Free tier**: 2M invocations/month
- Sync every 5 minutes: ~8,640/month
- **Cost**: $0/month ✅

### Disqus API
- **Free tier**: 1,000 requests/hour
- More than enough
- **Cost**: $0/month ✅

### Firestore
- **Free tier**: 50K reads/day
- **Cost**: $0/month ✅

**Total: $0/month** 💰

## Success Checklist

- [ ] Firestore rules deployed
- [ ] Disqus API key obtained
- [ ] API key set as Firebase secret
- [ ] Cloud Function deployed
- [ ] Posts initialized in Firestore
- [ ] First sync completed (check logs)
- [ ] Counts visible in Firebase Console
- [ ] Components updated in app
- [ ] Real-time updates working
- [ ] Monitoring set up

## Next Steps After Setup

1. ✅ Monitor for 24 hours
2. ✅ Verify counts stay in sync
3. ✅ Set up alerts for errors (optional)
4. ✅ Add more posts as you publish
5. 🎉 Enjoy automatic sync!

## Support Files

- **Deployment Guide**: `DEPLOY_COMMENT_SYNC_FUNCTION.md`
- **Quick Start**: `FIREBASE_COMMENT_COUNTER_QUICKSTART.md`
- **Full Guide**: `FIREBASE_COMMENT_COUNTER_GUIDE.md`
- **Function Code**: `functions/index.js`
- **Web Interface**: `public/init-comments.html`

---

**Setup Time**: ~15 minutes  
**Maintenance**: None (automatic)  
**Cost**: $0/month  
**Status**: ✅ Production Ready

Need help? Check the logs or the troubleshooting sections above!
