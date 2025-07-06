import { useTina } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"

// Custom components for TinaCMS rich text rendering
const components = {
    Callout: ({ type, title, content }) => (
        <div className={`callout callout-${type} p-4 rounded-lg my-6 border-l-4 ${type === 'info' ? 'bg-blue-50 border-blue-500 text-blue-900' :
                type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-900' :
                    type === 'error' ? 'bg-red-50 border-red-500 text-red-900' :
                        'bg-green-50 border-green-500 text-green-900'
            }`}>
            {title && <h4 className="font-semibold mb-2">{title}</h4>}
            <TinaMarkdown content={content} />
        </div>
    ),

    CodeBlock: ({ language, code }) => (
        <div className="code-block my-6">
            <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 rounded-t-lg">
                {language}
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-b-lg overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    ),

    ImageGallery: ({ images }) => (
        <div className="image-gallery grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
            {images?.map((image, index) => (
                <figure key={index} className="relative">
                    <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                    {image.caption && (
                        <figcaption className="text-sm text-gray-600 mt-2 text-center">
                            {image.caption}
                        </figcaption>
                    )}
                </figure>
            ))}
        </div>
    ),
}

// TinaCMS Post Component
export const TinaPost = ({ query, variables, data }) => {
    const { data: tinaData } = useTina({
        query,
        variables,
        data,
    })

    const post = tinaData.post

    return (
        <article className="max-w-4xl mx-auto px-4 py-8">
            {/* Post Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {post.title}
                </h1>

                {post.excerpt && (
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                        {post.excerpt}
                    </p>
                )}

                {post.featuredImage && (
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-64 md:h-96 object-cover rounded-xl mb-6"
                    />
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-8">
                    <div className="flex items-center space-x-4">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                    </div>

                    {post.tags && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* Post Content */}
            <div className="prose prose-lg dark:prose-dark max-w-none">
                <TinaMarkdown content={post.body} components={components} />
            </div>
        </article>
    )
}

export default TinaPost
