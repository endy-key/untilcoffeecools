import { getAllPosts, getPostData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { PostContent } from '@/components/PostContent';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

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
