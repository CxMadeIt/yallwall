import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "YallWall - Your City's 24/7 Live-Chat Room",
  description: "Keep up with local happenings, weather alerts, and more. Your City's 24/7 Live-Chat Room for real-time community conversations, events, and neighborhood connection.",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
