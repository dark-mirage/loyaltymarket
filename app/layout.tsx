import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import "./styles/globals.css";
import { cn } from "./shared";

// const inter = Inter({ subsets: ['latin', 'cyrillic', 'cyrillic-ext'], display: 'swap', variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head />
      <body className={cn(
        // inter.className,
        "font-[Inter,sans-serif] !text-black box-border")}>
        <div className="pt-15"></div>
        {children}
      </body>
    </html>
  );
}
