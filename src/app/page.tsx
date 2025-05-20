import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import Image from 'next/image';
import { ProfileCard } from '@/components/ProfileCard';

export default async function Home() { // async関数に変更
    const allPosts = await getAllPosts();

    // 記事を日付の新しい順にソート
    const sortedPosts = allPosts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // 最新5件の記事を取得
    const latestPosts = sortedPosts.slice(0, 5);

    return (
        <>
            <div className="flex items-center justify-center"> {/* ヒーローイメージのコンテナ */}
                <Image
                    src={"/heroImage.jpg"}
                    alt={"untilcoffeecools heroImage"}
                    width={1200}
                    height={400}
                    priority // LCP要素の可能性が高いため、priorityは適切です
                    className="w-full h-auto max-w-full" // コンテナ幅に合わせてレスポンシブに表示
                />
            </div>
            {/* メインコンテンツエリア (記事リスト + ProfileCard) */}
            <div className="mt-8 flex flex-col md:flex-row md:justify-center md:gap-8 md:relative"> {/* md:relative を追加 */}
                {/* 記事リストセクション */}
                <section className="space-y-8 md:max-w-3xl"> {/* flex-growを削除し、md以上で最大幅を指定 */}
                    <h1 className="text-3xl font-bold mb-6 text-gray-700">最新の記事</h1>
                    {latestPosts.map((post) => (
                        <article
                            key={post.slug} // 記事のslugをkeyとして使用
                            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
                        >
                            <Link href={`/posts/${post.slug}`}>
                                <h2 className="text-xl text-blue-600 hover:underline font-medium mb-2">
                                    {post.title} {/* 記事のタイトルを表示 */}
                                </h2>
                            </Link>
                            <p className="text-sm text-gray-500 mb-1">{post.date}</p> {/* 記事の日付を表示 */}
                            {/* 記事の概要を表示 */}
                            {post.excerpt && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2"> {/* line-clamp-2で最大2行表示 */}
                                    {post.excerpt}
                                </p>
                            )}
                        </article>
                    ))}
                </section>
                {/* ProfileCardを配置するサイドバー (ページ内) */}
                {/* モバイルでは通常フロー、md以上では絶対配置で右に浮かせる */}
                <aside className="w-full mt-8 md:absolute md:top-0 md:left-[calc(50%+30rem)] md:w-64 md:mt-0">
                    <ProfileCard />
                </aside>
            </div>
        </>
    );
}
