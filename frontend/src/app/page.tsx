"use client";

import Onboarding from "@/components/Onboarding";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const NAV_LINKS = [
  { label: "GEO Engine",    href: "#" },
  { label: "AI Reception", href: "#" },
  { label: "Case Studies", href: "#" },
  { label: "Pricing",      href: "/pricing" },
];

export default function Home() {
  return (
    <main style={{ background: "var(--theme-surface-surface)", color: "var(--theme-surface-on-surface)", minHeight: "100vh" }}>
      <div className="noise" />

      {/* --- Navigation --- */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        height: "var(--nav-height)",
        borderBottom: "1px solid var(--theme-outline-outline-variant)",
        background: "rgba(248,249,252,0.92)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      }}>
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <span style={{
              width: 28, height: 28, background: "var(--theme-surface-on-surface)",
              borderRadius: "var(--shape-corner-sm)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 7L7 13L1 7L7 1Z" fill="white" />
              </svg>
            </span>
            <span className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface)" }}>PONT AI</span>
          </Link>

          {/* Centre links */}
          <nav className="nav-links">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="call-to-action--nav"
                style={{ color: "var(--theme-surface-on-surface-variant)", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--palette-grey-1000)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--theme-surface-on-surface-variant)")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", flexShrink: 0 }}>
            <Link href="/login" className="call-to-action--nav nav-signin-label"
              style={{ color: "var(--theme-surface-on-surface-variant)", transition: "color 0.2s" }}
            >
              Sign in
            </Link>
            <Link href="/signup" className="call-to-action--nav" style={{
              display: "inline-flex", alignItems: "center", gap: "var(--space-xs)",
              height: 36, padding: "0 var(--space-lg)",
              borderRadius: "var(--shape-corner-rounded)",
              background: "var(--theme-surface-on-surface)", color: "var(--palette-grey-0)",
              textDecoration: "none", flexShrink: 0,
            }}>
              Try Free <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* --- Hero --- */}
      <section className="container" style={{ paddingTop: "var(--space-6xl)", paddingBottom: "var(--space-6xl)" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
        >
          <p className="caption" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-lg)" }}>
            Generative Engine Optimization (GEO) · Trusted by 40+ Companies
          </p>

          <h1 className="landing-main" style={{ marginBottom: "var(--space-2xl)" }}>
            Get Recommended by<br />
            <span className="second-line">ChatGPT & DeepSeek.</span>
          </h1>

          <div className="hero-sub-row" style={{ marginBottom: "var(--space-6xl)" }}>
            <p className="body-text" style={{ color: "var(--palette-grey-800)", maxWidth: 540 }}>
              The first GEO platform designed to dominate AI search results. 
              Average <span style={{color: 'var(--theme-surface-on-surface)', fontWeight: 500}}>+527% AI referral traffic</span> and 
              <span style={{color: 'var(--theme-surface-on-surface)', fontWeight: 500}}> +256% lead rate</span> for your business.
            </p>
            <Link href="/signup" className="call-to-action" style={{
              display: "inline-flex", alignItems: "center", gap: "var(--space-sm)",
              color: "var(--theme-surface-on-surface)", textDecoration: "none",
              whiteSpace: "nowrap", transition: "gap 0.3s var(--ease-out-expo)",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.gap = "var(--space-xl)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.gap = "var(--space-sm)"; }}
            >
              Dominate AI Search <ArrowUpRight size={20} />
            </Link>
          </div>

          <Onboarding />
        </motion.div>
      </section>

      {/* --- Metrics --- */}
      <section style={{ borderTop: "1px solid var(--theme-outline-outline-variant)" }}>
        <div className="container" style={{ paddingTop: "var(--space-6xl)", paddingBottom: "var(--space-6xl)" }}>
          <div className="metrics-grid">
            {[
              { label: "AI Engines Tracked",  value: "10+"    },
              { label: "Referral Growth",    value: "527%"   },
              { label: "Lead Conversion",    value: "256%"   },
            ].map((s) => (
              <div key={s.label} style={{ paddingTop: "var(--space-xl)", borderTop: "1px solid var(--theme-outline-outline-variant)" }}>
                <p className="caption" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-sm)" }}>{s.label}</p>
                <p className="heading-2">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer style={{ borderTop: "1px solid var(--theme-outline-outline-variant)" }}>
        <div className="container" style={{ paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-2xl)" }}>
          <div className="footer-row">
            <span className="caption" style={{ color: "var(--palette-grey-800)" }}>PONT AI © 2026 · GEO for Digital Labor</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2xl)" }}>
              {["Privacy", "Terms", "Documentation", "Status"].map((l) => (
                <Link key={l} href="#" className="caption"
                  style={{ color: "var(--palette-grey-800)", textDecoration: "none" }}
                >{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
