import Image from "next/image";
import Link from "next/link"; // ロゴをトップページへのリンクにする場合

export function Header() {
    return (
        <header className="py-1 px-4 md:px-6">
            <div className="container mx-auto"> {/* justify-center を削除し、子のdivでレイアウトを制御 */}
                {/* ヘッダーコンテンツ全体を横いっぱいに広げ、要素を配置 */}
                <div className="flex items-baseline justify-between w-full">
                    {/* 左側のスペーサー: タイトルを中央に配置するため、右側の「ホーム」リンクと同じ幅の不可視要素を配置 */}
                    <div className="invisible">
                        {/* 「ホーム」リンクと同じスタイルを適用して幅を確保 */}
                        <span className="text-base font-medium text-gray-700">
                            ホーム
                        </span>
                    </div>
                    {/* 中央のサイトタイトル */}
                    <span className="text-3xl font-caveat font-bold text-yellow-700 tracking-wider">
                        until coffee cools
                    </span>
                    {/* 右側のアイコン群 */}
                    <div className="flex items-center space-x-4">
                        {/* ホームアイコン (トップページへのリンク) */}
                        <Link href="/" className="flex items-center justify-center hover:opacity-75 transition-opacity" title="ホーム">
                            <Image
                                src="/home.svg"
                                alt="ホーム"
                                width={24}
                                height={24}
                            />
                        </Link>                        {/* 投稿一覧へのリンク */}
                        <Link href="/posts" className="flex items-center justify-center hover:opacity-75 transition-opacity" title="投稿一覧">
                            <Image
                                src="/article.svg" // アイコンのパス
                                alt="投稿一覧"
                                width={24}
                                height={24}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
