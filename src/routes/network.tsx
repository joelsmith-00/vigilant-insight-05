import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ExplainBadge, PageHeader, Panel, Tag } from "@/components/ui-kit";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Criminal Network Explorer — Sentinel" },
      { name: "description", content: "Interactive co-accused and co-location graph linking FIRs, suspects and clusters across Karnataka." },
      { property: "og:title", content: "Criminal Network Explorer — Sentinel" },
      { property: "og:description", content: "Explore co-accused clusters, bridge nodes and MO overlaps." },
    ],
  }),
  component: () => (
    <AppShell>
      <NetworkBody />
    </AppShell>
  ),
});

type Node = { id: string; name: string; x: number; y: number; type: "person" | "fir" | "vehicle"; degree: number; cluster: string };

const nodes: Node[] = [
  { id: "p1", name: "Rajesh K.", x: 50, y: 45, type: "person", degree: 9, cluster: "Chain-snatch South" },
  { id: "p2", name: "Imran S.", x: 30, y: 30, type: "person", degree: 5, cluster: "Chain-snatch South" },
  { id: "p3", name: "Mahesh B.", x: 72, y: 32, type: "person", degree: 6, cluster: "Vehicle theft East" },
  { id: "p4", name: "Suresh N.", x: 66, y: 66, type: "person", degree: 3, cluster: "Vehicle theft East" },
  { id: "p5", name: "Anil D.", x: 22, y: 62, type: "person", degree: 4, cluster: "Chain-snatch South" },
  { id: "f1", name: "FIR KSP-2231", x: 40, y: 18, type: "fir", degree: 2, cluster: "Chain-snatch South" },
  { id: "f2", name: "FIR KSP-2287", x: 16, y: 44, type: "fir", degree: 2, cluster: "Chain-snatch South" },
  { id: "f3", name: "FIR KSP-2410", x: 84, y: 50, type: "fir", degree: 2, cluster: "Vehicle theft East" },
  { id: "v1", name: "KA-05-MJ-4412", x: 50, y: 82, type: "vehicle", degree: 4, cluster: "Bridge" },
];

const edges: [string, string, string][] = [
  ["p1", "p2", "co-accused"],
  ["p1", "p5", "co-accused"],
  ["p2", "f1", "named in"],
  ["p1", "f1", "named in"],
  ["p5", "f2", "named in"],
  ["p3", "p4", "co-accused"],
  ["p3", "f3", "named in"],
  ["p1", "v1", "seen with"],
  ["p3", "v1", "seen with"],
  ["p4", "v1", "seen with"],
];

const color = { person: "oklch(0.78 0.15 195)", fir: "oklch(0.65 0.22 300)", vehicle: "oklch(0.75 0.14 235)" };

function NetworkBody() {
  const [sel, setSel] = useState<Node>(nodes[0]);
  const [filter, setFilter] = useState<"all" | "person" | "fir" | "vehicle">("all");

  const visible = useMemo(() => (filter === "all" ? nodes : nodes.filter((n) => n.type === filter)), [filter]);
  const visibleIds = new Set(visible.map((n) => n.id));
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const neighbours = edges
    .filter(([a, b]) => a === sel.id || b === sel.id)
    .map(([a, b, rel]) => ({ other: byId[a === sel.id ? b : a], rel }));

  return (
    <div>
      <PageHeader
        eyebrow="Criminal network explorer"
        title="Who connects to whom"
        subtitle="Co-accused, co-location and shared-vehicle edges built from linked FIRs. Click any node to trace its relationships."
        right={
          <div className="flex gap-1 rounded-lg border border-border bg-card/60 p-1">
            {(["all", "person", "fir", "vehicle"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 font-mono text-[11px] uppercase transition ${
                  filter === f ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 p-8 lg:grid-cols-3">
        <Panel eyebrow="Graph" title="Bengaluru South + East clusters" className="lg:col-span-2">
          <div className="relative aspect-[16/11] overflow-hidden rounded-lg border border-border/60 bg-[oklch(0.13_0.03_260)]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              {edges.map(([a, b], i) =>
                visibleIds.has(a) && visibleIds.has(b) ? (
                  <line
                    key={i}
                    x1={byId[a].x}
                    y1={byId[a].y}
                    x2={byId[b].x}
                    y2={byId[b].y}
                    stroke={a === sel.id || b === sel.id ? "oklch(0.78 0.15 195)" : "oklch(0.4 0.04 260)"}
                    strokeWidth={a === sel.id || b === sel.id ? 0.5 : 0.25}
                  />
                ) : null,
              )}
              {visible.map((n) => (
                <g key={n.id} className="cursor-pointer" onClick={() => setSel(n)}>
                  <circle cx={n.x} cy={n.y} r={1.4 + n.degree * 0.42} fill={color[n.type]} opacity={0.16} />
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={0.9 + n.degree * 0.18}
                    fill={color[n.type]}
                    stroke={sel.id === n.id ? "white" : "transparent"}
                    strokeWidth={0.4}
                  />
                  <text x={n.x + 3} y={n.y + 1} fontSize="2.4" fill="oklch(0.8 0.02 255)" fontFamily="ui-monospace, monospace">
                    {n.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
            {Object.entries(color).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: v }} /> {k}
              </span>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel eyebrow="Selected node" title={sel.name} right={<Tag>{sel.type}</Tag>}>
            <p className="text-xs text-muted-foreground">
              Cluster <span className="text-foreground">{sel.cluster}</span> · degree {sel.degree}
            </p>
            <div className="mt-3">
              <ExplainBadge
                confidence={0.82}
                basis="Edge inferred from 2 shared FIR co-accused records and 1 ANPR co-sighting within a 40-minute window."
              />
            </div>
            <ul className="mt-4 space-y-2">
              {neighbours.map((n) => (
                <li
                  key={n.other.id}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-background/40 px-3 py-2 text-xs"
                >
                  <button className="text-left hover:text-primary" onClick={() => setSel(n.other)}>
                    {n.other.name}
                  </button>
                  <span className="font-mono text-[10px] text-muted-foreground">{n.rel}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel eyebrow="Cluster signals" title="What the graph implies">
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li>
                <Tag tone="accent">bridge</Tag>
                <p className="mt-1.5">Vehicle KA-05-MJ-4412 bridges two otherwise separate clusters — highest betweenness in the graph.</p>
              </li>
              <li>
                <Tag>mo overlap</Tag>
                <p className="mt-1.5">3 FIRs share the same time-of-day + two-wheeler description. Suggest a joint interrogation plan.</p>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}