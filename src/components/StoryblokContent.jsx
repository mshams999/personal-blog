import React from 'react'
import {
    render,
    MARK_BOLD,
    MARK_ITALIC,
    MARK_UNDERLINE,
    MARK_STRIKE,
    MARK_CODE,
    MARK_LINK,
    NODE_HEADING,
    NODE_PARAGRAPH,
    NODE_UL,
    NODE_OL,
    NODE_LI,
    NODE_QUOTE,
    NODE_CODEBLOCK,
    NODE_IMAGE,
    NODE_HR,
} from 'storyblok-rich-text-react-renderer'

const Callout = ({ type = 'info', title, children }) => (
    <div
        className={`callout callout-${type} p-6 rounded-lg my-8 border-l-4 shadow-sm ${
            type === 'info'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-100'
                : type === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-900 dark:text-yellow-100'
                    : type === 'error'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-100'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-100'
        }`}
    >
        {title && <h4 className="font-semibold mb-3 text-lg">{title}</h4>}
        <div className="prose prose-sm max-w-none">{children}</div>
    </div>
)

const CodeBlock = ({ language, code }) => (
    <div className="code-block my-8 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <span className="text-sm text-gray-300 font-mono">{language || 'text'}</span>
            <button
                onClick={() => navigator.clipboard.writeText(code || '')}
                className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
            >
                Copy
            </button>
        </div>
        <pre className="bg-gray-900 text-green-400 p-6 overflow-x-auto">
            <code className="font-mono text-sm leading-relaxed">{code}</code>
        </pre>
    </div>
)

const ImageGallery = ({ images = [] }) => (
    <div className="image-gallery my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, i) => {
                const src = image?.filename || image?.src || image?.url
                const alt = image?.alt || image?.caption || ''
                return (
                    <figure key={i} className="relative group">
                        <div className="aspect-w-16 aspect-h-12 overflow-hidden rounded-lg shadow-md">
                            <img
                                src={src}
                                alt={alt}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        {image?.caption && (
                            <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
                                {image.caption}
                            </figcaption>
                        )}
                    </figure>
                )
            })}
        </div>
    </div>
)

const renderOptions = {
    markResolvers: {
        [MARK_BOLD]: (children) => <strong>{children}</strong>,
        [MARK_ITALIC]: (children) => <em>{children}</em>,
        [MARK_UNDERLINE]: (children) => <u>{children}</u>,
        [MARK_STRIKE]: (children) => <s>{children}</s>,
        [MARK_CODE]: (children) => (
            <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-sm">
                {children}
            </code>
        ),
        [MARK_LINK]: (children, props) => {
            const { href, target, linktype } = props || {}
            const url = linktype === 'email' ? `mailto:${href}` : href
            const isExternal = url?.startsWith('http')
            return (
                <a
                    href={url}
                    target={target || (isExternal ? '_blank' : undefined)}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
                >
                    {children}
                </a>
            )
        },
    },
    nodeResolvers: {
        [NODE_HEADING]: (children, { level }) => {
            const classes = {
                1: 'text-4xl font-bold mb-6 mt-8 text-gray-900 dark:text-white leading-tight',
                2: 'text-3xl font-bold mb-5 mt-7 text-gray-900 dark:text-white leading-tight',
                3: 'text-2xl font-bold mb-4 mt-6 text-gray-900 dark:text-white leading-tight',
                4: 'text-xl font-semibold mb-3 mt-5 text-gray-900 dark:text-white leading-tight',
                5: 'text-lg font-semibold mb-3 mt-4 text-gray-900 dark:text-white',
                6: 'text-base font-semibold mb-2 mt-3 text-gray-900 dark:text-white',
            }
            const Tag = `h${level}`
            return <Tag className={classes[level] || classes[3]}>{children}</Tag>
        },
        [NODE_PARAGRAPH]: (children) => (
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {children}
            </p>
        ),
        [NODE_UL]: (children) => (
            <ul className="mb-4 space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
                {children}
            </ul>
        ),
        [NODE_OL]: (children) => (
            <ol className="mb-4 space-y-2 text-gray-700 dark:text-gray-300 list-decimal list-inside">
                {children}
            </ol>
        ),
        [NODE_LI]: (children) => <li className="text-lg leading-relaxed">{children}</li>,
        [NODE_QUOTE]: (children) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-6 my-6 italic text-gray-800 dark:text-gray-200 text-lg">
                {children}
            </blockquote>
        ),
        [NODE_CODEBLOCK]: (children, { class: className }) => {
            const language = className?.replace('language-', '') || ''
            return (
                <pre className="bg-gray-900 text-green-400 p-6 my-6 rounded-lg overflow-x-auto">
                    <code className={`font-mono text-sm leading-relaxed language-${language}`}>
                        {children}
                    </code>
                </pre>
            )
        },
        [NODE_IMAGE]: (children, { src, alt }) => (
            <div className="my-8">
                <img
                    src={src}
                    alt={alt || ''}
                    className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
                {alt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
                        {alt}
                    </p>
                )}
            </div>
        ),
        [NODE_HR]: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
    },
    blokResolvers: {
        callout: (props) => (
            <Callout type={props.type} title={props.title}>
                {props.content ? <StoryblokContent content={props.content} /> : null}
            </Callout>
        ),
        code_block: (props) => <CodeBlock language={props.language} code={props.code} />,
        image_gallery: (props) => <ImageGallery images={props.images} />,
    },
    defaultBlokResolver: (name, props) => {
        // eslint-disable-next-line no-console
        console.warn(`[storyblok] Unhandled block type: ${name}`, props)
        return null
    },
}

export const StoryblokContent = ({ content }) => {
    if (!content) {
        return (
            <div className="text-gray-500 dark:text-gray-400 italic">
                No content available
            </div>
        )
    }

    return <div className="prose prose-lg max-w-none">{render(content, renderOptions)}</div>
}

export default StoryblokContent
