import type { Metadata } from "next";
import "./globals.css";
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
          <div className="sticky top-0 z-50 bg-gray-100">
            <Header />
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
