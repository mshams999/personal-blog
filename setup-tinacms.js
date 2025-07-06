#!/usr/bin/env node

/**
 * TinaCMS Quick Setup Script
 * Run this script to quickly set up TinaCMS for your blog
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Setting up TinaCMS for your personal blog...\n')

// Step 1: Install dependencies
console.log('📦 Installing TinaCMS dependencies...')
try {
    execSync('npm install tinacms @tinacms/cli @tinacms/mdx @tinacms/auth', { stdio: 'inherit' })
    console.log('✅ Dependencies installed successfully!\n')
} catch (error) {
    console.error('❌ Failed to install dependencies:', error.message)
    process.exit(1)
}

// Step 2: Create .env.local if it doesn't exist
console.log('🔧 Setting up environment variables...')
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
    const envTemplate = `# TinaCMS Configuration
# Get these from tina.io after signing up
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id-here
TINA_TOKEN=your-token-here
NEXT_PUBLIC_TINA_BRANCH=main
TINA_SEARCH_TOKEN=your-search-token-here

# GitHub Integration (Optional)
GITHUB_PERSONAL_ACCESS_TOKEN=your-github-token-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`

    fs.writeFileSync(envPath, envTemplate)
    console.log('✅ Created .env.local file\n')
} else {
    console.log('⚠️  .env.local already exists, skipping...\n')
}

// Step 3: Initialize TinaCMS
console.log('🎯 Initializing TinaCMS...')
try {
    execSync('npx @tinacms/cli@latest init --skip-install', { stdio: 'inherit' })
    console.log('✅ TinaCMS initialized successfully!\n')
} catch (error) {
    console.warn('⚠️  TinaCMS init may have already been run or encountered an issue\n')
}

// Step 4: Build TinaCMS
console.log('🔨 Building TinaCMS admin interface...')
try {
    execSync('npm run tina:build', { stdio: 'inherit' })
    console.log('✅ TinaCMS admin interface built successfully!\n')
} catch (error) {
    console.warn('⚠️  TinaCMS build encountered an issue. You may need to run this manually.\n')
}

console.log('🎉 TinaCMS setup complete!')
console.log('\n📋 Next steps:')
console.log('1. Sign up at https://tina.io and get your credentials')
console.log('2. Update the values in .env.local with your actual TinaCMS credentials')
console.log('3. Run "npm run dev" to start your development server')
console.log('4. Visit http://localhost:3000/admin to access the CMS')
console.log('\n📖 Read the full guide in TINACMS_SETUP_GUIDE.md')
console.log('\n🚀 Happy blogging!')
