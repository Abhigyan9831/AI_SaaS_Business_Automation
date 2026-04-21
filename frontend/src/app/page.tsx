"use client";

import Onboarding from "@/components/Onboarding";
import { Zap, Activity, Users, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060606] text-white selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">Pont AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <button className="bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-white/90 transition-all">
              Sign In
            </button>
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
            The multi-tenant control plane for distributed AI agents. Scalable, secure, and production-ready.
          </p>
        </div>

        <Onboarding />
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
