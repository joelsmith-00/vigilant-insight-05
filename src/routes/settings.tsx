import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel, Tag } from "@/components/ui-kit";
import { getRole, roleMeta, type Role } from "@/lib/session";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Sentinel" },
      { name: "description", content: "Language, model transparency and data-handling preferences for the Sentinel prototype." },
      { property: "og:title", content: "Settings — Sentinel" },
      { property: "og:description", content: "Language, transparency and data-handling preferences." },
    ],
  }),
  component: () => (
    <AppShell>
      <SettingsBody />
    </AppShell>
  ),
});

function Toggle({ label, desc, on, onChange }: { label: string; desc: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-4 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!on)}
        className={`mt-1 h-5 w-9 shrink-0 rounded-full border transition ${
          on ? "border-primary/50 bg-primary/30" : "border-border bg-muted"
        }`}
      >
        <span
          className={`block h-3.5 w-3.5 rounded-full bg-foreground transition ${on ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

function SettingsBody() {
  const [role, setR] = useState<Role | null>(null);
  const [lang, setLang] = useState<"en" | "kn">("en");
  const [trace, setTrace] = useState(true);
  const [cite, setCite] = useState(true);
  const [voice, setVoice] = useState(false);
  useEffect(() => setR(getRole()), []);

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="How Sentinel behaves for you"
        subtitle="Prototype preferences — language, transparency depth and data handling."
        right={role ? <Tag>{roleMeta[role].label}</Tag> : null}
      />

      <div className="grid gap-6 p-8 lg:grid-cols-2">
        <Panel eyebrow="Language" title="Interface & answers">
          <div className="flex gap-2">
            {(["en", "kn"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  lang === l ? "border-primary/40 bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {l === "en" ? "English" : "ಕನ್ನಡ"}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Kannada queries are translated, executed against the same structured layer, then the answer is translated back — the
            data never changes language, only the conversation does.
          </p>
        </Panel>

        <Panel eyebrow="Transparency" title="What Sentinel shows with every answer">
          <Toggle label="Show agent trace" desc="Reveal translation → plan → query → enrich → audit steps." on={trace} onChange={setTrace} />
          <Toggle label="Always cite sources" desc="Attach FIR IDs and record counts to every generated claim." on={cite} onChange={setCite} />
          <Toggle label="Voice input (mock)" desc="Enable the microphone affordance in chat." on={voice} onChange={setVoice} />
        </Panel>

        <Panel eyebrow="Data handling" title="Boundaries this prototype enforces" className="lg:col-span-2">
          <ul className="grid gap-3 text-xs text-muted-foreground md:grid-cols-3">
            {[
              "All data is synthetic. No real FIR or personal record is present.",
              "Risk scoring excludes caste, religion, region and income as inputs.",
              "Every read and query is written to the tamper-evident audit chain.",
              "Exports pass an automatic PII redaction gate.",
              "Model outputs are advisory — never evidence, never automated action.",
              "Role permissions are enforced server-side, not in the browser.",
            ].map((t) => (
              <li key={t} className="rounded-lg border border-border/70 bg-background/40 p-3 leading-relaxed">
                {t}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}