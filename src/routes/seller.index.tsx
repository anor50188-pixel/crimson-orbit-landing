import { t, localized, useI18n, getLocale, formatNumber, relativeTime, plural } from '@/i18n';
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Bot,
  Check,
  CircleHelp,
  FileText,
  Home,
  Phone,
  Rocket,
  Sun,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  User,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import wordmark from "@/assets/agentus-wordmark.png";
import planet from "@/assets/hero-planet.jpg";

export const Route = createFileRoute("/seller/")({
  component: SellerPage,
  head: () => ({
    meta: [
      { title: t("app.seller.sotuvchi_paneli_agentus") },
      { property: "og:title", content: t("app.seller.sotuvchi_paneli_agentus") },
      { property: "og:description", content: t("app.seller.agentus_sotuvchi_profilini_tayyorlash_va_nashr") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "description",
        content:
          t("app.seller.agentus_marketplace_sotuvchisi_bolib_royxatdan_oting"),
      },
    ],
  }),
});

// —————————————————————— Storage ——————————————————————
const SELLER_KEY = "agentus:seller-profile";

type SellerProfile = {
  name: string;
  phone: string;
  registeredAt: string;
};

function readSeller(): SellerProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SELLER_KEY);
    return raw ? (JSON.parse(raw) as SellerProfile) : null;
  } catch {
    return null;
  }
}

function writeSeller(p: SellerProfile) {
  try {
    window.localStorage.setItem(SELLER_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

function clearSeller() {
  try {
    window.localStorage.removeItem(SELLER_KEY);
  } catch {
    /* ignore */
  }
}

// —————————————————————— Nav ——————————————————————
const mainNav = localized(() => ([
  { icon: Home, label: t("app.workspace.asosiy"), to: "/" as const },
  { icon: Bot, label: t("app.workspace.agentlarim"), to: "/agentlarim" as const },
  { icon: Store, label: t("app.workspace.marketplace"), to: null },
  { icon: Wrench, label: t("app.workspace.mening_toollarim"), to: "/mening-toollarim" as const },
  { icon: Wallet, label: t("app.workspace.tolovlar"), to: null },
] as const));

const sellerNav = localized(() => ([
  { icon: Store, label: t("app.workspace.sotuvchi_paneli"), active: true },
  { icon: Settings, label: t("app.workspace.sozlamalar"), active: false },
] as const));

// —————————————————————— Root ——————————————————————
function SellerPage() {
  useI18n();
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<SellerProfile | null>(null);

  useEffect(() => {
    setProfile(readSeller());
    setHydrated(true);
  }, []);

  if (!hydrated) return <div className="min-h-screen bg-background" />;

  return (
    <Shell>
      {profile ? (
        <SellerDashboard
          profile={profile}
          onSignOut={() => {
            clearSeller();
            setProfile(null);
          }}
        />
      ) : (
        <SellerRegistration onDone={(p) => setProfile(p)} />
      )}
    </Shell>
  );
}

// —————————————————————— Shell (sidebar + topbar) ——————————————————————
function Shell({ children }: { children: React.ReactNode }) {
  useI18n();
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border/60 px-5">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={wordmark} alt="Agentus" className="h-6" />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4 text-sm">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const content = (
              <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-accent/40 hover:text-foreground">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
            );
            return item.to ? (
              <Link key={item.label} to={item.to}>
                {content}
              </Link>
            ) : (
              <div key={item.label} className="cursor-not-allowed opacity-70">
                {content}
              </div>
            );
          })}

          <div className="mt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {t("app.seller.sotuvchi")}</div>
          {sellerNav.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  item.active
                    ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/25"
                    : "cursor-not-allowed text-muted-foreground opacity-70"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
            );
          })}
        </nav>

        {/* Bottom cards */}
        <div className="space-y-2 border-t border-border/60 p-3">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/25">
                A
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{t("app.workspace.azizbek")}</div>
                <div className="text-[11px] text-primary">{t("app.workspace.pro_plan")}</div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground" />
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background/70">
              <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-primary to-[oklch(0.68_0.24_25)]" />
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">{t("app.seller.7_20_agent")}</div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[oklch(0.75_0.15_75)]/15 text-[oklch(0.85_0.18_80)] ring-1 ring-inset ring-[oklch(0.75_0.15_75)]/25">
              <Sun className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">{t("app.seller.24c")}</div>
              <div className="text-[11px] text-muted-foreground">{t("app.seller.sunny")}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border/60 px-6">
          <div className="min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
            >
              {t("app.seller.orqaga")}</Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition hover:text-foreground"
            >
              <CircleHelp className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
                2
              </span>
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-2 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-[11px] font-semibold text-primary">
                A
              </div>
              <span className="hidden text-sm text-foreground/90 sm:inline">{t("app.workspace.azizbek")}</span>
            </div>
          </div>
        </header>

        <div className="relative min-w-0 flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}

