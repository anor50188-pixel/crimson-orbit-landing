import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Home,
  Bot,
  Store,
  Wrench,
  Plug,
  BookOpen,
  BarChart3,
  Wallet,
  Settings,
  HelpCircle,
  ChevronDown,
  Plus,
  Paperclip,
  ArrowUp,
  Send,
  Instagram,
  MessageCircle,
  FileSpreadsheet,
  ShieldCheck,
  Clock,
  Infinity as InfinityIcon,
  Check,
  Loader2,
  Circle,
  Brain,
  Sparkles,
  Play,
  Pencil,
  Power,
} from "lucide-react";
import heroPlanet from "@/assets/hero-planet.jpg";
import wordmark from "@/assets/agentus-wordmark.png";
import planetSmall from "@/assets/planet-small.png";

export const Route = createFileRoute("/agent-yaratish")({
  component: AgentCreatePage,
  head: () => ({
    meta: [
      { title: "Agent yaratish — Agentus" },
      {
        name: "description",
        content:
          "Agentus'da yangi AI agent yaratish sahifasi. Suhbat orqali agent yaratish demo simulyatsiyasi.",
      },
    ],
  }),
});

// Chap panel — hech biri hali ishga tushmagan.
const navItems = [
  { icon: Home, label: "Asosiy", active: true },
  { icon: Bot, label: "Agentlarim" },
  { icon: Store, label: "Marketplace" },
  { icon: Wrench, label: "Mening toollarim" },
  { icon: Plug, label: "Integratsiyalar" },
  { icon: BookOpen, label: "Kodex" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Wallet, label: "To'lovlar" },
  { icon: Settings, label: "Sozlamalar" },
];

const examples = [
  { icon: Send, text: "Telegram orqali hisobot yig'uvchi agent yarat" },
  { icon: Instagram, text: "Instagram postlar tayyorlovchi agent" },
  { icon: MessageCircle, text: "Mijozlar bilan avtomatik muloqot qiluvchi bot" },
  { icon: FileSpreadsheet, text: "Excel fayllar bilan ishlovchi agent" },
];

const featureBar = [
  { icon: ShieldCheck, title: "100% xavfsiz", desc: "Ma'lumotlaringiz himoyalangan" },
  { icon: Clock, title: "24/7 ishlaydi", desc: "Siz uxlaganda ham agentingiz ishlaydi" },
  { icon: InfinityIcon, title: "Cheksiz imkoniyatlar", desc: "Toollar va integratsiyalar bilan kengaytiring" },
];

// Qurish bosqichlari — haqiqiy backend hali yo'q. Bu skript asosidagi
// demo simulyatsiya; foydalanuvchiga aniq ko'rsatiladi.
const buildSteps = [
  { key: "goal", label: "Maqsad tahlili" },
  { key: "tools", label: "Asboblarni tanlash" },
  { key: "codex", label: "Kodex yaratish" },
  { key: "memory", label: "Xotirani sozlash" },
  { key: "workflow", label: "Ish jarayonini yaratish" },
  { key: "verify", label: "Tasdiqlash" },
] as const;

type ChatMessage =
  | { role: "user"; text: string }
  | { role: "brain"; text: string; choices?: string[]; answered?: string };

type Phase = "hero" | "building" | "clarify" | "done";

const clarifyQuestion = {
  text: "Yaxshi. Bir savol: hisobotlarni kim yuboradi?",
  choices: ["Xodimlar", "Mijozlar", "Hamkorlar", "Boshqa"],
};

