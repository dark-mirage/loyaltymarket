import type { Metadata } from "next";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className="fonts-[Inter,sans-serif] !text-black box-border">
        {children}
      </body>
    </html>
  );
}
