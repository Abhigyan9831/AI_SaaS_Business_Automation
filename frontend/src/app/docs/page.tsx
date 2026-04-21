"use client";

import { Book, Code, Cpu, Server, Shield, Globe } from "lucide-react";

export default function Docs() {
  return (
    <main className="min-h-screen bg-[#060606] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex gap-12">
        {/* Sidebar */}
        <aside className="w-64 hidden lg:block shrink-0">
          <div className="sticky top-32 space-y-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Getting Started</h4>
              <nav className="space-y-2 text-sm text-muted-foreground">
                <a href="#introduction" className="block hover:text-white transition-colors">Introduction</a>
                <a href="#architecture" className="block hover:text-white transition-colors">Core Architecture</a>
                <a href="#quickstart" className="block hover:text-white transition-colors">Quickstart Guide</a>
              </nav>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Core Concepts</h4>
              <nav className="space-y-2 text-sm text-muted-foreground">
                <a href="#tenancy" className="block hover:text-white transition-colors">Multi-Tenancy</a>
                <a href="#xia-engine" className="block hover:text-white transition-colors">Xia Engine Loop</a>
                <a href="#quotas" className="block hover:text-white transition-colors">Quotas & Billing</a>
              </nav>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tighter mb-8" id="introduction">Documentation</h1>
          
          <div className="prose prose-invert prose-primary max-w-none space-y-12">
            <section>
              <p className="text-xl text-muted-foreground">
                Welcome to the Pont AI technical documentation. Pont AI is a cloud-native SaaS platform designed for high-scale AI task execution using the Xia core engine.
              </p>
            </section>

            <section id="architecture">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Server className="w-6 h-6 text-primary" />
                Core Architecture
              </h2>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">User Plane</h3>
                    <p className="text-sm text-muted-foreground">The marketing site, signup console, and payment gateway (Next.js).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Control Plane</h3>
                    <p className="text-sm text-muted-foreground">Stateless HA service managing tenants, subscriptions, quotas, and worker orchestration.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Data Plane</h3>
                    <p className="text-sm text-muted-foreground">The "Xia" workers running as isolated pods, Postgres with RLS, and Redis for task queues.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="tenancy">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                Security & Isolation
              </h2>
              <p className="text-muted-foreground">
                Pont AI uses **PostgreSQL Row Level Security (RLS)** at the data layer to ensure strict tenant isolation. Every database query is scoped to a specific `tenant_id`, preventing data leaks across different customers.
              </p>
            </section>

            <section id="xia-engine">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Cpu className="w-6 h-6 text-primary" />
                The Xia Engine
              </h2>
              <p className="text-muted-foreground mb-6">
                Xia is an event-driven task worker. It operates on a continuous loop:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <h4 className="font-bold mb-2">Crawl</h4>
                  <p className="text-xs text-muted-foreground">Data ingestion and scraping.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <h4 className="font-bold mb-2">Analyze</h4>
                  <p className="text-xs text-muted-foreground">LLM-based context analysis.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <h4 className="font-bold mb-2">Generate</h4>
                  <p className="text-xs text-muted-foreground">Vector-backed generation.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <h4 className="font-bold mb-2">Publish</h4>
                  <p className="text-xs text-muted-foreground">API and platform distribution.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
