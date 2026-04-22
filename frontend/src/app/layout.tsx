import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PONT AI — Generative Engine Optimization (GEO) for 10 AI platforms",
  description: "PONT AI helps 40+ companies get recommended by ChatGPT, DeepSeek, Perplexity, Kimi and 6 more AI engines. Average +527% AI referral traffic, +256% lead rate.",
  keywords: ["GEO", "Generative Engine Optimization", "AI SEO", "ChatGPT optimization", "DeepSeek optimization", "AI marketing", "Lead conversion"],
  openGraph: {
    title: "PONT AI — Generative Engine Optimization (GEO)",
    description: "Get recommended by ChatGPT, DeepSeek, and Perplexity. Drive traffic and leads with AI-driven marketing.",
    type: "website",
    locale: "en_US",
    url: "https://pontai.cloud/en",
    siteName: "PONT AI",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
