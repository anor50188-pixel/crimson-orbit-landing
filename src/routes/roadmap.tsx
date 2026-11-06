import { WorkspaceCosmos } from '@/components/workspace-cosmos';
import { CosmicEnding } from '@/components/cosmic-ending';
import { LanguageSwitcher } from '@/components/language-switcher';
import { t as translate, localized, useI18n, getLocale, formatNumber, relativeTime, plural } from '@/i18n';
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, CircleDashed, Target } from "lucide-react";
import heroPlanet from "@/assets/hero-planet.jpg";
import wordmark from "@/assets/agentus-wordmark.png";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: translate("app.common.agentus_development_roadmap_agentus") },
      { name: "description", content: translate("app.common.agentus_rivojlanish_yol_xaritasi_bugun_mavjud") },
      { property: "og:title", content: translate("app.common.agentus_development_roadmap_agentus") },
      { property: "og:description", content: translate("app.common.agentus_rivojlanish_yol_xaritasi_bugun_mavjud") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Roadmap,
});

const phases = localized(() => ([
  {
    status: "available",
    label: translate("app.common.mavjud"),
    title: translate("app.common.joriy_mvp"),
    icon: CheckCircle2,
    items: [
      translate("app.common.suniy_intellekt_agentini_yaratish"),
      translate("app.common.ai_jamoasini_yaratish"),
      translate("app.common.asbob_ulanishi"),
      translate("app.common.maxsus_agent_boshqaruv_paneli"),
      translate("app.common.agent_kodeksi"),
      translate("app.common.agentning_ishlash_vaqti"),
      translate("app.common.agentlarni_boshqarish"),
    ],
  },
  {
    status: "in-progress",
    label: translate("app.common.ishlab_chiqilmoqda"),
    title: translate("app.common.hozirda_qurilmoqda"),
    icon: Clock,
    items: [
      translate("app.common.asboblar_bozori"),
      translate("app.common.247_ish_vaqti"),
      translate("app.common.model_router"),
      translate("app.common.jamoa_orkestri"),
      "Tahlil",
      translate("app.common.bilimlar_markazi"),
      translate("app.common.mcp_integratsiyasi"),
    ],
  },
  {
    status: "planned",
    label: translate("app.agents.rejalashtirilgan"),
    title: translate("app.common.kelajak_uchun_rejalashtirilgan"),
    icon: CircleDashed,
    items: [
      translate("app.common.agent_bozori"),
      translate("app.common.mening_kompyuterim"),
      translate("app.common.ish_stoli_sinxronizatsiyasi"),
      translate("app.common.mobil_ilova"),
      translate("app.common.mahalliy_ai_ish_vaqti"),
      translate("app.common.suniy_intellekt_kompaniyasi_generatori"),
      translate("app.common.biznes_shablonlari"),
      translate("app.common.korxona_ish_maydoni"),
      translate("app.common.gumanoid_robototexnika_integratsiyasi"),
    ],
  },
]));

const statusMeta: Record<
  string,
  { dot: string; border: string; bg: string; text: string; iconColor: string }
> = {
  available: {
    dot: "bg-status-available",
    border: "border-status-available/30",
    bg: "bg-status-available/10",
    text: "text-status-available",
    iconColor: "text-status-available",
  },
  "in-progress": {
    dot: "bg-status-in-progress",
    border: "border-status-in-progress/30",
    bg: "bg-status-in-progress/10",
    text: "text-status-in-progress",
    iconColor: "text-status-in-progress",
  },
  planned: {
    dot: "bg-status-planned",
    border: "border-status-planned/30",
    bg: "bg-status-planned/10",
    text: "text-status-planned",
    iconColor: "text-status-planned",
  },
};

function Roadmap() {
  useI18n();
  return (
    <div className="cosmic-page min-h-screen bg-background text-foreground overflow-x-hidden">
      <WorkspaceCosmos continuous/><LanguageSwitcher/>{/* Header */}
      <header className="relative z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-baseline gap-0.5">
            <span className="text-xl font-black italic tracking-tight">AGENTUS</span>
            <span className="text-primary">.</span>
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {translate("app.common.bosh_sahifa")}</Link>
            <a href="/#xususiyatlar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {translate("app.common.xususiyatlar")}</a>
            <Link
              to="/biz-haqimizda"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {translate("app.common.biz_haqimizda")}</Link>
            <Link
              to="/roadmap"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {translate("app.common.yol_xaritasi")}</Link>
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

        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-12 text-center md:pt-20">
          <img
            src={wordmark}
            alt="AGENTUS"
            width={1600}
            height={544}
            className="w-full max-w-2xl select-none"
            draggable={false}
          />
          <h1 className="mt-8 text-3xl font-bold tracking-tight md:text-4xl">
            {translate("app.common.agentus_development_roadmap")}</h1>
          <p className="mt-4 max-w-2xl text-balance text-xl text-foreground/90 md:text-2xl">
            {translate("app.common.suniy_intellekt_sohasidagi_ishlarning_kelajagini_qurish")}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="relative border-t border-border/60 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <p className="text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            {translate("app.common.agentus_bosqichmabosqich_quriladi_biz_avval_barqaror")}</p>
          <p className="mt-4 text-balance text-sm leading-relaxed text-muted-foreground">
            {translate("app.common.chiqarilgan_har_bir_xususiyat_keyingi_bosqichga")}</p>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative bg-background pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-4 bottom-4 w-px bg-border md:left-1/2 md:-ml-px" />

            <div className="space-y-12">
              {phases.map((phase, idx) => {
                const meta = statusMeta[phase.status];
                const Icon = phase.icon;
                const isLeft = idx % 2 === 0;

                return (
                  <div
                    key={phase.status}
                    className={`relative flex items-start gap-6 md:items-center ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot on timeline */}
                    <div className="absolute left-4 top-1 z-10 -ml-1.5 h-4 w-4 rounded-full border-2 border-background md:left-1/2 md:-ml-2">
                      <span className={`block h-full w-full rounded-full ${meta.dot}`} />
                    </div>

                    {/* Content card */}
                    <div className="ml-12 flex-1 md:ml-0 md:w-1/2 md:px-12">
                      <div
                        className={`rounded-xl border ${meta.border} ${meta.bg} p-6 backdrop-blur`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border/60 ${meta.iconColor}`}>
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <span className={`text-xs font-semibold uppercase tracking-wider ${meta.text}`}>
                              {phase.label}
                            </span>
                            <h2 className="text-lg font-bold text-foreground md:text-xl">
                              {phase.title}
                            </h2>
                          </div>
                        </div>

                        <ul className="mt-5 space-y-3">
                          {phase.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 text-sm text-foreground/90"
                            >
                              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Empty side for desktop balance */}
                    <div className="hidden flex-1 md:block md:w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Current stage progress */}
      <section className="relative border-t border-border/60 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/30 px-4 py-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4 text-primary" />
            <span>{translate("app.common.joriy_bosqich")}</span>
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight md:text-3xl">
            {translate("app.common.mvpni_ishlab_chiqish")}</h2>

          <div className="mt-6 inline-flex w-full max-w-xs flex-col gap-2 rounded-lg border border-border/60 bg-card/40 px-5 py-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{translate("app.common.jarayon_paneli")}</span>
              <span className="font-semibold text-primary">60%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[60%] rounded-full bg-primary" />
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{translate("app.common.hozirgi_maqsad")}</span> {translate("app.common.birinchi_ommaviy_mvpni_ishga_tushirish")}</p>
        </div>
      </section>

      <CosmicEnding/>
    </div>
  );
}
