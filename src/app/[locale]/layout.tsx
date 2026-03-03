import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/features/theme-toggler/ThemeProvider";
import { Header } from "@/widgets/header/Header";
import { SmoothScrollProvider } from "@/shared/providers/SmoothScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://noris.dev"),

  title: {
    default: "Roman Noris — Fullstack Developer",
    template: "%s | Roman Noris",
  },
  description:
    "Fullstack Developer specializing in Next.js, NestJS, GSAP & cinematic UI. I engineer premium, ultra-high-performance digital products. Based in Ukraine.",
  keywords: [
    "Fullstack Developer",
    "Next.js",
    "NestJS",
    "React",
    "TypeScript",
    "GSAP",
    "PostgreSQL",
    "Portfolio",
    "Roman Noris",
    "Noris",
    "Web Developer Ukraine",
  ],
  authors: [{ name: "Roman Noris", url: "https://noris.dev" }],
  creator: "Roman Noris",

  /* ── Open Graph (Facebook, LinkedIn, WhatsApp, Telegram) ── */
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["uk_UA", "pl_PL"],
    url: "https://noris.dev",
    siteName: "Roman Noris — Portfolio",
    title: "Roman Noris — Engineering Antigravity.",
    description:
      "Fullstack Developer. Next.js · NestJS · GSAP · PostgreSQL. Building premium, cinematic web products at record speed.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Roman Noris — Fullstack Developer Portfolio",
      },
    ],
  },

  /* ── Twitter / X Card ─────────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title: "Roman Noris — Engineering Antigravity.",
    description:
      "Fullstack Developer. Next.js · NestJS · GSAP. Premium cinematic web experiences.",
    images: ["/og-image.png"],
    creator: "@romannoris",
  },

  /* ── Favicon & icons ──────────────────────────────────── */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    other: [
      { rel: "mask-icon", url: "/favicon.ico", color: "#3b82f6" },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020208" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { ScrollProgress } from "@/shared/ui/ScrollProgress";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <SmoothScrollProvider>
              <ScrollProgress />
              <Header />
              <div className="relative z-10">
                {children}
              </div>
            </SmoothScrollProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
