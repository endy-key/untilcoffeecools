import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image"; // next/image から Image をインポート
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import React from "react";
import { GtmScript } from "@/components/Gtm/GtmScript";
import { Caveat } from "next/font/google";

const caveat = Caveat({ // インスタンスを作成
  subsets: ['latin'], // 必要に応じてサブセットを指定
  display: 'swap', // フォントの表示戦略 (FOUTを防ぐためswapが一般的)
  // weight: ['400', '500', '600', '700'], // 可変フォントでない場合は、必要なウェイトを指定
  variable: '--font-caveat' // Tailwind CSSでCSS変数として使う場合
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
    <html lang="ja" className={caveat.className}>
      <head>
        <GtmScript />
      </head>
      <body>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <div className="sticky top-0 z-50 bg-gray-100 shadow-md"> {/* Headerをラップしてstickyにする */}
            <Header />
          </div>
          <div className="flex items-center justify-center">
            <Image
              src={"/heroImage.jpg"}
              alt={"untilcoffeecools heroImage"}
              width={1200} // 画像の実際の幅 (ピクセル単位) を指定してください
              height={400} // 画像実際の高さ (ピクセル単位) を指定してください
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
