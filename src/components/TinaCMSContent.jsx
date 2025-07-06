import React from 'react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'

/**
 * TinaCMS MDX Content Renderer
 * Renders rich content from TinaCMS posts with custom components
 */

// Custom components for TinaCMS rich text rendering
const components = {
    // Callout component for highlighting important information
    Callout: ({ type, title, content }) => (
        <div className={`callout callout-${type} p-6 rounded-lg my-8 border-l-4 shadow-sm ${type === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-100' :
                type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-900 dark:text-yellow-100' :
                    type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-100' :
                        'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-100'
            }`}>
            {title && <h4 className="font-semibold mb-3 text-lg">{title}</h4>}
            <div className="prose prose-sm max-w-none">
                <TinaMarkdown content={content} />
            </div>
        </div>
    ),

    // Code block component with syntax highlighting
    CodeBlock: ({ language, code }) => (
        <div className="code-block my-8 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <span className="text-sm text-gray-300 font-mono">{language || 'text'}</span>
                <button
                    onClick={() => navigator.clipboard.writeText(code)}
                    className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                >
                    Copy
                </button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-6 overflow-x-auto">
                <code className="font-mono text-sm leading-relaxed">{code}</code>
            </pre>
        </div>
    ),

    // Image gallery component for multiple images
    ImageGallery: ({ images }) => (
        <div className="image-gallery my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images?.map((image, index) => (
                    <figure key={index} className="relative group">
                        <div className="aspect-w-16 aspect-h-12 overflow-hidden rounded-lg shadow-md">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        {image.caption && (
                            <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
                                {image.caption}
                            </figcaption>
                        )}
                    </figure>
                ))}
            </div>
        </div>
    ),

    // Custom heading components with proper styling
    h1: ({ children }) => (
        <h1 className="text-4xl font-bold mb-6 mt-8 text-gray-900 dark:text-white leading-tight">
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-3xl font-bold mb-5 mt-7 text-gray-900 dark:text-white leading-tight">
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-2xl font-bold mb-4 mt-6 text-gray-900 dark:text-white leading-tight">
            {children}
        </h3>
    ),
    h4: ({ children }) => (
        <h4 className="text-xl font-semibold mb-3 mt-5 text-gray-900 dark:text-white leading-tight">
            {children}
        </h4>
    ),

    // Paragraph styling
    p: ({ children }) => (
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {children}
        </p>
    ),

    // List styling
    ul: ({ children }) => (
        <ul className="mb-4 space-y-2 text-gray-700 dark:text-gray-300">
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol className="mb-4 space-y-2 text-gray-700 dark:text-gray-300 list-decimal list-inside">
            {children}
        </ol>
    ),
    li: ({ children }) => (
        <li className="text-lg leading-relaxed">
            {children}
        </li>
    ),

    // Link styling
    a: ({ href, children }) => (
        <a
            href={href}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
            {children}
        </a>
    ),

    // Blockquote styling
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-6 my-6 italic text-gray-800 dark:text-gray-200 text-lg">
            {children}
        </blockquote>
    ),

    // Image component
    img: ({ src, alt }) => (
        <div className="my-8">
            <img
                src={src}
                alt={alt}
                className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
            {alt && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
                    {alt}
                </p>
            )}
        </div>
    ),
}

/**
 * TinaCMS Content Renderer Component
 */
export const TinaCMSContent = ({ content }) => {
    if (!content) {
        return <div className="text-gray-500 dark:text-gray-400 italic">No content available</div>
    }

    return (
        <div className="prose prose-lg max-w-none">
            <TinaMarkdown content={content} components={components} />
        </div>
    )
}

/**
 * Static Content Renderer for non-TinaCMS posts
 */
export const StaticContent = ({ content }) => {
    if (!content) {
        return <div className="text-gray-500 dark:text-gray-400 italic">No content available</div>
    }

    // For static posts, we assume the content is plain text or simple HTML
    return (
        <div className="prose prose-lg max-w-none">
            <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    )
}

export default TinaCMSContent
