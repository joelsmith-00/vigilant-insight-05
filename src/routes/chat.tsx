import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Mic, FileText, Database, Network, Sparkles, ShieldCheck, Languages } from "lucide-react";
import { getRole, roleMeta, type Role } from "@/lib/session";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat — Sentinel" },
      { name: "description", content: "Conversational NL2SQL over FIRs with a live agent trace, sources, and Kannada support." },
      { property: "og:title", content: "Sentinel Chat" },
      { property: "og:description", content: "Ask in English or ಕನ್ನಡ. Get answers with sources, network graphs, and forecasts." },
    ],
  }),
  component: () => (
    <AppShell>
      <ChatBody />
    </AppShell>
  ),
});

type Lang = "en" | "kn";
type TraceStep = { icon: typeof Database; label: string; detail: string; ms: number };
type Source = { id: string; title: string; snippet: string };
type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  trace?: TraceStep[];
  sources?: Source[];
  streaming?: boolean;
};

const suggestionsByRole: Record<Role, { en: string; kn: string }[]> = {
  investigator: [
    { en: "Show unsolved chain-snatching FIRs in Bengaluru South with the same MO as KSP-2231.", kn: "KSP-2231 ರ ಅದೇ MO ಹೊಂದಿರುವ ಪರಿಹಾರವಾಗದ ಪ್ರಕರಣಗಳನ್ನು ತೋರಿಸಿ." },
    { en: "Who are Rajesh K.'s known co-accused across all zones?", kn: "ರಾಜೇಶ್ K. ಯ ಸಹ-ಆರೋಪಿಗಳು ಯಾರು?" },
    { en: "Timeline of FIR #KSP-2287 with linked evidence.", kn: "FIR #KSP-2287 ರ ಕಾಲಗಣನೆ ತೋರಿಸಿ." },
  ],
  analyst: [
    { en: "Districts where property crime rose >20% last month.", kn: "ಕಳೆದ ತಿಂಗಳಲ್ಲಿ ಆಸ್ತಿ ಅಪರಾಧ 20% ಕ್ಕಿಂತ ಹೆಚ್ಚು ಏರಿಕೆಯಾದ ಜಿಲ್ಲೆಗಳು." },
    { en: "Cluster new chain-snatching FIRs by MO across Bengaluru.", kn: "MO ಪ್ರಕಾರ ಹೊಸ ಸರಪಳಿ ಕಳ್ಳತನ ಪ್ರಕರಣಗಳನ್ನು ಕ್ಲಸ್ಟರ್ ಮಾಡಿ." },
    { en: "Compare this week vs last week — top 5 hotspots.", kn: "ಈ ವಾರ ವಿರುದ್ಧ ಕಳೆದ ವಾರ — ಟಾಪ್ 5 ಹಾಟ್‌ಸ್ಪಾಟ್." },
  ],
  supervisor: [
    { en: "Any access anomalies in the last 24 hours?", kn: "ಕಳೆದ 24 ಗಂಟೆಗಳಲ್ಲಿ ಪ್ರವೇಶ ವೈಪರೀತ್ಯಗಳಿವೆಯೇ?" },
    { en: "FIRs past SLA under my team.", kn: "ನನ್ನ ತಂಡದ SLA ಮೀರಿದ ಪ್ರಕರಣಗಳು." },
    { en: "Export audit trail for FIR #KSP-2287.", kn: "FIR #KSP-2287 ರ ಆಡಿಟ್ ಟ್ರೇಲ್ ರಫ್ತು ಮಾಡಿ." },
  ],
  policymaker: [
    { en: "Forecast cybercrime FIRs for the next quarter.", kn: "ಮುಂದಿನ ತ್ರೈಮಾಸಿಕದ ಸೈಬರ್ ಅಪರಾಧ ಮುನ್ಸೂಚನೆ." },
    { en: "Which zones are understaffed vs predicted load?", kn: "ಯಾವ ವಲಯಗಳು ಸಿಬ್ಬಂದಿ ಕೊರತೆಯಲ್ಲಿವೆ?" },
    { en: "Simulate +50 officers in Bengaluru South.", kn: "ಬೆಂಗಳೂರು ದಕ್ಷಿಣದಲ್ಲಿ +50 ಅಧಿಕಾರಿಗಳನ್ನು ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಿ." },
  ],
};

