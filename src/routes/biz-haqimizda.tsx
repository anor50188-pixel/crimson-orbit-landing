import { t, localized, useI18n, getLocale, formatNumber, relativeTime, plural } from '@/i18n';
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, Rocket, SlidersHorizontal, Users } from "lucide-react";
import heroPlanet from "@/assets/hero-planet.jpg";
import wordmark from "@/assets/agentus-wordmark.png";

export const Route = createFileRoute("/biz-haqimizda")({
  head: () => ({
    meta: [
      { title: t("app.common.biz_haqimizda_agentus") },
      { name: "description", content: t("app.common.agentus_har_bir_inson_uchun_ai") },
      { property: "og:title", content: t("app.common.biz_haqimizda_agentus") },
      { property: "og:description", content: t("app.common.agentus_har_bir_inson_uchun_ai_2") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BizHaqimizda,
});

const values = localized(() => ([
  {
    icon: Heart,
    title: t("app.common.inson_markazida"),
    desc: t("app.common.ai_insonning_ornini_emas_uning_rivojlanishini"),
  },
  {
    icon: Rocket,
    title: t("app.common.oson_boshlash"),
    desc: t("app.common.goyadan_ishlaydigan_ai_agentga_atigi_bir"),
  },
  {
    icon: SlidersHorizontal,
    title: t("app.common.cheksiz_moslashuv"),
    desc: t("app.common.boshlash_oson_chuqur_moslashtirish_esa_cheklanmagan"),
  },
  {
    icon: Users,
    title: t("app.common.hamkor_ai_jamoasi"),
    desc: t("app.common.agentlaringizni_birga_ishga_soling_ulashing_va"),
  },
]));

function BizHaqimizda() {
  useI18n();
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
              {t("app.common.bosh_sahifa")}</Link>
            <a href="/#xususiyatlar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {t("app.common.xususiyatlar")}</a>
            <Link
              to="/biz-haqimizda"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {t("app.common.biz_haqimizda")}</Link>
            <Link
              to="/roadmap"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("app.common.yol_xaritasi")}</Link>
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

        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-16 text-center md:pt-24">
          <img
            src={wordmark}
            alt="AGENTUS"
            width={1600}
            height={544}
            className="w-full max-w-2xl select-none"
            draggable={false}
          />
          <h1 className="mt-8 text-3xl font-bold tracking-tight md:text-4xl">
            {t("app.common.biz_haqimizda")}</h1>
          <p className="mt-6 max-w-2xl text-balance text-xl text-foreground/90 md:text-2xl">
            <span className="text-primary">Agentus</span> {t("app.common.har_bir_inson_uchun_ai_jamoa")}</p>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">{t("app.common.kompaniya_haqida")}</p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("app.common.agentus_har_bir_inson_uchun_ai_3")}</h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
            <p>
              {t("app.common.biz_ishonamizki_muvaffaqiyatga_erishish_faqat_katta")}</p>
            <p>
              {t("app.common.agentus_aynan_shu_maqsadda_yaratilmoqda_bugun")}</p>
            <p>
              {t("app.common.bu_yerda_siz_ozingizga_agentlaringizni_yaratasiz")}</p>
            <p>
              {t("app.common.agentus_ai_platformasi_emas_bu_oz")}</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">{t("app.common.missiya")}</p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("app.common.bizning_maqsadimiz_oddiy")}</h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/90">
            {t("app.common.har_qanday_odamga_bir_necha_daqiqada")}</p>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-foreground/90">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{t("app.common.ozingizga_agentlaringizni_yaratasiz")}</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{t("app.common.ularni_biznesingizga_moslashtirasiz")}</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{t("app.common.kerakli_tool_va_integratsiyalarni_ulaysiz")}</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{t("app.common.ai_jamoalaringizni_birgalikda_ishlatasiz")}</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{t("app.common.vaqtingizni_tejaysiz_va_samaradorlikni_oshirasiz")}</span>
            </li>
          </ul>
          <p className="mt-8 text-base leading-relaxed text-foreground/90">
            {t("app.common.biz_ai_insonniga_emas_insonning_rivojlanishiga")}<em className="text-foreground">{t("app.common.bu_foydalanuvchining_hayotini_yaxshilaydimi")}</em> {t("app.common.agar_javob_ha_bolsa_biz_uni")}</p>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="mb-4 text-center text-xs uppercase tracking-widest text-muted-foreground">
            {t("app.common.asosiy_qadriyatlar")}</p>
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            {t("app.common.nega_agentus")}</h2>
          <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Slogan */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("app.common.bizning_shiorimiz")}</p>
          <p className="mt-6 text-2xl font-semibold italic leading-snug text-foreground md:text-3xl">
            {t("app.common.boshlash_oson_chuqur_moslashtirish_esa_cheklanmagan_2")}</p>
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
            {t("app.common.bosh_sahifaga_qaytish")}</Link>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-muted-foreground">
          {t("app.common.2026_agentus_ishlab_chiqilmoqda")}</div>
      </footer>
    </div>
  );
}
