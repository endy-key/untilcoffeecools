import { getAllPosts, getPostData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { PostContent } from '@/components/PostContent';
import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';
import { optimizedOgImage } from '@/lib/optimized-images';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

/**
 * 記事ごとの OGP メタデータを生成する。
 * getPostData（Markdown 処理あり）は重いため、frontmatter のみ読む
 * getAllPosts を使ってサムネイルや excerpt を取得する。
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const posts = await getAllPosts();
    const post = posts.find((p) => p.slug === slug);

    // 存在しないスラグは layout のデフォルト metadata にフォールバック
    if (!post) return {};

    // サムネイルがあればそれを OGP 画像に、なければデフォルト画像を使う
    const ogImage = post.thumbnail ? optimizedOgImage(post.thumbnail) : siteConfig.defaultOgImage;

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.date,
            tags: post.tags,
            images: [{ url: ogImage, alt: post.title }],
        },
        twitter: {
            title: post.title,
            description: post.excerpt,
            images: [ogImage],
        },
    };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const posts = await getAllPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function PostPage({ params }: Props) {
    try {
        const { slug } = await params;
        const post = await getPostData(slug);

        return (
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex items-start gap-6">
                <main className="flex-1 min-w-0">
                    <h1 className="text-3xl text-gray-700 font-bold mb-2">{post.title}</h1>
                    <p className="text-sm text-gray-500 mb-4">{post.date}</p>

                    {post.tags && post.tags.length > 0 && (
                        <div className="mb-6">
                            {post.tags.map((tag) => (
                                <span key={tag} className="tag-badge">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <PostContent contentHtml={post.contentHtml} />
                </main>
                <Sidebar />
            </div>
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        notFound();
    }
}
