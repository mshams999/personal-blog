# 🔐 SECURITY GUIDE - Environment Variables & API Keys

## 🚨 CRITICAL SECURITY ISSUE RESOLVED

**Problem**: API keys and tokens were exposed in multiple files and potentially on GitHub.

**Solution**: Implemented comprehensive security measures to protect sensitive data.

---

## 📋 SECURITY CHECKLIST

### ✅ Actions Completed:

1. **Updated `.gitignore`** - Added comprehensive patterns to exclude sensitive files
2. **Created `.env.example`** - Template with placeholder values
3. **Secured existing files** - Removed real API keys from tracked files
4. **Created security setup script** - `setup-security.js` for automated checks
5. **Documentation** - This comprehensive security guide

### 🔄 Actions Required:

1. **Regenerate ALL API keys** (they were exposed on GitHub)
2. **Update production environment variables**
3. **Review git history for sensitive data**
4. **Set up GitHub Secrets for CI/CD**

---

## 🔧 IMMEDIATE ACTIONS REQUIRED

### 1. Regenerate Exposed API Keys

**TinaCMS Keys:**
- Visit https://app.tina.io/projects
- Regenerate `TINA_TOKEN`
- Regenerate `TINA_SEARCH_TOKEN`
- Get new `NEXT_PUBLIC_TINA_CLIENT_ID`

**Firebase Keys:**
- Visit Firebase Console
- Go to Project Settings > General
- Regenerate API keys if exposed

**Mailchimp Keys:**
- Visit Mailchimp Account
- Go to API Keys section
- Regenerate API key

**Google Analytics:**
- Generally safe (public measurement IDs)
- But review if GA API keys were exposed

### 2. Update Local Environment

```bash
# Copy the template
cp .env.example .env

# Edit with your NEW API keys
code .env  # or your preferred editor
```

### 3. Clean Git History (If needed)

```bash
# Check for exposed secrets in git history
git log --grep="TOKEN\|API_KEY\|SECRET" --oneline

# If secrets found in history, consider:
# git filter-branch or BFG Repo-Cleaner
# But consult your team first!
```

---

## 🏗️ SECURE DEVELOPMENT WORKFLOW

### Environment File Structure:

```
📁 Project Root/
├── .env                    # 🔐 LOCAL ONLY - Your actual keys
├── .env.example           # 📋 Template with placeholders
├── .env.template          # 📋 Legacy template (cleaned)
├── .gitignore            # 🚫 Excludes all .env files
└── setup-security.js     # 🔧 Security setup script
```

### Development Setup:

```bash
# 1. Clone repository
git clone <repo-url>

# 2. Install dependencies
npm install

# 3. Run security setup
node setup-security.js

# 4. Copy environment template
cp .env.example .env

# 5. Add your actual API keys to .env
code .env

# 6. Start development
npm run tina:dev
```

---

## 🚀 PRODUCTION DEPLOYMENT

### GitHub Actions Secrets:

Set these in GitHub Repository → Settings → Secrets:

```
TINA_TOKEN=your-production-token
NEXT_PUBLIC_TINA_CLIENT_ID=your-production-client-id
TINA_SEARCH_TOKEN=your-production-search-token
VITE_FIREBASE_API_KEY=your-production-firebase-key
VITE_GA_MEASUREMENT_ID=your-production-ga-id
VITE_MAILCHIMP_API_KEY=your-production-mailchimp-key
```

### Netlify Environment Variables:

Set in Netlify Dashboard → Site Settings → Environment Variables:

```
NEXT_PUBLIC_TINA_CLIENT_ID
TINA_TOKEN
TINA_SEARCH_TOKEN
NEXT_PUBLIC_TINA_BRANCH
VITE_FIREBASE_API_KEY
VITE_FIREBASE_PROJECT_ID
VITE_GA_MEASUREMENT_ID
```

---

## 🛡️ SECURITY BEST PRACTICES

### ✅ DO:
- Use different API keys for development and production
- Rotate API keys regularly
- Use GitHub Secrets for CI/CD
- Keep `.env` files in `.gitignore`
- Use environment variable validation
- Monitor for exposed secrets

### ❌ DON'T:
- Commit `.env` files with real values
- Share API keys in chat/email
- Use production keys in development
- Leave default/example keys in production
- Push sensitive data to git

---

## 🔍 MONITORING & DETECTION

### Tools to Detect Exposed Secrets:

1. **GitHub Secret Scanning** (automatically enabled)
2. **GitLeaks** - Local secret detection
3. **TruffleHog** - Git history scanning
4. **npm audit** - Dependency vulnerabilities

### Setup Alerts:

```bash
# Install GitLeaks for local checking
# Windows (using Chocolatey)
choco install gitleaks

# Check current repository
gitleaks detect --source . --verbose
```

---

## 🚨 INCIDENT RESPONSE

If secrets are exposed:

1. **Immediately rotate all affected keys**
2. **Review access logs for unauthorized usage**
3. **Update all deployment environments**
4. **Notify team members**
5. **Document the incident**
6. **Review and improve security processes**

---

## 📞 SUPPORT

If you need help with:
- Regenerating API keys
- Setting up GitHub Secrets
- Configuring deployment environments
- Security auditing

Consult the respective service documentation or contact your security team.

---

**Last Updated**: January 2025  
**Status**: ✅ Security measures implemented  
**Next Review**: When onboarding new team members