function AgentCreatePage() {
  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState<Phase>("hero");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [followUp, setFollowUp] = useState("");
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [agentName, setAgentName] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, phase]);

  // Birinchi qurish bosqichi — 1..2 va aniqlashtirish savolgacha.
  useEffect(() => {
    if (phase !== "building") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    at(200, () => setActiveStep(0));
    at(700, () =>
      setMessages((m) => [
        ...m,
        { role: "brain", text: "Maqsadingizni tushundim. Kerakli toollarni tanlayapman…" },
      ]),
    );
    at(1500, () => {
      setActiveStep(1);
      setRevealed((r) => {
        const n = new Set(r);
        n.add("name");
        return n;
      });
    });
    at(2300, () =>
      setRevealed((r) => {
        const n = new Set(r);
        n.add("description");
        return n;
      }),
    );
    at(3100, () =>
      setRevealed((r) => {
        const n = new Set(r);
        n.add("tools");
        return n;
      }),
    );
    at(3700, () => {
      setMessages((m) => [
        ...m,
        { role: "brain", text: clarifyQuestion.text, choices: clarifyQuestion.choices },
      ]);
      setPhase("clarify");
    });

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const continueAfterClarify = () => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    at(300, () => {
      setActiveStep(2);
      setRevealed((r) => {
        const n = new Set(r);
        n.add("codex");
        return n;
      });
    });
    at(1100, () => {
      setActiveStep(3);
      setRevealed((r) => {
        const n = new Set(r);
        n.add("memory");
        return n;
      });
    });
    at(1900, () => {
      setActiveStep(4);
      setRevealed((r) => {
        const n = new Set(r);
        n.add("workflow");
        return n;
      });
    });
    at(2700, () => {
      setActiveStep(5);
      setRevealed((r) => {
        const n = new Set(r);
        n.add("capabilities");
        return n;
      });
    });
    at(3500, () => {
      setActiveStep(6);
      setMessages((m) => [
        ...m,
        { role: "brain", text: "Agent tayyor. O'ng tomonda ko'rib chiqishingiz mumkin." },
      ]);
      setPhase("done");
    });
  };

  const handleSubmit = () => {
    const text = prompt.trim();
    if (!text || phase !== "hero") return;
    setMessages([
      { role: "user", text },
      {
        role: "brain",
        text: "So'rovingizni oldim. Eslatma: bu demo simulyatsiya — AI backend hali ulanmagan.",
      },
    ]);
    setAgentName(text.length > 40 ? `${text.slice(0, 40)}…` : text);
    setPrompt("");
    setPhase("building");
  };

  const handleChoice = (choice: string) => {
    setMessages((m) => {
      const copy = [...m];
      for (let i = copy.length - 1; i >= 0; i--) {
        const msg = copy[i];
        if (msg.role === "brain" && msg.choices && !msg.answered) {
          copy[i] = { ...msg, answered: choice };
          break;
        }
      }
      copy.push({ role: "user", text: choice });
      return copy;
    });
    continueAfterClarify();
  };

  const sendFollowUp = () => {
    const text = followUp.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "brain",
        text: "Qabul qilindi. (Demo — javoblar hali stsenariy asosida.)",
      },
    ]);
    setFollowUp("");
  };

  const isSplit = phase !== "hero";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-background md:flex">
        <div className="px-6 py-6">
          <Link to="/" className="inline-flex items-baseline">
            <img src={wordmark} alt="AGENTUS" className="h-7 w-auto" draggable={false} />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(({ icon: Icon, label, active }) =>
            active ? (
              <span
                key={label}
                className="flex items-center gap-3 rounded-md bg-primary/15 px-3 py-2.5 text-sm font-medium text-foreground"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </span>
            ) : (
              <button
                key={label}
                type="button"
                disabled
                title="Bu bo'lim hali ishlab chiqilmoqda"
                className="flex w-full cursor-not-allowed items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground opacity-60"
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ),
          )}
        </nav>

        <div className="border-t border-border/60 px-6 py-5 text-xs text-muted-foreground">
          Platforma ishlab chiqilmoqda. Hisob va rejalar tizimi hali ulanmagan.
        </div>
      </aside>

      {/* Main */}
      <main className="relative isolate flex-1 overflow-hidden">
        {/* Katta qizil sayyora — pastdagi horizont */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[45vh] sm:h-[52vh] lg:h-[60vh]">
          <img src={heroPlanet} alt="" className="h-full w-full object-cover object-top" />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-background via-background/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <div
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 15%, oklch(0.22 0.14 25 / 0.55), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 10%, oklch(0.14 0.08 25 / 0.3), transparent 65%), var(--background)",
          }}
        />

        <img
          src={planetSmall}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -z-10 hidden opacity-90 md:block md:-right-20 md:top-[42%] md:w-56 md:-translate-y-1/2 lg:-right-28 lg:w-72 xl:-right-32 xl:w-80"
          style={{ filter: "drop-shadow(0 0 60px oklch(0.5 0.2 25 / 0.6))" }}
        />

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5">
          <button
            type="button"
            disabled
            title="Agent yaratish jarayoni hali sozlanmagan"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm opacity-70 backdrop-blur"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/20 text-primary text-[10px]">
              ◆
            </span>
            Agent yaratish
            <ChevronDown className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {isSplit && (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-wide text-primary">
                Demo simulyatsiya
              </span>
            )}
            <button
              type="button"
              disabled
              title="Yordam markazi hali tayyor emas"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm opacity-70 backdrop-blur"
            >
              <HelpCircle className="h-4 w-4" />
              Yordam markazi
            </button>
          </div>
        </div>

        {/* Hero — yuborilmaguncha ko'rinadi */}
        <div
          className={`mx-auto flex max-w-4xl flex-col items-center px-6 text-center transition-all duration-500 ${
            isSplit
              ? "pointer-events-none max-h-0 -translate-y-4 overflow-hidden opacity-0"
              : "pt-8 opacity-100"
          }`}
        >
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            <span className="text-primary">Agentus</span> bilan yarating
          </h1>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            Oddiy tilda yozing — Agentus platformasi hali ishlab chiqilmoqda,
            tez orada agentlar yaratish imkoniyati ochiladi.
          </p>

          <div className="mt-8 w-full rounded-2xl border border-border bg-card/80 p-4 backdrop-blur">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Agentingiz qanday bo'lishini yozing..."
              rows={3}
              className="w-full resize-none bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled
                  title="Fayl biriktirish hali ulanmagan"
                  className="grid h-9 w-9 cursor-not-allowed place-items-center rounded-md border border-border text-muted-foreground opacity-70"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled
                  title="Fayl biriktirish hali ulanmagan"
                  className="grid h-9 w-9 cursor-not-allowed place-items-center rounded-md border border-border text-muted-foreground opacity-70"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                title="Demo simulyatsiyani boshlash"
                className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 w-full text-left">
            <p className="mb-3 text-xs text-muted-foreground">Namuna promptlar:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {examples.map(({ icon: Icon, text }) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => setPrompt(text)}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-primary/60 hover:bg-card"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Split view — yuborishdan keyin */}
        {isSplit && (
          <div className="grid animate-fade-in gap-4 px-4 pb-6 md:px-6 lg:grid-cols-[35%_1fr]">
            {/* Chap: suhbat */}
            <section className="flex h-[calc(100vh-160px)] flex-col rounded-2xl border border-border bg-card/70 backdrop-blur">
              <header className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary">
                  <Brain className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Agentus Brain</p>
                  <p className="text-[11px] text-muted-foreground">Suhbat orqali yaratish (demo)</p>
                </div>
              </header>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((m, i) => (
                  <div key={i} className="animate-fade-in">
                    {m.role === "user" ? (
                      <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
                        {m.text}
                      </div>
                    ) : (
                      <div className="max-w-[95%] text-sm text-foreground">
                        <p>{m.text}</p>
                        {m.choices && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {m.choices.map((c) => {
                              const isPicked = m.answered === c;
                              const disabled = Boolean(m.answered);
                              return (
                                <button
                                  key={c}
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => handleChoice(c)}
                                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                                    isPicked
                                      ? "border-primary bg-primary/15 text-primary"
                                      : disabled
                                        ? "border-border/50 text-muted-foreground opacity-60"
                                        : "border-border hover:border-primary/60 hover:bg-card"
                                  }`}
                                >
                                  {c}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t border-border/60 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2">
                  <input
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendFollowUp();
                      }
                    }}
                    placeholder="Xabar yozing…"
                    className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={sendFollowUp}
                    disabled={!followUp.trim()}
                    className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* O'ng: builder ish maydoni */}
            <section className="flex h-[calc(100vh-160px)] flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-card/70 p-5 backdrop-blur">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Yaratish jarayoni</h2>
                  <span className="text-[11px] text-muted-foreground">
                    {Math.min(Math.max(activeStep, 0) + (phase === "done" ? 0 : 1), buildSteps.length)}/
                    {buildSteps.length}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {buildSteps.map((s, i) => {
                    const done = i < activeStep || phase === "done";
                    const active = i === activeStep && phase !== "done";
                    return (
                      <li
                        key={s.key}
                        className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
                          active
                            ? "border-primary/50 bg-primary/5 text-foreground"
                            : done
                              ? "border-border/60 text-foreground"
                              : "border-border/40 text-muted-foreground"
                        }`}
                      >
                        <span className="grid h-5 w-5 place-items-center">
                          {done ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : active ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 opacity-50" />
                          )}
                        </span>
                        <span>{s.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Jonli ko'rib chiqish</h3>
                  <span className="ml-auto rounded-full border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                    Demo ma'lumot
                  </span>
                </div>

                <div className="space-y-3">
                  <PreviewRow revealed={revealed.has("name")} label="Agent nomi">
                    <p className="text-sm">{agentName || "—"}</p>
                  </PreviewRow>
                  <PreviewRow revealed={revealed.has("description")} label="Tavsif">
                    <p className="text-sm text-muted-foreground">
                      Foydalanuvchi so'roviga asoslangan tavsif shu yerda paydo bo'ladi.
                    </p>
                  </PreviewRow>
                  <PreviewRow revealed={revealed.has("tools")} label="Tanlangan vositalar">
                    <div className="flex flex-wrap gap-1.5">
                      {["Xabar yuborish", "Jadval", "Rejalashtiruvchi"].map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border/60 bg-card px-2 py-0.5 text-[11px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </PreviewRow>
                  <PreviewRow revealed={revealed.has("codex")} label="Kodex">
                    <p className="text-xs text-muted-foreground">
                      Agentning qoidalari va chegaralari (rejalashtirilgan).
                    </p>
                  </PreviewRow>
                  <PreviewRow revealed={revealed.has("memory")} label="Xotira">
                    <p className="text-xs text-muted-foreground">
                      Qisqa va uzoq muddatli xotira (rejalashtirilgan).
                    </p>
                  </PreviewRow>
                  <PreviewRow revealed={revealed.has("workflow")} label="Ish oqimi">
                    <p className="text-xs text-muted-foreground">
                      Qadamlar ketma-ketligi (rejalashtirilgan).
                    </p>
                  </PreviewRow>
                  <PreviewRow revealed={revealed.has("capabilities")} label="Imkoniyatlar">
                    <p className="text-xs text-muted-foreground">
                      Agent nima qila oladi (rejalashtirilgan).
                    </p>
                  </PreviewRow>
                </div>
              </div>

              {phase === "done" && (
                <div className="animate-fade-in rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <p className="text-sm font-medium">Agent muvaffaqiyatli yaratildi.</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled
                      title="Sinov muhiti hali ulanmagan"
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs opacity-70"
                    >
                      <Play className="h-3.5 w-3.5" /> Sinov agenti
                    </button>
                    <button
                      type="button"
                      disabled
                      title="Tahrirlash oqimi hali ulanmagan"
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs opacity-70"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Tahrirlash
                    </button>
                    <button
                      type="button"
                      disabled
                      title="Faollashtirish backendi hali ulanmagan"
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground opacity-80"
                    >
                      <Power className="h-3.5 w-3.5" /> Faollashtirish
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Bu jarayon demo simulyatsiya. Haqiqiy agent yaratish backendi hali ulanmagan.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Feature bar — faqat hero holatida */}
        {!isSplit && (
          <div className="mt-16 border-t border-border/60 bg-background/70 px-8 py-5 backdrop-blur">
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {featureBar.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PreviewRow({
  revealed,
  label,
  children,
}: {
  revealed: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`transition-all duration-500 ${
        revealed ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
      }`}
    >
      <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}