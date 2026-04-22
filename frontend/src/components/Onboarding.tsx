"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Upload, Loader2, Check } from "lucide-react";
import { api } from "@/lib/api";

const STEPS = [
  { id: 1, label: "GEO Intent",      sub: "Define your optimization goals" },
  { id: 2, label: "Knowledge Base", sub: "Ingest content for RAG grounding" },
  { id: 3, label: "Engine Auth",    sub: "Link target AI platforms"      },
  { id: 4, label: "GEO Keywords",   sub: "Define your search focus"      },
];

const INTENTS   = ["content_gen", "cs_chat", "geo_monitoring", "market_analysis"];
const PLATFORMS = ["ChatGPT", "DeepSeek", "Perplexity", "Kimi"];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ intent: "content_gen", platform: "", keywords: "" });
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length + 1));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setUploadStatus("Ingesting to PONT Knowledge Base...");
    
    try {
      const text = await file.text();
      await api.ingestKB(file.name, text);
      setUploadStatus(`Success: ${file.name} indexed.`);
      setTimeout(next, 1500);
    } catch (err) {
      setUploadStatus("Upload failed. Verify PONT session.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await api.createTask(data.intent, {
        platform: data.platform,
        keywords: data.keywords,
        mode: 'initial_geo_batch'
      });
      next();
    } catch {
      alert("Deployment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: "1px solid var(--theme-outline-outline-variant)",
      borderRadius: "var(--shape-corner-xl)",
      overflow: "hidden",
      background: "var(--theme-surface-surface)",
    }}>
      <div style={{ position: "relative", height: 2, background: "var(--theme-outline-outline-variant)" }}>
        <motion.div
          style={{ position: "absolute", left: 0, top: 0, height: "100%", background: "var(--theme-surface-on-surface)" }}
          initial={false}
          animate={{ width: `${(Math.min(step, STEPS.length) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>

      <div className="onboarding-mobile-steps">
        {STEPS.map((s) => (
          <div key={s.id} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: step >= s.id ? "var(--theme-surface-on-surface)" : "var(--palette-grey-200)",
          }} />
        ))}
        <span className="caption" style={{ color: "var(--palette-grey-800)", marginLeft: "var(--space-sm)" }}>
          {STEPS[Math.min(step - 1, STEPS.length - 1)].label} · Step {Math.min(step, STEPS.length)} of {STEPS.length}
        </span>
      </div>

      <div className="onboarding-layout">
        <aside className="onboarding-sidebar" style={{ borderRight: "1px solid var(--theme-outline-outline-variant)" }}>
          {STEPS.map((s) => {
            const done    = step > s.id;
            const current = step === s.id;
            return (
              <div key={s.id} style={{
                display: "flex", alignItems: "flex-start", gap: "var(--space-md)",
                padding: "var(--space-lg) var(--space-xl)",
                borderBottom: "1px solid var(--theme-outline-outline-variant)",
                background: current ? "var(--palette-grey-10)" : "transparent",
              }}>
                <div style={{
                  marginTop: 3, flexShrink: 0, width: 20, height: 20, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? "var(--theme-surface-on-surface)" : "transparent",
                  outline: done ? "none" : `1px solid ${current ? "var(--palette-grey-900)" : "var(--palette-grey-300)"}`,
                }}>
                  {done ? <Check size={12} color="white" /> : <span style={{ width: 6, height: 6, borderRadius: "50%", background: current ? "var(--palette-grey-900)" : "var(--palette-grey-300)" }} />}
                </div>
                <div>
                  <p className="call-to-action--nav" style={{ color: current ? "var(--theme-surface-on-surface)" : "var(--palette-grey-300)", marginBottom: 2 }}>{s.label}</p>
                  <p className="caption" style={{ color: "var(--palette-grey-800)", opacity: current ? 1 : 0.5 }}>{s.sub}</p>
                </div>
              </div>
            );
          })}
        </aside>

        <div style={{ padding: "var(--space-3xl)", minHeight: 400, display: "flex", flexDirection: "column" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              style={{ flex: 1 }}
            >
              {step === 1 && (
                <div>
                  <p className="caption" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-sm)" }}>Step 1 of 4</p>
                  <h2 className="heading-5" style={{ marginBottom: "var(--space-2xl)" }}>Select GEO Strategy</h2>
                  <div className="intent-grid">
                    {INTENTS.map((opt) => (
                      <button key={opt} onClick={() => setData({ ...data, intent: opt })} style={{
                        textAlign: "left", padding: "var(--space-xl)", borderRadius: "var(--shape-corner-lg)",
                        border: `1px solid ${data.intent === opt ? "var(--palette-grey-1000)" : "var(--theme-outline-outline-variant)"}`,
                        background: data.intent === opt ? "var(--palette-grey-1200)" : "var(--palette-grey-10)",
                        color: data.intent === opt ? "var(--palette-grey-0)" : "var(--theme-surface-on-surface)",
                        cursor: "pointer", transition: "all 0.2s",
                      }}>
                        <p className="call-to-action--nav" style={{ marginBottom: "var(--space-xs)", textTransform: 'capitalize' }}>{opt.replace('_', ' ')}</p>
                        <p className="caption" style={{ color: data.intent === opt ? "rgba(255,255,255,0.6)" : "var(--palette-grey-800)" }}>
                          Optimization Engine v2.0
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="caption" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-sm)" }}>Step 2 of 4</p>
                  <h2 className="heading-5" style={{ marginBottom: "var(--space-2xl)" }}>PONT Knowledge Base</h2>
                  <label style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "var(--space-lg)", border: `2px dashed var(--theme-outline-outline-variant)`,
                    borderRadius: "var(--shape-corner-lg)", padding: "var(--space-5xl) var(--space-2xl)",
                    cursor: loading ? "wait" : "pointer", background: "var(--palette-grey-10)",
                  }}>
                    {loading ? <Loader2 className="animate-spin" size={32} color="var(--palette-grey-400)" /> : <Upload size={32} color="var(--palette-grey-400)" />}
                    <div style={{ textAlign: "center" }}>
                      <p className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface-variant)", marginBottom: "var(--space-xs)" }}>
                        {uploadStatus || "Upload brand content or training data"}
                      </p>
                      <p className="caption" style={{ color: "var(--palette-grey-400)" }}>Used for high-fidelity RAG grounding</p>
                    </div>
                    <input type="file" style={{ display: "none" }} disabled={loading} onChange={handleFileUpload} />
                  </label>
                </div>
              )}

              {step === 3 && (
                <div>
                  <p className="caption" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-sm)" }}>Step 3 of 4</p>
                  <h2 className="heading-5" style={{ marginBottom: "var(--space-2xl)" }}>Target AI Platforms</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                    {PLATFORMS.map((p) => (
                      <div key={p} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "var(--space-lg) var(--space-xl)", borderRadius: "var(--shape-corner-lg)",
                        border: `1px solid ${data.platform === p ? "var(--palette-grey-900)" : "var(--theme-outline-outline-variant)"}`,
                        background: data.platform === p ? "var(--palette-grey-10)" : "transparent",
                      }}>
                        <span className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface)" }}>{p}</span>
                        <button onClick={() => setData({ ...data, platform: p })} style={{
                          fontFamily: "inherit", background: "none", border: "none", cursor: "pointer",
                          color: data.platform === p ? "#34A853" : "var(--palette-grey-800)",
                        }}>
                          {data.platform === p ? "Enabled ✓" : "Enable Engine"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <p className="caption" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-sm)" }}>Step 4 of 4</p>
                  <h2 className="heading-5" style={{ marginBottom: "var(--space-2xl)" }}>GEO Search Keywords</h2>
                  <textarea
                    rows={6}
                    placeholder="e.g. Best AI automation tools, how to scale SaaS leads..."
                    value={data.keywords}
                    onChange={(e) => setData({ ...data, keywords: e.target.value })}
                    style={{
                      width: "100%", fontFamily: "inherit", padding: "var(--space-lg)",
                      borderRadius: "var(--shape-corner-md)", border: "1px solid var(--theme-outline-outline-variant)",
                      background: "var(--palette-grey-10)", color: "var(--theme-surface-on-surface)", resize: "none", outline: "none",
                    }}
                  />
                  <p className="caption" style={{ color: "var(--palette-grey-800)", marginTop: "var(--space-sm)" }}>
                    Xia will monitor and optimize your presence for these specific AI search terms.
                  </p>
                </div>
              )}

              {step === 5 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: "var(--space-xl)", padding: "var(--space-4xl) 0" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--palette-grey-10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={24} color="var(--palette-grey-1000)" />
                  </div>
                  <div>
                    <h2 className="heading-5" style={{ marginBottom: "var(--space-sm)" }}>PONT Engine Provisioned</h2>
                    <p className="body-text" style={{ color: "var(--palette-grey-800)", maxWidth: 360 }}>
                      Your dedicated GEO workers are online. Initial optimization report ready in 5-10 minutes.
                    </p>
                  </div>
                  <button onClick={() => (window.location.href = "/dashboard")} style={{
                    display: "inline-flex", alignItems: "center", gap: "var(--space-sm)",
                    height: 44, padding: "0 var(--space-2xl)", borderRadius: "var(--shape-corner-rounded)",
                    background: "var(--theme-surface-on-surface)", color: "var(--palette-grey-0)", border: "none",
                  }}>
                    Launch PONT Dashboard <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step <= 4 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              paddingTop: "var(--space-2xl)", marginTop: "var(--space-2xl)", borderTop: "1px solid var(--theme-outline-outline-variant)",
            }}>
              <button onClick={prev} disabled={step === 1 || loading} style={{
                height: 36, padding: "0 var(--space-lg)", borderRadius: "var(--shape-corner-rounded)",
                border: "1px solid var(--theme-outline-outline-variant)", background: "transparent",
              }}>
                Back
              </button>
              <button onClick={step === 4 ? handleFinish : next} disabled={loading} style={{
                display: "inline-flex", alignItems: "center", gap: "var(--space-sm)",
                height: 36, padding: "0 var(--space-lg)", borderRadius: "var(--shape-corner-rounded)",
                background: "var(--theme-surface-on-surface)", color: "var(--palette-grey-0)", border: "none",
              }}>
                {loading ? <Loader2 className="animate-spin" size={14} /> : (step === 4 ? "Start GEO Engine" : "Continue")} 
                {!loading && <ArrowRight size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
