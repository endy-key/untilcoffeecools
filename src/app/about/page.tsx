import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: "About",
    description: `${siteConfig.name} の運営者情報です。`,
};

export default function AboutPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
            {/* ページタイトル */}
            <h1 className="text-2xl font-bold text-gray-600 flex items-center gap-3 mb-10">
                <span className="inline-block w-1 h-6 bg-amber-700 rounded-full" aria-hidden="true" />
                About
            </h1>

            {/* プロフィールカード */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center mb-8">
                <Image
                    src={siteConfig.author.avatar}
                    alt="アバターアイコン"
                    width={96}
                    height={96}
                    className="rounded-full mb-4"
                />
                <h2 className="text-xl font-bold text-gray-700 mb-2">{siteConfig.author.name}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{siteConfig.author.bio}</p>
            </div>

            {/* サイトについて */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-4 text-sm text-gray-600 leading-relaxed">
                <h3 className="font-bold text-gray-700 text-base">このサイトについて</h3>
                <p>
                    <strong>{siteConfig.name}</strong> は、日々の趣味や気になったことを気ままに書き留める雑多な趣味ブログです。
                    コーヒーが冷めるくらいの時間で読み切れる記事を目指しています。
                </p>
                <p>
                    コーヒー・自作キーボード・観葉植物・テクノロジーなど、興味の赴くままに書いています。
                </p>
                <p>
                    お問い合わせは
                    <Link href="/contact" className="text-amber-700 hover:text-amber-600 underline mx-1">
                        こちら
                    </Link>
                    からどうぞ。
                </p>
            </div>
        </div>
    );
}
