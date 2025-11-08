#!/usr/bin/env node

/**
 * Script to rename TinaCMS post files to match their slug field
 * This ensures SEO-friendly URLs without timestamp prefixes
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const postsDir = path.join(__dirname, '../public/content/posts')

console.log('🔍 Scanning posts directory:', postsDir)

// Read all files in the posts directory
const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.mdx'))

console.log(`📄 Found ${files.length} post files\n`)

let renamedCount = 0
let errorCount = 0

// Simple frontmatter parser (no dependencies needed)
function extractSlug(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return null

    const frontmatter = match[1]
    const slugMatch = frontmatter.match(/^slug:\s*(.+)$/m)

    return slugMatch ? slugMatch[1].trim() : null
}

files.forEach(filename => {
    try {
        const filePath = path.join(postsDir, filename)
        const fileContent = fs.readFileSync(filePath, 'utf8')

        // Extract slug from frontmatter
        const slug = extractSlug(fileContent)

        if (!slug) {
            console.log(`⚠️  ${filename} - No slug field found, skipping`)
            return
        }

        const newFilename = `${slug}.mdx`

        // Check if filename already matches slug
        if (filename === newFilename) {
            console.log(`✅ ${filename} - Already using correct slug`)
            return
        }

        const newFilePath = path.join(postsDir, newFilename)

        // Check if target file already exists
        if (fs.existsSync(newFilePath)) {
            console.log(`⚠️  ${filename} - Target file ${newFilename} already exists, skipping`)
            return
        }

        // Rename the file
        fs.renameSync(filePath, newFilePath)
        console.log(`🔄 Renamed: ${filename} → ${newFilename}`)
        renamedCount++

    } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message)
        errorCount++
    }
})

console.log(`\n✨ Complete!`)
console.log(`   Renamed: ${renamedCount} files`)
if (errorCount > 0) {
    console.log(`   Errors: ${errorCount} files`)
}

console.log('\n💡 Next steps:')
console.log('   1. Review the renamed files')
console.log('   2. Restart your dev server')
console.log('   3. Test the new SEO-friendly URLs')
