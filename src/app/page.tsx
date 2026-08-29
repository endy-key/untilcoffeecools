import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { HeroSection } from '@/components/HeroSection';
import { Sidebar } from '@/components/Sidebar';

export default async function Home() {
    const allPosts = await getAllPosts();

    // ホームには公開日の新しい順で5件だけを表示し、一覧ページへの導線を残します。
    const sortedPosts = allPosts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const latestPosts = sortedPosts.slice(0, 5);

    return (
        <>
            <HeroSection />

            {/* ヘッダーと同じ max-w-6xl で x 軸を揃える */}
            <div
                id="latest-posts"
                className="home-feed max-w-6xl mx-auto px-4 md:px-8 py-10 flex items-start gap-6"
            >
                <section className="flex-1 min-w-0" aria-labelledby="latest-posts-heading">
                    <header className="home-section-header">
                        <div>
                            <p className="home-section-kicker">Freshly brewed</p>
                            <h2 id="latest-posts-heading" className="home-section-title">
                                <span className="home-section-mark" aria-hidden="true" />
                                最新の記事
                            </h2>
                        </div>
                        <Link href="/posts" className="home-all-posts">
                            すべての記事
                            <span aria-hidden="true">→</span>
                        </Link>
                    </header>

                    <div className="space-y-5 sm:space-y-6">
                        {latestPosts.map((post) => (
                            <article key={post.slug} className="home-post-card">
                                <Link href={`/posts/${post.slug}`} className="group flex min-h-36">
                                    {post.thumbnail && (
                                        <div className="home-post-image relative w-32 shrink-0 sm:w-44">
                                            <Image
                                                src={post.thumbnail}
                                                alt={post.title}
                                                fill
                                                className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                                                sizes="(max-width: 640px) 128px, 176px"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5 pr-12 flex flex-1 flex-col justify-center min-w-0">
                                        <h3 className="text-lg text-amber-900 group-hover:text-amber-700 font-medium mb-1 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                                        {post.excerpt && (
                                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="mt-2">
                                                {post.tags.map((tag) => (
                                                    <span key={tag} className="tag-badge">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <span className="home-post-arrow" aria-hidden="true">→</span>
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
                <Sidebar />
            </div>
        </>
    );
}
