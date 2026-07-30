import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ExplainBadge, PageHeader, Panel, Tag } from "@/components/ui-kit";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "Investigator Decision Support — Sentinel" },
      { name: "description", content: "Case timelines, next-best-action suggestions and linked evidence for open FIRs." },
      { property: "og:title", content: "Case Decision Support — Sentinel" },
      { property: "og:description", content: "Timelines, next-best actions and linked evidence per FIR." },
    ],
  }),
  component: () => (
    <AppShell>
      <CasesBody />
    </AppShell>
  ),
});

const cases = [
  { id: "KSP-2231", title: "Chain snatching — Jayanagar 4th Block", status: "Open", age: 9, prio: "High" },
  { id: "KSP-2287", title: "Extortion complaint — BTM Layout", status: "Open", age: 21, prio: "High" },
  { id: "KSP-2410", title: "Two-wheeler theft — KR Puram", status: "Under investigation", age: 4, prio: "Medium" },
  { id: "KSP-2455", title: "OTP relay fraud — Indiranagar", status: "Open", age: 2, prio: "Medium" },
];

const timeline = [
  { t: "Day 0", label: "FIR registered", done: true },
  { t: "Day 1", label: "Scene visit + CCTV requisition", done: true },
  { t: "Day 3", label: "Complainant statement recorded", done: true },
  { t: "Day 6", label: "ANPR match on KA-05-MJ-4412", done: true },
  { t: "Day 9", label: "Suspect interrogation pending", done: false },
  { t: "—", label: "Charge sheet draft", done: false },
];

const actions = [
  { a: "Request ANPR pull for 17:00–20:00 corridor cams", why: "MO peak window overlaps 3 linked FIRs.", conf: 0.86 },
  { a: "Cross-question Rajesh K. on 12 Jun sighting", why: "Co-accused edge with confidence 0.82 to this FIR's cluster.", conf: 0.82 },
  { a: "Escalate — 21-day SLA breach risk in 12 days", why: "Median close time for this offence class is 11 days.", conf: 0.74 },
];

function CasesBody() {
  const [sel, setSel] = useState(cases[0]);
  return (
    <div>
      <PageHeader
        eyebrow="Investigator decision support"
        title="Every case, with the next move suggested"
        subtitle="Sentinel reads the case file and proposes the next-best investigative action — with the reason and the source behind it."
        right={<Tag tone="muted">{cases.length} open in your queue</Tag>}
      />

      <div className="grid gap-6 p-8 lg:grid-cols-3">
        <div className="space-y-3">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => setSel(c)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                sel.id === c.id ? "border-primary/40 bg-primary/5" : "border-border bg-card/60 hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-primary">FIR {c.id}</span>
                <Tag tone={c.prio === "High" ? "danger" : "muted"}>{c.prio}</Tag>
              </div>
              <div className="mt-2 text-sm font-semibold leading-snug">{c.title}</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {c.age} days open · {c.status}
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Panel eyebrow={`FIR ${sel.id}`} title={sel.title}>
            <ol className="relative ml-2 border-l border-border/70 pl-6">
              {timeline.map((s) => (
                <li key={s.label} className="pb-5 last:pb-0">
                  <span className="absolute -left-[9px] mt-0.5">
                    {s.done ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground">{s.t}</span>
                    <span className={`text-sm ${s.done ? "" : "text-muted-foreground"}`}>{s.label}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel eyebrow="Next best actions" title="Ranked by expected case movement">
            <div className="space-y-3">
              {actions.map((a) => (
                <div key={a.a} className="rounded-lg border border-border/70 bg-background/40 p-4 transition hover:border-primary/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold">{a.a}</h4>
                    <ExplainBadge confidence={a.conf} basis={a.why} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{a.why}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}