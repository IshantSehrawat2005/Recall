import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";
import SessionManager from "@/components/session-manager";
import SessionTimeoutNotification from "@/components/session-timeout-notification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recall",
  description: "Recall: Effortlessly capture, organize, and discover insights from your web learning moments. Mindful learning for everyone.",
  keywords: ["Recall", "web highlights", "knowledge management", "learning", "notes", "AI", "insights", "organization"],
  openGraph: {
    title: "Recall",
    description: "Effortlessly capture, organize, and discover insights from your web learning moments.",
    url: "https://yourdomain.com/",
    siteName: "Recall",
    images: [
      {
        url: "/light-mode-logo.png",
        width: 800,
        height: 600,
        alt: "Recall Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recall",
    description: "Effortlessly capture, organize, and discover insights from your web learning moments.",
    images: ["/light-mode-logo.png"],
    site: "@yourtwitterhandle"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className + " bg-white dark:bg-black dark:bg-opacity-95 backdrop-blur-md"}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionManager timeoutDays={7}>
            {children}
            <SessionTimeoutNotification timeoutDays={7} warningDays={1} />
          </SessionManager>
        </ThemeProvider>
        <TempoInit />
      </body>
    </html>
  );
}
