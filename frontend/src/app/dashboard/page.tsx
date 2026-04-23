"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, LayoutDashboard, Database, Activity, Settings, LogOut, Clock, Zap, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "GEO Overview",      href: "/dashboard"       },
  { icon: Database,        label: "Knowledge Base",    href: "/dashboard/kb"    },
  { icon: Activity,        label: "AI Recommendation", href: "/dashboard/ai"    },
  { icon: ShieldCheck,     label: "AI CS Agent",       href: "/dashboard/cs"    },
  { icon: Settings,        label: "Settings",          href: "/dashboard/settings" },
];

const statusColor: Record<string, string> = {
  completed:  "#34A853",
  processing: "#3279F9",
  failed:     "#EA4335",
};

export default function DashboardPage() {
  const pathname = usePathname();
  const [tasks, setTasks]       = useState<any[]>([]);
  const [quotas, setQuotas]     = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [ranks, setRanks]       = useState<any[]>([]);
  const [audits, setAudits]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  const fetchData = async () => {
    try {
      const [t, u, p, r, a] = await Promise.all([
        api.getTasks(), 
        api.getUsage(),
        api.getPaymentHistory(),
        api.getRankTracking(),
        api.getSiteAudit()
      ]);
      if (Array.isArray(t)) setTasks(t);
      if (Array.isArray(u)) setQuotas(u);
      if (Array.isArray(p)) setPayments(p);
      if (Array.isArray(r)) setRanks(r);
      if (Array.isArray(a)) setAudits(a);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 5000);
    return () => clearInterval(iv);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("pont_token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--theme-surface-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="call-to-action--nav animate-pulse" style={{ color: "var(--palette-grey-800)" }}>Initialising GEO control plane…</p>
      </main>
    );
  }

  const live = tasks.filter(t => t.status === "processing").length;

  return (
    <main style={{ minHeight: "100vh", background: "var(--theme-surface-surface)", color: "var(--theme-surface-on-surface)", display: "flex", flexDirection: "column" }}>
      <div className="noise" />

      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        height: "var(--nav-height)", flexShrink: 0,
        borderBottom: "1px solid var(--theme-outline-outline-variant)",
        background: "rgba(248,249,252,0.92)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 var(--page-margin)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ width: 28, height: 28, background: "var(--theme-surface-on-surface)", borderRadius: "var(--shape-corner-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13L1 7L7 1Z" fill="white" /></svg>
          </span>
          <span className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface)" }}>PONT AI</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-lg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34A853" }} />
            <span className="caption" style={{ color: "var(--palette-grey-800)" }}>GEO Engine Online</span>
          </div>
          <button onClick={handleSignOut} className="caption" style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: "var(--palette-grey-800)" }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <nav style={{ display: "flex", flexDirection: "column" }}>
          {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.label} href={item.href} style={{
                  display: "flex", alignItems: "center", gap: "var(--space-md)",
                  padding: "var(--space-md) var(--space-xl)",
                  background: isActive ? "var(--palette-grey-10)" : "transparent",
                  borderLeft: isActive ? `2px solid var(--palette-grey-1200)` : "2px solid transparent",
                  color: isActive ? "var(--theme-surface-on-surface)" : "var(--palette-grey-800)",
                  width: "100%", textDecoration: "none",
                }}>
                  <item.icon size={16} />
                  <span className="call-to-action--nav sidebar-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main style={{ flex: 1, padding: "var(--space-4xl) var(--space-3xl)", overflowY: "auto", minWidth: 0 }}>
          <div style={{ marginBottom: "var(--space-4xl)", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p className="caption" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-sm)" }}>ID: PONT-ALPHA-01</p>
              <h1 className="heading-1">GEO Console</h1>
            </div>
            <Link href="/pricing" style={{ 
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', 
              borderRadius: 20, border: '1px solid var(--theme-outline-outline-variant)', 
              textDecoration: 'none', color: 'var(--theme-surface-on-surface)' 
            }}>
              <CreditCard size={14} /> <span className="caption" style={{fontWeight: 500}}>Upgrade Plan</span>
            </Link>
          </div>

          <div className="stats-grid">
            {[
              { label: "GEO Workers",  value: live, icon: Zap },
              { label: "GEO Keywords",  value: `${quotas.find(q => q.resource_type === 'geo_monitoring')?.used || 0}/${quotas.find(q => q.resource_type === 'geo_monitoring')?.total || 0}` },
              { label: "Content Gen",   value: `${quotas.find(q => q.resource_type === 'content_gen')?.used || 0}/${quotas.find(q => q.resource_type === 'content_gen')?.total || 0}` },
              { label: "CS Lead Rate",  value: "256%", icon: Activity },
            ].map((s, i) => (
              <div key={i} style={{ padding: "var(--space-2xl)", borderRight: i < 3 ? "1px solid var(--theme-outline-outline-variant)" : "none" }}>
                <p className="caption" style={{ color: "var(--palette-grey-800)", marginBottom: "var(--space-sm)" }}>{s.label}</p>
                <p className="heading-3">{s.value}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-xl)" }}>
            {/* Thread List */}
            <div style={{ borderRadius: "var(--shape-corner-lg)", border: "1px solid var(--theme-outline-outline-variant)", overflow: "hidden" }}>
              <div className="task-header" style={{ padding: "var(--space-lg) var(--space-2xl)", borderBottom: "1px solid var(--theme-outline-outline-variant)", background: "var(--palette-grey-10)" }}>
                <span className="caption" style={{ color: "var(--palette-grey-800)", fontWeight: 450 }}>GEO Operation</span>
                <span className="caption task-col-protocol" style={{ color: "var(--palette-grey-800)", fontWeight: 450 }}>AI Platform</span>
                <span className="caption" style={{ color: "var(--palette-grey-800)", fontWeight: 450 }}>Status</span>
                <span />
              </div>

              {tasks.length === 0 ? (
                <div style={{ padding: "var(--space-5xl)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-lg)" }}>
                  <Clock size={28} color="var(--palette-grey-300)" />
                  <p className="body-text" style={{ color: "var(--palette-grey-800)" }}>No active GEO threads.</p>
                </div>
              ) : tasks.map((task, i) => (
                <div key={task.id} className="task-row" style={{ padding: "var(--space-lg) var(--space-2xl)", borderBottom: i < tasks.length - 1 ? "1px solid var(--theme-outline-outline-variant)" : "none" }}>
                  <div style={{ minWidth: 0 }}>
                    <p className="call-to-action--nav" style={{ marginBottom: 2, textTransform: 'capitalize' }}>{task.type.replace('_', ' ')}</p>
                    <p className="caption" style={{ color: "var(--palette-grey-800)", fontFamily: "'Google Sans Code', monospace" }}>{String(task.id).substring(0, 8)}</p>
                  </div>
                  <span className="caption task-col-protocol" style={{ color: "var(--palette-grey-800)" }}>{task.payload?.platform || 'Multi-Engine'}</span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "var(--space-xs)",
                    padding: "2px var(--space-sm)", borderRadius: "var(--shape-corner-rounded)",
                    fontSize: "var(--xs-size)", fontWeight: 450,
                    background: `${statusColor[task.status] || '#eee'}1a`,
                    color: statusColor[task.status] || '#888',
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
                    {task.status}
                  </span>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--theme-outline-outline-variant)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment History */}
            <div style={{ borderRadius: "var(--shape-corner-lg)", border: "1px solid var(--theme-outline-outline-variant)", background: "var(--palette-grey-10)", padding: "var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
              <h3 className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface)" }}>Payment History</h3>
              {payments.length === 0 ? (
                <p className="caption" style={{ color: "var(--palette-grey-800)" }}>No recent transactions.</p>
              ) : payments.map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", borderBottom: "1px solid var(--theme-outline-outline-variant)", paddingBottom: "var(--space-md)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#34A8531a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle2 size={16} color="#34A853" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="caption" style={{ color: "var(--theme-surface-on-surface)", fontWeight: 500 }}>¥{p.amount.toLocaleString()}</p>
                    <p className="caption" style={{ color: "var(--palette-grey-800)", fontSize: 10 }}>{new Date(p.paid_at).toLocaleDateString()}</p>
                  </div>
                  <span className="caption" style={{ color: "var(--palette-grey-800)", fontSize: 10 }}>{p.payment_method}</span>
                </div>
              ))}
              <Link href="/pricing" style={{ marginTop: "auto", textAlign: "center", color: "var(--palette-grey-800)", textDecoration: "underline" }} className="caption">
                Manage Billing
              </Link>
            </div>

            {/* Visibility Section */}
            <div style={{ borderRadius: "var(--shape-corner-lg)", border: "1px solid var(--theme-outline-outline-variant)", background: "var(--palette-grey-10)", padding: "var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="call-to-action--nav" style={{ color: "var(--theme-surface-on-surface)" }}>Search Engine Visibility</h3>
                <span className="caption" style={{ color: '#34A853', fontWeight: 500 }}>Live Analysis</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--theme-outline-outline-variant)' }}>
                  <span className="caption" style={{ color: 'var(--palette-grey-800)' }}>Keyword</span>
                  <span className="caption" style={{ color: 'var(--palette-grey-800)', textAlign: 'center' }}>Google Rank</span>
                  <span className="caption" style={{ color: 'var(--palette-grey-800)', textAlign: 'center' }}>AI Search (AEO)</span>
                </div>
                
                {ranks.length === 0 ? (
                  <p className="caption" style={{ color: 'var(--palette-grey-800)', textAlign: 'center', padding: '20px 0' }}>No monitoring data available.</p>
                ) : ranks.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, alignItems: 'center' }}>
                    <span className="caption" style={{ fontWeight: 500 }}>{r.keyword}</span>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>#{r.google_rank}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: '#eee', borderRadius: 2, maxWidth: 60 }}>
                        <div style={{ width: `${(r.perplexity_mention_rate || 0) * 100}%`, height: '100%', background: '#3279F9', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500 }}>{Math.round((r.perplexity_mention_rate || 0) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', padding: 12, background: 'var(--palette-grey-0)', borderRadius: 8, border: '1px solid var(--theme-outline-outline-variant)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <CheckCircle2 size={14} color="#34A853" />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Xia AEO Strategy</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--palette-grey-800)', lineHeight: 1.4 }}>
                  Recommendation: Your mention rate in Perplexity is low for "{ranks[0]?.keyword || 'core keywords'}". Increase JSON-LD schema density.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
