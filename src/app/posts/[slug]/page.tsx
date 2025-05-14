import { getAllPosts, getPostData } from '@/lib/posts';
import { notFound } from 'next/navigation';

type Props = {
    params: {
        slug: string;
    };
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
            <main className="max-w-2xl mx-auto p-4">
                <h1 className="text-3xl text-gray-700 font-bold mb-2">{post.title}</h1>
                <p className="text-sm text-gray-500 mb-6">{post.date}</p>

                <article className="prose"
                    dangerouslySetInnerHTML={{ __html: post.contentHtml }}>
                </article>
            </main >
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        notFound(); // 例外が出たら404に
    }
}