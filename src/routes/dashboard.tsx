import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { getRole, roleMeta, type Role } from "@/lib/session";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, FileText, MapPin, Network, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Sentinel" },
      { name: "description", content: "Role-aware crime intelligence dashboard: KPIs, hotspots, and AI-generated leads." },
      { property: "og:title", content: "Sentinel Dashboard" },
      { property: "og:description", content: "Role-aware crime intelligence — KPIs, hotspots, AI leads." },
    ],
  }),
  component: () => (
    <AppShell>
      <DashboardBody />
    </AppShell>
  ),
});

type Kpi = { label: string; value: string; delta: string; icon: typeof FileText; tone: "up" | "down" | "flat" };

const kpisByRole: Record<Role, Kpi[]> = {
  investigator: [
    { label: "My open FIRs", value: "23", delta: "+3 this week", icon: FileText, tone: "up" },
    { label: "Linked suspects", value: "47", delta: "12 shared with other zones", icon: Users, tone: "flat" },
    { label: "Priority leads", value: "5", delta: "AI flagged", icon: AlertTriangle, tone: "up" },
    { label: "Cluster hits", value: "3", delta: "MO overlap detected", icon: Network, tone: "up" },
  ],
  analyst: [
    { label: "FIRs (30d)", value: "8,412", delta: "+6.2% vs prior", icon: FileText, tone: "up" },
    { label: "Active clusters", value: "38", delta: "9 new this week", icon: Network, tone: "up" },
    { label: "Hotspots", value: "12", delta: "3 escalating", icon: MapPin, tone: "up" },
    { label: "MO patterns", value: "27", delta: "auto-detected", icon: TrendingUp, tone: "flat" },
  ],
  supervisor: [
    { label: "Team FIRs open", value: "184", delta: "8 officers", icon: FileText, tone: "flat" },
    { label: "Median close time", value: "11d", delta: "-2d vs last month", icon: TrendingUp, tone: "down" },
    { label: "Access events (24h)", value: "1,204", delta: "0 anomalies", icon: Users, tone: "flat" },
    { label: "Escalations", value: "6", delta: "2 pending review", icon: AlertTriangle, tone: "up" },
  ],
  policymaker: [
    { label: "State FIRs (30d)", value: "42,981", delta: "+3.1% MoM", icon: FileText, tone: "up" },
    { label: "Predicted hotspots", value: "18", delta: "next 14 days", icon: MapPin, tone: "up" },
    { label: "Resource gap", value: "7 zones", delta: "understaffed vs load", icon: Users, tone: "up" },
    { label: "Solve rate", value: "63%", delta: "+1.4pp YoY", icon: TrendingUp, tone: "down" },
  ],
};

const leadsByRole: Record<Role, { title: string; body: string; tag: string }[]> = {
  investigator: [
    { tag: "MO MATCH", title: "3 FIRs share the KSP-2231 chain-snatching MO", body: "Same TOD window, same 2-wheeler description across Jayanagar, JP Nagar, BTM. Suggest joint interrogation." },
    { tag: "NETWORK", title: "Suspect Rajesh K. links to unsolved case in Zone 7", body: "Co-accused edge (2019 theft). Confidence 0.82. Explain trace →" },
    { tag: "PRIORITY", title: "FIR #KSP-2287 escalation risk", body: "Complainant profile matches 4 prior extortion patterns in cluster." },
  ],
  analyst: [
    { tag: "PATTERN", title: "Chain-snatching cluster forming — Bengaluru South", body: "7 FIRs in 9 days, 4 share vehicle sub-pattern. Cluster confidence rising." },
    { tag: "SEASONAL", title: "Property crime up 22% ahead of Deepavali", body: "Matches 2022 and 2023 precursor curves within ±3%." },
    { tag: "HOTSPOT", title: "New hotspot: KR Puram corridor", body: "Not in last month's top 20. Now rank 6. Suggest patrol re-route." },
  ],
  supervisor: [
    { tag: "AUDIT", title: "All 1,204 access events verified", body: "Hash-chain intact. 0 tamper flags in the last 24h." },
    { tag: "TEAM", title: "SI Meera Rao — 4 FIRs past 21-day SLA", body: "Recommend re-assign or extension approval." },
    { tag: "REDACTION", title: "3 FIRs pending PII review before export", body: "Auto-redaction ready — one click to approve." },
  ],
  policymaker: [
    { tag: "FORECAST", title: "Cybercrime FIRs forecast to +18% by Q4", body: "Recommend +2 cyber cells in Bengaluru East + Mangaluru." },
    { tag: "RESOURCE", title: "7 zones understaffed vs predicted load", body: "Run resource simulator → suggested reallocation ready." },
    { tag: "POLICY", title: "Chain-snatching hotspot — Bengaluru South", body: "Consistent 3-month rise; evaluate targeted deterrence program." },
  ],
};

