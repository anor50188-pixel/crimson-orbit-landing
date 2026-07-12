import { createFileRoute } from "@tanstack/react-router";
import heroPlanet from "@/assets/hero-planet.jpg";
import {
  ArrowUp,
  Paperclip,
  Plus,
  Send,
  Instagram,
  MessageCircle,
  FileSpreadsheet,
  ShieldCheck,
  Clock,
  Infinity as InfinityIcon,
  Sparkles,
  Zap,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

const examples = [
  { icon: Send, text: "Telegram orqali hisobot yig'uvchi agent yarat" },
  { icon: Instagram, text: "Instagram postlar tayyorlovchi agent" },
  { icon: MessageCircle, text: "Mijozlar bilan avtomatik muloqot qiluvchi bot" },
  { icon: FileSpreadsheet, text: "Excel fayllar bilan ishlovchi agent" },
];

const features = [
  { icon: ShieldCheck, title: "100% xavfsiz", desc: "Ma'lumotlaringiz shifrlangan va himoyalangan" },
  { icon: Clock, title: "24/7 ishlaydi", desc: "Siz uxlaganda ham agentingiz ishlaydi" },
  { icon: InfinityIcon, title: "Cheksiz imkoniyatlar", desc: "Toollar va integratsiyalar bilan kengaytiring" },
];

const capabilities = [
  {
    icon: Sparkles,
    title: "Tabiiy tilda ta'riflang",
    desc: "Kod yozmasdan, oddiy o'zbek tilida agentingiz nima qilishi kerakligini yozing. Agentus qolgan hammasini o'zi bajaradi.",
  },
  {
    icon: Zap,
    title: "Bir daqiqada ishga tushiring",
    desc: "Yaratishdan foydalanishgacha bir necha soniya. Telegram, WhatsApp, Instagram va boshqa platformalarga bir tugma bilan ulanadi.",
  },
  {
    icon: Layers,
    title: "50+ integratsiya",
    desc: "Google, Notion, Slack, Excel, CRM tizimlari va yuzlab boshqa xizmatlar bilan bevosita ishlaydi.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="relative z-30 border-b border-border/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-baseline gap-1">
            <span className="text-2xl font-black italic tracking-tight">AGENTUS</span>
            <span className="text-primary">.</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#imkoniyatlar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Imkoniyatlar</a>
            <a href="#misollar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Misollar</a>
            <a href="#narxlar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Narxlar</a>
            <a href="#yordam" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Yordam</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#kirish" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline">Kirish</a>
            <a
              href="#boshlash"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
            >
              Boshlash
            </a>
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/3 -z-10">
          <img
            src={heroPlanet}
            alt=""
            width={1920}
            height={1280}
            className="h-full w-full object-cover object-top opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background/80" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--gradient-radial-red)" }} />

        <div className="mx-auto max-w-5xl px-6 pb-24 pt-24 text-center md:pt-32">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            Yangi — eng so'nggi AI modellari asosida
          </div>

          <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
              Agentus
            </span>{" "}
            bilan yarating
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
            Oddiy tilda yozing — Agentus siz uchun aqlli agentni yaratadi. Kod yo'q, sozlash yo'q, faqat natija.
          </p>

          <div className="mx-auto mt-12 max-w-3xl">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 shadow-[var(--shadow-elegant)] backdrop-blur-xl transition-all focus-within:border-primary/60 focus-within:shadow-[var(--shadow-glow)]">
              <textarea
                rows={2}
                placeholder="Agentingiz qanday bo'lishini yozing..."
                className="w-full resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground">
                    <Plus className="h-4 w-4" />
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground">
                    <Paperclip className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground">
                    Yaratish rejimi
                  </button>
                  <button
                    aria-label="Yuborish"
                    className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
                  >
                    <ArrowUp className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div id="misollar" className="mt-10 text-left">
              <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Misol uchun</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {examples.map(({ icon: Icon, text }) => (
                  <button
                    key={text}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 text-left text-sm text-muted-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card hover:text-foreground"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-background/40 text-primary transition-colors group-hover:border-primary/40">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="truncate">{text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-background/40 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="imkoniyatlar" className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-widest text-primary">Imkoniyatlar</p>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            G'oyadan ishlab chiqarishga <span className="text-primary">bir daqiqada</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Agentus — bu shunchaki chatbot emas. Bu sizning biznesingiz uchun avtonom aqlli xodim.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:bg-primary/20" />
              <span className="relative grid h-12 w-12 place-items-center rounded-xl border border-border bg-background/40 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="relative mt-6 text-xl font-semibold">{title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="boshlash" className="relative overflow-hidden border-t border-border/60">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--gradient-radial-red)" }} />
        <div className="mx-auto max-w-4xl px-6 py-28 text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Birinchi agentingizni <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
              bugun yarating
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Bepul boshlang. Kredit kartasi kerak emas. Bir daqiqada ishga tushadi.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
            >
              Bepul boshlash
            </a>
            <a
              href="#narxlar"
              className="rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:bg-card"
            >
              Narxlarni ko'rish
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black italic tracking-tight text-foreground">AGENTUS</span>
            <span className="text-primary">.</span>
          </div>
          <p>© 2026 Agentus. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-foreground">Maxfiylik</a>
            <a href="#" className="transition-colors hover:text-foreground">Shartlar</a>
          </div>
        </div>
      </footer>
    </div>
  );
}