import { WorkspaceCosmos } from '@/components/workspace-cosmos';
import { CosmicEnding } from '@/components/cosmic-ending';
import { LanguageSwitcher } from '@/components/language-switcher';
import { t as translate, localized, useI18n, getLocale, formatNumber, relativeTime, plural } from '@/i18n';
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Bot,
  Check,
  CircleHelp,
  Home,
  Image as ImageIcon,
  Info,
  Lightbulb,
  Rocket,
  Settings,
  ShieldCheck,
  Store,
  Sun,
  Trash2,
  Upload,
  Wallet,
  Wrench,
  X,
  ChevronDown,
} from "lucide-react";
import wordmark from "@/assets/agentus-wordmark.png";
import planet from "@/assets/hero-planet.jpg";

export const Route = createFileRoute("/seller/publish/$agentId")({
  component: SellerPublishPage,
  head: () => ({
    meta: [
      { title: translate("app.seller.agentni_marketplacega_chiqarish_agentus") },
      { property: "og:title", content: translate("app.seller.agentni_nashrga_tayyorlash_agentus") },
      { property: "og:description", content: translate("app.seller.agent_nomi_tavsifi_narxi_va_rasmlarini") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "description",
        content:
          translate("app.seller.4_bosqichli_sotuvchi_nashriyot_ustasi_agentingizni"),
      },
    ],
  }),
});

// ————— Nav (mirrors seller.tsx sidebar) —————
const mainNav = localized(() => ([
  { icon: Home, label: translate("app.workspace.asosiy"), to: "/" as const },
  { icon: Bot, label: translate("app.workspace.agentlarim"), to: "/agentlarim" as const },
  { icon: Store, label: translate("app.workspace.marketplace"), to: null },
  { icon: Wrench, label: translate("app.workspace.mening_toollarim"), to: "/mening-toollarim" as const },
  { icon: Wallet, label: translate("app.workspace.tolovlar"), to: null },
] as const));

const sellerNav = localized(() => ([
  { icon: Store, label: translate("app.workspace.sotuvchi_paneli"), to: "/seller" as const, active: true },
  { icon: Settings, label: translate("app.workspace.sozlamalar"), to: null, active: false },
] as const));

function SellerPublishPage() {
  useI18n();
  return (
    <div className="cosmic-page flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="relative flex min-w-0 flex-1 flex-col"><WorkspaceCosmos continuous/>
        <TopBar />
        <div className="relative min-w-0 flex-1 overflow-y-auto pb-24">
          <PublishWizard /><CosmicEnding/>
        </div>
        <BottomBar />
      </main>
    </div>
  );
}

