import { t, localized, useI18n, getLocale, formatNumber, relativeTime, plural } from '@/i18n';
export const plannedPlans = localized(() => ([
  { name: "Freemium", price: 0, agents: 2, tools: 2, requests: 500, scheduled: false },
  { name: t("app.workspace.pro"), price: 19, agents: 10, tools: 5, requests: 5000, scheduled: true },
  { name: t("app.landing.pro_max"), price: 49, agents: null, tools: null, requests: 25000, scheduled: true },
] as const));

export const roadmapStages = localized(() => ([
  { letter: "A", title: t("app.landing.agent_yaratish_va_ishlatish"), badge: t("app.landing.hozir_ishlab_chiqilmoqda"), items: [t("app.landing.agent_tool_va_ai_jamoalar"), t("app.landing.3_tilda_platforma"), t("app.landing.talabalar_va_biznes_uchun_shablonlar"), "Maqsad: 500+ foydalanuvchi"] },
  { letter: "B", title: t("app.landing.bozor_va_savdo"), badge: t("app.landing.keyingi_bosqich"), items: [t("app.landing.marketplace_faoliyati"), t("app.landing.agent_sotish_va_25_komissiya"), t("app.landing.onlayn_tolovlar"), "Maqsad: 10 000+ foydalanuvchi"] },
  { letter: "C", title: t("app.landing.mintaqa_lideri"), badge: t("app.landing.kelajak_maqsadi"), items: [t("app.landing.ozbekiston_va_markaziy_osiyo_bozori"), t("app.landing.korporativ_mijozlar"), t("app.landing.maqsad_1_markaziy_osiyo_ai_platformasi")] },
] as const));