import React from 'react'
import { Mail, Twitter, Github, Instagram, Linkedin, Facebook } from 'lucide-react'

/**
 * AuthorBio component for displaying author information
 * 
 * Features:
 * - Author avatar with rounded styling and subtle shadow
 * - Author name and bio with improved typography
 * - Social media links (GitHub, LinkedIn, Twitter, Facebook)
 * - Glass morphism card effect
 * - Responsive layout with mobile optimization
 * - Hover animations for interactive elements
 */
const AuthorBio = ({ author }) => {
    // Default author data - Mohamed Shams
    const defaultAuthor = {
        name: "Mohamed Shams Abdelaziz",
        bio: "Emergency Medicine Doctor and Medical Professional with expertise in acute care management, clinical research, and patient care. Passionate about combining medical knowledge with technology to improve healthcare outcomes.",
        avatar: "/api/placeholder/150/150", // You can replace this with your actual photo
        social: {
            github: "https://github.com/mshams999",
            linkedin: "https://www.linkedin.com/in/mohamedshamsms/",
            twitter: "https://x.com/MohamedShams936",
            facebook: "https://m.facebook.com/mosh936/",
            email: "shamsmohamed155@gmail.com"
        }
    }

    const authorData = author || defaultAuthor

    return (
        <div className="glass rounded-xl p-6 md:p-8 mt-8 shadow-sm card-hover transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                    <div className="relative">
                        <img
                            src={authorData.avatar}
                            alt={authorData.name}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-4 ring-white dark:ring-dark-800 shadow-md object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-500/20 to-transparent mix-blend-overlay"></div>
                    </div>
                </div>

                {/* Author Info */}
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                        About {authorData.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        {authorData.bio}
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center space-x-4 justify-center md:justify-start">
                        {authorData.social?.github && (
                            <a
                                href={authorData.social.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-primary-500 transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        )}
                        {authorData.social?.linkedin && (
                            <a
                                href={authorData.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-primary-500 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        )}
                        {authorData.social?.twitter && (
                            <a
                                href={authorData.social.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-primary-500 transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                        )}
                        {authorData.social?.facebook && (
                            <a
                                href={authorData.social.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-primary-500 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                        )}
                        {authorData.social?.email && (
                            <a
                                href={`mailto:${authorData.social.email}`}
                                className="text-gray-500 hover:text-primary-500 transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthorBio
