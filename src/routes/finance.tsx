import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Bars, ExplainBadge, PageHeader, Panel, Tag } from "@/components/ui-kit";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Financial Crime Link Analysis — Sentinel" },
      { name: "description", content: "Mule-account chains, layering paths and payout clusters behind cyber fraud FIRs." },
      { property: "og:title", content: "Financial Crime Link Analysis — Sentinel" },
      { property: "og:description", content: "Trace mule chains and layering paths from fraud FIRs." },
    ],
  }),
  component: () => (
    <AppShell>
      <FinanceBody />
    </AppShell>
  ),
});

const chain = [
  { label: "Victim UPI", sub: "₹2,40,000", tone: "muted" },
  { label: "Mule A · HDFC ****4412", sub: "₹2,40,000 · 3 min", tone: "primary" },
  { label: "Split · 4 wallets", sub: "₹60,000 each · 11 min", tone: "primary" },
  { label: "Aggregator · ****9087", sub: "₹2,31,000 · 42 min", tone: "accent" },
  { label: "Cash-out ATM cluster", sub: "Kalaburagi · 3 machines", tone: "danger" },
];

const exposure = [
  { label: "Mule accounts", value: 38 },
  { label: "Linked FIRs", value: 24 },
  { label: "Wallet handles", value: 61 },
  { label: "Cash-out points", value: 9 },
];

function FinanceBody() {
  return (
    <div>
      <PageHeader
        eyebrow="Financial crime link analysis"
        title="Follow the money, not just the complaint"
        subtitle="Sentinel stitches transaction hops across FIRs into a single layering path — from victim UPI to the cash-out cluster."
        right={<Tag tone="muted">case bundle · OTP-relay ring</Tag>}
      />

      <div className="grid gap-6 p-8 lg:grid-cols-3">
        <Panel eyebrow="Layering path" title="₹2.4L traced across 5 hops in 42 minutes" className="lg:col-span-2">
          <div className="space-y-2">
            {chain.map((c, i) => (
              <div key={c.label} className="flex items-center gap-3">
                <div className="flex-1 rounded-lg border border-border/70 bg-background/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{c.label}</span>
                    <Tag tone={c.tone as any}>hop {i + 1}</Tag>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-primary">
            <ArrowRight className="h-3.5 w-3.5" /> Freeze request pre-filled for hops 2–4
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel eyebrow="Ring exposure" title="What this bundle touches">
            <Bars data={exposure} />
          </Panel>
          <Panel eyebrow="Signal" title="Why these accounts are grouped">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Shared device fingerprint on 12 accounts, identical KYC address block on 7, and a repeating 3-minute forwarding
              latency across all hops.
            </p>
            <div className="mt-3">
              <ExplainBadge confidence={0.89} basis="Graph community detection over transaction edges + device/KYC attribute overlap." />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}