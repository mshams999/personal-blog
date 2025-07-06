/**
 * Production-ready TinaCMS content loader
 * This file handles loading TinaCMS content in production builds
 */

/**
 * Load TinaCMS posts directly from MDX files for production
 * This is used when the GraphQL API is not available
 */
export const loadStaticTinaPosts = async () => {
    try {
        // In production, we'll load the posts from the built content
        // This is a fallback method that reads from the MDX files directly
        
        // Import all MDX files from the posts directory
        const postModules = import.meta.glob('/public/content/posts/*.mdx', { 
            as: 'raw',
            eager: false 
        })
        
        const posts = []
        
        for (const [path, importPost] of Object.entries(postModules)) {
            try {
                const content = await importPost()
                const filename = path.split('/').pop().replace('.mdx', '')
                
                // Parse frontmatter
                const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
                if (frontmatterMatch) {
                    const frontmatterLines = frontmatterMatch[1].split('\n')
                    const frontmatter = {}
                    
                    let currentKey = null
                    let currentValue = []
                    
                    for (const line of frontmatterLines) {
                        if (line.includes(':') && !line.startsWith(' ')) {
                            // Save previous key-value pair
                            if (currentKey) {
                                frontmatter[currentKey] = currentValue.length === 1 ? 
                                    currentValue[0] : currentValue
                                currentValue = []
                            }
                            
                            // Start new key-value pair
                            const [key, ...valueParts] = line.split(':')
                            currentKey = key.trim()
                            const value = valueParts.join(':').trim()
                            
                            if (value.startsWith("'") && value.endsWith("'")) {
                                currentValue.push(value.slice(1, -1))
                            } else if (value) {
                                currentValue.push(value)
                            }
                        } else if (line.startsWith('  - ') && currentKey === 'tags') {
                            // Handle array values (tags)
                            currentValue.push(line.slice(4).trim())
                        } else if (line.trim() && currentKey) {
                            // Handle multi-line values
                            currentValue.push(line.trim())
                        }
                    }
                    
                    // Save last key-value pair
                    if (currentKey) {
                        frontmatter[currentKey] = currentValue.length === 1 ? 
                            currentValue[0] : currentValue
                    }
                    
                    // Extract body content
                    const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)/)
                    const body = bodyMatch ? bodyMatch[1].trim() : ''
                    
                    posts.push({
                        id: frontmatter.title || filename,
                        slug: filename,
                        title: frontmatter.title,
                        excerpt: frontmatter.excerpt,
                        date: frontmatter.date,
                        readTime: parseInt(frontmatter.readTime) || 5,
                        featuredImage: frontmatter.featuredImage,
                        authorId: frontmatter.authorId,
                        categoryId: frontmatter.categoryId,
                        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags].filter(Boolean),
                        body: body,
                        _source: 'static-mdx'
                    })
                }
            } catch (error) {
                console.warn(`Failed to parse post ${path}:`, error)
            }
        }
        
        console.log(`✅ Loaded ${posts.length} static TinaCMS posts`)
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
        
    } catch (error) {
        console.error('Failed to load static TinaCMS posts:', error)
        return []
    }
}
