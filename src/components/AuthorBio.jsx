import React from 'react'
import { Mail, Twitter, Github, Linkedin, Facebook } from 'lucide-react'
import Rule from './editorial/Rule'
import Kicker from './editorial/Kicker'

/**
 * Editorial AuthorBio — horizontal rules above/below, serif name, italic bio,
 * inline icon row. No glass card, no gradients.
 */
const AuthorBio = ({ author }) => {
    const defaultAuthor = {
        name: 'د. محمد شمس',
        bio: 'طبيب طوارئ وكاتب مهتم بالطب والقراءة والفكر. هذه المساحة لتدوين ما لا يتسع له وقت المناوبة.',
        avatar: '/pictures/about-me.jpg',
        social: {
            github: 'https://github.com/mshams999',
            linkedin: 'https://www.linkedin.com/in/mohamedshamsms/',
            twitter: 'https://x.com/MohamedShams936',
            facebook: 'https://m.facebook.com/mosh936/',
            email: 'shamsmohamed155@gmail.com',
        },
    }
    const a = author || defaultAuthor
    const icons = [
        ['twitter', Twitter, a.social?.twitter],
        ['linkedin', Linkedin, a.social?.linkedin],
        ['github', Github, a.social?.github],
        ['facebook', Facebook, a.social?.facebook],
        ['email', Mail, a.social?.email ? `mailto:${a.social.email}` : null],
    ].filter(([, , href]) => Boolean(href))

    return (
        <section className="my-12">
            <Rule />
            <div className="py-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                {a.avatar && (
                    <img
                        src={a.avatar}
                        alt={a.name}
                        loading="lazy"
                        className="w-20 h-20 rounded-full object-cover border border-rule flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none' }}
                    />
                )}
                <div className="flex-1">
                    <Kicker className="mb-2">عن الكاتب</Kicker>
                    <h3 className="font-display text-2xl text-ink mb-2">{a.name}</h3>
                    <p className="font-serif italic text-ink-muted leading-relaxed mb-4 max-w-prose-editorial">
                        {a.bio}
                    </p>
                    {icons.length > 0 && (
                        <div className="flex items-center gap-5">
                            {icons.map(([key, Icon, href]) => (
                                <a
                                    key={key}
                                    href={href}
                                    target={key === 'email' ? undefined : '_blank'}
                                    rel={key === 'email' ? undefined : 'noopener noreferrer'}
                                    className="text-ink-muted hover:text-accent transition-colors"
                                    aria-label={key}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Rule />
        </section>
    )
}

export default AuthorBio