function buildResponse(prompt: string, lang: Lang): { trace: TraceStep[]; sources: Source[]; text: string } {
  const trace: TraceStep[] = [
    { icon: Languages, label: lang === "kn" ? "Translate ಕನ್ನಡ → EN" : "Detect language · EN", detail: "IndicTrans2 · confidence 0.98", ms: 180 },
    { icon: Sparkles, label: "Plan", detail: "Classified as retrieval + aggregation query", ms: 120 },
    { icon: Database, label: "NL2SQL", detail: "SELECT * FROM firs WHERE mo_hash = ... AND status='open'", ms: 240 },
    { icon: Network, label: "Enrich · network graph", detail: "Joined 7 FIRs, 3 co-accused clusters", ms: 310 },
    { icon: ShieldCheck, label: "Redact + audit", detail: "PII masked · event #ax91c logged", ms: 90 },
  ];
  const sources: Source[] = [
    { id: "KSP-2231", title: "FIR #KSP-2231 · Chain snatching · Jayanagar", snippet: "2 offenders on Pulsar 150, snatched gold chain near 4th Block signal at 21:14." },
    { id: "KSP-2287", title: "FIR #KSP-2287 · Chain snatching · BTM Layout", snippet: "Similar vehicle description, same TOD window, 3 km radius." },
    { id: "KSP-2299", title: "FIR #KSP-2299 · Chain snatching · JP Nagar", snippet: "Complainant matched vehicle registration partial (KA-05-**-****)." },
  ];
  const text =
    lang === "kn"
      ? "KSP-2231 ರ ಅದೇ MO ಹೊಂದಿರುವ **7 ಪರಿಹಾರವಾಗದ FIR ಗಳು** ದೊರೆತಿವೆ. ಇವುಗಳಲ್ಲಿ 3 ಅದೇ ಸಹ-ಆರೋಪಿ ನೆಟ್‌ವರ್ಕ್ ಕ್ಲಸ್ಟರ್ ಹಂಚಿಕೊಳ್ಳುತ್ತವೆ (ವಿಶ್ವಾಸ 0.82). ವಾಹನ ವಿವರಣೆ ಮತ್ತು TOD ವಿಂಡೋ ಎಲ್ಲಾ ಪ್ರಕರಣಗಳಲ್ಲಿ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತವೆ. ಜಂಟಿ ವಿಚಾರಣೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ."
      : "Found **7 unsolved FIRs** matching the KSP-2231 MO in Bengaluru South. **3 of them share the same co-accused network cluster** (confidence 0.82). Vehicle description and time-of-day window overlap in all cases. Recommend a joint interrogation — network graph and case timelines are ready.";
  return { trace, sources, text };
}

