import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { HeroSection } from '@/components/HeroSection';
import { Sidebar } from '@/components/Sidebar';

export default async function Home() {
    const allPosts = await getAllPosts();

    const sortedPosts = allPosts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const latestPosts = sortedPosts.slice(0, 5);

    return (
        <>
            <HeroSection />

            {/* ヘッダーと同じ max-w-6xl で x 軸を揃える */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 flex items-start gap-6">
                <section className="flex-1 min-w-0 space-y-6">
                <h1 className="text-2xl font-bold text-gray-600 flex items-center gap-3">
                    <span className="inline-block w-1 h-6 bg-amber-700 rounded-full" aria-hidden="true" />
                    最新の記事
                </h1>
                {latestPosts.map((post) => (
                    <article
                        key={post.slug}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 overflow-hidden"
                    >
                        <Link href={`/posts/${post.slug}`} className="flex">
                            {post.thumbnail && (
                                <div className="relative w-32 shrink-0 sm:w-44">
                                    <Image
                                        src={post.thumbnail}
                                        alt={post.title}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 640px) 128px, 176px"
                                    />
                                </div>
                            )}
                            <div className="p-5 flex flex-col justify-center min-w-0">
                                <h2 className="text-lg text-amber-900 hover:text-amber-700 font-medium mb-1 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
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
                        </Link>
                    </article>
                ))}
                </section>
                <Sidebar />
            </div>
        </>
    );
}
