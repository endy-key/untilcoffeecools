import { getAllPosts } from '@/lib/posts';
import { ProfileCard } from '@/components/ProfileCard';
import { HeroSection } from '@/components/HeroSection';
import { PostList } from '@/components/PostList';

export default async function Home() {
    const allPosts = await getAllPosts();

    // 記事を日付の新しい順にソート
    const sortedPosts = allPosts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // 最新5件の記事を取得
    const latestPosts = sortedPosts.slice(0, 5);

    return (
        <>
            {/* ヒーローイメージとSVGアニメーションのコンテナ */}
            <HeroSection />
            {/* メインコンテンツエリア (記事リスト + ProfileCard) */}
            <div className="mt-8 flex flex-col md:flex-row md:justify-center md:gap-8 md:relative">
                {/* 記事リストセクション */}
                <PostList posts={latestPosts} />
                {/* ProfileCardを配置するサイドバー (ページ内) */}
                {/* モバイルでは通常フロー、md以上では絶対配置で右に浮かせる */}
                <aside className="w-full mt-8 md:absolute md:top-0 md:left-[calc(50%+30rem)] md:w-64 md:mt-0">
                    <ProfileCard />
                </aside>
            </div>
        </>
    );
}
