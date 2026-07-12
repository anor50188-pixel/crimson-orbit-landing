import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
          "Agentus'da yangi AI agent yaratish sahifasi. Platforma hali ishlab chiqilmoqda.",
      },
    ],
  }),
});

// Chap panel elementlari. Hech biri hali ochilgan sahifaga ega emas —
// shuning uchun barchasi aria-disabled va tooltip bilan belgilangan.
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

// Namuna promptlar — bosilganda textarea ga yoziladi (haqiqiy ish).
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

function AgentCreatePage() {
  const [prompt, setPrompt] = useState("");

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
      <main className="relative flex-1 overflow-hidden">
        {/* Planet background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55vh]">
          <img
            src={heroPlanet}
            alt=""
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background/95" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        </div>

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

        {/* Hero */}
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            <span className="text-primary">Agentus</span> bilan yarating
          </h1>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            Oddiy tilda yozing — Agentus platformasi hali ishlab chiqilmoqda,
            tez orada agentlar yaratish imkoniyati ochiladi.
          </p>

          {/* Prompt box */}
          <div className="mt-8 w-full rounded-2xl border border-border bg-card/80 p-4 backdrop-blur">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
                disabled
                title="AI backend hali ulanmagan"
                className="grid h-10 w-10 cursor-not-allowed place-items-center rounded-full bg-primary text-primary-foreground opacity-70"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Examples */}
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

        {/* Feature bar */}
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
      </main>
    </div>
  );
}