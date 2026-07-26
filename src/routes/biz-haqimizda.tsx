import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Shield, Users, Rocket } from "lucide-react";
import heroPlanet from "@/assets/hero-planet.jpg";
import wordmark from "@/assets/agentus-wordmark.png";

export const Route = createFileRoute("/biz-haqimizda")({
  head: () => ({
    meta: [
      { title: "Biz haqimizda — Agentus" },
      { name: "description", content: "Agentus — oddiy tilda AI agentlar yaratish platformasi. Bizning maqsad, vazifalarni avtomatlashtirishni har qanday foydalanuvchi uchun oson va tushunarli qilish." },
      { property: "og:title", content: "Biz haqimizda — Agentus" },
      { property: "og:description", content: "Agentus — oddiy tilda AI agentlar yaratish platformasi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BizHaqimizda,
});

const values = [
  {
    icon: Sparkles,
    title: "Oddiylik",
    desc: "Kod yoki murakkab sozlamalarsiz, faqatgina tabiiy til orqali agent yaratish.",
  },
  {
    icon: Shield,
    title: "Xavfsizlik",
    desc: "Foydalanuvchi ma'lumotlari va ulanishlar xavfsiz saqlanadi.",
  },
  {
    icon: Users,
    title: "Hamjamiyat",
    desc: "Agentlaringizni Marketplace'da ulashing va boshqalarning ishini osonlashtiring.",
  },
  {
    icon: Rocket,
    title: "Tezlik",
    desc: "G'oyadan ishlaydigan agentga atigi bir necha daqiqa.",
  },
];

function BizHaqimizda() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="relative z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-baseline gap-0.5">
            <span className="text-xl font-black italic tracking-tight">AGENTUS</span>
            <span className="text-primary">.</span>
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Bosh sahifa
            </Link>
            <a href="/#xususiyatlar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Xususiyatlar
            </a>
            <Link
              to="/biz-haqimizda"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Biz haqimizda
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70vh]">
          <img
            src={heroPlanet}
            alt=""
            width={1920}
            height={1280}
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background/90" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        </div>

        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-32 pt-16 text-center md:pt-24">
          <img
            src={wordmark}
            alt="AGENTUS"
            width={1600}
            height={544}
            className="w-full max-w-2xl select-none"
            draggable={false}
          />
          <h1 className="mt-8 text-3xl font-bold tracking-tight md:text-4xl">
            Biz haqimizda
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-foreground/90 md:text-xl">
            <span className="text-primary">Agentus</span> — oddiy tilda yozib, aqlli AI agentlar yaratish platformasi.
            Bizning maqsadimiz: texnologiyani har kimga ochiq va foydali qilish.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="mb-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
            Asosiy qadriyatlar
          </p>
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back link */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Bosh sahifaga qaytish
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-muted-foreground">
          © 2026 Agentus — ishlab chiqilmoqda
        </div>
      </footer>
    </div>
  );
}
