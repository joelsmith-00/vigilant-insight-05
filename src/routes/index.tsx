import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroBg from "@/assets/network-hero.jpg";
import kspLogo from "@/assets/ksp-logo.png.asset.json";
import {
  MessageSquare,
  Network,
  TrendingUp,
  Radar,
  ShieldCheck,
  Mic,
  Languages,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

type Lang = "en" | "kn";

const copy = {
  en: {
    nav: { features: "Capabilities", pipeline: "How it works", demo: "Demo access" },
    badge: "Karnataka State Police · Prototype",
    title: ["Ten seconds", "to connect every FIR", "in the state."],
    sub: "Sentinel is a conversational, explainable AI layer over siloed crime records. Ask in English or ಕನ್ನಡ, by voice or keyboard — get answers with sources, network graphs, and forecasts.",
    cta: "Enter demo",
    ctaSub: "Pick a role — no credentials required on stage.",
    roles: [
      { key: "investigator", label: "Investigator", desc: "Full FIR + accused, case timelines" },
      { key: "analyst", label: "Analyst", desc: "Patterns, hotspots, network clusters" },
      { key: "supervisor", label: "Supervisor", desc: "Team view + tamper-evident audit" },
      { key: "policymaker", label: "Policymaker", desc: "Forecasts + resource simulator" },
    ],
    features: {
      heading: "Five surfaces, one intelligence layer",
      items: [
        { icon: MessageSquare, title: "Conversational Search", body: "Natural-language NL2SQL over FIRs, with a live agent trace showing every step." },
        { icon: Network, title: "Criminal Network Graph", body: "Force-directed exploration of co-accused, MO overlap and financial edges. Louvain clustering." },
        { icon: TrendingUp, title: "Pattern Analytics", body: "District heatmaps, seasonal correlations, and auto-generated insight cards." },
        { icon: Radar, title: "Predictive Hotspots", body: "Early-warning feed with precursor-pattern matching against historical escalations." },
        { icon: ShieldCheck, title: "Explainable AI", body: "Every answer cites its sources. Field-level redaction and hash-chained audit logs." },
      ],
    },
    pipeline: {
      heading: "Built for Kannada from the ground up",
      sub: "Speech and text flow through Bhashini / IndicTrans2. Structured logic stays in English for reliability; the human-facing layer is bilingual.",
      steps: ["ಕನ್ನಡ voice/text", "ASR + Translation", "LLM · NL2SQL · Tools", "Response · TTS ಕನ್ನಡ"],
    },
    quote: "\u201CAn officer investigating a theft in Zone 4 shouldn\u2019t need three phone calls to learn the suspect has priors in Zone 7.\u201D",
    footer: "Prototype — synthetic data. Not connected to live police systems.",
  },
  kn: {
    nav: { features: "ಸಾಮರ್ಥ್ಯಗಳು", pipeline: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ", demo: "ಡೆಮೋ ಪ್ರವೇಶ" },
    badge: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ · ಮೂಲಮಾದರಿ",
    title: ["ಹತ್ತು ಸೆಕೆಂಡ್\u200Cಗಳಲ್ಲಿ,", "ರಾಜ್ಯದ ಪ್ರತಿ FIR ಅನ್ನು", "ಸಂಪರ್ಕಿಸಿ."],
    sub: "ಸೆಂಟಿನೆಲ್ ಒಂದು ಸಂಭಾಷಣಾತ್ಮಕ, ವಿವರಿಸಬಹುದಾದ AI ಪದರ. ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ — ಧ್ವನಿಯಿಂದ ಅಥವಾ ಕೀಬೋರ್ಡ್‌ನಿಂದ ಕೇಳಿ; ಮೂಲಗಳು, ನೆಟ್\u200Cವರ್ಕ್ ಗ್ರಾಫ್\u200Cಗಳು ಮತ್ತು ಮುನ್ಸೂಚನೆಗಳೊಂದಿಗೆ ಉತ್ತರ ಪಡೆಯಿರಿ.",
    cta: "ಡೆಮೋ ಪ್ರವೇಶಿಸಿ",
    ctaSub: "ಪಾತ್ರವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ — ರುಜುವಾತುಗಳು ಅಗತ್ಯವಿಲ್ಲ.",
    roles: [
      { key: "investigator", label: "ತನಿಖಾಧಿಕಾರಿ", desc: "ಪೂರ್ಣ FIR, ಆರೋಪಿ, ಪ್ರಕರಣದ ಕಾಲಗಣನೆ" },
      { key: "analyst", label: "ವಿಶ್ಲೇಷಕ", desc: "ಮಾದರಿಗಳು, ಹಾಟ್\u200Cಸ್ಪಾಟ್\u200Cಗಳು, ಕ್ಲಸ್ಟರ್\u200Cಗಳು" },
      { key: "supervisor", label: "ಮೇಲ್ವಿಚಾರಕ", desc: "ತಂಡದ ನೋಟ + ಆಡಿಟ್ ದಾಖಲೆ" },
      { key: "policymaker", label: "ನೀತಿ ನಿರೂಪಕ", desc: "ಮುನ್ಸೂಚನೆ + ಸಂಪನ್ಮೂಲ ಸಿಮ್ಯುಲೇಟರ್" },
    ],
    features: {
      heading: "ಐದು ಮೇಲ್ಮೈಗಳು, ಒಂದು ಗುಪ್ತಚರ ಪದರ",
      items: [
        { icon: MessageSquare, title: "ಸಂಭಾಷಣಾ ಹುಡುಕಾಟ", body: "FIR ಗಳ ಮೇಲೆ ನೈಸರ್ಗಿಕ ಭಾಷೆಯ NL2SQL, ಪ್ರತಿ ಹೆಜ್ಜೆಯ ಲೈವ್ ಟ್ರೇಸ್." },
        { icon: Network, title: "ಅಪರಾಧ ನೆಟ್\u200Cವರ್ಕ್ ಗ್ರಾಫ್", body: "ಸಹ-ಆರೋಪಿ, MO ಮತ್ತು ಹಣಕಾಸಿನ ಸಂಪರ್ಕಗಳ ಪರಿಶೋಧನೆ." },
        { icon: TrendingUp, title: "ಮಾದರಿ ವಿಶ್ಲೇಷಣೆ", body: "ಜಿಲ್ಲಾ ಹೀಟ್\u200Cಮ್ಯಾಪ್\u200Cಗಳು, ಋತುಮಾನ ಪರಸ್ಪರ ಸಂಬಂಧಗಳು." },
        { icon: Radar, title: "ಮುನ್ಸೂಚಕ ಹಾಟ್\u200Cಸ್ಪಾಟ್\u200Cಗಳು", body: "ಪೂರ್ವ-ಎಚ್ಚರಿಕೆ ಫೀಡ್ ಮತ್ತು ಪೂರ್ವಗಾಮಿ ಮಾದರಿ ಹೊಂದಾಣಿಕೆ." },
        { icon: ShieldCheck, title: "ವಿವರಿಸಬಹುದಾದ AI", body: "ಪ್ರತಿ ಉತ್ತರ ಮೂಲಗಳನ್ನು ಉಲ್ಲೇಖಿಸುತ್ತದೆ. ಹ್ಯಾಶ್-ಚೈನ್ ಆಡಿಟ್." },
      ],
    },
    pipeline: {
      heading: "ಕನ್ನಡಕ್ಕಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",
      sub: "ಭಾಷಿಣಿ / IndicTrans2 ಮೂಲಕ ಧ್ವನಿ ಮತ್ತು ಪಠ್ಯ. ರಚನಾತ್ಮಕ ತರ್ಕ ಇಂಗ್ಲಿಷ್\u200Cನಲ್ಲಿ ಉಳಿಯುತ್ತದೆ; ಮಾನವ ಪದರ ದ್ವಿಭಾಷಾ.",
      steps: ["ಕನ್ನಡ ಧ್ವನಿ/ಪಠ್ಯ", "ASR + ಅನುವಾದ", "LLM · NL2SQL · ಪರಿಕರಗಳು", "ಪ್ರತಿಕ್ರಿಯೆ · TTS ಕನ್ನಡ"],
    },
    quote: "\u201CZone 4 ರಲ್ಲಿ ಕಳ್ಳತನ ತನಿಖೆ ಮಾಡುತ್ತಿರುವ ಅಧಿಕಾರಿಗೆ, ಶಂಕಿತನ ಹಿಂದಿನ ಅಪರಾಧಗಳನ್ನು ತಿಳಿಯಲು ಮೂರು ಫೋನ್ ಕರೆಗಳ ಅಗತ್ಯವಿರಬಾರದು.\u201D",
    footer: "ಮೂಲಮಾದರಿ — ಸಂಶ್ಲೇಷಿತ ಡೇಟಾ. ಲೈವ್ ಪೊಲೀಸ್ ಸಿಸ್ಟಂಗಳಿಗೆ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ.",
  },
} as const;

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const t = copy[lang];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-background/60 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img src={kspLogo.url} alt="Karnataka State Police" className="h-9 w-9 object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-tight text-base">Sentinel</span>
              <span className="hidden sm:inline text-[10px] text-muted-foreground font-mono">KARNATAKA STATE POLICE</span>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">{t.nav.features}</a>
            <a href="#pipeline" className="hover:text-foreground transition">{t.nav.pipeline}</a>
            <a href="#demo" className="hover:text-foreground transition">{t.nav.demo}</a>
          </nav>
          <div className="flex items-center gap-1 rounded-full border border-border/80 p-0.5 text-xs">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-full transition ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >EN</button>
            <button
              onClick={() => setLang("kn")}
              className={`px-3 py-1 rounded-full transition ${lang === "kn" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >ಕನ್ನಡ</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroBg}
            alt=""
            width={1920}
            height={1280}
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs font-mono text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t.badge}
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            {t.title.map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <span style={{ background: "var(--gradient-accent)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">{t.sub}</p>

          {/* Query preview */}
          <div className="mt-10 max-w-2xl rounded-xl border border-border bg-card/70 backdrop-blur p-4 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-destructive/70" />
                <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                <span className="h-2 w-2 rounded-full bg-primary/70" />
              </div>
              <span className="ml-2">sentinel · chat</span>
              <span className="ml-auto">{lang === "en" ? "EN → SQL" : "ಕನ್ನಡ → SQL"}</span>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <Mic className="h-4 w-4 mt-1 text-primary" />
              <p className="text-sm">
                {lang === "en"
                  ? "Show unsolved chain-snatching FIRs in Bengaluru South with the same MO as case #KSP-2231."
                  : "KSP-2231 ಪ್ರಕರಣದ ಅದೇ MO ಹೊಂದಿರುವ ಬೆಂಗಳೂರು ದಕ್ಷಿಣದ ಪರಿಹಾರವಾಗದ ಸರಪಳಿ ಕಳ್ಳತನ FIR ಗಳನ್ನು ತೋರಿಸಿ."}
              </p>
            </div>
            <div className="mt-3 ml-7 font-mono text-xs text-primary/80">
              → matched 7 FIRs · 3 share suspect network cluster · <span className="text-accent">explain ↗</span>
            </div>
          </div>

          <a href="#demo" className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <Languages className="h-4 w-4" /> {t.pipeline.heading} →
          </a>
        </div>
      </section>

      {/* DEMO ROLE ACCESS */}
      <section id="demo" className="relative py-20 border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest">04 · Role-based access</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{t.cta}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t.ctaSub}</p>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.roles.map((r, i) => (
              <button
                key={r.key}
                className="group relative text-left rounded-xl border border-border bg-card/60 p-5 hover:border-primary/60 hover:bg-card transition overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition" style={{ background: "var(--gradient-accent)" }} />
                <div className="font-mono text-xs text-muted-foreground">0{i + 1}</div>
                <div className="mt-2 text-lg font-semibold">{r.label}</div>
                <p className="mt-1 text-sm text-muted-foreground min-h-[3rem]">{r.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-primary">
                  {t.cta} <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs text-primary uppercase tracking-widest">05 · Capabilities</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">{t.features.heading}</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card/50 p-6 hover:border-primary/40 transition">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center border border-border/60" style={{ background: "linear-gradient(135deg, oklch(0.28 0.08 265 / 0.7), oklch(0.20 0.035 260 / 0.7))" }}>
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section id="pipeline" className="py-24 border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs text-primary uppercase tracking-widest">07 · Multilingual pipeline</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">{t.pipeline.heading}</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t.pipeline.sub}</p>

          <div className="mt-12 grid gap-3 md:grid-cols-4">
            {t.pipeline.steps.map((s, i) => (
              <div key={s} className="relative rounded-xl border border-border bg-card/60 p-5">
                <div className="font-mono text-xs text-primary">STEP · 0{i + 1}</div>
                <div className="mt-2 font-semibold">{s}</div>
                {i < t.pipeline.steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70" />
                )}
              </div>
            ))}
          </div>

          <blockquote className="mt-16 max-w-3xl border-l-2 pl-6 text-xl md:text-2xl font-medium leading-snug text-foreground/90" style={{ borderColor: "oklch(0.78 0.15 195)" }}>
            {t.quote}
          </blockquote>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-3">
            <img src={kspLogo.url} alt="Karnataka State Police" className="h-8 w-8 object-contain opacity-90" />
            <span>© Sentinel · {t.footer}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "kn" : "en")}
              className="inline-flex items-center gap-1 hover:text-foreground transition"
            >
              <Languages className="h-3 w-3" /> {lang === "en" ? "ಕನ್ನಡ" : "English"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
