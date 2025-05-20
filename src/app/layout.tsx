import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import React from "react";
import { GtmScript } from "@/components/Gtm/GtmScript";
import { Caveat, Noto_Sans_JP } from "next/font/google";

const caveat = Caveat({
  subsets: ['latin'], // 必要に応じてサブセットを指定
  display: 'swap', // フォントの表示戦略 (FOUTを防ぐためswapが一般的)
  variable: '--font-caveat' // CSS変数名
});

// Noto Sans JP フォントの設定
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'], // 必要に応じて 'japanese' も追加検討
  weight: ['400', '700'], // 使用するウェイト
  display: 'swap',
  variable: '--font-noto-sans-jp', // CSS変数名
});

export const metadata: Metadata = {
  title: "until coffee cools",
  description: "コーヒーが冷めるまで",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <GtmScript />
      </head>
      <body className={notoSansJP.className}>
        {/* ページ全体のコンテナを縦方向のフレックスコンテナに変更 */}
        <div className="flex min-h-screen flex-col bg-gray-100 text-gray-700">
          {/* ヘッダー */}
          <div className="sticky top-0 z-50 bg-gray-100 shadow-md">
            <Header className={caveat.className} />
          </div>
          {/* メインコンテンツと右サイドバーを横並びにするコンテナ */}
          {/* このコンテナがヘッダーとフッター以外の残りの高さを占める (flex-1) */}
          <div className="flex flex-1">
            {/* 各ページのコンテンツ (メインエリア) */}
            <main className="flex-1">{children}</main>
            {/* 右サイドバー (ProfileCard) */}
            {/* <aside className="hidden md:block w-50 flex-shrink-0 p-6">
              <ProfileCard />
            </aside> */}
          </div>
          {/* フッター */}
          <Footer className={caveat.className} />
        </div>
      </body>
    </html>
  );
}
