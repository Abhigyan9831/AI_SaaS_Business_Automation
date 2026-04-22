"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
//  PLANS — Exact values from PontAI.pdf Section 5.4
// ─────────────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "entry_999",
    name: "Entry",
    nameZh: "入门版",
    price: { monthly: 999, quarterly: 2697, annual: 9588 },
    discount: { quarterly: "10% off", annual: "20% off" },
    tagline: "Launch your GEO presence across core AI engines.",
    cta: "Start Free Trial",
    highlighted: false,
    quotas: {
      content_gen: 100,
      cs_sessions: 500,
      geo_keywords: 5,
      platforms: 2,
      kb_documents: 10,
      ai_engines: 3,
      team_members: 1,
      support: "Email (48h SLA)",
      infra: "Shared",
    },
  },
  {
    id: "pro_2999",
    name: "Pro",
    nameZh: "专业版",
    price: { monthly: 2999, quarterly: 8097, annual: 28790 },
    discount: { quarterly: "10% off", annual: "20% off" },
    tagline: "Advanced GEO across all 10 AI engines. Dedicated workers.",
    cta: "Get Started",
    highlighted: true,
    quotas: {
      content_gen: 500,
      cs_sessions: 3000,
      geo_keywords: 50,
      platforms: 10,
      kb_documents: 100,
      ai_engines: 10,
      team_members: 5,
      support: "Priority (24h SLA)",
      infra: "Soft-Isolated Namespace",
    },
  },
  {
    id: "flagship_9999",
    name: "Flagship",
    nameZh: "旗舰版",
    price: { monthly: 9999, quarterly: 26997, annual: 95990 },
    discount: { quarterly: "10% off", annual: "20% off" },
    tagline: "Dedicated infrastructure. Custom AI workflows. White-label.",
    cta: "Contact Sales",
    highlighted: false,
    quotas: {
      content_gen: "Unlimited",
      cs_sessions: "Unlimited",
      geo_keywords: "Unlimited",
      platforms: "Unlimited",
      kb_documents: "Unlimited",
      ai_engines: 10,
      team_members: "Unlimited",
      support: "Dedicated Account Manager",
      infra: "Dedicated Node (K8s)",
    },
  },
];

const FEATURE_ROWS = [
  { section: "GEO Core", features: [
    { label: "AI Engines Monitored", values: ["3", "10", "10"] },
    { label: "GEO Keywords", values: ["5", "50", "Unlimited"] },
    { label: "Content Generation / mo", values: ["100 pieces", "500 pieces", "Unlimited"] },
    { label: "RAG Knowledge Base (docs)", values: ["10", "100", "Unlimited"] },
  ]},
  { section: "AI CS Agent", features: [
    { label: "CS Sessions / mo", values: ["500", "3,000", "Unlimited"] },
    { label: "Platform Connections", values: ["2", "10", "Unlimited"] },
    { label: "Lead Auto-Capture", values: [true, true, true] },
    { label: "Human Handoff", values: [false, true, true] },
  ]},
  { section: "Infrastructure", features: [
    { label: "Compute Isolation", values: ["Shared", "Soft Namespace", "Dedicated Node"] },
    { label: "Proxy Pool Region", values: ["CN Shared", "CN + Global", "Custom Regions"] },
    { label: "Account Pool", values: ["Shared", "Assigned", "Dedicated"] },
    { label: "SLA Uptime", values: ["99%", "99.9%", "99.99%"] },
  ]},
  { section: "Billing & Support", features: [
    { label: "Team Members", values: ["1", "5", "Unlimited"] },
    { label: "Overage Billing", values: ["Auto-charged", "Auto-charged", "Custom caps"] },
    { label: "Support", values: ["Email (48h)", "Priority (24h)", "Dedicated AM"] },
    { label: "White-label Dashboard", values: [false, false, true] },
  ]},
];

const OVERAGE_RATES = [
  { resource: "Content Generation", rate: "¥5 / piece" },
  { resource: "CS Chat Session",    rate: "¥0.5 / session" },
  { resource: "GEO Keyword Slot",   rate: "¥50 / keyword" },
  { resource: "KB Document",        rate: "¥2 / document" },
];

type Period = "monthly" | "quarterly" | "annual";

const navBtnStyle = (active: boolean): React.CSSProperties => ({
  height: 34,
  padding: "0 20px",
  borderRadius: "var(--shape-corner-rounded)",
  border: active ? "1px solid var(--palette-grey-900)" : "1px solid transparent",
  background: active ? "var(--theme-surface-on-surface)" : "transparent",
  color: active ? "var(--palette-grey-0)" : "var(--palette-grey-800)",
  cursor: "pointer",
  transition: "all 0.2s",
  fontSize: "var(--sm-size)",
  fontWeight: 450,
});

