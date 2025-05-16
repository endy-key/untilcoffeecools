import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image"; // next/image から Image をインポート
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import React from "react";
import { GtmScript } from "@/components/Gtm/GtmScript";
import { Caveat, Noto_Sans_JP } from "next/font/google"; // Noto_Sans_JP をインポート

const caveat = Caveat({
  subsets: ['latin'], // 必要に応じてサブセットを指定
  display: 'swap', // フォントの表示戦略 (FOUTを防ぐためswapが一般的)
  variable: '--font-caveat' // Tailwind CSSでCSS変数として使う場合
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
    // 両方のフォントのCSS変数をhtmlタグに適用
    // caveat.className ではなく、両方の .variable を結合します
    <html lang="ja">
      <head>
        <GtmScript />
      </head>
      {/* bodyにfont-sansを適用してデフォルトフォントをNoto Sans JPにする */}
      <body className={notoSansJP.className}>
        {/* text-gray-800などのデフォルトテキストカラーもここで指定すると良いでしょう */}
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-700">
          <div className="sticky top-0 z-50 bg-gray-100 shadow-md"> {/* Headerをラップしてstickyにする */}
            <Header className={caveat.className} />
          </div>
          <div className="flex items-center justify-center">
            <Image
              src={"/heroImage.jpg"}
              alt={"untilcoffeecools heroImage"}
              width={1200}
              height={400}
              priority // LCP要素の可能性が高いため、priorityは適切です
              className="w-full h-auto max-w-full" // コンテナ幅に合わせてレスポンシブに表示
            />
          </div>
          <div className="flex flex-1">
            <main className="flex-1 p-6">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
