import React from 'react'
import { User, Phone, Mail, MapPin, Calendar, Globe, Send } from 'lucide-react'

const ContactInfoCard = ({ className = '' }) => {
    return (
        <div className={`bg-paper border border-rule rounded-2xl p-6 ${className}`.trim()}>
            <h3 className="text-sm font-bold text-ink mb-5 uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-accent" />
                Contact Information
            </h3>

            <div className="space-y-3.5">
                <a
                    href="tel:+966053489204"
                    className="flex items-center text-sm text-ink-muted hover:text-accent transition-colors"
                    aria-label="Call +966053489204"
                >
                    <Phone className="h-4 w-4 mr-3 text-accent flex-shrink-0" />
                    <span>+966053489204</span>
                </a>

                <a
                    href="mailto:shamsmohamed155@gmail.com"
                    className="flex items-center text-sm text-ink-muted hover:text-accent transition-colors"
                    aria-label="Email shamsmohamed155@gmail.com"
                >
                    <Mail className="h-4 w-4 mr-3 text-accent flex-shrink-0" />
                    <span className="break-all">shamsmohamed155@gmail.com</span>
                </a>

                <a
                    href="https://t.me/shamsmohamed155"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-ink-muted hover:text-accent transition-colors"
                    aria-label="Open Telegram profile"
                >
                    <Send className="h-4 w-4 mr-3 text-accent flex-shrink-0" />
                    <span>@shamsmohamed155</span>
                </a>

                <div className="flex items-center text-sm text-ink-muted">
                    <MapPin className="h-4 w-4 mr-3 text-accent flex-shrink-0" />
                    <span>Saudi Arabia</span>
                </div>

                <div className="flex items-center text-sm text-ink-muted">
                    <Calendar className="h-4 w-4 mr-3 text-accent flex-shrink-0" />
                    <span>17 - 06 - 1996</span>
                </div>

                <div className="flex items-center text-sm text-ink-muted">
                    <Globe className="h-4 w-4 mr-3 text-accent flex-shrink-0" />
                    <span>Egyptian</span>
                </div>
            </div>
        </div>
    )
}

export default ContactInfoCard
