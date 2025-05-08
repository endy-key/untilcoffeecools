import Image from "next/image";
import Link from "next/link"; // ロゴをトップページへのリンクにする場合

export function Header() {
    return (
        <header className="py-6 px-4 md:px-6 border-b border-gray-300">
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
                    {/* カフェ風のスタイルを適用 */}
                    <span className="text-3xl font-serif font-semibold text-yellow-700 tracking-wider italic">
                        until coffee cools
                    </span>
                    {/* 右端のホームロゴ (トップページへのリンク) */}
                    <Link href="/" className="text-base font-medium text-gray-700 hover:text-yellow-700 transition-colors">
                        ホーム
                    </Link>
                </div>
                {/* ヒーローイメージやナビゲーションなど、他の要素をここに配置 */}
                {/* 現在の eyecatch.jpg はヒーローイメージとして別の場所に配置するか、
                    ヘッダー内に残す場合は、スクロール時の挙動を考慮して調整します。
                    もし eyecatch.jpg がロゴそのものだった場合は、このテキストロゴと置き換える形になります。
                */}
                {/* <div className="flex items-center justify-center">
                    <Image src={"/eyecatch.jpg"} alt={"untilcoffeecools eyecatch"} width={500} height={150} priority />
                </div> */}
            </div>
        </header>
    );
}
