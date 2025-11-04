# Deploy Disqus Comment Sync Cloud Function

## Quick Deploy (5 Minutes)

### Step 1: Get Your Disqus API Key

1. Go to https://disqus.com/api/applications/
2. Click "Register New Application"
3. Fill in the form:
   - **Label**: "My Blog Comment Sync"
   - **Description**: "Sync comments to Firebase"
   - **Website**: Your blog URL
4. Click "Register my application"
5. Copy your **API Key** (the public key, not secret)

### Step 2: Set Firebase Secrets

In your terminal, run:

```bash
# Set your Disqus API key as a secret
firebase functions:secrets:set DISQUS_API_KEY
# When prompted, paste your Disqus API key and press Enter
```

### Step 3: Deploy the Function

```bash
# Deploy just the functions
firebase deploy --only functions
```

This will deploy:
- `syncDisqusComments` - Runs automatically every 5 minutes
- `syncDisqusCommentsManual` - HTTP endpoint for manual sync

### Step 4: Initialize Your Posts

In your browser console on your blog:

```javascript
// Get your posts
const { getRecentPosts } = /* your data context */
const posts = getRecentPosts()

// Initialize comment counts in Firebase
import { initializeCommentCount } from './utils/commentSync'

for (const post of posts) {
    await initializeCommentCount(post.slug)
}
```

Or use the setup script:
```javascript
import setupCommentCounts from './utils/setupCommentCounts'
await setupCommentCounts(posts)
```

### Step 5: Trigger First Sync

Option A - Wait 5 minutes for automatic sync

Option B - Trigger manual sync:
```bash
# Get your function URL from Firebase Console or deployment output
curl https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/syncDisqusCommentsManual
```

Done! Your comments will now sync automatically every 5 minutes. 🎉

## Verify It's Working

### Check Logs

```bash
firebase functions:log --only syncDisqusComments
```

You should see:
```
🔄 Starting Disqus comment sync...
✅ Synced post-slug-1: 5 comments
✅ Synced post-slug-2: 12 comments
🎉 Sync complete! Success: 10, Errors: 0
```

### Check Firestore

1. Go to https://console.firebase.google.com
2. Navigate to Firestore Database
3. Open `commentCounts` collection
4. Verify documents have updated `count` and `lastUpdated` fields

### Test Real-Time Updates

1. Open your blog in a browser
2. Comment on a post via Disqus
3. Wait 5 minutes (or trigger manual sync)
4. Refresh your blog - count should be updated!

## Troubleshooting

### Function not deploying?

Check Node version:
```bash
node --version  # Should be 18 or higher
```

Update if needed:
```bash
nvm install 18
nvm use 18
```

### "DISQUS_API_KEY not configured"?

Set the secret:
```bash
firebase functions:secrets:set DISQUS_API_KEY
```

### "No posts found in commentCounts collection"?

Initialize your posts first (see Step 4 above).

### Sync not working?

1. Check Disqus API key is correct
2. Verify shortname in code matches your Disqus forum
3. Check function logs for errors
4. Verify posts exist in Disqus with those exact slugs

### Rate limiting errors?

Disqus free tier limits:
- 1000 requests/hour
- Adjust sync frequency if needed

## Configuration

### Change Sync Frequency

Edit `functions/index.js`:

```javascript
exports.syncDisqusComments = onSchedule({
    schedule: 'every 10 minutes',  // Change this
    timeZone: 'America/New_York',
    // ...
})
```

Options:
- `'every 5 minutes'`
- `'every 10 minutes'`
- `'every 30 minutes'`
- `'every 1 hours'`
- `'0 */2 * * *'` (cron format - every 2 hours)

Then redeploy:
```bash
firebase deploy --only functions
```

### Change Timezone

```javascript
timeZone: 'America/Los_Angeles',  // PST
timeZone: 'Europe/London',        // GMT
timeZone: 'Asia/Dubai',           // GST
```

### Update Disqus Shortname

Edit `functions/index.js`:

```javascript
const DISQUS_SHORTNAME = 'your-shortname-here';
```

## Manual Sync Endpoint

Your function creates an HTTP endpoint for manual syncing:

```bash
# Get the URL
firebase functions:config:get

# Call it
curl https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/syncDisqusCommentsManual

# Response:
{
  "success": true,
  "message": "Sync complete",
  "synced": 10,
  "errors": 0,
  "total": 10,
  "results": [...]
}
```

## Cost Estimate

Firebase Cloud Functions pricing:
- **Free tier**: 2 million invocations/month
- **After free tier**: $0.40 per million invocations

Example costs:
- Sync every 5 minutes: ~8,640 invocations/month = **FREE**
- Sync every minute: ~43,200 invocations/month = **FREE**

Disqus API:
- **Free tier**: 1,000 requests/hour
- More than enough for sync operations

**Total cost: $0/month** 💰

## Production Checklist

- [ ] Disqus API key set as Firebase secret
- [ ] Function deployed successfully
- [ ] Posts initialized in Firestore
- [ ] First sync completed
- [ ] Firestore rules deployed
- [ ] Real-time updates working in app
- [ ] Logs showing successful syncs

## Monitoring

### View Logs

```bash
# Live logs
firebase functions:log --only syncDisqusComments --follow

# Recent logs
firebase functions:log --only syncDisqusComments --limit 50
```

### Firebase Console

1. Go to https://console.firebase.google.com
2. Select your project
3. Navigate to Functions
4. Click on `syncDisqusComments`
5. View metrics: invocations, errors, execution time

### Set Up Alerts

In Firebase Console:
1. Go to Functions
2. Click on function name
3. Click "Logs"
4. Set up alert for errors

## Advanced: Using with CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy-functions.yml
name: Deploy Functions

on:
  push:
    branches: [ main ]
    paths:
      - 'functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
        working-directory: functions
      - run: firebase deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Next Steps

1. ✅ Deploy function
2. ✅ Initialize posts
3. ✅ Verify sync working
4. 🔄 Update your components to use Firebase counts
5. 🚀 Deploy your app

See: `FIREBASE_COMMENT_COUNTER_QUICKSTART.md` for component updates.

---

**Deployment Time**: 5 minutes  
**Cost**: $0/month  
**Maintenance**: None (automatic)  
**Status**: ✅ Production Ready
