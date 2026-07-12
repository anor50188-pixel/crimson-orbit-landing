import { createFileRoute } from "@tanstack/react-router";
import heroPlanet from "@/assets/hero-planet.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="relative z-30 border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-baseline gap-1">
            <span className="text-2xl font-black italic tracking-tight">AGENTUS</span>
            <span className="text-primary">.</span>
          </a>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            Ishlab chiqilmoqda
          </span>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/3 -z-10">
          <img
            src={heroPlanet}
            alt=""
            width={1920}
            height={1280}
            className="h-full w-full object-cover object-top opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-32 pt-24 text-center md:pt-32">
          <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              Agentus
            </span>{" "}
            bilan yarating
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            Oddiy tilda yozing — Agentus siz uchun aqlli agentni yaratadi.
          </p>

          <div className="mx-auto mt-16 max-w-xl rounded-2xl border border-border bg-card/70 p-8 text-left backdrop-blur-xl">
            <p className="text-xs uppercase tracking-widest text-primary">Hozirgi holat</p>
            <h2 className="mt-2 text-lg font-semibold">Platforma ishlab chiqilmoqda</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Agentus hali ochiq foydalanish uchun tayyor emas. Ishga tushish
              haqida xabar olish uchun ushbu sahifani belgilab qo'ying — yangilanishlar
              shu yerda paydo bo'ladi.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-muted-foreground">
          © 2026 Agentus
        </div>
      </footer>
    </div>
  );
}