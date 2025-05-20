import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default async function PostsPage() {
    const posts = await getAllPosts();

    // 日付の降順で記事をソート
    const sortedPosts = posts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-700">記事一覧</h1>
            <ul className="space-y-4">
                {sortedPosts.map((post) => (
                    <li key={post.slug} className="border-b pb-2">
                        <Link href={`/posts/${post.slug}`}>
                            <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                                {post.title}
                            </h2>
                        </Link>
                        <p className="text-gray-500 text-sm">{post.date}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}