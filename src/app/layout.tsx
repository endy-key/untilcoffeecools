import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <header className="bg-gray-100 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">untilcoffeecools</h1>
          <nav className="space-x-4">
              <a href="/" className="hover:underline">Home</a>
              <a href="/about" className="hover:underline">About</a>
              <a href="/categories" className="hover:underline">Categories</a>
          </nav>
      </header>
      <header className="bg-blue-600 text-white py-8 px-6 text-center">
          <h1 className="text-3xl font-extrabold">Welcome to untilcoffeecools!</h1>
      </header>
        {children}
      </body>
    </html>
  );
}
