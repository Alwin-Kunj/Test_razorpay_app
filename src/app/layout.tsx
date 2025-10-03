import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Transactions Admin",
  description: "Simple admin dashboard for transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <div className="min-h-screen grid grid-cols-[240px_1fr]">
          <aside className="hidden md:block border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="p-4 text-xl font-semibold">Admin</div>
            <nav className="px-2 space-y-1">
              <Link href="/" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800">Dashboard</Link>
              <a href="#" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800">Payments</a>
              <a href="#" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800">Settlements</a>
              <a href="#" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800">Customers</a>
            </nav>
          </aside>
          <div className="flex flex-col">
            <header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
              <div className="h-14 flex items-center justify-between px-4">
                <div className="font-semibold">Transactions Admin</div>
                <div className="text-sm text-gray-500">Next.js + Tailwind</div>
              </div>
            </header>
            <main className="p-4">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
