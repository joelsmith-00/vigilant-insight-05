import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Bars, ExplainBadge, PageHeader, Panel, Tag } from "@/components/ui-kit";

export const Route = createFileRoute("/patterns")({
  head: () => ({
    meta: [
      { title: "Crime Pattern & Trend Analytics — Sentinel" },
      { name: "description", content: "MO clustering, seasonality curves and sociological correlates behind Karnataka crime trends." },
      { property: "og:title", content: "Crime Pattern & Trend Analytics — Sentinel" },
      { property: "og:description", content: "MO clusters, seasonality and socio-economic correlates." },
    ],
  }),
  component: () => (
    <AppShell>
      <PatternsBody />
    </AppShell>
  ),
});

const byType = [
  { label: "Chain snatching", value: 412 },
  { label: "Two-wheeler theft", value: 388 },
  { label: "House burglary", value: 271 },
  { label: "Cyber fraud", value: 244 },
  { label: "Assault", value: 190 },
];

const byHour = [4, 3, 2, 2, 3, 6, 11, 18, 24, 21, 17, 15, 14, 16, 19, 23, 31, 42, 51, 47, 38, 26, 15, 8];

const socio = [
  { label: "Youth unemployment", value: 71 },
  { label: "Night-lighting gaps", value: 63 },
  { label: "Transit-hub density", value: 58 },
  { label: "Migrant housing churn", value: 41 },
];

function PatternsBody() {
  return (
    <div>
      <PageHeader
        eyebrow="Pattern & trend analytics"
        title="Where the crime curve is bending"
        subtitle="Unsupervised MO clustering over 30 days of synthetic FIR text, cross-read against seasonality and district socio-economic indicators."
        right={<Tag tone="muted">30-day window · synthetic</Tag>}
      />

      <div className="grid gap-6 p-8 lg:grid-cols-3">
        <Panel eyebrow="Volume" title="FIRs by offence type" className="lg:col-span-2">
          <Bars data={byType} />
        </Panel>

        <Panel eyebrow="Seasonality" title="Festival precursor curve">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Property crime is tracking <span className="text-primary">+22%</span> ahead of Deepavali, matching 2022 and 2023
            precursor curves within ±3%.
          </p>
          <div className="mt-4">
            <ExplainBadge confidence={0.91} basis="Dynamic time-warping match against 3 prior festival windows; residual error 2.8%." />
          </div>
        </Panel>

        <Panel eyebrow="Time of day" title="Incident density by hour" className="lg:col-span-2">
          <div className="flex h-40 items-end gap-1">
            {byHour.map((v, i) => (
              <div key={i} className="group relative flex-1">
                <div
                  className="w-full rounded-t bg-[var(--gradient-accent)] transition group-hover:opacity-80"
                  style={{ height: `${(v / Math.max(...byHour)) * 150}px` }}
                />
                <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-popover px-1.5 py-0.5 font-mono text-[10px] group-hover:block">
                  {v}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>00h</span>
            <span>12h</span>
            <span>23h</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Peak window <span className="text-foreground">17:00–20:00</span> — 34% of all snatching FIRs.
          </p>
        </Panel>

        <Panel eyebrow="Sociological insight" title="Correlates, not causes">
          <Bars data={socio} unit="%" />
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            Correlation strength only. Sentinel never asserts causality and never scores individuals on demographic attributes.
          </p>
        </Panel>

        <Panel eyebrow="MO clusters" title="Auto-detected modus operandi groups" className="lg:col-span-3">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { name: "Two-rider pillion snatch", n: 27, conf: 0.88, area: "Bengaluru South" },
              { name: "Duplicate-key scooter lift", n: 19, conf: 0.79, area: "Bengaluru East" },
              { name: "OTP-relay bank fraud", n: 34, conf: 0.93, area: "Statewide" },
            ].map((c) => (
              <div key={c.name} className="rounded-lg border border-border/70 bg-background/40 p-4 transition hover:border-primary/40">
                <Tag>{c.area}</Tag>
                <h4 className="mt-2 text-sm font-semibold">{c.name}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{c.n} FIRs grouped this month</p>
                <div className="mt-3">
                  <ExplainBadge confidence={c.conf} basis={`Cluster formed from TF-IDF + embedding similarity across ${c.n} FIR narratives.`} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}