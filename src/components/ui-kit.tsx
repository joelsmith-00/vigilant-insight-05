import type { ReactNode } from "react";
import { Info } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-border/60 bg-[var(--gradient-hero)] px-8 py-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}

export function Panel({
  title,
  eyebrow,
  right,
  className = "",
  children,
}: {
  title?: string;
  eyebrow?: string;
  right?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-xl border border-border bg-card/60 p-6 backdrop-blur-sm transition hover:border-primary/30 ${className}`}
    >
      {(title || right) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
            )}
            {title && <h3 className="mt-1 font-semibold tracking-tight">{title}</h3>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Tag({ children, tone = "primary" }: { children: ReactNode; tone?: "primary" | "accent" | "muted" | "danger" }) {
  const map = {
    primary: "text-primary bg-primary/10 border-primary/30",
    accent: "text-accent bg-accent/10 border-accent/30",
    muted: "text-muted-foreground bg-muted/40 border-border",
    danger: "text-destructive bg-destructive/10 border-destructive/30",
  } as const;
  return (
    <span className={`inline-block rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${map[tone]}`}>
      {children}
    </span>
  );
}

export function ExplainBadge({ confidence, basis }: { confidence: number; basis: string }) {
  return (
    <span
      title={basis}
      className="group relative inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary"
    >
      <Info className="h-3 w-3" />
      {(confidence * 100).toFixed(0)}% · why?
      <span className="pointer-events-none absolute left-0 top-6 z-20 hidden w-64 rounded-lg border border-border bg-popover p-3 text-[11px] leading-relaxed text-muted-foreground shadow-xl group-hover:block">
        {basis}
      </span>
    </span>
  );
}

export function Bars({ data, unit = "" }: { data: { label: string; value: number }[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate text-xs text-muted-foreground">{d.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/50">
            <div
              className="h-full rounded-full bg-[var(--gradient-accent)]"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right font-mono text-xs text-foreground">
            {d.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Soon() {
  return <Tag tone="muted">prototype data</Tag>;
}