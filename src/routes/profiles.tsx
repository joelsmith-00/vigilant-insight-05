import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Bars, ExplainBadge, PageHeader, Panel, Tag } from "@/components/ui-kit";

export const Route = createFileRoute("/profiles")({
  head: () => ({
    meta: [
      { title: "Offender Profiling & Risk Scoring — Sentinel" },
      { name: "description", content: "Behaviour-based recidivism indicators built only from case history — never demographics." },
      { property: "og:title", content: "Offender Profiling — Sentinel" },
      { property: "og:description", content: "Behaviour-only risk indicators with full factor attribution." },
    ],
  }),
  component: () => (
    <AppShell>
      <ProfilesBody />
    </AppShell>
  ),
});

type Profile = {
  id: string;
  name: string;
  aka: string;
  risk: number;
  cases: number;
  last: string;
  mo: string;
  factors: { label: string; value: number }[];
};

const profiles: Profile[] = [
  {
    id: "OFF-1042",
    name: "Rajesh K.",
    aka: "Raju",
    risk: 78,
    cases: 6,
    last: "12 Jun 2026",
    mo: "Two-rider pillion snatch",
    factors: [
      { label: "Repeat same MO", value: 88 },
      { label: "Short reoffence gap", value: 74 },
      { label: "Network centrality", value: 69 },
      { label: "Cross-zone activity", value: 52 },
    ],
  },
  {
    id: "OFF-2210",
    name: "Mahesh B.",
    aka: "—",
    risk: 61,
    cases: 4,
    last: "02 May 2026",
    mo: "Duplicate-key scooter lift",
    factors: [
      { label: "Repeat same MO", value: 71 },
      { label: "Short reoffence gap", value: 44 },
      { label: "Network centrality", value: 63 },
      { label: "Cross-zone activity", value: 38 },
    ],
  },
  {
    id: "OFF-3388",
    name: "Imran S.",
    aka: "Immu",
    risk: 35,
    cases: 2,
    last: "19 Jan 2026",
    mo: "Chain snatch (accessory)",
    factors: [
      { label: "Repeat same MO", value: 30 },
      { label: "Short reoffence gap", value: 22 },
      { label: "Network centrality", value: 48 },
      { label: "Cross-zone activity", value: 18 },
    ],
  },
];

function tone(r: number) {
  return r >= 70 ? "danger" : r >= 50 ? "accent" : "muted";
}

function ProfilesBody() {
  const [sel, setSel] = useState(profiles[0]);
  return (
    <div>
      <PageHeader
        eyebrow="Offender profiling"
        title="Risk from behaviour, never identity"
        subtitle="Scores use only case history, MO repetition and network position. Caste, religion, region and income are excluded by design."
        right={<Tag tone="muted">decision support · not evidence</Tag>}
      />

      <div className="grid gap-6 p-8 lg:grid-cols-3">
        <div className="space-y-3">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSel(p)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                sel.id === p.id ? "border-primary/40 bg-primary/5" : "border-border bg-card/60 hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">{p.id}</span>
                <Tag tone={tone(p.risk) as any}>risk {p.risk}</Tag>
              </div>
              <div className="mt-2 font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">
                {p.cases} linked cases · last {p.last}
              </div>
            </button>
          ))}
        </div>

        <Panel eyebrow="Profile" title={sel.name} className="lg:col-span-2" right={<Tag tone={tone(sel.risk) as any}>risk {sel.risk}/100</Tag>}>
          <dl className="grid gap-4 sm:grid-cols-3">
            {[
              ["Alias", sel.aka],
              ["Dominant MO", sel.mo],
              ["Linked cases", String(sel.cases)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-sm">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Factor attribution</p>
            <Bars data={sel.factors} unit="%" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-border/70 bg-background/40 p-4">
            <ExplainBadge
              confidence={sel.risk / 100}
              basis="Gradient-boosted model over behavioural features only. Top contributor: repeat MO within 90 days. No protected attributes are used as inputs."
            />
            <p className="text-[11px] text-muted-foreground">
              Every score is reversible to its inputs and logged to the audit chain when viewed.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}