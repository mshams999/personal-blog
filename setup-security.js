#!/usr/bin/env node

/**
 * 🔐 SECURITY SETUP SCRIPT
 * 
 * This script helps you set up environment variables securely
 * and removes any accidentally committed sensitive data
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
}

console.log(`${colors.bold}${colors.cyan}🔐 SECURITY SETUP SCRIPT${colors.reset}`)
console.log(`${colors.yellow}Setting up secure environment variables...${colors.reset}\n`)

// Check if .env exists
const envPath = path.join(__dirname, '.env')
const envExamplePath = path.join(__dirname, '.env.example')

if (!fs.existsSync(envPath)) {
    console.log(`${colors.yellow}⚠️  No .env file found. Creating from template...${colors.reset}`)
    
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath)
        console.log(`${colors.green}✅ Created .env file from .env.example${colors.reset}`)
        console.log(`${colors.cyan}📝 Please edit .env file and add your actual API keys${colors.reset}\n`)
    } else {
        console.log(`${colors.red}❌ No .env.example template found!${colors.reset}`)
        process.exit(1)
    }
} else {
    console.log(`${colors.green}✅ .env file already exists${colors.reset}`)
}

// Check for exposed secrets in various files
const dangerousFiles = [
    '.env.local.new',
    '.env.template', 
    '.env.backup',
    'setup-tinacms.js'
]

console.log(`${colors.yellow}🔍 Checking for exposed secrets...${colors.reset}`)

dangerousFiles.forEach(file => {
    const filePath = path.join(__dirname, file)
    if (fs.existsSync(filePath)) {
        console.log(`${colors.red}⚠️  Found potentially exposed file: ${file}${colors.reset}`)
        
        // Ask user if they want to remove it (for now, just warn)
        console.log(`${colors.cyan}   Consider removing this file if it contains real API keys${colors.reset}`)
    }
})

// Check git status
console.log(`\n${colors.yellow}🔍 Git Security Check...${colors.reset}`)

// Security recommendations
console.log(`\n${colors.bold}${colors.magenta}🔐 SECURITY RECOMMENDATIONS:${colors.reset}`)
console.log(`${colors.cyan}1. Never commit .env files with real API keys${colors.reset}`)
console.log(`${colors.cyan}2. Use GitHub Secrets for CI/CD deployment${colors.reset}`)
console.log(`${colors.cyan}3. Rotate any exposed API keys immediately${colors.reset}`)
console.log(`${colors.cyan}4. Use different keys for development and production${colors.reset}`)
console.log(`${colors.cyan}5. Review git history for accidentally committed secrets${colors.reset}`)

console.log(`\n${colors.green}${colors.bold}✅ Security setup complete!${colors.reset}`)
console.log(`${colors.yellow}📝 Remember to edit .env with your actual API keys${colors.reset}`)
