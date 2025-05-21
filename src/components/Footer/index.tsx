import Image from 'next/image';
import Link from 'next/link';

export function Footer({ className }: { className: string }) {
    return (
        <footer className={`p-6 text-center text-gray-500 ${className} flex items-center justify-center`}> {/* flex-colを削除し、横並びにして中央揃え */}
            <div> {/* mb-2を削除 */}
                &copy; {new Date().getFullYear()} untilcoffeecools
            </div>
            <div className="ml-4"> {/* 左にマージンを追加してコピーライトとの間にスペースを作る */}
                <Link href="https://github.com/endy-key/untilcoffeecools" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" title="GitHub Repository">
                    <Image
                        src="/github-mark.svg" // publicディレクトリからのパス
                        alt="GitHub Icon"
                        width={24} // アイコンの適切なサイズに調整してください
                        height={24} // アイコンの適切なサイズに調整してください
                        className="inline-block hover:opacity-75 transition-opacity"
                    />
                </Link>
            </div>
        </footer>
    );
}