// —————————————————————— Registration ——————————————————————
function SellerRegistration({ onDone }: { onDone: (p: SellerProfile) => void }) {
  useI18n();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [openRules, setOpenRules] = useState(false);

  const canSubmit = useMemo(
    () => name.trim().length > 1 && phone.trim().length >= 7 && accepted,
    [name, phone, accepted],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const profile: SellerProfile = {
      name: name.trim(),
      phone: phone.trim(),
      registeredAt: new Date().toISOString(),
    };
    writeSeller(profile);
    onDone(profile);
    navigate({ to: "/seller" });
  }

  return (
    <>
      {/* Space background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={planet}
          alt=""
          className="absolute right-[-15%] top-[-10%] h-[80%] w-auto opacity-40 mix-blend-screen"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 80% 10%, oklch(0.58 0.22 25 / 0.18), transparent 60%), radial-gradient(800px 400px at 20% 90%, oklch(0.58 0.22 25 / 0.10), transparent 60%)",
          }}
        />
        <StarField />
      </div>

      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-16 sm:py-20">
        <h1 className="text-center text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {t("app.seller.sotuvchi_bolib")}<br />
          <span className="bg-gradient-to-r from-primary to-[oklch(0.68_0.24_25)] bg-clip-text text-transparent">
            {t("app.seller.royxatdan_oting")}</span>
        </h1>
        <p className="mt-5 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
          {t("app.seller.marketplace_orqali_ai_agentlaringizni_sotishni_boshlang")}<br />
          {t("app.seller.quyidagi_malumotlarni_toldiring_va_qoidalarga_rozilik")}</p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full rounded-3xl border border-border/60 bg-card/60 p-6 shadow-[0_20px_80px_-40px_oklch(0.58_0.22_25/0.6)] backdrop-blur-xl sm:p-8"
        >
          {/* Name */}
          <Field label={t("app.seller.ism_va_familiya")}>
            <IconInput
              icon={<User className="h-4 w-4" />}
              value={name}
              onChange={setName}
              placeholder={t("app.seller.ismingizni_kiriting")}
              autoComplete="name"
            />
          </Field>

          {/* Phone */}
          <Field label={t("app.seller.telefon_raqami")} className="mt-5">
            <IconInput
              icon={<Phone className="h-4 w-4" />}
              value={phone}
              onChange={setPhone}
              placeholder={t("app.seller.998_90_123_45_67")}
              type="tel"
              autoComplete="tel"
            />
          </Field>

          {/* Rules card */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/25">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">
                {t("app.seller.agentus_marketplace_qoidalari_bilan_tanishib_chiqing")}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {t("app.seller.qoidalar_platformada_xavfsiz_va_adolatli_muhitni")}</div>
            </div>
            <button
              type="button"
              onClick={() => setOpenRules(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-xs font-medium text-foreground transition hover:bg-accent/40"
            >
              {t("app.seller.qoidalarni_oqish")}<ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Agreement (read-only) */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              disabled
              aria-checked={accepted}
              role="checkbox"
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                accepted
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-background"
              } cursor-not-allowed`}
            >
              {accepted ? <Check className="h-3.5 w-3.5" /> : null}
            </button>
            <span className={`text-sm ${accepted ? "text-foreground" : "text-muted-foreground"}`}>
              {accepted
                ? t("app.seller.marketplace_qoidalariga_roziman")
                : t("app.seller.men_agentus_marketplace_qoidalari_bilan_tanishdim")}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-primary to-[oklch(0.5_0.22_25)] text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.58_0.22_25/0.6)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {t("app.workspace.davom_etish")}<ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary/80" />
          {t("app.seller.malumotlaringiz_xavfsiz_saqlanadi")}</div>
      </div>

      {openRules ? (
        <RulesModal
          onClose={() => setOpenRules(false)}
          onAccept={() => {
            setAccepted(true);
            setOpenRules(false);
          }}
        />
      ) : null}
    </>
  );
}

// —————————————————————— Field / Input ——————————————————————
function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  useI18n();
  return (
    <label className={`block ${className ?? ""}`}>
      <div className="mb-2 text-sm font-medium text-foreground/90">{label}</div>
      {children}
    </label>
  );
}

function IconInput({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  useI18n();
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3 transition focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/25">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
      />
    </div>
  );
}

// —————————————————————— Rules modal ——————————————————————
type Rule = { icon: React.ReactNode; title: string; body: React.ReactNode };

const RULES: Rule[] = localized(() => ([
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    title: t("app.seller.1_agent_sifati"),
    body:
      t("app.seller.marketplacega_joylanayotgan_har_bir_agent_ishlaydigan"),
  },
  {
    icon: <X className="h-4 w-4" />,
    title: t("app.seller.2_taqiqlangan_agentlar"),
    body: (
      <ul className="mt-1 list-disc space-y-1 pl-4 text-muted-foreground">
        <li>{t("app.seller.qonunlarga_zid_faoliyatni_osonlashtiruvchi_agentlar")}</li>
        <li>{t("app.seller.kiberjinoyat_hacking_phishing_yoki_zararli_dasturlar")}</li>
        <li>{t("app.seller.firibgarlik_aldov_yoki_yolgon_malumot_tarqatishga")}</li>
        <li>{t("app.seller.noqonuniy_qimor_va_tavakkalga_asoslangan_agentlar")}</li>
        <li>{t("app.seller.zoravonlik_nafrat_yoki_diskriminatsiyani_targib_qiluvchi")}</li>
      </ul>
    ),
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    title: t("app.seller.3_maxfiylik"),
    body:
      t("app.seller.boshqa_insonlarning_shaxsiy_malumotlari_api_kalitlari"),
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    title: t("app.seller.4_intellektual_mulk"),
    body:
      t("app.seller.siz_marketplacega_joylanayotgan_agent_sizga_tegishli"),
  },
  {
    icon: <FileText className="h-4 w-4" />,
    title: t("app.seller.5_tavsif_va_vadalar"),
    body:
      t("app.seller.agent_tavsifi_haqiqatga_mos_bolishi_kerak"),
  },
  {
    icon: <Wallet className="h-4 w-4" />,
    title: t("app.seller.6_moliyaviy_agentlar"),
    body:
      t("app.seller.trading_investitsiya_yoki_moliyaviy_xizmatlarga_oid"),
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    title: t("app.seller.7_tekshiruv_huquqi"),
    body:
      t("app.seller.agentus_marketplacega_yuborilgan_har_bir_agentni"),
  },
  {
    icon: <X className="h-4 w-4" />,
    title: t("app.seller.8_qoidabuzarlik_va_oqibatlar"),
    body:
      t("app.seller.qoidalarni_buzgan_agentlar_marketplacedan_olib_tashlanadi"),
  },
]));

function RulesModal({ onClose, onAccept }: { onClose: () => void; onAccept: () => void }) {
  useI18n();
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <button
        aria-label={t("app.workspace.yopish")}
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
      />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="relative flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
          >
            {t("app.seller.orqaga")}</button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent/40 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative overflow-y-auto px-6 pb-4 pt-6">
          <div className="pointer-events-none absolute right-4 top-2 h-32 w-32 opacity-30">
            <img src={planet} alt="" className="h-full w-full object-contain mix-blend-screen" />
          </div>
          <h2 className="relative text-2xl font-semibold tracking-tight">
            {t("app.seller.agentus_marketplace")}{" "}
            <span className="text-primary">{t("app.seller.qoidalari")}</span>
          </h2>
          <p className="relative mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {t("app.seller.ushbu_qoidalar_marketplaceda_xavfsiz_adolatli_va")}</p>

          <div className="mt-6 space-y-3">
            {RULES.map((r) => (
              <div
                key={r.title}
                className="flex gap-3 rounded-2xl border border-border/60 bg-background/60 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/25">
                  {r.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground">{r.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {r.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 bg-card/95 px-6 py-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only"
            />
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                agreed ? "border-primary bg-primary text-primary-foreground" : "border-border/70 bg-background"
              }`}
            >
              {agreed ? <Check className="h-3.5 w-3.5" /> : null}
            </span>
            <span className="text-sm text-foreground/90">
              {t("app.seller.men_agentus_marketplace")}<span className="text-primary">{t("app.seller.qoidalari")}</span> {t("app.seller.bilan_tanishdim_va_ularga_roziman")}</span>
          </label>
          <button
            type="button"
            disabled={!agreed}
            onClick={onAccept}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-primary to-[oklch(0.5_0.22_25)] text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.58_0.22_25/0.6)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {t("app.seller.roziman")}</button>
        </div>
      </div>
    </div>
  );
}

