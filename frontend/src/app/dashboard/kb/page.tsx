"use client";
import Link from "next/link";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

export default function KBPage() {
  const [filename, setFilename] = useState("");
  const [content, setContent]  = useState("");
  const [status, setStatus]    = useState("");

  const handleIngest = async () => {
    if (!filename || !content) return setStatus("Please fill in both fields.");
    setStatus("Ingesting...");
    try {
      await api.ingestKB(filename, content);
      setStatus("✅ Document ingested successfully!");
      setFilename(""); setContent("");
    } catch (e: any) { setStatus("❌ " + e.message); }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--theme-surface-surface)", color: "var(--theme-surface-on-surface)", padding: "var(--space-4xl) var(--page-margin)" }}>
      <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--palette-grey-800)", textDecoration: "none", marginBottom: "var(--space-2xl)" }} className="caption">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <h1 className="heading-2" style={{ marginBottom: "var(--space-xl)" }}>Knowledge Base</h1>
      <p className="body-text" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-3xl)" }}>Upload documents so Xia AI can use them to answer questions for your customers.</p>
      <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          <label className="caption">Document Name</label>
          <input value={filename} onChange={e => setFilename(e.target.value)} placeholder="e.g. company-faq.txt"
            style={{ height: 48, padding: "0 16px", borderRadius: 8, border: "1px solid var(--theme-outline-outline-variant)", background: "var(--palette-grey-10)", fontSize: 14, color: "inherit", outline: "none" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          <label className="caption">Document Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your document content here..." rows={8}
            style={{ padding: 16, borderRadius: 8, border: "1px solid var(--theme-outline-outline-variant)", background: "var(--palette-grey-10)", fontSize: 14, color: "inherit", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
        </div>
        <button onClick={handleIngest} style={{ height: 44, borderRadius: 8, background: "var(--theme-surface-on-surface)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
          <Upload size={16} /> Ingest Document
        </button>
        {status && <p className="caption" style={{ color: status.startsWith("✅") ? "#34A853" : status.startsWith("❌") ? "#EA4335" : "var(--palette-grey-800)" }}>{status}</p>}
      </div>
    </main>
  );
}
