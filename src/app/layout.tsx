import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { GtmScript } from "@/components/Gtm/GtmScript";
import ClarityScript from "@/components/Clarity/ClarityScript";
import { Caveat, Noto_Sans_JP } from "next/font/google";
import { siteConfig } from "@/config/site";

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
  /**
   * metadataBase を設定することで、openGraph.images などに指定した
   * 相対パス（例: "/heroImage.jpg"）を絶対 URL に自動解決してくれる。
   * NEXT_PUBLIC_SITE_URL 環境変数がなければ localhost にフォールバック。
   */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    /** 各ページは "%s | until coffee cools" 形式になる */
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    locale: "ja_JP",
    type: "website",
    images: [{ url: siteConfig.defaultOgImage, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.lang}>
      <head>
        <GtmScript />
        <ClarityScript />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9101239248699291"
          crossOrigin="anonymous"
        />
      </head>
      <body className={notoSansJP.className}>
        {/* ページ全体のコンテナを縦方向のフレックスコンテナに変更 */}
        <div className="flex min-h-screen flex-col bg-gray-100 text-gray-700">
          {/* ヘッダー */}
          <div className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-200/60">
            <Header className={caveat.className} />
          </div>
          {/* メインコンテンツと右サイドバーを横並びにするコンテナ */}
          {/* このコンテナがヘッダーとフッター以外の残りの高さを占める (flex-1) */}
          <div className="flex flex-1">
            <main className="flex-1 min-w-0">{children}</main>
          </div>
          {/* フッター */}
          <Footer className={caveat.className} />
        </div>
      </body>
    </html>
  );
}
