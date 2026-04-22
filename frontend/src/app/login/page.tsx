"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const inputStyle: React.CSSProperties = {
  width: "100%", fontFamily: "inherit",
  height: 48, padding: "0 var(--space-lg)",
  borderRadius: "var(--shape-corner-md)",
  border: "1px solid var(--theme-outline-outline-variant)",
  background: "var(--palette-grey-10)",
  fontSize: "var(--base-size)", lineHeight: "1",
  color: "var(--theme-surface-on-surface)",
  outline: "none", transition: "border-color 0.2s",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.login({ email, password });
      if (res.error) { 
        setError(res.error); 
      } else if (res.token) {
        localStorage.setItem("pont_token", res.token);
        localStorage.setItem("pont_user", JSON.stringify(res.user));
        router.push("/dashboard");
      }
    } catch { 
      setError("Failed to connect to GEO control plane."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--theme-surface-surface)", color: "var(--theme-surface-on-surface)", display: "flex", flexDirection: "column" }}>
      <div className="noise" />
      
      {/* Nav */}
      <header style={{
        height: "var(--nav-height)", borderBottom: "1px solid var(--theme-outline-outline-variant)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 var(--page-margin)", zIndex: 10,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{
            width: 28, height: 28, background: "var(--theme-surface-on-surface)",
            borderRadius: "var(--shape-corner-sm)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13L1 7L7 1Z" fill="white" /></svg>
          </span>
          <span className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface)" }}>PONT AI</span>
        </Link>
        <Link href="/signup" className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface-variant)" }}>
          Create account
        </Link>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-6xl) var(--page-margin)" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          style={{ width: "100%", maxWidth: 440 }}
        >
          <div style={{ marginBottom: "var(--space-3xl)" }}>
            <p className="caption" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-sm)" }}>Secure Access</p>
            <h1 className="heading-2" style={{ marginBottom: "var(--space-sm)" }}>Sign in</h1>
            <p className="body-text" style={{ color: "var(--palette-grey-800)" }}>Access your PONT GEO console and AI workers.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: "var(--space-sm)",
                padding: "var(--space-md)", borderRadius: "var(--shape-corner-md)",
                background: "rgba(213,0,0,0.06)", border: "1px solid rgba(213,0,0,0.15)",
                color: "#d50000",
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span className="caption">{error}</span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <label className="caption" style={{ color: "var(--palette-grey-800)", fontWeight: 450 }}>Work email</label>
              <input type="email" required autoComplete="email" placeholder="name@company.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--palette-grey-900)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--theme-outline-outline-variant)"; }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <label className="caption" style={{ color: "var(--palette-grey-800)", fontWeight: 450 }}>Password</label>
              <input type="password" required autoComplete="current-password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--palette-grey-900)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--theme-outline-outline-variant)"; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-sm)",
                height: 44, borderRadius: "var(--shape-corner-rounded)",
                background: "var(--theme-surface-on-surface)", color: "var(--palette-grey-0)",
                border: "none", cursor: loading ? "wait" : "pointer", fontFamily: "inherit",
                fontSize: "var(--cta-size)", fontWeight: 450, letterSpacing: "var(--cta-letter-spacing)",
                opacity: loading ? 0.6 : 1, transition: "opacity 0.2s, background 0.2s",
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="caption" style={{ textAlign: "center", marginTop: "var(--space-2xl)", color: "var(--palette-grey-800)" }}>
            Need a GEO instance?{" "}
            <Link href="/signup" style={{ color: "var(--theme-surface-on-surface)", fontWeight: 450 }}>Start free trial</Link>
          </p>
        </motion.div>
      </div>

      <footer style={{ borderTop: "1px solid var(--theme-outline-outline-variant)", padding: "var(--space-xl) var(--page-margin)" }}>
        <p className="caption" style={{ textAlign: "center", color: "var(--palette-grey-800)" }}>PONT AI © 2026 · Distributed AI Labor</p>
      </footer>
    </main>
  );
}
