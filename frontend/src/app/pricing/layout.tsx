import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — PONT AI GEO Platform",
  description: "Choose your PONT AI plan. From ¥999/month Entry to Flagship ¥9,999/month. GEO optimization across ChatGPT, DeepSeek, Perplexity and 7 more AI engines.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
