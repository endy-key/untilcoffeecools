import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Footer({ className }: { className: string }) {
    return (
        <footer className={`px-4 py-6 text-center text-gray-500 ${className}`}>
            {/* フッターリンク群 */}
            <div className="flex items-center justify-center gap-4 text-xs mb-3">
                <Link href="/about" className="hover:text-amber-700 transition-colors">
                    About
                </Link>
                <Link href="/contact" className="hover:text-amber-700 transition-colors">
                    Contact
                </Link>
                <Link href="/privacy-policy" className="hover:text-amber-700 transition-colors">
                    Privacy Policy
                </Link>
            </div>

            <p className="mx-auto mb-4 max-w-3xl font-sans text-sm leading-relaxed text-gray-700">
                Amazonのアソシエイトとして、until coffee coolsは適格販売により収入を得ています。
            </p>

            {/* コピーライト + GitHub アイコン */}
            <div className="flex items-center justify-center gap-4">
                <span>&copy; {new Date().getFullYear()} {siteConfig.copyrightName}</span>
                <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" title="GitHub Repository">
                    <Image
                        src="/github-mark.svg"
                        alt="GitHub Icon"
                        width={20}
                        height={20}
                        className="inline-block hover:opacity-75 transition-opacity"
                    />
                </Link>
            </div>
        </footer>
    );
}