function DashboardBody() {
  const [role, setR] = useState<Role | null>(null);
  useEffect(() => setR(getRole()), []);
  if (!role) return null;
  const meta = roleMeta[role];
  const kpis = kpisByRole[role];
  const leads = leadsByRole[role];

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-primary uppercase tracking-widest">{meta.badge}</p>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight">Good evening, {meta.label}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Live view · synthetic Karnataka data · last refresh just now</p>
        </div>
        <Link
          to="/chat"
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
        >
          Ask Sentinel <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* KPIs */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card/60 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{k.label}</span>
              <k.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">{k.value}</div>
            <div className={`mt-1 text-xs ${k.tone === "up" ? "text-primary" : k.tone === "down" ? "text-accent" : "text-muted-foreground"}`}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Body grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Trend chart placeholder */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest">Trend · 30 days</p>
              <h3 className="mt-1 font-semibold">FIR volume vs baseline</h3>
            </div>
            <span className="text-xs text-muted-foreground">synthetic</span>
          </div>
          <Sparkline />
        </div>

        {/* Hotspot mini map */}
        <div className="rounded-xl border border-border bg-card/60 p-6">
          <p className="font-mono text-xs text-primary uppercase tracking-widest">Hotspots</p>
          <h3 className="mt-1 font-semibold">Karnataka · this week</h3>
          <HotspotMock />
        </div>
      </div>

      {/* AI leads */}
      <div className="mt-6 rounded-xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-primary uppercase tracking-widest">AI leads</p>
            <h3 className="mt-1 font-semibold">Sentinel noticed these for you</h3>
          </div>
          <Link to="/chat" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
            Investigate in chat <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {leads.map((l) => (
            <div key={l.title} className="rounded-lg border border-border/70 bg-background/40 p-4 hover:border-primary/40 transition">
              <span className="inline-block text-[10px] font-mono text-primary bg-primary/10 border border-primary/30 rounded px-1.5 py-0.5">{l.tag}</span>
              <h4 className="mt-2 text-sm font-semibold leading-snug">{l.title}</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{l.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sparkline() {
  const pts = [22, 28, 25, 31, 34, 29, 38, 42, 39, 44, 48, 41, 50, 55, 52, 58, 61, 57, 63, 67, 64, 70, 74, 71, 78, 82, 79, 85, 91, 88];
  const w = 600, h = 160, max = Math.max(...pts), min = Math.min(...pts);
  const path = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * (h - 20) - 10;
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.15 195)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.78 0.15 195)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#g)" />
        <path d={path} fill="none" stroke="oklch(0.78 0.15 195)" strokeWidth="2" />
      </svg>
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
        <span>D-30</span><span>D-15</span><span>Today</span>
      </div>
    </div>
  );
}

function HotspotMock() {
  const dots = [
    { x: 30, y: 55, r: 14, label: "Blr S" },
    { x: 42, y: 48, r: 10, label: "Blr E" },
    { x: 28, y: 70, r: 8, label: "Mysuru" },
    { x: 20, y: 30, r: 7, label: "Hubballi" },
    { x: 60, y: 75, r: 6, label: "Mangaluru" },
    { x: 70, y: 20, r: 5, label: "Kalaburagi" },
  ];
  return (
    <div className="mt-4 relative aspect-[4/5] rounded-lg border border-border/60 overflow-hidden bg-[oklch(0.14_0.03_260)]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <path d="M20,15 L75,10 L85,35 L82,65 L70,90 L40,92 L18,75 L10,45 Z" fill="oklch(0.20 0.035 260)" stroke="oklch(0.32 0.04 260)" strokeWidth="0.4" />
        {dots.map((d) => (
          <g key={d.label}>
            <circle cx={d.x} cy={d.y} r={d.r} fill="oklch(0.78 0.15 195)" opacity="0.15" />
            <circle cx={d.x} cy={d.y} r={d.r / 2.5} fill="oklch(0.78 0.15 195)" opacity="0.7" />
            <text x={d.x + d.r / 1.5} y={d.y + 1} fontSize="3" fill="oklch(0.72 0.03 255)" fontFamily="ui-monospace, monospace">{d.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}