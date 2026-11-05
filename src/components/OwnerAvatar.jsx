import { useOwnerPresence } from '../hooks/useOwnerPresence'

const OwnerAvatar = ({ className = '' }) => {
    const online = useOwnerPresence()
    const label = online ? 'متصل الآن' : 'غير متصل'

    return (
        <span className="relative inline-flex shrink-0">
            <img
                src="/pictures/logo-portrait.jpg"
                alt=""
                className={className}
            />
            <span
                className={`absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full ring-2 ring-paper ${online ? 'bg-emerald-500' : 'bg-ink-muted/45'}`}
                title={label}
                aria-label={label}
            />
        </span>
    )
}

export default OwnerAvatar
