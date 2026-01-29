'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PostMeta } from '@/lib/posts';

interface PostListProps {
    posts: PostMeta[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function PostList({ posts }: PostListProps) {
    return (
        <section className="space-y-8 md:max-w-3xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-700">最新の記事</h1>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {posts.map((post) => (
                    <motion.article
                        key={post.slug}
                        variants={item}
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-white rounded-2xl shadow-sm p-6 transition-all"
                    >
                        <Link href={`/posts/${post.slug}`}>
                            <h2 className="text-xl text-blue-600 hover:underline font-medium mb-2">
                                {post.title}
                            </h2>
                        </Link>
                        <p className="text-sm text-gray-500 mb-1">{post.date}</p>
                        {post.excerpt && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
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
                    </motion.article>
                ))}
            </motion.div>
        </section>
    );
}
