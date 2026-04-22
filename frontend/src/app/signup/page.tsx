"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

const STEPS = [
  { id: 1, label: "Account",      sub: "Create your PONT ID."    },
  { id: 2, label: "Organisation", sub: "Details for your GEO instance." },
  { id: 3, label: "Market",       sub: "Your industry focus."     },
];

const ORG_SIZES  = ["1–10", "11–50", "51–200", "201+"];
const INDUSTRIES = ["E-commerce", "SaaS", "Finance", "Healthcare", "Education", "Real Estate"];

const inputStyle: React.CSSProperties = {
  width: "100%", fontFamily: "inherit",
  height: 48, padding: "0 var(--space-lg)",
  borderRadius: "var(--shape-corner-md)",
  border: "1px solid var(--theme-outline-outline-variant)",
  background: "var(--palette-grey-10)",
  fontSize: "var(--base-size)", lineHeight: "1",
  color: "var(--theme-surface-on-surface)",
  outline: "none", transition: "border-color 0.2s",
  boxSizing: "border-box",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
      <label className="caption" style={{ color: "var(--palette-grey-800)", fontWeight: 450 }}>{label}</label>
      {children}
    </div>
  );
}

export default function SignupPage() {
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ email: "", phone: "", password: "", companyName: "", orgSize: "", industry: "" });
  const patch = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleDeploy = async () => {
    setLoading(true);
    try { 
      const res = await api.register(form); 
      if (res.token) {
        localStorage.setItem('pont_token', res.token);
        window.location.href = "/dashboard"; 
      }
    }
    catch (e: any) { alert("Signup failed: " + (e.message || "Please try again.")); }
    finally { setLoading(false); }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--theme-surface-surface)", color: "var(--theme-surface-on-surface)", display: "flex", flexDirection: "column" }}>
      <div className="noise" />

      {/* Nav */}
      <header style={{
        height: "var(--nav-height)", borderBottom: "1px solid var(--theme-outline-outline-variant)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 var(--page-margin)", flexShrink: 0,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ width: 28, height: 28, background: "var(--theme-surface-on-surface)", borderRadius: "var(--shape-corner-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13L1 7L7 1Z" fill="white" /></svg>
          </span>
          <span className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface)" }}>PONT AI</span>
        </Link>
        <Link href="/login" className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface-variant)" }}>Sign in</Link>
      </header>

      {/* Progress bar */}
      <div style={{ position: "relative", height: 2, background: "var(--theme-outline-outline-variant)", flexShrink: 0 }}>
        <motion.div
          style={{ position: "absolute", left: 0, top: 0, height: "100%", background: "var(--theme-surface-on-surface)" }}
          initial={false}
          animate={{ width: `${(step / STEPS.length) * 100}%` }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-4xl) var(--page-margin)" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <div style={{ marginBottom: "var(--space-3xl)" }}>
                <p className="caption" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-sm)" }}>
                  Step {step} of {STEPS.length}
                </p>
                <h1 className="heading-2" style={{ marginBottom: "var(--space-sm)" }}>{STEPS[step - 1].label}</h1>
                <p className="body-text" style={{ color: "var(--palette-grey-800)" }}>{STEPS[step - 1].sub}</p>
              </div>

              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
                  <Field label="Work email">
                    <input type="email" placeholder="name@company.com"
                      value={form.email} onChange={(e) => patch("email", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Phone number">
                    <input type="tel" placeholder="+1 (555) 000-0000"
                      value={form.phone} onChange={(e) => patch("phone", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Secure password">
                    <input type="password" placeholder="Min 8 characters"
                      value={form.password} onChange={(e) => patch("password", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
                  <Field label="Company name">
                    <input type="text" placeholder="Acme Corp"
                      value={form.companyName} onChange={(e) => patch("companyName", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Deployment size">
                    <div className="org-size-grid">
                      {ORG_SIZES.map((s) => (
                        <button key={s} onClick={() => patch("orgSize", s)} style={{
                          height: 44, fontFamily: "inherit", borderRadius: "var(--shape-corner-md)",
                          border: `1px solid ${form.orgSize === s ? "var(--palette-grey-1000)" : "var(--theme-outline-outline-variant)"}`,
                          background: form.orgSize === s ? "var(--palette-grey-1200)" : "var(--palette-grey-10)",
                          color: form.orgSize === s ? "var(--palette-grey-0)" : "var(--theme-surface-on-surface)",
                          fontSize: "var(--sm-size)", fontWeight: 450, cursor: "pointer", transition: "all 0.2s",
                        }}>{s}</button>
                      ))}
                    </div>
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div className="industry-grid">
                  {INDUSTRIES.map((ind) => (
                    <button key={ind} onClick={() => patch("industry", ind)} style={{
                      height: 56, fontFamily: "inherit", borderRadius: "var(--shape-corner-md)",
                      border: `1px solid ${form.industry === ind ? "var(--palette-grey-1000)" : "var(--theme-outline-outline-variant)"}`,
                      background: form.industry === ind ? "var(--palette-grey-1200)" : "var(--palette-grey-10)",
                      color: form.industry === ind ? "var(--palette-grey-0)" : "var(--theme-surface-on-surface)",
                      fontSize: "var(--base-size)", fontWeight: 450, cursor: "pointer", transition: "all 0.2s",
                    }}>{ind}</button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: "var(--space-3xl)", marginTop: "var(--space-3xl)",
            borderTop: "1px solid var(--theme-outline-outline-variant)",
          }}>
            {step > 1 ? (
              <button onClick={() => setStep((s) => s - 1)} style={{
                display: "inline-flex", alignItems: "center", gap: "var(--space-xs)",
                height: 36, padding: "0 var(--space-lg)", borderRadius: "var(--shape-corner-rounded)",
                border: "1px solid var(--theme-outline-outline-variant)", background: "transparent",
                color: "var(--theme-surface-on-surface-variant)", fontSize: "var(--cta-sm-size)", fontWeight: 450,
              }}>
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <Link href="/" className="caption" style={{ color: "var(--palette-grey-800)" }}>← Home</Link>
            )}

            <button
              disabled={loading}
              onClick={step < STEPS.length ? () => setStep((s) => s + 1) : handleDeploy}
              style={{
                display: "inline-flex", alignItems: "center", gap: "var(--space-sm)",
                height: 36, padding: "0 var(--space-lg)", borderRadius: "var(--shape-corner-rounded)",
                background: "var(--theme-surface-on-surface)", color: "var(--palette-grey-0)",
                border: "none", cursor: loading ? "wait" : "pointer", fontSize: "var(--cta-sm-size)", fontWeight: 450,
              }}
            >
              {loading ? "Initializing..." : step < STEPS.length ? "Continue" : "Deploy PONT Engine"}
              {!loading && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
