"use client";

import { Check, Zap, Rocket, Shield } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Entry",
    price: "999",
    description: "Perfect for starting your AI journey.",
    features: [
      "Up to 100 Content Gen articles",
      "500 CS chat sessions",
      "5 GEO monitoring keywords",
      "2 Platform connections",
      "10 KB documents",
      "Standard support"
    ],
    cta: "Start Free Trial",
    highlight: false
  },
  {
    name: "Pro",
    price: "2,999",
    description: "Scale your business with advanced features.",
    features: [
      "500 Content Gen articles",
      "3,000 CS chat sessions",
      "50 GEO monitoring keywords",
      "10 Platform connections",
      "100 KB documents",
      "Priority 24/7 support",
      "Custom analytics"
    ],
    cta: "Go Pro",
    highlight: true
  },
  {
    name: "Flagship",
    price: "9,999",
    description: "Unleash the full power of Xia for enterprise.",
    features: [
      "Unlimited Content Gen",
      "Unlimited CS chat",
      "Unlimited GEO monitoring",
      "Unlimited connections",
      "Unlimited KB documents",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations"
    ],
    cta: "Contact Sales",
    highlight: false
  }
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-[#060606] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold tracking-tighter mb-6">Simple, Transparent <br /><span className="gradient-text">Usage-Based Pricing</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your growth. All plans include a 30-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={`p-8 rounded-3xl border ${tier.highlight ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/[0.02]'} relative overflow-hidden`}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">¥{tier.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">{tier.description}</p>
              
              <Link 
                href="/login" 
                className={`w-full py-3 rounded-xl font-bold transition-all text-center block mb-8 ${tier.highlight ? 'bg-primary hover:bg-primary/90' : 'bg-white text-black hover:bg-white/90'}`}
              >
                {tier.cta}
              </Link>

              <div className="space-y-4">
                {tier.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Overage Pricing */}
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/5 bg-white/[0.02] p-10">
          <h2 className="text-2xl font-bold mb-8 text-center">Overage Pricing</h2>
          <div className="space-y-4">
            {[
              { resource: "Content Generation", unit: "per article", price: "¥3.00" },
              { resource: "CS Chat", unit: "per session", price: "¥1.00" },
              { resource: "GEO Monitoring", unit: "per keyword/mo", price: "¥10.00" },
              { resource: "Platform Connections", unit: "per platform/mo", price: "¥99.00" },
              { resource: "KB Documents", unit: "per document", price: "¥10.00" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex flex-col">
                  <span className="font-medium">{item.resource}</span>
                  <span className="text-xs text-muted-foreground">{item.unit}</span>
                </div>
                <span className="text-lg font-bold text-primary">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
