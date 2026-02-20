'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function HomeIcon() {
    return (
        <svg viewBox="0 -960 960 960" fill="currentColor" className="w-full h-full">
            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
        </svg>
    );
}

function ArticleIcon() {
    return (
        <svg viewBox="0 -960 960 960" fill="currentColor" className="w-full h-full">
            <path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
        </svg>
    );
}

function PlaygroundIcon() {
    return (
        <svg viewBox="0 -960 960 960" fill="currentColor" className="w-full h-full">
            <path d="M240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Zm-14 120q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320Zm-30-128h61q0-25 6.5-40.5T544-526q18-20 35-40.5t17-53.5q0-42-32.5-71T483-720q-40 0-72.5 23T365-637l55 23q7-22 24.5-35.5T483-663q22 0 36.5 12t14.5 31q0 21-12.5 37.5T492-549q-20 21-31 42t-11 59Z" />
        </svg>
    );
}

const NAV_ITEMS = [
    { href: '/',           label: 'Home',       Icon: HomeIcon,       exact: true  },
    { href: '/posts',      label: 'Articles',   Icon: ArticleIcon,    exact: false },
    { href: '/playground', label: 'Playground', Icon: PlaygroundIcon, exact: false },
] as const;

export function Header({ className }: { className: string }) {
    const pathname = usePathname();

    return (
        <header className="h-14 px-4 md:px-8 flex items-center">
            <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
                {/* Site title — links to home */}
                <Link
                    href="/"
                    className={`text-2xl font-bold text-amber-700 hover:text-amber-600 transition-colors tracking-wider ${className}`}
                >
                    until coffee cools
                </Link>

                {/* Navigation */}
                <nav aria-label="メインナビゲーション">
                    <ul className="flex items-center gap-1">
                        {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
                            const isActive = exact
                                ? pathname === href
                                : pathname.startsWith(href);
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        aria-current={isActive ? 'page' : undefined}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'text-gray-500 hover:text-amber-700 hover:bg-amber-50'
                                        }`}
                                    >
                                        <span className="w-[18px] h-[18px] shrink-0">
                                            <Icon />
                                        </span>
                                        <span className="hidden sm:inline">{label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
