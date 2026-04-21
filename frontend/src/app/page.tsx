"use client";

import Onboarding from "@/components/Onboarding";
import { Zap, Activity, Users, CreditCard, Search, Brain, FileText, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060606] text-white selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">Pont AI</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/login" className="bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-white/90 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section / Onboarding */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Cloud-Native v2.0 Live
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Accelerate your AI <br />
            <span className="gradient-text">Execution with Xia.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            The multi-tenant control plane for distributed AI agents. Scalable, secure, and production-ready architecture designed for high-margin SaaS.
          </p>
        </div>

        <Onboarding />
      </section>

      {/* Xia Engine Details */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The Xia Core Engine</h2>
            <p className="text-muted-foreground">Continuous execution loop for high-scale AI automation.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Search, title: "Crawl", desc: "Intelligent data ingestion from any source." },
              { icon: Brain, title: "Analyze", desc: "Context-aware processing with multi-model support." },
              { icon: FileText, title: "Generate", desc: "High-quality content production at scale." },
              { icon: Share2, title: "Publish", desc: "Automated distribution to integrated platforms." },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                <feature.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Workers', value: '1,248', icon: Activity },
            { label: 'Total Tasks', value: '48.2M', icon: Zap },
            { label: 'Managed Tenants', value: '312', icon: Users },
            { label: 'Cloud Savings', value: '82%', icon: CreditCard },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <stat.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
