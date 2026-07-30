import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ExplainBadge, PageHeader, Panel, Tag } from "@/components/ui-kit";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Forecasting & Early Warning — Sentinel" },
      { name: "description", content: "14-day hotspot forecasts and a resource simulator for patrol reallocation across Karnataka." },
      { property: "og:title", content: "Forecasting & Early Warning — Sentinel" },
      { property: "og:description", content: "14-day hotspot forecasts and patrol resource simulation." },
    ],
  }),
  component: () => (
    <AppShell>
      <ForecastBody />
    </AppShell>
  ),
});

const zones = [
  { zone: "Bengaluru South", base: 412, risk: 0.86 },
  { zone: "Bengaluru East", base: 331, risk: 0.74 },
  { zone: "Mysuru City", base: 188, risk: 0.58 },
  { zone: "Mangaluru", base: 142, risk: 0.44 },
  { zone: "Kalaburagi", base: 121, risk: 0.39 },
];

function ForecastBody() {
  const [patrols, setPatrols] = useState(12);
  const [horizon, setHorizon] = useState(14);

  const effect = Math.min(0.34, patrols * 0.018);

  return (
    <div>
      <PageHeader
        eyebrow="Forecasting & early warning"
        title="What next fortnight likely looks like"
        subtitle="Seasonal + trend model over synthetic FIR history, with a what-if simulator for patrol reallocation."
        right={<Tag tone="muted">confidence bands shown · advisory only</Tag>}
      />

      <div className="grid gap-6 p-8 lg:grid-cols-3">
        <Panel eyebrow="Simulator" title="Reallocate patrol units">
          <label className="block text-xs text-muted-foreground">
            Additional patrol units: <span className="font-mono text-foreground">{patrols}</span>
          </label>
          <input
            type="range"
            min={0}
            max={20}
            value={patrols}
            onChange={(e) => setPatrols(Number(e.target.value))}
            className="mt-2 w-full accent-[oklch(0.78_0.15_195)]"
          />
          <label className="mt-5 block text-xs text-muted-foreground">
            Horizon: <span className="font-mono text-foreground">{horizon} days</span>
          </label>
          <input
            type="range"
            min={7}
            max={30}
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="mt-2 w-full accent-[oklch(0.78_0.15_195)]"
          />
          <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-primary">Modelled effect</p>
            <p className="mt-1 text-2xl font-semibold">−{(effect * 100).toFixed(1)}%</p>
            <p className="mt-1 text-xs text-muted-foreground">predicted street-crime volume over {horizon} days</p>
          </div>
          <div className="mt-4">
            <ExplainBadge
              confidence={0.71}
              basis="Elasticity estimated from historical patrol-density vs incident-rate pairs; diminishing returns applied beyond 19 units."
            />
          </div>
        </Panel>

        <Panel eyebrow="Zone forecast" title={`Predicted FIRs · next ${horizon} days`} className="lg:col-span-2">
          <div className="space-y-3">
            {zones.map((z) => {
              const pred = Math.round((z.base / 30) * horizon * (1 + z.risk * 0.12) * (1 - effect));
              const band = Math.round(pred * 0.14);
              return (
                <div key={z.zone} className="rounded-lg border border-border/70 bg-background/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium">{z.zone}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {pred} <span className="text-muted-foreground/60">± {band}</span>
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/50">
                    <div className="h-full rounded-full bg-[var(--gradient-accent)]" style={{ width: `${z.risk * 100}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    Escalation risk {(z.risk * 100).toFixed(0)}%
                  </p>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}