function ChatBody() {
  const [role, setR] = useState<Role | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setR(getRole()), []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);
  useEffect(() => inputRef.current?.focus(), []);

  if (!role) return null;
  const suggestions = suggestionsByRole[role];

  const send = (prompt?: string) => {
    const text = (prompt ?? input).trim();
    if (!text || busy) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text };
    const asstId = crypto.randomUUID();
    const asstMsg: Msg = { id: asstId, role: "assistant", text: "", streaming: true, trace: [], sources: [] };
    setMessages((m) => [...m, userMsg, asstMsg]);
    setInput("");
    setBusy(true);

    const { trace, sources, text: reply } = buildResponse(text, lang);

    // Stream trace steps sequentially
    let acc: TraceStep[] = [];
    trace.forEach((step, i) => {
      setTimeout(() => {
        acc = [...acc, step];
        setMessages((m) => m.map((x) => (x.id === asstId ? { ...x, trace: acc } : x)));
      }, 250 * (i + 1));
    });

    // Stream reply text after trace
    const startTextAt = 250 * (trace.length + 1);
    const words = reply.split(" ");
    words.forEach((w, i) => {
      setTimeout(() => {
        setMessages((m) =>
          m.map((x) =>
            x.id === asstId
              ? {
                  ...x,
                  text: x.text + (i === 0 ? "" : " ") + w,
                  sources: i > 3 ? sources : x.sources,
                }
              : x,
          ),
        );
        if (i === words.length - 1) {
          setMessages((m) => m.map((x) => (x.id === asstId ? { ...x, streaming: false, sources } : x)));
          setBusy(false);
          inputRef.current?.focus();
        }
      }, startTextAt + i * 35);
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="h-16 border-b border-border/60 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold">Sentinel Chat</h1>
          <p className="text-[11px] font-mono text-muted-foreground">{roleMeta[role].label} view · explainable NL2SQL</p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border/80 p-0.5 text-xs">
          <button onClick={() => setLang("en")} className={`px-3 py-1 rounded-full transition ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>EN</button>
          <button onClick={() => setLang("kn")} className={`px-3 py-1 rounded-full transition ${lang === "kn" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>ಕನ್ನಡ</button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 grid" style={{ gridTemplateColumns: "1fr 340px" }}>
        <div ref={scrollRef} className="overflow-y-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs font-mono text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" /> READY · try a question
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                {lang === "en" ? `Ask Sentinel, ${roleMeta[role].label}.` : `ಕೇಳಿ ಸೆಂಟಿನೆಲ್, ${roleMeta[role].kn}.`}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {lang === "en" ? "Voice or keyboard. Answers cite sources and show every reasoning step." : "ಧ್ವನಿ ಅಥವಾ ಕೀಬೋರ್ಡ್. ಉತ್ತರಗಳು ಮೂಲಗಳನ್ನು ಉಲ್ಲೇಖಿಸುತ್ತವೆ."}
              </p>
              <div className="mt-6 grid gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.en}
                    onClick={() => send(lang === "en" ? s.en : s.kn)}
                    className="text-left rounded-lg border border-border bg-card/50 p-3 text-sm hover:border-primary/50 hover:bg-card transition"
                  >
                    {lang === "en" ? s.en : s.kn}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} msg={m} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar trace */}
        <div className="border-l border-border/60 bg-card/20 overflow-y-auto p-5">
          <p className="font-mono text-xs text-primary uppercase tracking-widest">Agent trace</p>
          <p className="text-xs text-muted-foreground mt-1">Every step is logged and auditable.</p>
          <div className="mt-5 space-y-3">
            {(messages.filter((m) => m.role === "assistant").pop()?.trace ?? []).map((s, i) => (
              <div key={i} className="flex gap-3 rounded-lg border border-border/70 bg-background/40 p-3">
                <div className="h-7 w-7 shrink-0 rounded-md border border-border/60 flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.28 0.08 265 / 0.6), oklch(0.20 0.035 260 / 0.6))" }}>
                  <s.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold">{s.label}</div>
                  <div className="text-[11px] text-muted-foreground truncate font-mono">{s.detail}</div>
                  <div className="text-[10px] text-primary/70 mt-0.5">{s.ms}ms</div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-xs text-muted-foreground italic">Trace will appear here after your first question.</div>
            )}
          </div>

          <div className="mt-8 rounded-lg border border-border/70 bg-background/40 p-3">
            <div className="flex items-center gap-2 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-muted-foreground">AUDIT</span>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
              This session hash-chains into KSP audit ledger. All PII is field-level redacted based on your role.
            </p>
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-border/60 bg-card/30 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 rounded-xl border border-border bg-background/60 p-2 focus-within:border-primary/60 transition">
            <button className="h-9 w-9 shrink-0 rounded-lg hover:bg-card flex items-center justify-center text-muted-foreground" title="Voice (mock)">
              <Mic className="h-4 w-4" />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder={lang === "en" ? "Ask about FIRs, suspects, hotspots…" : "FIR, ಶಂಕಿತರು, ಹಾಟ್‌ಸ್ಪಾಟ್ ಬಗ್ಗೆ ಕೇಳಿ…"}
              className="flex-1 resize-none bg-transparent outline-none text-sm py-2 max-h-40"
            />
            <button
              onClick={() => send()}
              disabled={busy || !input.trim()}
              className="h-9 w-9 shrink-0 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 flex items-center justify-center hover:opacity-90 transition"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-[10px] font-mono text-muted-foreground text-center">
            Prototype · synthetic data · answers grounded in cited FIRs only
          </p>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary/15 border border-primary/30 px-4 py-2.5 text-sm">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 shrink-0 rounded-lg border border-border/60 flex items-center justify-center" style={{ background: "var(--gradient-accent)" }}>
        <Sparkles className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-mono text-muted-foreground mb-1">SENTINEL</div>
        <div className="rounded-2xl rounded-tl-sm border border-border bg-card/70 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
          {msg.text}
          {msg.streaming && <span className="inline-block w-1.5 h-4 bg-primary/70 ml-1 animate-pulse align-middle" />}
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-3">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Sources</div>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {msg.sources.map((s) => (
                <div key={s.id} className="rounded-lg border border-border/70 bg-background/40 p-2.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3 w-3 text-primary" />
                    <span className="font-mono text-[10px] text-primary">{s.id}</span>
                  </div>
                  <div className="mt-1 font-semibold text-xs leading-snug">{s.title}</div>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-snug line-clamp-2">{s.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}