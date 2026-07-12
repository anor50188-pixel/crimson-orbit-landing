import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, Wrench, ShieldCheck, Store } from "lucide-react";
import heroPlanet from "@/assets/hero-planet.jpg";
import wordmark from "@/assets/agentus-wordmark.png";

export const Route = createFileRoute("/")({
  component: Landing,
});

// Rejalashtirilgan MVP xususiyatlari. Hech qanday raqam yoki tasdiqlanmagan da'volar yo'q.
const features = [
  {
    icon: Bot,
    title: "AI agentlar yarating",
    desc: "Kod yozmasdan, tabiiy tilda agent yarating.",
  },
  {
    icon: Wrench,
    title: "Kuchli toollar",
    desc: "Agentingizni tashqi API va toollar bilan bog'lang.",
  },
  {
    icon: ShieldCheck,
    title: "Xavfsiz va masshtablanuvchi",
    desc: "Ma'lumotlaringiz shifrlangan holda saqlanadi.",
  },
  {
    icon: Store,
    title: "Marketplace",
    desc: "Agentlaringizni ulashing va topib ishlating.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav — faqat sahifa ichidagi anchorlar, mavjud bo'lmagan sahifalarga link yo'q */}
      <header className="relative z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <a href="#top" className="flex items-baseline gap-0.5">
            <span className="text-xl font-black italic tracking-tight">AGENTUS</span>
            <span className="text-primary">.</span>
          </a>
          <nav className="hidden items-center gap-10 md:flex">
            <a href="#xususiyatlar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Xususiyatlar
            </a>
            <a href="#holat" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Holat
            </a>
          </nav>
          <span
            aria-disabled="true"
            className="cursor-not-allowed rounded-md bg-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground opacity-70"
            title="Ro'yxatdan o'tish hali ochiq emas"
          >
            Tez orada
          </span>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative isolate overflow-hidden">
        {/* Planet horizon */}
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

        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-40 pt-16 text-center md:pt-24">
          <img
            src={wordmark}
            alt="AGENTUS"
            width={1600}
            height={544}
            className="w-full max-w-4xl select-none"
            draggable={false}
          />

          <p className="mt-6 max-w-2xl text-balance text-lg text-foreground/90 md:text-xl">
            <span className="text-primary">AI agentlar</span> yarating. Biznesingizni quring.{" "}
            <span className="text-primary">Avtomatlashtiring</span>.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground opacity-70"
              title="Bu funksiya hali ishlab chiqilmoqda"
            >
              Birinchi agentni yarating
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-border bg-background/40 px-6 py-3.5 text-sm font-semibold text-foreground opacity-70 backdrop-blur"
              title="Marketplace hali ochiq emas"
            >
              Marketplace'ni ko'rish
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <p id="holat" className="mt-6 text-xs text-muted-foreground">
            Platforma ishlab chiqilmoqda — tugmalar hali faol emas.
          </p>
        </div>
      </section>

      {/* Rejalashtirilgan xususiyatlar */}
      <section id="xususiyatlar" className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="mb-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
            Rejalashtirilgan xususiyatlar
          </p>
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }) => (
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

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-muted-foreground">
          © 2026 Agentus — ishlab chiqilmoqda
        </div>
      </footer>
    </div>
  );
}