import { useMemo, useState } from 'react';
import {
    LayoutDashboard,
    PenSquare,
    BookOpen,
    LibraryBig,
    UserRound,
    Home,
    Menu,
    ChevronLeft,
    ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const portalLinks = [
    {
        title: 'Net Worth Dashboard',
        description: 'Track and manage your finances.',
        to: '/net-worth',
        icon: LayoutDashboard,
    },
    {
        title: 'Tina Admin',
        description: 'Write and edit blog posts.',
        to: '/admin/index.html',
        icon: PenSquare,
    },
    {
        title: 'Blog Page',
        description: 'Preview your published posts.',
        to: '/blog',
        icon: BookOpen,
        external: false,
    },
    {
        title: 'Reading Library',
        description: 'Go to your books and notes.',
        to: '/reading',
        icon: LibraryBig,
        external: false,
    },
    {
        title: 'About Page',
        description: 'Check your public profile page.',
        to: '/about',
        icon: UserRound,
        external: false,
    },
    {
        title: 'Home',
        description: 'Return to the website homepage.',
        to: '/',
        icon: Home,
    },
];

const PortalPage = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activePath, setActivePath] = useState('/admin/index.html');

    const activeItem = useMemo(
        () => portalLinks.find((item) => item.to === activePath) || portalLinks[0],
        [activePath]
    );

    return (
        <section className="px-4 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3">
                    <div>
                        <h1 className="font-display text-3xl sm:text-4xl text-ink">Control Room</h1>
                        <p className="text-ink-muted font-serif">
                            Welcome back {user?.displayName || user?.email}. Manage your website from one place.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen((v) => !v)}
                        className="inline-flex items-center gap-2 border border-rule rounded-full px-3 py-2 text-sm text-ink hover:bg-ink/5 transition"
                        aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                    >
                        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        <span>{isSidebarOpen ? 'Hide Menu' : 'Show Menu'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-4">
                    {isSidebarOpen && (
                        <aside className="bg-paper border border-rule rounded-2xl p-3 sm:p-4 h-fit">
                            <p className="text-xs uppercase tracking-wider text-ink-muted px-2 pb-2">Navigation</p>
                            <div className="space-y-2">
                                {portalLinks.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activePath === item.to;

                                    return (
                                        <button
                                            key={item.title}
                                            onClick={() => setActivePath(item.to)}
                                            className={`w-full text-left rounded-xl px-3 py-2.5 transition border ${isActive
                                                ? 'border-accent/50 bg-accent/5 text-ink'
                                                : 'border-transparent hover:bg-ink/5 text-ink-muted hover:text-ink'
                                                }`}
                                        >
                                            <span className="inline-flex items-center gap-2 font-display text-sm">
                                                <Icon className="w-4 h-4" />
                                                {item.title}
                                            </span>
                                            <span className="block text-xs mt-1 opacity-90">{item.description}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </aside>
                    )}

                    <div className="bg-paper border border-rule rounded-2xl overflow-hidden min-h-[70vh]">
                        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-rule">
                            <div>
                                <h2 className="font-display text-xl text-ink">{activeItem.title}</h2>
                                <p className="text-xs text-ink-muted">{activeItem.description}</p>
                            </div>
                            <a
                                href={activeItem.to}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>Open tab</span>
                            </a>
                        </div>

                        <div className="p-5 sm:p-8">
                            <div className="max-w-2xl">
                                <p className="text-sm text-ink-muted mb-6">
                                    The embedded preview has been removed. Use the actions below to open this section directly.
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href={activeItem.to}
                                        className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-full hover:opacity-90 transition"
                                    >
                                        <span>Open Here</span>
                                    </a>
                                    <a
                                        href={activeItem.to}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 border border-rule text-ink px-4 py-2.5 rounded-full hover:bg-ink/5 transition"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Open in New Tab</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PortalPage;
