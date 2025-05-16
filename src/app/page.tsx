import Link from 'next/link';
import { getAllPosts } from '@/lib/posts'; // getAllPosts関数をインポート
import Image from 'next/image';

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
            <div className="flex items-center justify-center">
                <Image
                    src={"/heroImage.jpg"}
                    alt={"untilcoffeecools heroImage"}
                    width={1200}
                    height={400}
                    priority // LCP要素の可能性が高いため、priorityは適切です
                    className="w-full h-auto max-w-full" // コンテナ幅に合わせてレスポンシブに表示
                />
            </div>
            <section className="max-w-3xl mx-auto px-4 py-8 space-y-8">
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
        </>
    );
}
