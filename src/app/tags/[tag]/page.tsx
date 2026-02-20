import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

export async function generateStaticParams() {
    const posts = await getAllPosts();
    const tags = new Set(posts.flatMap((p) => p.tags ?? []));
    return Array.from(tags).map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);

    const allPosts = await getAllPosts();
    const filtered = allPosts
        .filter((p) => p.tags?.includes(decodedTag))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (filtered.length === 0) notFound();

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex items-start gap-6">
            <main className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold mb-8 text-gray-600 flex items-center gap-3">
                    <span className="inline-block w-1 h-6 bg-amber-700 rounded-full" aria-hidden="true" />
                    <span className="text-amber-700">#{decodedTag}</span>
                    <span className="text-base font-normal text-gray-400">{filtered.length}件</span>
                </h1>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filtered.map((post) => (
                        <li key={post.slug}>
                            <Link href={`/posts/${post.slug}`}>
                                <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 overflow-hidden h-full flex flex-col">
                                    {post.thumbnail ? (
                                        <div className="relative w-full aspect-video">
                                            <Image
                                                src={post.thumbnail}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, 50vw"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-video bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-amber-200 select-none">
                                                {post.title.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="p-4 flex flex-col flex-1">
                                        <h2 className="text-base font-medium text-amber-900 mb-1 line-clamp-2 leading-snug">
                                            {post.title}
                                        </h2>
                                        <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                                        {post.excerpt && (
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="mt-3">
                                                {post.tags.map((t) => (
                                                    <span
                                                        key={t}
                                                        className={`tag-badge ${t === decodedTag ? 'bg-amber-100 text-amber-800' : ''}`}
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        </li>
                    ))}
                </ul>
            </main>
            <Sidebar />
        </div>
    );
}
