"use client";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

export default function AIPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState("");

  const runTask = async (type: string) => {
    setLoading(true); setResult("");
    try {
      const res = await api.createTask(type, { source: "dashboard" });
      setResult(`✅ Task "${type}" queued. ID: ${res.id}`);
    } catch (e: any) { setResult("❌ " + e.message); }
    finally { setLoading(false); }
  };

  const TASKS = [
    { label: "GEO Keyword Analysis",  type: "geo_monitoring",  desc: "Analyse local market search trends." },
    { label: "Content Generation",    type: "content_gen",     desc: "Generate SEO-optimised blog posts." },
    { label: "Platform Sync",         type: "platform_sync",   desc: "Sync connected social platforms." },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--theme-surface-surface)", color: "var(--theme-surface-on-surface)", padding: "var(--space-4xl) var(--page-margin)" }}>
      <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--palette-grey-800)", textDecoration: "none", marginBottom: "var(--space-2xl)" }} className="caption">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <h1 className="heading-2" style={{ marginBottom: "var(--space-xl)" }}>AI Recommendations</h1>
      <p className="body-text" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-3xl)" }}>Trigger Xia AI tasks. Workers will scale automatically based on demand.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-lg)" }}>
        {TASKS.map(task => (
          <div key={task.type} style={{ padding: "var(--space-2xl)", borderRadius: 12, border: "1px solid var(--theme-outline-outline-variant)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <Zap size={20} />
            <h3 className="call-to-action--nav">{task.label}</h3>
            <p className="caption" style={{ color: "var(--palette-grey-800)", flex: 1 }}>{task.desc}</p>
            <button onClick={() => runTask(task.type)} disabled={loading}
              style={{ height: 40, borderRadius: 8, background: "var(--theme-surface-on-surface)", color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
              {loading ? "Running..." : "Run Task"}
            </button>
          </div>
        ))}
      </div>
      {result && <p className="caption" style={{ marginTop: "var(--space-xl)", color: result.startsWith("✅") ? "#34A853" : "#EA4335" }}>{result}</p>}
    </main>
  );
}
