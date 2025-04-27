import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { Nav } from "./_components/Nav";
import React from "react";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "untilcoffeecools",
  description: "コーヒーが冷めるまで",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <Nav />
                <main className={styles.main}>{children}</main>
            </div>
            <Footer />
        </div>
      </body>
    </html>
  );
}