export default function PricingPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async (planId: string) => {
    const token = localStorage.getItem('pont_token');
    if (!token) {
      router.push('/signup');
      return;
    }

    setLoading(true);
    try {
      const res = await api.getCheckoutUrl(planId, period);
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        alert("Payment service error. Try again later.");
      }
    } catch {
      alert("Failed to connect to billing server.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) => `¥${n.toLocaleString("en")}`;

  return (
    <main style={{ minHeight: "100vh", background: "var(--theme-surface-surface)", color: "var(--theme-surface-on-surface)" }}>
      <div className="noise" />
      <header style={{ position: "sticky", top: 0, zIndex: 100, height: "var(--nav-height)", borderBottom: "1px solid var(--theme-outline-outline-variant)", background: "rgba(248,249,252,0.92)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 var(--page-margin)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 28, height: 28, background: "var(--theme-surface-on-surface)", borderRadius: "var(--shape-corner-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13L1 7L7 1Z" fill="white" /></svg>
          </span>
          <span className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface)" }}>PONT AI</span>
        </Link>
        <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <Link href="/login" className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface-variant)" }}>Sign in</Link>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 var(--space-lg)", borderRadius: "var(--shape-corner-rounded)", background: "var(--theme-surface-on-surface)", color: "var(--palette-grey-0)", fontSize: "var(--cta-sm-size)", fontWeight: 450 }}>
            Try Free <ArrowUpRight size={14} />
          </Link>
        </div>
      </header>

      <section className="container" style={{ paddingTop: "var(--space-6xl)", paddingBottom: "var(--space-4xl)", textAlign: "center" }}>
        <p className="caption" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-lg)" }}>Simple, transparent pricing — no hidden fees</p>
        <h1 className="heading-2" style={{ marginBottom: "var(--space-lg)" }}>Scale your GEO presence</h1>
        <p className="body-text" style={{ color: "var(--palette-grey-800)", maxWidth: 520, margin: "0 auto var(--space-3xl)" }}>Every plan includes a 30-day free trial. No credit card required to start.</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: 4, borderRadius: "var(--shape-corner-rounded)", background: "var(--palette-grey-10)", border: "1px solid var(--theme-outline-outline-variant)" }}>
          {(["monthly", "quarterly", "annual"] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={navBtnStyle(period === p)}>{p === "monthly" ? "Monthly" : p === "quarterly" ? "Quarterly −10%" : "Annual −20%"}</button>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: "var(--space-6xl)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-md)" }}>
          {PLANS.map((plan) => (
            <div key={plan.id} style={{ borderRadius: "var(--shape-corner-xl)", border: plan.highlighted ? "2px solid var(--palette-grey-1200)" : "1px solid var(--theme-outline-outline-variant)", background: plan.highlighted ? "var(--palette-grey-1200)" : "var(--theme-surface-surface)", padding: "var(--space-2xl)", display: "flex", flexDirection: "column", gap: "var(--space-xl)", position: "relative" }}>
              {plan.highlighted && <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%) translateY(-50%)", background: "var(--palette-grey-1200)", color: "var(--palette-grey-0)", padding: "4px 16px", borderRadius: "var(--shape-corner-rounded)", fontSize: "var(--xs-size)", fontWeight: 450, letterSpacing: "0.08em", whiteSpace: "nowrap", border: "1px solid var(--palette-grey-900)" }}>MOST POPULAR</div>}
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: "var(--space-xs)" }}>
                  <span className="heading-5" style={{ color: plan.highlighted ? "var(--palette-grey-0)" : "var(--theme-surface-on-surface)" }}>{plan.name}</span>
                  <span className="caption" style={{ color: plan.highlighted ? "rgba(255,255,255,0.5)" : "var(--palette-grey-800)" }}>{plan.nameZh}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: "var(--space-sm)" }}>
                  <span style={{ fontSize: "var(--4xl-size)", fontWeight: 450, lineHeight: 1, color: plan.highlighted ? "var(--palette-grey-0)" : "var(--theme-surface-on-surface)" }}>{fmt(plan.price[period])}</span>
                  <span className="caption" style={{ color: plan.highlighted ? "rgba(255,255,255,0.5)" : "var(--palette-grey-800)" }}>/{period === "monthly" ? "mo" : period === "quarterly" ? "qtr" : "yr"}</span>
                </div>
                <p className="caption" style={{ color: plan.highlighted ? "rgba(255,255,255,0.6)" : "var(--palette-grey-800)" }}>{plan.tagline}</p>
              </div>

              {plan.id === "flagship_9999" ? (
                <Link href="mailto:sales@pont-ai.com" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 44, borderRadius: "var(--shape-corner-rounded)", background: plan.highlighted ? "var(--palette-grey-0)" : "var(--theme-surface-on-surface)", color: plan.highlighted ? "var(--palette-grey-1200)" : "var(--palette-grey-0)", fontWeight: 450, fontSize: "var(--cta-sm-size)" }}>Contact Sales <ArrowUpRight size={14} /></Link>
              ) : (
                <button disabled={loading} onClick={() => handleCheckout(plan.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 44, borderRadius: "var(--shape-corner-rounded)", background: plan.highlighted ? "var(--palette-grey-0)" : "var(--theme-surface-on-surface)", color: plan.highlighted ? "var(--palette-grey-1200)" : "var(--palette-grey-0)", fontWeight: 450, fontSize: "var(--cta-sm-size)", width: '100%', opacity: loading ? 0.6 : 1, cursor: loading ? 'wait' : 'pointer' }}>{loading ? "Redirecting..." : plan.cta} <ArrowUpRight size={14} /></button>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", paddingTop: "var(--space-lg)", borderTop: `1px solid ${plan.highlighted ? "rgba(255,255,255,0.1)" : "var(--theme-outline-outline-variant)"}` }}>
                {[
                  { label: "Content Gen / mo", value: plan.quotas.content_gen },
                  { label: "CS Sessions / mo",  value: plan.quotas.cs_sessions },
                  { label: "GEO Keywords",       value: plan.quotas.geo_keywords },
                  { label: "AI Engines",          value: plan.quotas.ai_engines },
                  { label: "KB Docs",             value: plan.quotas.kb_documents },
                  { label: "Infrastructure",      value: plan.quotas.infra },
                ].map((q) => (
                  <div key={q.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span className="caption" style={{ color: plan.highlighted ? "rgba(255,255,255,0.6)" : "var(--palette-grey-800)" }}>{q.label}</span>
                    <span className="caption" style={{ color: plan.highlighted ? "var(--palette-grey-0)" : "var(--theme-surface-on-surface)", fontWeight: 450 }}>{q.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ borderTop: "1px solid var(--theme-outline-outline-variant)" }}>
        <div className="container" style={{ paddingTop: "var(--space-5xl)", paddingBottom: "var(--space-6xl)" }}>
          <h2 className="heading-5" style={{ marginBottom: "var(--space-4xl)", textAlign: "center" }}>Full Feature Comparison</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(3, 140px)", gap: 0, borderBottom: "1px solid var(--theme-outline-outline-variant)", paddingBottom: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
            <div />
            {PLANS.map((p) => (
              <div key={p.id} style={{ textAlign: "center" }}>
                <p className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface)" }}>{p.name}</p>
                <p className="caption" style={{ color: "var(--palette-grey-800)" }}>{fmt(p.price[period])}/mo</p>
              </div>
            ))}
          </div>
          {FEATURE_ROWS.map((section) => (
            <div key={section.section} style={{ marginBottom: "var(--space-2xl)" }}>
              <p className="caption" style={{ color: "var(--palette-grey-800)", fontWeight: 450, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "var(--space-md)", paddingTop: "var(--space-lg)", borderTop: "1px solid var(--theme-outline-outline-variant)" }}>{section.section}</p>
              {section.features.map((feat) => (
                <div key={feat.label} style={{ display: "grid", gridTemplateColumns: "1fr repeat(3, 140px)", gap: 0, padding: "var(--space-md) 0", borderBottom: "1px solid var(--theme-outline-outline-variant)" }}>
                  <span className="caption" style={{ color: "var(--theme-surface-on-surface)" }}>{feat.label}</span>
                  {feat.values.map((val, i) => (
                    <div key={i} style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
                      {typeof val === "boolean" ? (val ? <Check size={16} color="#34A853" /> : <Minus size={16} color="var(--palette-grey-300)" />) : (<span className="caption" style={{ color: "var(--theme-surface-on-surface)", fontWeight: i === 1 ? 500 : 400 }}>{val}</span>)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--theme-outline-outline-variant)" }}>
        <div className="container" style={{ paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-2xl)" }}>
          <div className="footer-row">
            <span className="caption" style={{ color: "var(--palette-grey-800)" }}>PONT AI © 2026 · GEO for AI-First Marketing</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2xl)" }}>
              {["Privacy", "Terms", "Documentation", "Contact"].map((l) => (
                <Link key={l} href="#" className="caption" style={{ color: "var(--palette-grey-800)" }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
