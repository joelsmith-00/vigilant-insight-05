import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, MessageSquare, Network, TrendingUp, Radar, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import kspLogo from "@/assets/ksp-logo.png.asset.json";
import { clearRole, getRole, roleMeta, type Role } from "@/lib/session";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; soon?: boolean };
const nav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/network", label: "Network", icon: Network, soon: true },
  { to: "/analytics", label: "Analytics", icon: TrendingUp, soon: true },
  { to: "/forecast", label: "Forecast", icon: Radar, soon: true },
];

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [role, setRoleState] = useState<Role | null>(null);

  useEffect(() => {
    const r = getRole();
    if (!r) {
      router.navigate({ to: "/login" });
      return;
    }
    setRoleState(r);
  }, [router]);

  if (!role) {
    return <div className="min-h-screen bg-background" />;
  }

  const meta = roleMeta[role];

  return (
    <div className="min-h-screen bg-background text-foreground grid" style={{ gridTemplateColumns: "240px 1fr" }}>
      <aside className="border-r border-border/60 bg-card/30 flex flex-col">
        <div className="h-16 px-4 flex items-center gap-3 border-b border-border/60">
          <img src={kspLogo.url} alt="KSP" className="h-8 w-8 object-contain" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Sentinel</div>
            <div className="text-[10px] font-mono text-muted-foreground">KSP · PROTOTYPE</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to as any}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-primary/10 text-foreground border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60 border border-transparent"
                }`}
                onClick={(e) => {
                  if (n.soon) e.preventDefault();
                }}
              >
                <n.icon className="h-4 w-4" />
                <span className="flex-1">{n.label}</span>
                {n.soon && <span className="text-[9px] font-mono text-muted-foreground/70">SOON</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border/60">
          <div className="rounded-lg border border-border/70 bg-card/60 p-3">
            <div className="flex items-center gap-2 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-muted-foreground">SIGNED IN</span>
            </div>
            <div className="mt-2 text-sm font-semibold">{meta.label}</div>
            <div className="text-[11px] text-muted-foreground">{meta.badge}</div>
            <button
              onClick={() => {
                clearRole();
                router.navigate({ to: "/login" });
              }}
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-border/80 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
            >
              <LogOut className="h-3 w-3" /> Switch role
            </button>
          </div>
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}