import {
    LayoutDashboard,
    PenSquare,
    BookOpen,
    LibraryBig,
    UserRound,
    Home,
    ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STORYBLOK_URL =
    'https://app.storyblok.com/#/me/spaces/291949279442822/stories/0/0/index/167608382889663?currentPage=1';

const portalLinks = [
    {
        title: 'Storyblok Admin',
        description: 'Write and edit blog posts.',
        to: STORYBLOK_URL,
        icon: PenSquare,
        external: true,
    },
    {
        title: 'Net Worth Dashboard',
        description: 'Track and manage your finances.',
        to: '/net-worth',
        icon: LayoutDashboard,
    },
    {
        title: 'Blog Page',
        description: 'Preview your published posts.',
        to: '/blog',
        icon: BookOpen,
    },
    {
        title: 'Reading Library',
        description: 'Go to your books and notes.',
        to: '/reading',
        icon: LibraryBig,
    },
    {
        title: 'About Page',
        description: 'Check your public profile page.',
        to: '/about',
        icon: UserRound,
    },
    {
        title: 'Home',
        description: 'Return to the website homepage.',
        to: '/',
        icon: Home,
    },
];

const PortalCard = ({ item }) => {
    const Icon = item.icon;
    const baseClasses =
        'group relative flex flex-col gap-3 bg-paper border border-rule rounded-2xl p-6 hover:border-accent/60 hover:shadow-sm transition';

    const inner = (
        <>
            <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-rule bg-ink/[0.02] text-ink group-hover:text-accent transition">
                    <Icon className="w-5 h-5" />
                </span>
                {item.external && (
                    <ExternalLink className="w-4 h-4 text-ink-muted group-hover:text-accent transition" />
                )}
            </div>
            <div>
                <h2 className="font-display text-lg text-ink">{item.title}</h2>
                <p className="text-sm text-ink-muted font-serif mt-1">{item.description}</p>
            </div>
        </>
    );

    if (item.external) {
        return (
            <a href={item.to} target="_blank" rel="noreferrer" className={baseClasses}>
                {inner}
            </a>
        );
    }
    return (
        <Link to={item.to} className={baseClasses}>
            {inner}
        </Link>
    );
};

const PortalPage = () => {
    const { user } = useAuth();

    return (
        <section className="px-4 py-10 sm:py-14">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 sm:mb-10">
                    <h1 className="font-display text-3xl sm:text-4xl text-ink">Control Room</h1>
                    <p className="text-ink-muted font-serif mt-1">
                        Welcome back {user?.displayName || user?.email}. Manage your website from one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {portalLinks.map((item) => (
                        <PortalCard key={item.title} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PortalPage;
