import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Facebook, Mail } from 'lucide-react'
import { useHybridData } from '../contexts/HybridDataContext'
import { useBulkArticleViews, formatViewCount } from '../hooks/useFirebaseViews'
import Rule from './editorial/Rule'

/**
 * Editorial Footer — magazine masthead style.
 *   Column 1: About + socials
 *   Column 2: Popular reads (by views)
 *   Column 3: Follow / contact
 *   Bottom: colophon signoff
 */
const socialLinks = [
    { name: 'Twitter', url: 'https://x.com/MohamedShams936', icon: Twitter },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/mohamedshamsms/', icon: Linkedin },
    { name: 'Facebook', url: 'https://www.facebook.com/mosh936', icon: Facebook },
    { name: 'GitHub', url: 'https://github.com/mshams999/personal-blog', icon: Github },
    { name: 'Email', url: 'mailto:shamsmohamed155@gmail.com', icon: Mail },
]

const Footer = () => {
    const { posts = [], getRecentPosts } = useHybridData() || {}
    const currentYear = new Date().getFullYear()

    const recentPosts = useMemo(() => {
        try {
            const recent = getRecentPosts ? getRecentPosts(6) : posts.slice(0, 6)
            return recent || []
        } catch {
            return []
        }
    }, [posts, getRecentPosts])

    const { getViewCount } = useBulkArticleViews(recentPosts)

    const popular = useMemo(() => {
        if (!recentPosts.length) return []
        return [...recentPosts]
            .map((p) => ({ ...p, viewCount: getViewCount(p.slug) }))
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 4)
    }, [recentPosts, getViewCount])

    return (
        <footer className="bg-paper text-ink mt-24 border-t border-rule">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                    {/* About */}
                    <section>
                        <p className="kicker mb-3">عن المدونة</p>
                        <h3 className="font-display text-2xl leading-tight mb-4">
                            د. محمد شمس
                            <span className="inline-block ms-1 w-1.5 h-1.5 rounded-full bg-accent align-middle" />
                        </h3>
                        <p className="font-serif text-ink-muted leading-relaxed max-w-sm">
                            طبيب طوارئ يكتب عن الطب والفضول والقراءة. أؤمن أن الفضول هو بداية كل معرفة.
                        </p>
                    </section>

                    {/* Popular */}
                    <section>
                        <p className="kicker mb-3">الأكثر قراءة</p>
                        <ul className="space-y-3">
                            {popular.map((post) => (
                                <li key={post.id}>
                                    <Link
                                        to={`/post/${post.slug}`}
                                        className="group block"
                                    >
                                        <h4 className="font-display text-base leading-snug text-ink group-hover:text-accent transition-colors">
                                            {post.title}
                                        </h4>
                                        <p className="small-caps mt-1">
                                            {formatViewCount(post.viewCount || 0)} قراءة
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Follow */}
                    <section>
                        <p className="kicker mb-3">للمتابعة</p>
                        <ul className="space-y-2 mb-6">
                            {socialLinks.map(({ name, url, icon: Icon }) => (
                                <li key={name}>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-3 text-ink-muted hover:text-ink transition-colors"
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="font-serif text-base">{name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <Link
                            to="/cv"
                            className="small-caps inline-block border-b border-rule hover:border-accent hover:text-accent transition-colors pb-0.5"
                        >
                            السيرة الذاتية →
                        </Link>
                    </section>
                </div>

                <Rule className="!my-12" />

                {/* Colophon */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-ink-muted">
                    <p className="font-serif italic text-sm leading-relaxed max-w-xl">
                        Set in Fraunces, Amiri, and Inter. Built with React, Vite, and TinaCMS.
                    </p>
                    <p className="small-caps">
                        © {currentYear} · جميع الحقوق محفوظة
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
