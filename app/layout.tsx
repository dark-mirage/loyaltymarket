// import { Inter } from 'next/font/google'
import "./styles/globals.css";
import Script from "next/script";

import { cn } from "./shared";
import WebViewErrorAlert from "./components/WebViewErrorAlert";
import TelegramInit from "./components/TelegramInit";

// const inter = Inter({ subsets: ['latin', 'cyrillic', 'cyrillic-ext'], display: 'swap', variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Telegram WebApp SDK - загружается до интерактивности для корректной инициализации */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          // inter.className,
          "font-[Inter,sans-serif] text-black! box-border"
        )}
      >
        <TelegramInit />
        {children}
        <WebViewErrorAlert />
      </body>
    </html>
  );
}
