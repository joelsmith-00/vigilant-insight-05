import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import kspLogo from "@/assets/ksp-logo.png.asset.json";
import { roleMeta, setRole, type Role } from "@/lib/session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Sentinel" },
      { name: "description", content: "Role-based demo access for Sentinel — Karnataka State Police prototype." },
      { property: "og:title", content: "Sentinel — Role Access" },
      { property: "og:description", content: "Pick a role to enter the Sentinel demo. No credentials required on stage." },
    ],
  }),
  component: Login,
});

function Login() {
  const router = useRouter();
  const roles = Object.keys(roleMeta) as Role[];

  const enter = (r: Role) => {
    setRole(r);
    router.navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-center gap-3">
          <img src={kspLogo.url} alt="KSP" className="h-10 w-10 object-contain" />
          <div className="leading-tight">
            <div className="text-lg font-semibold tracking-tight">Sentinel</div>
            <div className="text-[10px] font-mono text-muted-foreground">KARNATAKA STATE POLICE · PROTOTYPE</div>
          </div>
        </div>

        <div className="mt-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs font-mono text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" /> ROLE-BASED ACCESS · JWT + RBAC (mock)
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">Choose your role to enter</h1>
          <p className="mt-3 text-muted-foreground">
            The demo binds each role to a scoped view: field officers see their FIRs, analysts get patterns, supervisors get audit trails, and policymakers get forecasts.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r, i) => {
            const m = roleMeta[r];
            return (
              <button
                key={r}
                onClick={() => enter(r)}
                className="group relative text-left rounded-xl border border-border bg-card/60 p-5 hover:border-primary/60 hover:bg-card transition overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition" style={{ background: "var(--gradient-accent)" }} />
                <div className="font-mono text-xs text-muted-foreground">0{i + 1}</div>
                <div className="mt-2 text-lg font-semibold">{m.label}</div>
                <div className="text-xs text-muted-foreground/80">{m.kn}</div>
                <p className="mt-2 text-sm text-muted-foreground min-h-[3rem]">{m.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-primary">
                  Enter as {m.label} <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-xs text-muted-foreground font-mono">
          Prototype — synthetic data. No credentials transmitted. Sessions are local to this browser.
        </p>
      </div>
    </div>
  );
}