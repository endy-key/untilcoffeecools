import Link from "next/link";

export function Nav() {
    return (
        <nav className="min-w-[220px] p-6 border-r border-black flex flex-col gap-2">
            <Link href="/">Home</Link>
            <Link href="/posts">記事一覧</Link>  {/* ← ここが導線 */}
        </nav>
    );
}
