# 🔄 Development Workflow Guide

This guide covers how to make changes to your live website and deploy them.

## Daily Development Workflow

### 1. Start Development Server
```bash
npm run dev
```
This starts your local development server at `http://localhost:5173`

### 2. Make Your Changes
Edit any files in VS Code:
- **Content**: Update `src/data/info.json` for posts/bio
- **Styling**: Edit components or `src/index.css`
- **Pages**: Modify files in `src/pages/`
- **Components**: Update files in `src/components/`

### 3. Test Locally
- Check your changes in the browser
- Test responsiveness (mobile/desktop)
- Verify all features work

### 4. Commit Changes
```bash
# Check what files changed
git status

# Add files to staging
git add .

# Commit with descriptive message
git commit -m "Brief description of what you changed"
```

### 5. Push to GitHub
```bash
git push origin main
```

### 6. Automatic Deployment
Your hosting platform will automatically:
- Pull the latest code
- Build the project
- Deploy to your live site

**Deployment Time:**
- Netlify: 1-2 minutes
- Vercel: 1-2 minutes  
- GitHub Pages: 2-5 minutes

## Common Editing Scenarios

### Updating Blog Posts
**File**: `src/data/info.json`

```json
{
  "posts": [
    {
      "id": "new-post",
      "slug": "my-new-blog-post",
      "title": "My New Blog Post",
      "excerpt": "This is what my post is about...",
      "date": "2025-07-04T10:00:00Z",
      "readTime": 5,
      "featuredImage": "https://images.unsplash.com/photo-example",
      "authorId": "author-1",
      "categoryId": "tech",
      "tags": ["web", "development"],
      "mdxContentPath": "/content/posts/new-post.mdx"
    }
  ]
}
```

Don't forget to create the corresponding MDX file in `public/content/posts/`

### Updating Your CV
**File**: `src/pages/CVPage.jsx` or `src/data/info.json`

Update your experience, skills, education, etc.

### Changing Colors/Styling
**File**: `tailwind.config.js` for theme colors
**File**: `src/index.css` for custom styles

### Updating Personal Info
**File**: `src/data/info.json`

Update bio, contact info, social links, etc.

### Adding New Pages
1. Create new file in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation in `src/components/Header.jsx`

## Git Commands Reference

### Basic Commands
```bash
# Check status
git status

# See what changed
git diff

# Add all changes
git add .

# Add specific file
git add src/components/Header.jsx

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes (if working with others)
git pull origin main
```

### Useful Git Commands
```bash
# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename.jsx

# Create new branch for feature
git checkout -b feature-name

# Switch back to main
git checkout main
```

## Best Practices

### Commit Messages
Use clear, descriptive commit messages:

✅ **Good:**
- `Add new blog post about React hooks`
- `Update CV with recent experience`
- `Fix mobile navigation styling`
- `Update contact information`

❌ **Bad:**
- `Update stuff`
- `Fix things`
- `Changes`

### Testing Before Push
Always test locally:
```bash
# Test development build
npm run dev

# Test production build
npm run build
npm run preview
```

### Environment Variables
If you add new environment variables:
1. Add to `.env.example`
2. Update hosting platform settings
3. Document in setup guides

## Troubleshooting

### Build Fails on Deployment
```bash
# Test build locally first
npm run build

# Check for errors
npm run preview
```

### Changes Not Appearing
1. Check deployment logs on hosting platform
2. Clear browser cache
3. Wait for full deployment (2-5 minutes)
4. Verify git push was successful

### Merge Conflicts
If you see merge conflicts:
```bash
# Pull latest changes
git pull origin main

# Resolve conflicts in VS Code
# Look for <<<<<<< HEAD sections

# Add resolved files
git add .

# Commit merge
git commit -m "Resolve merge conflicts"

# Push
git push origin main
```

## Workflow Tips

### 1. Small, Frequent Commits
Better to make many small commits than one large commit.

### 2. Use Branches for Big Features
```bash
# Create feature branch
git checkout -b new-feature

# Work on feature...
git add .
git commit -m "Add new feature"

# Switch to main and merge
git checkout main
git merge new-feature
git push origin main
```

### 3. Backup Important Changes
Consider creating branches before major changes:
```bash
git checkout -b backup-before-changes
git checkout main
# Make your changes...
```

### 4. Use VS Code Git Integration
- VS Code has built-in git tools
- View changes, stage files, commit directly in editor
- Use Source Control panel (Ctrl+Shift+G)

## Monitoring Your Live Site

### Check Deployment Status
- **Netlify**: Go to your site dashboard
- **Vercel**: Check deployment tab
- **GitHub Pages**: Check Actions tab

### Performance Monitoring
Regularly check:
- Google PageSpeed Insights
- Your analytics dashboard
- Uptime monitoring (if set up)

---

## Quick Reference Card

```bash
# Daily workflow
npm run dev          # Start development
git status          # Check changes
git add .           # Stage changes  
git commit -m "msg" # Commit changes
git push origin main # Deploy to live site

# Emergency commands
git reset --soft HEAD~1  # Undo last commit
git checkout -- file    # Discard file changes
npm run build           # Test production build
```

**Remember**: Every push to the `main` branch automatically updates your live website! 🚀
