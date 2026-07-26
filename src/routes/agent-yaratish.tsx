import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Home,
  Bot,
  Store,
  Wrench,
  Wallet,
  Settings,
  ChevronRight,
  Send,
  Instagram,
  MessageCircle,
  FileSpreadsheet,
  Brain,
  Box,
  User,
  Crown,
  Share2,
  Upload,
  MessageSquare,
} from "lucide-react";

import heroPlanet from "@/assets/hero-planet.jpg";
import wordmark from "@/assets/agentus-wordmark.png";

export const Route = createFileRoute("/agent-yaratish")({
  component: AgentCreatePage,
  head: () => ({
    meta: [
      { title: "Agent yaratish — Agentus" },
      {
        name: "description",
        content:
          "Agentus'da yangi AI agent yaratish. Suhbat orqali agent qurish demo simulyatsiyasi.",
      },
    ],
  }),
});

const navItems = [
  { icon: Home, label: "Asosiy", active: true },
  { icon: Bot, label: "Agentlarim" },
  { icon: Store, label: "Marketplace" },
  { icon: Wrench, label: "Mening toollarim", to: "/mening-toollarim" as const },
  { icon: Crown, label: "Sotuvchi paneli", to: "/seller" as const },
  { icon: Wallet, label: "To'lovlar" },
  { icon: Settings, label: "Sozlamalar" },
];

const examples = [
  { icon: Send, text: "Telegram orqali hisobot yig'uvchi agent yarat" },
  { icon: Instagram, text: "Instagram postlar tayyorlovchi agent" },
  { icon: MessageCircle, text: "Mijozlar bilan avtomatik muloqot qiluvchi bot" },
  { icon: FileSpreadsheet, text: "Excel fayllar bilan ishlovchi agent" },
];

type ChatMessage = { role: "user" | "brain"; text: string; time: string };
type Phase = "hero" | "building";

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function AgentCreatePage() {
  return <AgentCreatePageInner />;
}

