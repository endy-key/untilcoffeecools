import { getAllPosts } from '@/lib/posts';
import { ProfileCard } from '@/components/ProfileCard';
import Link from 'next/link';

export async function Sidebar() {
    const posts = await getAllPosts();

    // タグごとの記事数を集計
    const tagCounts: Record<string, number> = {};
    for (const post of posts) {
        for (const tag of post.tags ?? []) {
            tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
        }
    }
    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

    return (
        <aside className="hidden lg:block w-60 shrink-0 pt-8">
            {/* sticky: ヘッダー(h-14=56px)の下から固定 */}
            <div className="sticky top-[4.5rem] flex flex-col gap-4">
                <ProfileCard />

                {sortedTags.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            Tags
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {sortedTags.map(([tag, count]) => (
                                <Link
                                    key={tag}
                                    href={`/tags/${encodeURIComponent(tag)}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-amber-100 hover:text-amber-800 transition-colors"
                                >
                                    {tag}
                                    <span className="text-gray-400 text-[10px]">{count}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