function Sidebar() {
  useI18n();
  return (
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
          {translate("app.seller.sotuvchi")}</div>
        {sellerNav.map((item) => {
          const Icon = item.icon;
          const inner = (
            <span
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                item.active
                  ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/25"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </span>
          );
          return item.to ? (
            <Link key={item.label} to={item.to}>
              {inner}
            </Link>
          ) : (
            <div key={item.label} className="cursor-not-allowed opacity-70">{inner}</div>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-border/60 p-3">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/25">
              A
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">{translate("app.workspace.azizbek")}</div>
              <div className="text-[11px] text-primary">{translate("app.workspace.pro_plan")}</div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground" />
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background/70">
            <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-primary to-[oklch(0.68_0.24_25)]" />
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">{translate("app.seller.7_20_agent")}</div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[oklch(0.75_0.15_75)]/15 text-[oklch(0.85_0.18_80)] ring-1 ring-inset ring-[oklch(0.75_0.15_75)]/25">
            <Sun className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-foreground">{translate("app.seller.24c")}</div>
            <div className="text-[11px] text-muted-foreground">{translate("app.seller.sunny")}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  useI18n();
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border/60 px-6">
      <Link
        to="/seller"
        className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
      >
        <span className="text-sm">←</span> {translate("app.agents.orqaga")}</Link>
      <div className="flex items-center gap-2"><LanguageSwitcher/>
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition hover:text-foreground">
          <CircleHelp className="h-4 w-4" />
        </button>
        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
            2
          </span>
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-2 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-[11px] font-semibold text-primary">
            A
          </div>
          <span className="hidden text-sm text-foreground/90 sm:inline">{translate("app.workspace.azizbek")}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}

function BottomBar() {
  useI18n();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur md:left-64">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-card/40">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </div>
          {translate("app.seller.agentingiz_tekshiruvdan_otadi_va_qoidalarga_muvofiq")}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-border/60 bg-card/60 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent/40"
          >
            {translate("app.seller.qoralama_saqlash")}</button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-[oklch(0.5_0.22_25)] px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.58_0.22_25/0.7)] transition hover:brightness-110"
          >
            {translate("app.seller.tekshiruvga_yuborish")}<Rocket className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// —————————————————————— Wizard ——————————————————————
const STEP_LABELS = localized(() => ([
  translate("app.seller.asosiy_malumotlar"),
  translate("app.seller.tolov_va_harajatlar"),
  translate("app.seller.tavsif_va_toollar"),
  translate("app.seller.rasm_va_ikonka"),
] as const));

function PublishWizard() {
  useI18n();
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));
  return (
    <>
      {/* Background planet + glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={planet}
          alt=""
          className="absolute right-[-10%] top-[-15%] h-[70%] w-auto opacity-60 mix-blend-screen"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1000px 500px at 85% 5%, oklch(0.58 0.22 25 / 0.18), transparent 55%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] px-8 py-10">
        {/* Title */}
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-[42px]">
          {translate("app.seller.agentingizni_marketplacega_chiqarish")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {translate("app.seller.quyidagi_4_bosqichni_toldirib_agentingizni_minglab")}</p>

        {/* Stepper */}
        <Stepper current={step} onJump={(i) => i < step && setStep(i)} />

        {/* Sequential step card */}
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-2xl">
            {step === 0 ? <Step1Basic onNext={next} /> : null}
            {step === 1 ? <Step2Pricing onNext={next} onBack={prev} /> : null}
            {step === 2 ? <Step3Description onNext={next} onBack={prev} /> : null}
            {step === 3 ? <Step4Media onBack={prev} /> : null}
          </div>
        </div>
      </div>
    </>
  );
}

function Stepper({
  current,
  onJump,
}: {
  current: number;
  onJump: (i: number) => void;
}) {
  useI18n();
  return (
    <div className="mt-10 grid grid-cols-4 items-start gap-4">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const canJump = i < current;
        return (
          <button
            type="button"
            key={label}
            disabled={!canJump}
            onClick={() => onJump(i)}
            className={`relative flex flex-col items-center ${canJump ? "cursor-pointer" : "cursor-default"}`}
          >
            {i < STEP_LABELS.length - 1 ? (
              <div
                className={`absolute left-1/2 top-5 h-[2px] w-full ${
                  done ? "bg-primary" : active ? "bg-primary/40" : "bg-border/60"
                }`}
              />
            ) : null}
            <div
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                active
                  ? "bg-primary text-primary-foreground shadow-[0_0_0_4px_oklch(0.58_0.22_25/0.2)]"
                  : done
                    ? "bg-primary/90 text-primary-foreground"
                    : "border border-border/70 bg-card/60 text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <div
              className={`mt-3 text-xs ${
                active
                  ? "font-semibold text-primary"
                  : done
                    ? "text-foreground/80"
                    : "text-muted-foreground"
              }`}
            >
              {label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// —————— Reusable primitives ——————
function Card({
  n,
  title,
  subtitle,
  children,
}: {
  n: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  useI18n();
  return (
    <div className="flex flex-col rounded-2xl border border-border/60 bg-card/60 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/60 text-sm font-semibold text-foreground">
          {n}
        </div>
        <div className="min-w-0">
          <div className="text-base font-semibold text-foreground">{title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4">{children}</div>
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  useI18n();
  return (
    <div className="mb-1.5 text-xs font-medium text-foreground/90">
      {children}
      {required ? <span className="ml-0.5 text-primary">*</span> : null}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suffix?: React.ReactNode;
}) {
  useI18n();
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 transition focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
      />
      {suffix ? <span className="text-xs text-muted-foreground">{suffix}</span> : null}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  useI18n();
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 pr-9 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function WizardNav({
  onBack,
  onNext,
  nextLabel = "Keyingi",
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
}) {
  useI18n();
  return (
    <div className="mt-2 flex items-center gap-2">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/60 px-4 text-sm font-medium text-foreground transition hover:bg-accent/40"
        >
          {translate("app.seller.orqaga")}</button>
      ) : null}
      {onNext ? (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.58_0.22_25/0.7)] transition hover:brightness-110"
        >
          {nextLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

// —————— Step 1 ——————
function Step1Basic({ onNext }: { onNext: () => void }) {
  useI18n();
  const [name, setName] = useState(translate("app.seller.trading_assistant"));
  const [slug, setSlug] = useState(translate("app.seller.tradingassistant"));
  const [category, setCategory] = useState("Moliyaviy (Trading)");
  const [lang, setLang] = useState(translate("app.seller.ozbek_tili"));
  const [type, setType] = useState<"simple" | "auto">("simple");

  return (
    <Card n={1} title={translate("app.seller.asosiy_malumotlar")} subtitle={translate("app.seller.agentingiz_haqida_asosiy_malumotlar")}>
      <div>
        <Label required>{translate("app.seller.agent_nomi")}</Label>
        <TextInput value={name} onChange={setName} placeholder={translate("app.seller.trading_assistant")} />
      </div>

      <div>
        <Label required>{translate("app.seller.qisqa_nom_url_uchun")}</Label>
        <TextInput value={slug} onChange={setSlug} placeholder={translate("app.seller.tradingassistant")} />
        <div className="mt-1.5 flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">{translate("app.seller.agentusaiagents")}{slug || "..."}</span>
          <span className="inline-flex items-center gap-1 text-[oklch(0.72_0.18_150)]">
            <Check className="h-3 w-3" /> {translate("app.common.mavjud")}</span>
        </div>
      </div>

      <div>
        <Label required>{translate("app.seller.kategoriya")}</Label>
        <Select
          value={category}
          onChange={setCategory}
          options={[
            "Moliyaviy (Trading)",
            translate("app.seller.talim"),
            translate("app.seller.sogliqni_saqlash"),
            "Marketing",
            "Boshqa",
          ]}
        />
      </div>

      <div>
        <Label required>{translate("app.seller.agent_turi")}</Label>
        <div className="grid grid-cols-2 gap-2">
          <TypeCard
            selected={type === "simple"}
            onClick={() => setType("simple")}
            title={translate("app.seller.oddiy_agent")}
            desc={translate("app.seller.foydalanuvchi_soroviga_javob_beradi")}
          />
          <TypeCard
            selected={type === "auto"}
            onClick={() => setType("auto")}
            title={translate("app.seller.avtomatik_agent")}
            desc={translate("app.seller.ozi_mustaqil_ishlaydi")}
          />
        </div>
      </div>

      <div>
        <Label required>{translate("app.workspace.til")}</Label>
        <Select
          value={lang}
          onChange={setLang}
          options={[translate("app.seller.ozbek_tili"), translate("app.seller.rus_tili"), translate("app.seller.ingliz_tili")]}
        />
      </div>

      <WizardNav onNext={onNext} />
    </Card>
  );
}

function TypeCard({
  selected,
  onClick,
  title,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-1.5 rounded-xl border p-3 text-left transition ${
        selected
          ? "border-primary/70 bg-primary/[0.06] shadow-[inset_0_0_0_1px_oklch(0.58_0.22_25/0.4)]"
          : "border-border/60 bg-background/60 hover:border-border"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
            selected ? "border-primary bg-primary" : "border-border/70"
          }`}
        >
          {selected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
        </span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <div className="text-[11px] leading-snug text-muted-foreground">{desc}</div>
    </button>
  );
}

// —————— Step 2 ——————
function Step2Pricing({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  useI18n();
  const [price, setPrice] = useState("15");
  const [source, setSource] = useState<"own" | "agentus">("own");
  const income = useMemo(() => {
    const p = parseFloat(price || "0");
    if (Number.isNaN(p)) return "0.00";
    return (p * 0.8).toFixed(2);
  }, [price]);

  return (
    <Card n={2} title={translate("app.seller.tolov_va_harajatlar")} subtitle={translate("app.seller.narx_belgilang_va_oyiga_xarajatni_koring")}>
      <div>
        <Label required>{translate("app.seller.sotish_narxi_usd")}</Label>
        <TextInput value={price} onChange={setPrice} placeholder="15" suffix="USD" />
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Info className="h-3 w-3" /> {translate("app.seller.foydalanuvchilar_ushbu_narxni_tolaydi")}</div>
      </div>

      <div className="rounded-xl border border-[oklch(0.75_0.15_60)]/40 bg-[oklch(0.75_0.15_60)]/[0.06] p-3">
        <div className="text-[11px] text-[oklch(0.85_0.15_65)]">{translate("app.seller.sizning_daromadingiz")}</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-semibold text-foreground">${income}</span>
          <span className="text-[11px] text-muted-foreground">/ sotuv</span>
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">{translate("app.seller.agentus_komissiyasi_20")}</div>
      </div>

      <div>
        <Label required>{translate("app.seller.agentingiz_oyiga_qancha_harajat_qiladi")}</Label>
        <div className="rounded-xl border border-border/60 bg-background/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-foreground">$4.20</span>
              <span className="text-[11px] text-muted-foreground">/ oy</span>
            </div>
            <span className="rounded-md bg-[oklch(0.55_0.15_160)]/15 px-2 py-0.5 text-[10px] font-medium text-[oklch(0.78_0.16_160)] ring-1 ring-inset ring-[oklch(0.55_0.15_160)]/30">
              {translate("app.tools.tavsiya_etilgan")}</span>
          </div>
          <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {translate("app.seller.bu_summa_agent_ishlashi_uchun_zarur")}</div>
        </div>
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          <Info className="h-3 w-3" /> {translate("app.seller.hisobkitob_qanday_ishlaydi")}</button>
      </div>

      <div>
        <Label required>{translate("app.seller.xarajat_manbai")}</Label>
        <div className="flex flex-col gap-2">
          <SourceCard
            selected={source === "own"}
            onClick={() => setSource("own")}
            title={translate("app.seller.mening_api_kalitlarim")}
            desc={translate("app.seller.ozingizning_api_kalitlaringizni_ishlatasiz")}
          />
          <SourceCard
            selected={source === "agentus"}
            onClick={() => setSource("agentus")}
            title={translate("app.seller.agentus_orqali")}
            badge=translate("app.workspace.pro")
            desc={translate("app.seller.agentus_api_xarajatlarni_boshqaradi")}
          />
        </div>
      </div>

      <WizardNav onBack={onBack} onNext={onNext} />
    </Card>
  );
}

function SourceCard({
  selected,
  onClick,
  title,
  desc,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  badge?: string;
}) {
  useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
        selected
          ? "border-primary/70 bg-primary/[0.06]"
          : "border-border/60 bg-background/60 hover:border-border"
      }`}
    >
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-primary bg-primary" : "border-border/70"
        }`}
      >
        {selected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {badge ? (
            <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-inset ring-primary/30">
              {badge}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}

// —————— Step 3 ——————
function Step3Description({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  useI18n();
  const [short, setShort] = useState(
    translate("app.seller.trading_assistant_kriptovalyuta_bozorini_tahlil_qiladi"),
  );
  const [full, setFull] = useState(
    translate("app.seller.bu_agent_kriptovalyuta_bozoridagi_malumotlarni_real"),
  );
  const [features, setFeatures] = useState<string[]>([
    translate("app.seller.bozor_tahlili"),
    translate("app.seller.savdo_signallari"),
    translate("app.seller.risk_boshqaruvi"),
    translate("app.seller.portfel_kuzatuvi"),
  ]);

  return (
    <Card n={3} title={translate("app.seller.tavsif_va_toollar")} subtitle={translate("app.seller.agentingizni_batafsil_tavsiflang")}>
      <div>
        <Label required>{translate("app.seller.qisqa_tavsif")}</Label>
        <div className="rounded-xl border border-border/60 bg-background/60 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
          <textarea
            value={short}
            onChange={(e) => setShort(e.target.value.slice(0, 150))}
            rows={3}
            className="w-full resize-none bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
        </div>
        <div className="mt-1 text-right text-[11px] text-muted-foreground">
          {short.length} / 150
        </div>
      </div>

      <div>
        <Label required>{translate("app.seller.toliq_tavsif")}</Label>
        <div className="rounded-xl border border-border/60 bg-background/60 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
          <textarea
            value={full}
            onChange={(e) => setFull(e.target.value.slice(0, 2000))}
            rows={9}
            className="w-full resize-none bg-transparent px-3.5 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
        </div>
        <div className="mt-1 text-right text-[11px] text-muted-foreground">
          {full.length} / 2000
        </div>
      </div>

      <div>
        <Label required>{translate("app.seller.asosiy_funksiyalar")}</Label>
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-border/60 bg-background/60 p-2">
          {features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[11px] text-foreground ring-1 ring-inset ring-primary/25"
            >
              {f}
              <button
                type="button"
                onClick={() => setFeatures(features.filter((x) => x !== f))}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => {
              const v = prompt(translate("app.seller.yangi_funksiya_nomi"));
              if (v && v.trim()) setFeatures([...features, v.trim()]);
            }}
            className="rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent/40 hover:text-foreground"
          >
            {translate("app.seller.qoshish")}</button>
        </div>
      </div>

      <WizardNav onBack={onBack} onNext={onNext} />
    </Card>
  );
}

// —————— Step 4 ——————
function Step4Media({ onBack }: { onBack: () => void }) {
  useI18n();
  return (
    <Card n={4} title={translate("app.seller.rasm_va_ikonka")} subtitle={translate("app.seller.agentingiz_uchun_rasm_va_ikonka_yuklang")}>
      <div>
        <Label required>{translate("app.seller.agent_ikonka_512x512")}</Label>
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-background/60">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 55%, oklch(0.32 0.12 25 / 0.9), oklch(0.1 0.03 25) 70%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl">📈</div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            className="flex-1 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent/40"
          >
            {translate("app.seller.rasmni_ozgartirish")}</button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground transition hover:bg-accent/40 hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div>
        <Label>{translate("app.seller.muqova_rasmi_1200x630")}</Label>
        <div className="relative aspect-[1200/630] overflow-hidden rounded-xl border border-border/60 bg-background/60">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, oklch(0.38 0.18 25 / 0.9), oklch(0.08 0.02 25) 75%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/25 ring-1 ring-inset ring-primary/50">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        <button
          type="button"
          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent/40"
        >
          <Upload className="h-3.5 w-3.5" />
          {translate("app.seller.rasmni_yuklash")}</button>
      </div>

      <div className="mt-auto flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/60 p-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.75_0.15_75)]/15 text-[oklch(0.85_0.18_80)] ring-1 ring-inset ring-[oklch(0.75_0.15_75)]/25">
          <Lightbulb className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-foreground">{translate("app.seller.maslahat")}</div>
          <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            {translate("app.seller.yaxshi_rasm_va_ikonka_koproq_sotuvga")}</div>
        </div>
      </div>
      <WizardNav onBack={onBack} />
    </Card>
  );
}