function AgentCreatePageInner() {
  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState<Phase>("hero");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [followUp, setFollowUp] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, phase]);

  const handleSubmit = () => {
    const text = prompt.trim();
    if (!text || phase !== "hero") return;
    const t = nowTime();
    setMessages([
      { role: "user", text, time: t },
      {
        role: "brain",
        text: "Demo rejim — hozircha haqiqiy AI ulanmagan. Bu yerda Agentus Brain sizning promtingiz asosida jonli agent qurgan bo'lardi va natija chap tomonda paydo bo'ladi.",
        time: t,
      },
    ]);
    setPrompt("");
    setPhase("building");
  };

  const sendFollowUp = () => {
    const text = followUp.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { role: "user", text, time: nowTime() },
      {
        role: "brain",
        text: "Qabul qilindi. (Demo — hozircha haqiqiy AI ulanmagan.)",
        time: nowTime(),
      },
    ]);
    setFollowUp("");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* SIDEBAR */}
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-border/60 bg-background lg:flex">
        <div className="px-6 py-6">
          <Link to="/" className="inline-flex">
            <img src={wordmark} alt="AGENTUS" className="h-6 w-auto" draggable={false} />
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map(({ icon: Icon, label, active }) => {
            if (active) {
              return (
                <span
                  key={label}
                  className="flex items-center gap-3 rounded-lg bg-primary/15 px-3 py-2.5 text-sm font-medium text-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </span>
              );
            }
            if (label === "Agentlarim") {
              return (
                <Link
                  key={label}
                  to="/agentlarim"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-card/60 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            }
            if (label === "Mening toollarim") {
              return (
                <Link
                  key={label}
                  to="/mening-toollarim"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-card/60 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            }
            if (label === "Sotuvchi paneli") {
              return (
                <Link
                  key={label}
                  to="/seller"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-card/60 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            }
            return (
              <button
                key={label}
                type="button"
                disabled
                title="Bu bo'lim hali ishlab chiqilmoqda"
                className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground opacity-70 hover:opacity-100"
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Pro Plan card (demo — plan tizimi hali ulanmagan) */}
        <div className="mx-3 mb-3 rounded-xl border border-border/60 bg-card/60 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Box className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Pro Plan</p>
            <span className="ml-auto rounded border border-border/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">
              Demo
            </span>
          </div>
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
            Barcha premium imkoniyatlardan foydalaning.
          </p>
          <button
            type="button"
            disabled
            title="To'lov tizimi hali ulanmagan"
            className="w-full cursor-not-allowed rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground opacity-80"
          >
            Rejani yangilash
          </button>
        </div>

        {/* User profile (demo hisob) */}
        <div className="border-t border-border/60 px-3 py-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
              <User className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Azizbek</p>
              <p className="truncate text-[11px] text-muted-foreground">Demo hisob</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 px-2">
            <div className="h-1 w-full overflow-hidden rounded-full bg-border/60">
              <div className="h-full w-[0%] bg-primary" />
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">0 / 0 agent (demo)</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="relative isolate flex flex-1 flex-col overflow-hidden">
        {/* Planet horizon */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55vh]">
          <img
            src={heroPlanet}
            alt=""
            className="h-full w-full object-cover object-top"
            style={{
              filter:
                "saturate(1.65) contrast(1.12) brightness(1.08) hue-rotate(-12deg)",
              opacity: 0.55,
            }}
            draggable={false}
          />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-background via-background/70 to-transparent" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 50% 105%, oklch(0.58 0.22 25 / 0.35), transparent 65%), radial-gradient(ellipse 60% 50% at 90% 10%, oklch(0.22 0.14 25 / 0.5), transparent 60%), var(--background)",
          }}
        />

        {/* TOP BAR — Lovable-style */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex lg:hidden">
              <img src={wordmark} alt="AGENTUS" className="h-5 w-auto" draggable={false} />
            </Link>
            <span className="hidden rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary lg:inline-flex">
              Demo simulyatsiya
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              title="Ulashish funksiyasi hali ulanmagan"
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button
              type="button"
              disabled
              title="Publish funksiyasi hali ulanmagan"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload className="h-4 w-4" />
              Publish
            </button>
          </div>
        </div>

        {/* HERO */}
        {phase === "hero" && (
          <div className="relative mx-auto flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 py-1.5 pl-1.5 pr-4 text-sm text-primary backdrop-blur">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                Demo
              </span>
              <span>Agent yaratish simulyatsiyasi</span>
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Qanday agent quramiz, Azizbek?
            </h1>

            {/* Prompt box */}
            <div className="mt-10 w-full max-w-2xl rounded-3xl border border-border bg-card/80 p-4 shadow-2xl shadow-black/40 backdrop-blur">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Agentusdan hisobot yig'uvchi agent qurishni so'rang..."
                rows={2}
                className="w-full resize-none bg-transparent px-2 py-2 text-left text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  Yaratish
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Example chips */}
            <div className="mt-6 flex w-full max-w-2xl flex-wrap justify-center gap-2">
              {examples.map(({ icon: Icon, text }) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => setPrompt(text)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition-colors hover:border-primary/60 hover:text-foreground"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SPLIT VIEW: preview left, chat right */}
        {phase !== "hero" && (
          <div className="grid flex-1 gap-0 overflow-hidden lg:grid-cols-[1fr_420px]">
            {/* PREVIEW PANEL */}
            <section className="relative flex min-h-0 flex-col items-center justify-center overflow-hidden p-8">
              <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
              </div>
              <div className="relative flex flex-col items-center text-center">
                <span className="relative grid h-20 w-20 place-items-center rounded-full border border-primary/40 bg-primary/10">
                  <span className="absolute inset-0 animate-ping rounded-full border border-primary/40" />
                  <Brain className="h-8 w-8 text-primary" />
                </span>
                <h2 className="mt-6 text-xl font-semibold tracking-tight">
                  Agentus Brain ishlayapti…
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Sizning agentingiz shu yerda jonli qurilib boradi. Natija tayyor bo'lgach,
                  bu maydonda paydo bo'ladi.
                </p>
                <div className="mt-6 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                </div>
              </div>
            </section>

            {/* CHAT PANEL */}
            <section className="flex h-full min-h-0 flex-col border-l border-border/60 bg-card/60 backdrop-blur">
              <header className="flex items-center gap-3 border-b border-border/60 px-4 py-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
                  <Brain className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">Agentus Brain</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Online
                  </p>
                </div>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                {messages.map((m, i) => (
                  <div key={i} className="animate-fade-in">
                    {m.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-primary/50 bg-primary/10 px-3.5 py-2 text-sm text-foreground">
                          <p className="whitespace-pre-wrap">{m.text}</p>
                          <p className="mt-1 text-right text-[10px] text-muted-foreground">
                            {m.time}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                          <Brain className="h-3.5 w-3.5" />
                        </span>
                        <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border/60 bg-background/50 px-3.5 py-2 text-sm">
                          <p className="whitespace-pre-wrap">{m.text}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">{m.time}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-border/60 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2">
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendFollowUp();
                      }
                    }}
                    placeholder="Xabaringizni yozing..."
                    className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={sendFollowUp}
                    disabled={!followUp.trim()}
                    className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
