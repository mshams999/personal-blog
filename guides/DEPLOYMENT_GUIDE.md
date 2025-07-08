# Deployment Guide: Deploy to Custom Domain

This guide will help you deploy your personal blog webapp to a custom domain using popular hosting platforms.

## Deployment Options

### Option 1: Netlify (Recommended)

**Why Netlify?**
- Free tier with custom domains
- Automatic builds from GitHub
- Built-in form handling (perfect for MailChimp)
- Easy environment variable management
- Excellent performance

**Steps:**

1. **Connect GitHub Repository**
   ```
   1. Go to https://netlify.com and sign up/login
   2. Click "Add new site" → "Import an existing project"
   3. Choose "Deploy with GitHub"
   4. Authorize Netlify to access your repositories
   5. Select your blog repository
   ```

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Set Environment Variables**
   ```
   Go to Site settings → Environment variables
   Add your variables from .env.example:
   - VITE_DISQUS_SHORTNAME=your_disqus_shortname
   - VITE_MAILCHIMP_ACTION_URL=your_mailchimp_url
   - VITE_GA_MEASUREMENT_ID=your_ga_id
   ```

4. **Deploy**
   ```
   Click "Deploy site"
   Your site will be available at: https://random-name.netlify.app
   ```

5. **Connect Custom Domain**
   ```
   1. Go to Site settings → Domain management
   2. Click "Add custom domain"
   3. Enter your domain (e.g., yourblog.com)
   4. Follow DNS configuration instructions
   5. SSL certificate will be automatically provisioned
   ```

**DNS Configuration:**
```
For root domain (yourblog.com):
- A record pointing to Netlify's load balancer IP
- Or ALIAS/ANAME record pointing to your-site.netlify.app

For subdomain (www.yourblog.com):
- CNAME record pointing to your-site.netlify.app
```

### Option 2: Vercel

**Steps:**

1. **Deploy from GitHub**
   ```
   1. Go to https://vercel.com and sign up/login
   2. Click "New Project"
   3. Import your GitHub repository
   4. Vercel auto-detects Vite settings
   5. Click "Deploy"
   ```

2. **Environment Variables**
   ```
   Go to Project settings → Environment Variables
   Add your variables from .env.example
   ```

3. **Custom Domain**
   ```
   1. Go to Project settings → Domains
   2. Add your custom domain
   3. Configure DNS as instructed
   ```

### Option 3: GitHub Pages + Custom Domain

**Steps:**

1. **Enable GitHub Pages**
   ```
   1. Go to your repository settings
   2. Scroll to "Pages" section
   3. Source: Deploy from a branch
   4. Branch: gh-pages (you'll create this)
   ```

2. **Set up Build Action**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           env:
             VITE_DISQUS_SHORTNAME: ${{ secrets.VITE_DISQUS_SHORTNAME }}
             VITE_MAILCHIMP_ACTION_URL: ${{ secrets.VITE_MAILCHIMP_ACTION_URL }}
             VITE_GA_MEASUREMENT_ID: ${{ secrets.VITE_GA_MEASUREMENT_ID }}
             
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Add Secrets**
   ```
   Repository settings → Secrets and variables → Actions
   Add your environment variables as secrets
   ```

4. **Custom Domain**
   ```
   1. Repository settings → Pages
   2. Add your custom domain
   3. Configure DNS with your domain provider
   ```

## DNS Configuration Guide

### For Most Domain Providers (GoDaddy, Namecheap, etc.)

**Root Domain (yourblog.com):**
```
Type: A
Name: @ (or leave blank)
Value: [Platform's IP address]
TTL: 300 (5 minutes)
```

**WWW Subdomain:**
```
Type: CNAME
Name: www
Value: [Platform's domain]
TTL: 300
```

**Platform-Specific Values:**

**Netlify:**
- A record: 75.2.60.5
- CNAME: your-site.netlify.app

**Vercel:**
- A record: 76.76.19.61
- CNAME: cname.vercel-dns.com

**GitHub Pages:**
- A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- CNAME: yourusername.github.io

## Post-Deployment Checklist

### 1. Test Your Environment Variables
```bash
# Check if analytics loads
# Check if Disqus comments appear
# Test newsletter signup
```

### 2. Performance Optimization
```bash
# Enable compression (usually automatic)
# Set up CDN (usually included)
# Configure caching headers
```

### 3. SEO Setup
```bash
# Verify meta tags
# Submit sitemap to Google Search Console
# Set up Google Analytics goals
```

### 4. Security
```bash
# Enable HTTPS (usually automatic)
# Set up security headers
# Configure Content Security Policy if needed
```

## Integration Setup After Deployment

### 1. Disqus Configuration
```
1. Go to your Disqus admin panel
2. Add your production domain to trusted domains
3. Update VITE_DISQUS_SHORTNAME if needed
```

### 2. MailChimp Configuration
```
1. Update allowed domains in MailChimp settings
2. Test signup form on production
3. Set up automation workflows
```

### 3. Google Analytics
```
1. Add your production domain to GA4 property
2. Set up conversion goals
3. Configure enhanced ecommerce if needed
```

## Troubleshooting

### Common Issues:

**1. Build Fails**
```
- Check Node.js version compatibility
- Verify environment variables are set
- Check for missing dependencies
```

**2. Domain Not Working**
```
- DNS propagation can take up to 48 hours
- Use DNS checker tools to verify configuration
- Check SSL certificate status
```

**3. Analytics Not Working**
```
- Verify VITE_GA_MEASUREMENT_ID is correct
- Check browser console for errors
- Test in incognito mode
```

**4. Comments Not Loading**
```
- Verify Disqus shortname
- Check trusted domains in Disqus settings
- Clear browser cache
```

## Monitoring & Maintenance

### Performance Monitoring
```
- Google PageSpeed Insights
- GTmetrix
- Pingdom
```

### Uptime Monitoring
```
- UptimeRobot (free)
- Pingdom
- StatusCake
```

### Analytics Monitoring
```
- Google Analytics 4
- Google Search Console
- Social media analytics
```

## Support Resources

- **Netlify Docs**: https://docs.netlify.com/
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Pages**: https://docs.github.com/pages
- **Domain DNS Help**: Your domain registrar's support

---

**Need Help?** 
Check the troubleshooting guides in this repository or create an issue on GitHub.