// —————————————————————— Star field ——————————————————————
function StarField() {
  useI18n();
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
      })),
    [],
  );
  return (
    <div className="absolute inset-0">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

// —————————————————————— Post-registration Dashboard (minimal placeholder) ——————————————————————
function SellerDashboard({
  profile,
  onSignOut,
}: {
  profile: SellerProfile;
  onSignOut: () => void;
}) {
  useI18n();
  void profile;
  return (
    <>
      {/* Space background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={planet}
          alt=""
          className="absolute right-[-18%] top-[-8%] h-[95%] w-auto opacity-60 mix-blend-screen"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1400px 700px at 88% 12%, oklch(0.58 0.22 25 / 0.28), transparent 60%), radial-gradient(900px 500px at 15% 85%, oklch(0.58 0.22 25 / 0.14), transparent 60%)",
          }}
        />
        <StarField />
        {/* small distant planets */}
        <div className="absolute left-[18%] top-[22%] h-24 w-24 rounded-full bg-gradient-to-br from-[oklch(0.35_0.12_25)] to-[oklch(0.15_0.05_25)] opacity-70 blur-[1px] shadow-[0_0_60px_-10px_oklch(0.5_0.2_25/0.5)]" />
        <div className="absolute left-[12%] bottom-[18%] h-16 w-16 rounded-full bg-gradient-to-br from-[oklch(0.3_0.1_25)] to-[oklch(0.12_0.04_25)] opacity-60 shadow-[0_0_40px_-8px_oklch(0.5_0.2_25/0.4)]" />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-3xl items-center justify-center px-6 py-10 sm:py-14">
        <div className="relative w-full overflow-hidden rounded-[28px] border border-border/60 bg-card/50 p-10 shadow-[0_30px_120px_-40px_oklch(0.58_0.22_25/0.7)] backdrop-blur-2xl sm:p-14">
          {/* Planet arc at bottom of card */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 overflow-hidden">
            <div
              className="absolute left-1/2 top-8 h-[520px] w-[520px] -translate-x-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, oklch(0.35 0.15 25 / 0.7), oklch(0.1 0.03 25 / 0.9) 55%, transparent 70%)",
                boxShadow:
                  "0 -20px 80px -10px oklch(0.58 0.22 25 / 0.6), inset 0 20px 60px -10px oklch(0.68 0.24 25 / 0.5)",
              }}
            />
          </div>

          {/* Confetti dots */}
          <ConfettiDots />

          {/* Success ring */}
          <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow:
                  "0 0 0 2px oklch(0.68 0.24 25 / 0.9), 0 0 40px 8px oklch(0.58 0.22 25 / 0.6), inset 0 0 20px 2px oklch(0.58 0.22 25 / 0.3)",
              }}
            />
            <div className="absolute inset-2 rounded-full border border-primary/40" />
            <Check className="relative h-14 w-14 text-white" strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h1 className="relative mt-10 text-center text-4xl font-semibold tracking-tight text-foreground sm:text-[42px]">
            <span className="mr-2 inline-block">🎉</span>
            {t("app.seller.tabriklaymiz")}</h1>

          <p className="relative mt-4 text-center text-base text-foreground/90">
            {t("app.seller.siz_endi_agentus_marketplace_sotuvchisisiz")}</p>

          <div className="relative mx-auto mt-6 h-px w-10 bg-primary" />

          <p className="relative mx-auto mt-6 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
            {t("app.seller.endi_birinchi_agentingizni_marketplacega")}<br />
            {t("app.seller.joylashtirishingiz_mumkin")}</p>

          <Link
            to="/seller/publish/$agentId"
            params={{ agentId: "new" }}
            className="relative mx-auto mt-10 flex h-14 w-full max-w-md items-center justify-between rounded-2xl bg-gradient-to-b from-primary to-[oklch(0.5_0.22_25)] px-6 text-base font-semibold text-primary-foreground shadow-[0_20px_60px_-15px_oklch(0.58_0.22_25/0.9)] transition hover:brightness-110"
          >
            <Rocket className="h-5 w-5" />
            <span className="flex-1 text-center">{t("app.seller.agent_tanlash")}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          {/* Demo reset — tiny, discreet */}
          <button
            type="button"
            onClick={onSignOut}
            className="relative mx-auto mt-6 block text-[11px] text-muted-foreground/60 transition hover:text-muted-foreground"
          >
            {t("app.seller.demo_royxatdan_chiqish")}</button>
        </div>
      </div>
    </>
  );
}

function ConfettiDots() {
  useI18n();
  const dots = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        top: 8 + Math.random() * 32,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.7 + 0.3,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0">
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-sm bg-primary"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}
