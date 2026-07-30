import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel, Tag } from "@/components/ui-kit";
import { ShieldCheck, Lock } from "lucide-react";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit & Governance — Sentinel" },
      { name: "description", content: "Tamper-evident hash-chained access log, PII redaction queue and role permission matrix." },
      { property: "og:title", content: "Audit & Governance — Sentinel" },
      { property: "og:description", content: "Hash-chained access logs and redaction governance." },
    ],
  }),
  component: () => (
    <AppShell>
      <AuditBody />
    </AppShell>
  ),
});

const events = [
  { t: "04:12", who: "SI Meera Rao", act: "Viewed FIR KSP-2231", hash: "9f3a…c1d2" },
  { t: "04:08", who: "Analyst D. Prasad", act: "Ran query: chain snatching 30d", hash: "71bd…44a0" },
  { t: "03:57", who: "DCP South", act: "Approved redacted export (3 FIRs)", hash: "a20e…9fb7" },
  { t: "03:41", who: "SI Kiran M.", act: "Opened profile OFF-1042", hash: "cc84…12e5" },
  { t: "03:22", who: "System", act: "Model card v1.4 published", hash: "5e0f…8a31" },
];

const matrix = [
  { cap: "Full FIR text + accused", inv: true, ana: false, sup: true, pol: false },
  { cap: "Aggregated statistics", inv: true, ana: true, sup: true, pol: true },
  { cap: "Network graph", inv: true, ana: true, sup: true, pol: false },
  { cap: "Risk scores", inv: true, ana: true, sup: true, pol: false },
  { cap: "Forecast + simulator", inv: false, ana: true, sup: true, pol: true },
  { cap: "Audit log", inv: false, ana: false, sup: true, pol: false },
];

function AuditBody() {
  return (
    <div>
      <PageHeader
        eyebrow="Audit & governance"
        title="Every question asked is on the record"
        subtitle="Access events are hash-chained — altering one entry breaks the chain. Exports pass a PII redaction gate first."
        right={
          <span className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
            <ShieldCheck className="h-4 w-4" /> Chain intact · 0 tamper flags (24h)
          </span>
        }
      />

      <div className="grid gap-6 p-8 lg:grid-cols-3">
        <Panel eyebrow="Access log" title="Last 24 hours · 1,204 events" className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg border border-border/70">
            <table className="w-full text-left text-sm">
              <thead className="bg-background/50 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Actor</th>
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Chain hash</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.hash} className="border-t border-border/60 hover:bg-primary/5">
                    <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{e.t}</td>
                    <td className="px-3 py-2.5">{e.who}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{e.act}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-primary">{e.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel eyebrow="Redaction queue" title="Pending PII review">
            <div className="space-y-2">
              {["KSP-2231", "KSP-2287", "KSP-2410"].map((id) => (
                <div key={id} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/40 px-3 py-2">
                  <span className="font-mono text-xs">FIR {id}</span>
                  <Tag tone="accent">auto-redaction ready</Tag>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Names, phone numbers and addresses are masked before any export leaves the system.
            </p>
          </Panel>

          <Panel eyebrow="Permissions" title="Role capability matrix">
            <table className="w-full text-left text-xs">
              <thead className="font-mono text-[9px] uppercase text-muted-foreground">
                <tr>
                  <th className="pb-2">Capability</th>
                  <th className="pb-2 text-center">Inv</th>
                  <th className="pb-2 text-center">Ana</th>
                  <th className="pb-2 text-center">Sup</th>
                  <th className="pb-2 text-center">Pol</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((m) => (
                  <tr key={m.cap} className="border-t border-border/60">
                    <td className="py-2 pr-2 text-muted-foreground">{m.cap}</td>
                    {[m.inv, m.ana, m.sup, m.pol].map((v, i) => (
                      <td key={i} className="py-2 text-center">
                        {v ? <span className="text-primary">●</span> : <Lock className="mx-auto h-3 w-3 text-muted-foreground/50" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
      </div>
    </div>
  );
}