export default function Home() {
    return (
        <section className="max-w-3xl mx-auto px-4 py-8 space-y-8">
            {/* 記事カード（サンプル） */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => (
                <article
                    key={id}
                    className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
                >
                    <h2 className="text-xl text-[#6b6b6b] font-medium mb-2">記事タイトルのサンプル {id}</h2>
                    <p className="text-sm text-[#6b6b6b]">
                        ここに記事の冒頭文が入ります。気になったこと、ふと考えたこと、そんな日々のメモ。
                    </p>
                </article>
            ))}
        </section>
    );
}
