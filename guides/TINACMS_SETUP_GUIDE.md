# TinaCMS Setup Guide for Personal Blog

This guide will help you set up TinaCMS for your personal blog, enabling a beautiful WYSIWYG editor at `/admin` to manage your MDX content directly from the browser.

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install tinacms @tinacms/cli @tinacms/mdx @tinacms/auth
```

### 2. Initialize TinaCMS

```bash
npx @tinacms/cli@latest init
```

### 3. Setup Environment Variables

Create a `.env.local` file in your project root:

```env
# TinaCMS Configuration
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-token
NEXT_PUBLIC_TINA_BRANCH=main
TINA_SEARCH_TOKEN=your-search-token

# GitHub Integration (for direct repo commits)
GITHUB_PERSONAL_ACCESS_TOKEN=your-github-token
```

### 4. Configure TinaCMS

The configuration is in `tina/config.js` - this connects TinaCMS to your GitHub repo and defines the content structure.

### 5. Start the Development Server

```bash
npm run dev
```

Then visit `http://localhost:3000/admin` to access the CMS.

## 📁 File Structure After Setup

```
your-blog/
├── tina/
│   ├── config.js          # Main TinaCMS configuration
│   └── __generated__/     # Auto-generated types
├── content/
│   └── posts/            # Your MDX files
├── .env.local            # Environment variables
└── pages/
    └── admin.js          # Admin page route
```

## 🎯 Features You'll Get

### ✅ Visual Editor
- Rich WYSIWYG editor for MDX content
- Live preview while editing
- Drag-and-drop image uploads
- Markdown shortcuts support

### ✅ Content Management
- Create new blog posts
- Edit existing posts
- Manage metadata (title, excerpt, tags, etc.)
- Set featured images
- Organize by categories

### ✅ GitHub Integration
- Commits directly to your repo
- Branch-based workflows
- Pull request creation
- Content versioning

### ✅ Media Management
- Upload images directly
- Automatic optimization
- CDN integration options
- Alt text management

## 🔧 Configuration Details

### Content Schema
Your blog posts will have these fields:
- **Title**: SEO-optimized titles
- **Excerpt**: Brief description for cards
- **Content**: Rich MDX content with components
- **Featured Image**: Hero images for posts
- **Category**: Organized content sections
- **Tags**: Topic-based filtering
- **Author**: Multi-author support
- **Publication Date**: Scheduling support
- **Read Time**: Automatic calculation
- **SEO Meta**: Title, description, keywords

### Supported Content Types
- **Blog Posts**: Main content type
- **Pages**: Static pages (About, Contact, etc.)
- **Authors**: Author profiles
- **Categories**: Content organization
- **Settings**: Site-wide configuration

## 🎨 Customization Options

### Styling the Admin Interface
You can customize the TinaCMS admin interface to match your brand:

```javascript
// In tina/config.js
export default defineConfig({
  admin: {
    auth: {
      customizeSignIn: () => {
        return {
          logo: '/your-logo.png',
          background: '#your-brand-color'
        }
      }
    }
  }
})
```

### Custom Field Components
Create custom field types for specialized content:

```javascript
// Custom components for your blog
const customFields = {
  codeBlock: {
    name: 'codeBlock',
    label: 'Code Block',
    component: 'group',
    fields: [
      { name: 'language', label: 'Language', type: 'string' },
      { name: 'code', label: 'Code', type: 'string', ui: { component: 'textarea' } }
    ]
  }
}
```

## 📝 Usage Workflow

### Creating a New Post
1. Go to `yoursite.com/admin`
2. Click "Create New" → "Blog Post"
3. Fill in the metadata fields
4. Write your content using the rich editor
5. Preview your changes
6. Save & Publish (commits to GitHub)

### Editing Existing Posts
1. Navigate to "Posts" in the admin
2. Select the post you want to edit
3. Make your changes
4. Preview and save
5. Changes are automatically committed

### Managing Images
1. Use the media manager for uploads
2. Drag images directly into content
3. Set alt text for accessibility
4. Images are optimized automatically

## 🔐 Authentication Setup

### Tina Cloud (Recommended)
1. Sign up at [tina.io](https://tina.io)
2. Connect your GitHub repository
3. Get your client ID and tokens
4. Add to environment variables

### Self-Hosted (Advanced)
You can also run TinaCMS entirely self-hosted for more control.

## 🌐 Deployment

### Vercel/Netlify
Your TinaCMS setup will work with any modern hosting platform:

```bash
# Build command
npm run build

# Start command  
npm run start
```

### Environment Variables in Production
Make sure to set all environment variables in your hosting platform:
- `NEXT_PUBLIC_TINA_CLIENT_ID`
- `TINA_TOKEN`
- `NEXT_PUBLIC_TINA_BRANCH`
- `GITHUB_PERSONAL_ACCESS_TOKEN`

## 🎉 Benefits

### For Content Creators
- **No Markdown Required**: Visual editing experience
- **Live Preview**: See changes immediately
- **Easy Media**: Drag-and-drop image uploads
- **Mobile Friendly**: Edit from any device

### For Developers
- **Git-Based**: All content versioned in Git
- **Type Safety**: Generated TypeScript types
- **Flexible**: Customize fields and workflows
- **Performance**: Static generation + dynamic editing

### For Teams
- **Collaboration**: Multiple editors
- **Permissions**: Role-based access
- **Workflow**: Review and approval processes
- **History**: Full edit history and rollbacks

## 🚨 Important Notes

1. **Backup**: Always backup your content before major changes
2. **Testing**: Test new configurations in a staging environment
3. **Performance**: Large sites may need pagination configuration
4. **Security**: Keep your tokens secure and rotate regularly

## 📞 Support

- **Documentation**: [TinaCMS Docs](https://tina.io/docs)
- **Community**: [TinaCMS Discord](https://discord.gg/zumN63Ybpf)
- **GitHub**: [TinaCMS Issues](https://github.com/tinacms/tinacms/issues)

---

**Ready to start?** Follow the setup steps above and you'll have a professional CMS running in minutes! 🎯
