import { LanguageSwitcher } from '@/components/language-switcher';
import { CosmicEnding } from '@/components/cosmic-ending';
import { t, localized, useI18n, getLocale, formatNumber, relativeTime, plural } from '@/i18n';
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Box,
  Brain,
  Calculator,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Crown,
  Database,
  FileSpreadsheet,
  Globe,
  Home,
  Instagram,
  Layers,
  LockKeyhole,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  Moon,
  Mouse,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Store,
  Sun,
  Upload,
  User,
  Users,
  Wallet,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { Button as DesignButton, type ButtonProps } from "@/components/ui/button";
import { WorkspaceCosmos } from "@/components/workspace-cosmos";
import { KnowledgeCarousel } from "@/components/knowledge-carousel";

function Button(props: ButtonProps) {
  useI18n();
  return <DesignButton variant="workspace" size="workspace" {...props} />;
}
import { AIText, WorkspaceCommandPalette } from "@/components/workspace-command";
const wordmark = "/images/agentus-wordmark.webp";

export const Route = createFileRoute("/agent-yaratish")({
  component: AgentCreatePage,
  head: () => ({
    meta: [
      { title: t("app.workspace.agent_yaratish_agentus") },
      {
        name: "description",
        content: t("app.workspace.agentus_yordamchisi_bilan_suhbatda_oz_ai"),
      },
      { property: "og:title", content: t("app.workspace.agent_yaratish_agentus") },
      {
        property: "og:description",
        content: t("app.workspace.goyangizni_yozing_savollarga_javob_bering_va"),
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Phase = "home" | "builder";
type SoonKey = "Marketplace" | "Mening toollarim" | "Sotuvchi paneli" | "To'lovlar";
type MobilePanel = "chat" | "live";
type ChatMessage = { id: number; role: "user" | "assistant"; text: string };
type Draft = {
  name: string;
  icon: string;
  direction: string;
  tools: string[];
  schedule: string;
  prompt: string;
  instructions: string;
};

const initialDraft: Draft = {
  name: "",
  icon: "bot",
  direction: "",
  tools: [],
  schedule: "",
  prompt: "",
  instructions: "",
};

const suggestions = localized(() => ([
  { icon: Send, text: t("app.workspace.telegram_orqali_hisobot_yiguvchi_agent_yarat") },
  { icon: Instagram, text: t("app.workspace.instagram_postlar_tayyorlovchi_agent") },
  { icon: MessageCircle, text: t("app.workspace.mijozlar_bilan_avtomatik_muloqot_qiluvchi_bot") },
  { icon: FileSpreadsheet, text: t("app.workspace.excel_fayllar_bilan_ishlovchi_agent") },
]));

const recentAgents = localized(() => ([
  { name: t("app.workspace.hisobot_yiguvchi"), icon: BarChart3, status: "Faol" },
  { name: t("app.workspace.kontent_yordamchisi"), icon: Instagram, status: "Qoralama" },
  { name: t("app.workspace.mijozlar_boti"), icon: MessageCircle, status: t("app.workspace.toxtatilgan") },
]));

const questions = localized(() => ([
  t("app.workspace.agentingizga_qanday_nom_beramiz"),
  t("app.workspace.ikonka_tanlang"),
  t("app.workspace.qaysi_yonalishga_tegishli"),
  t("app.workspace.qaysi_toollar_kerak_boladi"),
  t("app.workspace.agent_qachon_ishlasin"),
]));

const directions = localized(() => ([
  "Talabalar",
  "Biznes",
  "Marketing",
  t("app.workspace.qollabquvvatlash"),
  "Kontent",
  "Tadqiqot",
  t("app.workspace.talim"),
  "Samaradorlik",
]));

const iconChoices: { id: string; icon: LucideIcon; label: string }[] = localized(() => ([
  { id: "bot", icon: Bot, label: t("app.workspace.bot") },
  { id: "chart", icon: BarChart3, label: t("app.workspace.grafik") },
  { id: "mail", icon: Mail, label: t("app.workspace.pochta") },
  { id: "megaphone", icon: Megaphone, label: t("app.workspace.elon") },
  { id: "book", icon: BookOpen, label: t("app.workspace.kitob") },
  { id: "shield", icon: Shield, label: t("app.workspace.himoya") },
  { id: "cart", icon: ShoppingCart, label: t("app.workspace.savat") },
  { id: "spark", icon: Sparkles, label: t("app.workspace.yulduz") },
]));

const toolChoices: { name: string; icon: LucideIcon }[] = localized(() => ([
  { name: "Telegram", icon: Send },
  { name: t("app.workspace.web_qidiruv"), icon: Search },
  { name: t("app.workspace.http_sorov"), icon: Globe },
  { name: "Xotira", icon: Database },
  { name: "Kalkulyator", icon: Calculator },
  { name: "Sana/vaqt", icon: Clock },
]));

const schedules = localized(() => ([t("app.workspace.qolda"), t("app.workspace.har_soat"), t("app.workspace.har_kuni"), t("app.workspace.har_hafta")]));

const carouselCards: { icon: LucideIcon; title: string; text: string }[] = localized(() => ([
  {
    icon: Bot,
    title: t("app.workspace.agent_nima"),
    text: t("app.workspace.mustaqil_ishlaydigan_ai_yordamchi_oz_maqsadi"),
  },
  {
    icon: Wrench,
    title: t("app.workspace.tool_nima"),
    text: t("app.workspace.agent_oylaydi_tool_harakat_qiladi_telegram"),
  },
  {
    icon: Users,
    title: t("app.workspace.ai_jamoa"),
    text: t("app.workspace.mijoz_lead_taklif_shartnoma_agentlar_zanjir"),
  },
  {
    icon: Clock,
    title: t("app.workspace.247_avtonom"),
    text: t("app.workspace.jadval_boyicha_agent_ozi_ishga_tushadi"),
  },
  {
    icon: Database,
    title: t("app.workspace.xotira"),
    text: t("app.workspace.agent_muhim_faktlarni_eslab_qoladi"),
  },
  {
    icon: Shield,
    title: t("app.workspace.xavfsizlik"),
    text: t("app.workspace.tokenlar_shifrlangan_holda_saqlanadi"),
  },
  {
    icon: Store,
    title: t("app.workspace.marketplace"),
    text: t("app.workspace.tez_orada_agentlaringizni_soting_va_daromad"),
  },
]));

const soonContent: Record<
  SoonKey,
  { icon: LucideIcon; description: string; bullets: string[] }
> = localized(() => ({
  Marketplace: {
    icon: Store,
    description: t("app.workspace.tayyor_agentlarni_toping_va_bir_bosishda"),
    bullets: [t("app.workspace.reyting_va_sharhlar"), t("app.workspace.kategoriyalar_boyicha_qidiruv"), t("app.workspace.bir_bosishda_ornatish")],
  },
  "Mening toollarim": {
    icon: Wrench,
    description: t("app.workspace.barcha_ulangan_toollarni_bir_joyda_boshqaring"),
    bullets: [t("app.workspace.tokenlarni_xavfsiz_saqlash"), t("app.workspace.toolni_bir_nechta_agentga_ulash"), t("app.workspace.foydalanish_statistikasi")],
  },
  "Sotuvchi paneli": {
    icon: Crown,
    description: t("app.workspace.agentingizni_soting_va_daromad_oling"),
    bullets: [t("app.workspace.75_daromad_sizga"), t("app.workspace.sotuvlar_va_reyting_statistikasi"), t("app.workspace.oylik_tolovlar")],
  },
  "To'lovlar": {
    icon: Wallet,
    description: t("app.workspace.obuna_va_tolovlarni_qulay_boshqaring"),
    bullets: [t("app.workspace.payme_va_click_orqali_tolov"), t("app.workspace.tolov_tarixi"), t("app.workspace.tarifni_bir_bosishda_yangilash")],
  },
}));

let messageId = 0;
const nextMessageId = () => ++messageId;

function soonLabel(key: SoonKey) { return key === "Marketplace" ? t("app.workspace.marketplace") : key === "Mening toollarim" ? t("app.workspace.mening_toollarim") : key === "Sotuvchi paneli" ? t("app.workspace.sotuvchi_paneli") : t("app.workspace.tolovlar"); }

function AgentCreatePage() {
  useI18n();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("home");
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [composer, setComposer] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [published, setPublished] = useState(false);
  const [readyInteracted, setReadyInteracted] = useState(false);
  const [flash, setFlash] = useState("");
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("chat");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [soon, setSoon] = useState<SoonKey | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [toast, setToast] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const timers = useRef<number[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const later = (callback: () => void, delay = 560) => {
    const timer = window.setTimeout(callback, delay);
    timers.current.push(timer);
  };

  useEffect(() => {
    return () => timers.current.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, step, selectedTools]);

  useEffect(() => {
    const shortcut = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(value => !value); }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  const showToast = (text: string) => setToast(text);

  const startBuilder = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setDraft({ ...initialDraft, prompt: clean });
    setMessages([{ id: nextMessageId(), role: "user", text: clean }]);
    setPrompt("");
    setStep(0);
    setTyping(true);
    setPublished(false);
    setReadyInteracted(false);
    setSelectedTools([]);
    setComposer("");
    setMobilePanel("chat");
    setPhase("builder");
    setMobileMenu(false);
    later(() => setTyping(false), 650);
  };

  const goHome = () => {
    setPhase("home");
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateDraft = (currentStep: number, value: string | string[]) => {
    setDraft((current) => {
      if (currentStep === 0) return { ...current, name: String(value) };
      if (currentStep === 1) return { ...current, icon: String(value) };
      if (currentStep === 2) return { ...current, direction: String(value) };
      if (currentStep === 3) return { ...current, tools: value as string[] };
      return { ...current, schedule: String(value) };
    });
    const fields = ["name", "icon", "direction", "tools", "schedule"];
    setFlash(fields[currentStep]);
    later(() => setFlash(""), 800);
  };

  const answer = (value: string | string[], display?: string) => {
    if (typing || step >= questions.length) return;
    if (Array.isArray(value) && value.length === 0) return;
    if (!Array.isArray(value) && !value.trim()) return;
    const currentStep = step;
    const answerText = display ?? (Array.isArray(value) ? value.join(", ") : value);
    setMessages((current) => [
      ...current,
      { id: nextMessageId(), role: "assistant", text: questions[currentStep] },
      { id: nextMessageId(), role: "user", text: answerText },
    ]);
    updateDraft(currentStep, value);
    setComposer("");
    setStep(currentStep + 1);
    setTyping(true);
    later(() => setTyping(false));
  };

  const toggleTool = (name: string) => {
    setSelectedTools((current) =>
      current.includes(name) ? current.filter((tool) => tool !== name) : [...current, name],
    );
  };

  const sendReadyEdit = (text: string) => {
    setReadyInteracted(true);
    setMessages((current) => [
      ...current,
      { id: nextMessageId(), role: "user", text },
    ]);
    const normalized = text.toLowerCase();
    let field = "instructions";
    setDraft((current) => {
      if (normalized.startsWith("nomini")) {
        field = "name";
        const name = text
          .replace(/^nomini\s*:?/i, "")
          .replace(/o['‘’]zgartir/gi, "")
          .trim();
        return { ...current, name: name || current.name };
      }
      if (normalized.includes("tool")) {
        field = "tools";
        return {
          ...current,
          tools: current.tools.includes(t("app.workspace.web_qidiruv"))
            ? current.tools
            : [...current.tools, t("app.workspace.web_qidiruv")],
        };
      }
      return { ...current, instructions: text };
    });
    setFlash(field);
    setTyping(true);
    later(() => {
      setTyping(false);
      setFlash("");
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId(),
          role: "assistant",
          text: t("app.workspace.ozgartirish_jonli_korinishga_qoshildi"),
        },
      ]);
    });
  };

  const submitComposer = (event?: FormEvent) => {
    event?.preventDefault();
    const text = composer.trim();
    if (!text || typing) return;
    if (step < questions.length) answer(text);
    else sendReadyEdit(text);
    setComposer("");
  };

  const publish = () => {
    if (published) {
      navigate({ to: "/agentlarim" });
      return;
    }
    setPublished(true);
    showToast(t("app.workspace.agent_elon_qilindi"));
  };

  const testAgent = () => {
    setMessages((current) => [
      ...current,
      {
        id: nextMessageId(),
        role: "assistant",
        text: t("app.workspace.sinov_uchun_chatga_buyruq_yozing_ozgartirish"),
      },
    ]);
    setReadyInteracted(true);
    setMobilePanel("chat");
  };

  const openNewAgent = () => {
    goHome();
    later(() => {
      promptRef.current?.focus();
      promptRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="agent-workspace" data-theme={theme}>
      <Sidebar
        builder={phase === "builder"}
        mobileOpen={mobileMenu}
        onClose={() => setMobileMenu(false)}
        onHome={goHome}
        onSoon={setSoon}
        onNotice={showToast}
      />

      <main className={`workspace-main ${phase === "builder" ? "is-builder" : ""}`}>
        {phase === "home" && <><WorkspaceCosmos /><WorkspaceCosmos continuous /></>}

        <header className="workspace-topbar">
          <div className={`topbar-title ${phase === "home" ? "home-topbar-title" : ""}`}>
            <Button
              className="icon-button mobile-menu-button"
              type="button"
              onClick={() => setMobileMenu(true)}
              aria-label={t("app.workspace.menyuni_ochish")}
            >
              <Menu />
            </Button>
            <span>Agentus</span>
            <ChevronRight aria-hidden="true" />
            <strong>{phase === "home" ? "Asosiy" : t("app.workspace.agent_yaratish")}</strong>
          </div>
          <div className="topbar-actions">
            <Button className="icon-button command-trigger" type="button" aria-label={t("app.workspace.tezkor_qidiruv")} title={t("app.workspace.tezkor_qidiruv")} onClick={() => setCommandOpen(true)}>{t("app.workspace.k")}</Button>
            <Button
              className="icon-button"
              type="button"
              onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? t("app.workspace.yorug_mavzuga_otish") : t("app.workspace.tungi_mavzuga_otish")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
            <LanguageSwitcher/>
            <div className="topbar-popover-wrap">
              <Button
                className="icon-button notification-button"
                type="button"
                onClick={() => {
                  setNotificationsOpen((value) => !value);
                  setProfileOpen(false);
                }}
                aria-label={t("app.workspace.bildirishnomalar")}
                aria-expanded={notificationsOpen}
              >
                <Bell />
              </Button>
              {notificationsOpen && (
                <div className="topbar-popover">
                  <strong>{t("app.workspace.bildirishnomalar")}</strong>
                  <p>{t("app.workspace.yangi_bildirishnoma_yoq")}</p>
                </div>
              )}
            </div>
            <div className="topbar-popover-wrap">
              <Button
                className="topbar-avatar"
                type="button"
                onClick={() => {
                  setProfileOpen((value) => !value);
                  setNotificationsOpen(false);
                }}
                aria-label={t("app.workspace.profil_malumotlari")}
                aria-expanded={profileOpen}
              >
                A
              </Button>
              {profileOpen && (
                <div className="topbar-popover profile-popover">
                  <strong>{t("app.workspace.azizbek")}</strong>
                  <p>{t("app.workspace.pro_tarif")}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {phase === "home" ? (
          <HomeView
            prompt={prompt}
            promptRef={promptRef}
            onPrompt={setPrompt}
            onStart={startBuilder}
            onNew={openNewAgent}
            onSoon={setSoon}
            onNotice={showToast}
          />
        ) : (
          <div className="builder-shell">
            <div className="builder-mobile-tabs" role="tablist" aria-label={t("app.workspace.agent_qurish_korinishi")}>
              <Button
                type="button"
                role="tab"
                aria-selected={mobilePanel === "chat"}
                className={mobilePanel === "chat" ? "active" : ""}
                onClick={() => setMobilePanel("chat")}
              >
                {t("app.workspace.chat")}</Button>
              <Button
                type="button"
                role="tab"
                aria-selected={mobilePanel === "live"}
                className={mobilePanel === "live" ? "active" : ""}
                onClick={() => setMobilePanel("live")}
              >
                {t("app.workspace.jonli_korinish")}</Button>
            </div>
            <div className="builder-grid">
              <ChatPanel
                mobilePanel={mobilePanel}
                messages={messages}
                step={step}
                typing={typing}
                selectedTools={selectedTools}
                composer={composer}
                readyInteracted={readyInteracted}
                chatEndRef={chatEndRef}
                onAnswer={answer}
                onToggleTool={toggleTool}
                onComposer={setComposer}
                onSubmit={submitComposer}
              />
              <LivePanel
                mobilePanel={mobilePanel}
                draft={draft}
                step={step}
                flash={flash}
                published={published}
                onPublish={publish}
                onTest={testAgent}
              />
            </div>
          </div>
        )}
      </main>

      {commandOpen && <WorkspaceCommandPalette onClose={() => setCommandOpen(false)} commands={[
        ...recentAgents.map(agent => ({ label: agent.name, group: "Agentlar", run: () => startBuilder(t("app.workspace.v0_agentini_sinash", { v0: agent.name })) })),
        ...suggestions.map(item => ({ label: item.text, group: "Shablonlar", run: () => { goHome(); setPrompt(item.text); later(() => promptRef.current?.focus(), 100); } })),
        { label: t("app.workspace.asosiy"), group: "Sahifalar", run: goHome },
        { label: t("app.workspace.agentlarim"), group: "Sahifalar", run: () => { navigate({ to: "/agentlarim" }); } },
        ...(["Marketplace", "Mening toollarim", "Sotuvchi paneli", "To'lovlar"] as SoonKey[]).map(label => ({ label: soonLabel(label), group: t("app.workspace.asosiy_bolimlar"), run: () => setSoon(label) })),
      ]} />}
      {soon && <ComingSoonModal section={soon} onClose={() => setSoon(null)} />}
      {toast && (
        <div className="workspace-toast" role="status">
          <Check />
          {toast}
        </div>
      )}
    </div>
  );
}

function Sidebar({
  builder,
  mobileOpen,
  onClose,
  onHome,
  onSoon,
  onNotice,
}: {
  builder: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  onHome: () => void;
  onSoon: (key: SoonKey) => void;
  onNotice: (text: string) => void;
}) {
  useI18n();
  const items: {
    label: string;
    icon: LucideIcon;
    active?: boolean;
    to?: "/agentlarim";
    soon?: SoonKey;
    badge?: boolean;
  }[] = [
    { label: t("app.workspace.asosiy"), icon: Home, active: true },
    { label: t("app.workspace.agentlarim"), icon: Bot, to: "/agentlarim" },
    { label: t("app.workspace.ai_jamoalar"), icon: Users },
    { label: t("app.workspace.statistika"), icon: BarChart3 },
    { label: t("app.workspace.sozlamalar"), icon: Settings },
    { label: t("app.workspace.marketplace"), icon: Store, soon: "Marketplace", badge: true },
    { label: t("app.workspace.mening_toollarim"), icon: Wrench, soon: "Mening toollarim", badge: true },
    { label: t("app.workspace.sotuvchi_paneli"), icon: Crown, soon: "Sotuvchi paneli", badge: true },
    { label: t("app.workspace.tolovlar"), icon: Wallet, soon: "To'lovlar", badge: true },
  ];

  const content = (
    <>
      <div className="sidebar-brand">
        <Link to="/" aria-label={t("app.workspace.agentus_bosh_sahifasi")}>
          <img src={wordmark} alt="AGENTUS" draggable={false} />
        </Link>
        <span className="collapsed-brand">A.</span>
        <Button className="icon-button sidebar-close" type="button" onClick={onClose} aria-label={t("app.workspace.menyuni_yopish")}>
          <X />
        </Button>
      </div>
      <nav className="sidebar-nav" aria-label={t("app.workspace.asosiy_bolimlar")}>
        {items.map(({ label, icon: Icon, active, to, soon }, index) => {
          const className = `sidebar-link ${active ? "active" : ""}`;
          if (to) {
            return (
              <Link key={label} to={to} className={className} title={label} onClick={onClose}>
                <Icon />
                <span className="sidebar-label"><AIText text={label} /></span>
              </Link>
            );
          }
          return (
            <div key={label} className={soon ? "soon-nav-item" : "nav-item"}>
            {index === 5 && <p className="sidebar-group-title">{t("app.workspace.tez_orada")}</p>}
            <Button
              type="button"
              className={className}
              title={label}
              onClick={() => {
                if (active) onHome();
                else if (soon) onSoon(soon);
                else onNotice(t("app.workspace.v0_hozircha_mavjud_emas", { v0: label }));
                onClose();
              }}
            >
              <Icon />
              <span className="sidebar-label"><AIText text={label} /></span>
              {soon && <Clock className="nav-clock" />}
            </Button>
            </div>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="plan-card">
          <div className="plan-title"><span className="pro-accent">{t("app.workspace.pro")}</span><strong>{t("app.workspace.pro_plan")}</strong></div>
          <UsageLine label="Agentlar" value="3 / 10" percent={30} />
          <Button className="neon-button" type="button" onClick={() => onNotice(t("app.workspace.rejani_yangilash_tez_orada_mavjud_boladi"))}>{t("app.workspace.yangilash")}<ArrowRight /></Button>
        </div>
        <Button className="sidebar-user" type="button" onClick={() => onNotice(t("app.workspace.azizbek_pro_tarif"))} title={t("app.workspace.azizbek_pro_tarif_2")}>
          <span className="user-avatar"><User /></span>
          <span className="sidebar-label user-copy"><strong>{t("app.workspace.azizbek")}</strong><small>{t("app.workspace.pro_tarif")}</small></span>
          <ChevronDown className="sidebar-label" />
        </Button>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && <Button className="sidebar-overlay" type="button" onClick={onClose} aria-label={t("app.workspace.menyuni_yopish")} />}
      <aside className={`workspace-sidebar ${builder ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {content}
      </aside>
    </>
  );
}

function UsageLine({ label, value, percent }: { label: string; value: string; percent: number }) {
  useI18n();
  return (
    <div className="usage-line">
      <div><span>{label}</span><strong>{value}</strong></div>
      <div className="meter-track"><span style={{ width: `${percent}%` }} /></div>
    </div>
  );
}

function HomeView({
  prompt,
  promptRef,
  onPrompt,
  onStart,
  onNew,
  onSoon,
  onNotice,
}: {
  prompt: string;
  promptRef: React.RefObject<HTMLTextAreaElement | null>;
  onPrompt: (value: string) => void;
  onStart: (prompt: string) => void;
  onNew: () => void;
  onSoon: (key: SoonKey) => void;
  onNotice: (text: string) => void;
}) {
  useI18n();
  const [popover, setPopover] = useState<"templates" | "tools" | "language" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 30);
    scroll(); window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  const chooseSuggestion = (text: string) => { onPrompt(text); setPopover(null); promptRef.current?.focus(); };
  const shortLabels = [t("app.workspace.telegram_hisobot_agenti"), t("app.workspace.instagram_kontent_agenti"), t("app.workspace.mijozlar_boti"), t("app.workspace.excel_tahlilchi")];
  const submit = () => onStart(prompt);
  const promptKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="home-content">
      <section className="home-hero">
        <div className="hero-pill"><Sparkles /> {t("app.workspace.agent_yaratish")}</div>
        <h1>{t("app.workspace.qanday_agent_quramiz")}<span>{t("app.workspace.azizbek_2")}</span></h1>
        <p className="hero-description">{t("app.workspace.goyangizni_yozing_agentus_uni_birga_shakllantiradi")}</p>
        <div className="home-prompt-card">
          <textarea
            ref={promptRef}
            value={prompt}
            onChange={(event) => onPrompt(event.target.value)}
            onKeyDown={promptKeyDown}
            placeholder={t("app.workspace.agentusdan_hisobot_yiguvchi_agent_qurishni_sorang")}
            rows={3}
            aria-label={t("app.workspace.agent_goyasi")}
          />
          <div className="prompt-footer">
            <div className="composer-options">
              <Button className="composer-chip" type="button" onClick={() => setPopover(value => value === "templates" ? null : "templates")} aria-expanded={popover === "templates"}><Layers />{t("app.workspace.shablon_tanlash")}</Button>
              <Button className="composer-chip" type="button" onClick={() => setPopover(value => value === "tools" ? null : "tools")} aria-expanded={popover === "tools"}><Wrench />{t("app.workspace.toollar")}</Button>
              <Button className="composer-chip" type="button" onClick={() => setPopover(value => value === "language" ? null : "language")} aria-expanded={popover === "language"}>{t("app.shared.language")}: {getLocale().slice(0,2).toUpperCase()}</Button>
            </div>
            <span className="prompt-shortcut">⌘ ↵</span>
            <Button className="neon-button create-button" type="button" disabled={!prompt.trim()} onClick={submit}>
              {t("app.workspace.yaratish")}<Send />
            </Button>
          </div>
          {popover && <div className="composer-popover">
            {popover === "templates" && suggestions.map((item, index) => <Button key={item.text} type="button" onClick={() => chooseSuggestion(item.text)}>{shortLabels[index]}<ArrowRight /></Button>)}
            {popover === "tools" && <><p>{t("app.workspace.toollar_agent_yaratish_bosqichida_tanlanadi")}</p><Button type="button" onClick={() => { setPopover(null); onSoon("Mening toollarim"); }}>{t("app.workspace.mening_toollarim")}<ArrowRight /></Button></>}
            {popover === "language" && <LanguageSwitcher/>}
          </div>}
        </div>
        <div className="suggestion-grid">
          {suggestions.map(({ icon: Icon, text }, index) => (
            <Button key={text} type="button" onClick={() => chooseSuggestion(text)}>
              <span className="suggestion-icon"><Icon /></span><span>{shortLabels[index]}</span>
            </Button>
          ))}
        </div>
        <a className={`home-scroll-cue ${scrolled ? "scrolled" : ""}`} href="#recent-agents" aria-label={t("app.workspace.songgi_agentlarga_otish")}>
          <Mouse />{t("app.workspace.pastga_suring")}</a>
      </section>

      <div className="home-sections"><p className="workspace-sample-note">{t("app.workspace.korgazma_malumotlari_haqiqiy_foydalanish_natijalari_emas")}</p>
        <section className="dashboard-section" id="recent-agents">
          <div className="section-title-row">
            <div><span className="section-kicker">{t("app.workspace.ish_maydoningiz")}</span><h2>{t("app.workspace.songgi_agentlarim")}</h2></div>
            <Link to="/agentlarim" className="text-link">{t("app.workspace.barchasini_korish")}<ArrowRight /></Link>
          </div>
          <div className="recent-grid">
            {recentAgents.map(({ name, icon: Icon, status }) => (
              <article className="dashboard-card recent-card" key={name} onPointerMove={event => { const box = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--spot-x", `${event.clientX - box.left}px`); event.currentTarget.style.setProperty("--spot-y", `${event.clientY - box.top}px`); }}>
                <div className="recent-card-top">
                  <span className="agent-icon"><Icon /></span>
                  <StatusPill status={status} />
                </div>
                <h3>{name}</h3>
                <p>{t("app.shared.last_run", { time: relativeTime(-2, "hour") })}</p>
                <Button className="glass-button" type="button" onClick={() => onStart(t("app.workspace.v0_agentini_sinash", { v0: name }))}>
                  <Play /> {t("app.workspace.sinash")}</Button>
              </article>
            ))}
            <Button className="new-agent-card" type="button" onClick={onNew}>
              <span className="new-agent-orbit"><Plus /></span><strong>{t("app.workspace.yangi_agent_yarating")}</strong><span>{t("app.workspace.goyadan_ishlaydigan_agentgacha")}</span>
            </Button>
          </div>
        </section>

        <section className="dashboard-split-section">
          <div className="dashboard-section usage-section">
            <div className="section-title-row"><div><span className="section-kicker">{t("app.workspace.joriy_oy")}</span><h2>{t("app.workspace.foydalanish")}</h2></div></div>
            <div className="usage-cards elevated-surface">
              <UsageMetric icon={Bot} label="Agentlar" value="3 / 10" percent={30} />
              <UsageMetric icon={Wrench} label={t("app.workspace.toollar")} value="4 / 10" percent={40} />
              <UsageMetric icon={Zap} label={t("app.workspace.oylik_sorovlar")} value="1 240 / 5 000" percent={24.8} />
            </div>
          </div>
          <div className="dashboard-section checklist-section">
            <div className="section-title-row">
              <div><span className="section-kicker">{t("app.workspace.ilk_qadamlar")}</span><h2>{t("app.workspace.boshlash_uchun")}</h2></div>
              <span className="checklist-progress">1/4</span>
            </div>
            <div className="checklist elevated-surface">
              <div className="onboarding-top"><div className="metric-ring" style={{ "--progress": "90deg" } as CSSProperties}><strong>1/4</strong></div><div><strong>{t("app.workspace.birinchi_qadam_qoyildi")}</strong><p>{t("app.workspace.agent_yarating")}</p></div></div>
              <div className="onboarding-steps">{[t("app.workspace.agent_yarating"), t("app.workspace.tool_ulang"), t("app.workspace.agentni_sinang"), t("app.workspace.jadvalga_qoying")].map((item, index) => <div className={index === 0 ? "done" : ""} key={item}><span>{index === 0 ? <Check /> : index + 1}</span><small>{item}</small></div>)}</div>
              <Button className="neon-button" type="button" onClick={() => onSoon("Mening toollarim")}>{t("app.workspace.keyingi_tool_ulang")}<ArrowRight /></Button>
            </div>
          </div>
        </section>
        <section className="dashboard-section templates-section">
          <div className="section-title-row"><div><span className="section-kicker">{t("app.workspace.goyadan_boshlang")}</span><h2>{t("app.workspace.tayyor_shablonlar")}</h2></div><Button className="text-link" type="button" onClick={() => { promptRef.current?.focus(); promptRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); setPopover("templates"); }}>{t("app.workspace.barchasini_korish")}<ArrowRight /></Button></div>
          <div className="template-rail">{suggestions.map(({ icon: Icon, text }, index) => <article className={`template-tile template-${index}`} key={text}><div className="template-cover"><Icon /></div><h3>{shortLabels[index]}</h3><Button className="glass-button" type="button" onClick={() => { chooseSuggestion(text); promptRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>{t("app.workspace.tanlash")}<ArrowRight /></Button></article>)}</div>
        </section>
        <CosmicEnding onCreate={onNew}/>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  useI18n();
  const active = status === "Faol" || status === t("app.agents.faol");
  const draft = status === "Qoralama" || status === t("app.workspace.qoralama");
  const className = active ? "active" : draft ? "draft" : "paused";
  status = active ? t("app.agents.faol") : draft ? t("app.workspace.qoralama") : t("app.workspace.toxtatilgan");
  return <span className={`status-pill ${className}`}><span />{status}</span>;
}

function UsageMetric({ icon: Icon, label, value, percent }: { icon: LucideIcon; label: string; value: string; percent: number }) {
  useI18n();
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [numeral, limit] = value.split(" / ");
  const total = Number(numeral?.replaceAll(" ", ""));
  useEffect(() => {
    const node = root.current; if (!node) return;
    let frame = 0;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setCount(total); return; }
      const start = performance.now();
      const tick = (time: number) => { const fraction = Math.min((time - start) / 900, 1); setCount(Math.round(total * (1 - (1 - fraction) ** 3))); if (fraction < 1) frame = requestAnimationFrame(tick); };
      frame = requestAnimationFrame(tick);
    }, { threshold: .3 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [total]);
  return <div className="usage-metric" ref={root}>
    <div className="metric-ring" style={{ "--progress": `${percent * 3.6}deg` } as CSSProperties}><strong>{formatNumber(count)}</strong><small>/ {formatNumber(Number(limit?.replaceAll(" ", "")))}</small></div>
    <p><Icon />{label}</p><small>{t("app.workspace.joriy_oy")}</small>
  </div>;
}

function ChatPanel({
  mobilePanel,
  messages,
  step,
  typing,
  selectedTools,
  composer,
  readyInteracted,
  chatEndRef,
  onAnswer,
  onToggleTool,
  onComposer,
  onSubmit,
}: {
  mobilePanel: MobilePanel;
  messages: ChatMessage[];
  step: number;
  typing: boolean;
  selectedTools: string[];
  composer: string;
  readyInteracted: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  onAnswer: (value: string | string[], display?: string) => void;
  onToggleTool: (name: string) => void;
  onComposer: (value: string) => void;
  onSubmit: (event?: FormEvent) => void;
}) {
  useI18n();
  const ready = step >= questions.length;
  return (
    <section className={`chat-panel ${mobilePanel === "chat" ? "mobile-active" : ""}`} aria-label={t("app.workspace.agentus_yordamchisi")}>
      <header className="chat-header">
        <span className="assistant-avatar"><Brain /></span>
        <div><h2>{t("app.workspace.agentus_yordamchisi")}</h2><div className="chat-stepper" role="progressbar" aria-label={t("app.workspace.agent_yaratish_bosqichlari")} aria-valuemin={0} aria-valuemax={5} aria-valuenow={Math.min(step, 5)}>{questions.map((question, i) => <span key={question} className={i < step ? "complete" : i === step ? "current" : ""} title={question}>{i < step && <Check />}</span>)}</div></div>
        <span className="assistant-status" />
      </header>
      <div className="chat-messages">
        {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
        {!typing && (!ready || !readyInteracted) && (
          <div className="current-question">
            <ChatBubble
              message={{
                id: -1,
                role: "assistant",
                text: ready
                  ? t("app.workspace.agent_tayyor_endi_chat_orqali_xohlagan")
                  : questions[step],
              }}
            />
            {!ready && (
              <div className="quick-replies">
                {step === 0 && (
                  <><Button type="button" onClick={() => onAnswer(t("app.workspace.hisobot_yiguvchi"))}>{t("app.workspace.hisobot_yiguvchi")}</Button><Button type="button" onClick={() => onAnswer(t("app.workspace.daily_reporter"))}>{t("app.workspace.daily_reporter")}</Button></>
                )}
                {step === 1 && (
                  <div className="icon-choice-grid">
                    {iconChoices.map(({ id, icon: Icon, label }) => (
                      <Button key={id} type="button" onClick={() => onAnswer(id, label)} aria-label={label}><Icon /><span>{label}</span></Button>
                    ))}
                  </div>
                )}
                {step === 2 && directions.map((direction) => <Button key={direction} type="button" onClick={() => onAnswer(direction)}>{direction}</Button>)}
                {step === 3 && (
                  <div className="tool-picker">
                    <div className="tool-choice-grid">
                      {toolChoices.map(({ name, icon: Icon }) => (
                        <Button key={name} type="button" className={selectedTools.includes(name) ? "selected" : ""} onClick={() => onToggleTool(name)} aria-pressed={selectedTools.includes(name)}>
                          <Icon />{name}{selectedTools.includes(name) && <Check />}
                        </Button>
                      ))}
                    </div>
                    {selectedTools.includes("Telegram") && (
                      <div className="telegram-fields">
                        <label><span>{t("app.workspace.bot_token")}</span><div><LockKeyhole /><input type="password" autoComplete="off" placeholder={t("app.workspace.bot_tokenni_kiriting")} /></div></label>
                        <label><span>{t("app.workspace.chat_id")}</span><div><MessageCircle /><input inputMode="numeric" placeholder={t("app.workspace.chat_id_ni_kiriting")} /></div></label>
                        <p><LockKeyhole />{t("app.workspace.shifrlangan_holda_saqlanadi")}</p>
                      </div>
                    )}
                    <Button className="neon-button tools-continue" type="button" disabled={selectedTools.length === 0} onClick={() => onAnswer(selectedTools)}>{t("app.workspace.davom_etish")}<ArrowRight /></Button>
                  </div>
                )}
                {step === 4 && (
                  <div className="schedule-picker">
                    {schedules.map((schedule) => (
                      <Button key={schedule} type="button" onClick={() => onAnswer(schedule)}>{schedule}{schedule !== t("app.workspace.qolda") && <span>{t("app.workspace.pro")}</span>}</Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {typing && <TypingIndicator />}
        {!typing && !ready && <aside className="chat-tip"><Sparkles /><div><strong>{t("app.workspace.tavsiya")}</strong><p>{[t("app.workspace.yaxshi_nom_qisqa_va_aniq_boladi"), t("app.workspace.ikonka_agentingiz_vazifasini_ifodalasin"), t("app.workspace.maqsadingizga_mos_yonalishni_tanlang"), t("app.workspace.faqat_kerakli_toollarni_tanlang"), t("app.workspace.avval_qolda_sinab_koring")][step]}</p></div></aside>}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-composer-wrap">
        {ready && (
          <div className="edit-hints">
            {[t("app.workspace.nomini_ozgartir"), t("app.workspace.tool_qosh"), t("app.workspace.qoidalarni_qisqartir")].map((hint) => (
              <Button key={hint} type="button" onClick={() => onComposer(hint === t("app.workspace.nomini_ozgartir") ? "Nomini: " : hint)}>{hint}</Button>
            ))}
          </div>
        )}
        <form className="chat-composer" onSubmit={onSubmit}>
          <input
            value={composer}
            onChange={(event) => onComposer(event.target.value)}
            placeholder={ready ? t("app.workspace.agentga_ozgartirish_yozing") : step === 0 ? t("app.workspace.agent_nomini_yozing") : t("app.workspace.javobingizni_yozing")}
            aria-label={t("app.workspace.agentus_yordamchisiga_xabar")}
          />
          <Button type="submit" disabled={!composer.trim() || typing} aria-label={t("app.workspace.xabarni_yuborish")}><Send /></Button>
        </form>
      </div>
    </section>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  useI18n();
  return (
    <div className={`chat-bubble-row ${message.role}`}>
      {message.role === "assistant" && <span className="mini-avatar"><Brain /></span>}
      <div className="chat-bubble"><AIText text={message.text} /></div>
    </div>
  );
}

function TypingIndicator() {
  useI18n();
  return (
    <div className="chat-bubble-row assistant typing-row">
      <span className="mini-avatar"><Brain /></span>
      <div className="chat-bubble"><span /><span /><span /></div>
    </div>
  );
}

function LivePanel({
  mobilePanel,
  draft,
  step,
  flash,
  published,
  onPublish,
  onTest,
}: {
  mobilePanel: MobilePanel;
  draft: Draft;
  step: number;
  flash: string;
  published: boolean;
  onPublish: () => void;
  onTest: () => void;
}) {
  useI18n();
  const ready = step >= questions.length;
  return (
    <section className={`live-panel ${mobilePanel === "live" ? "mobile-active" : ""}`} aria-label={t("app.workspace.agentning_jonli_korinishi")}>
      <WorkspaceCosmos />
      {ready && (
        <div className="live-actions">
          <Button className="glass-button" type="button" onClick={onTest}><Play />{t("app.workspace.sinab_korish")}</Button>
          <Button className="neon-button" type="button" onClick={onPublish}>
            {published ? <>{t("app.workspace.agentga_otish")}<ArrowRight /></> : <><Upload />{t("app.workspace.publish")}</>}
          </Button>
        </div>
      )}
      {step === 0 ? (
        <div className="waiting-state">
          <div className="carousel-heading"><span>{t("app.workspace.agentus_bilan_tanishing")}</span><h2>{t("app.workspace.agentingiz_shu_yerda_shakllanadi")}</h2></div>
          <KnowledgeCarousel cards={carouselCards} />
          <p className="carousel-caption">{t("app.workspace.agentus_savollaringizga_javob_bergach_agent_shu")}</p>
        </div>
      ) : (
        <AgentLiveCard draft={draft} step={step} flash={flash} published={published} ready={ready} />
      )}
    </section>
  );
}

function AgentLiveCard({ draft, step, flash, published, ready }: { draft: Draft; step: number; flash: string; published: boolean; ready: boolean }) {
  useI18n();
  const progress = Math.round((step / questions.length) * 100);
  const selectedIcon = iconChoices.find((choice) => choice.id === draft.icon)?.icon ?? Bot;
  const SelectedIcon = selectedIcon;
  return (
    <div className={`agent-live-wrap ${ready ? "ready" : ""}`}>
      <div className="agent-live-heading">
        <div><span className="section-kicker">{t("app.workspace.jonli_agent")}</span><h2>{ready ? t("app.workspace.agentingiz_tayyor") : t("app.workspace.agent_qurilmoqda")}</h2></div>
        <div className="readiness">
          <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as CSSProperties}><span>{progress}%</span></div>
          <div><strong>{t("app.workspace.tayyorlik")}{progress}%</strong><StatusPill status={published ? "Faol" : "Qoralama"} /></div>
        </div>
      </div>
      <article className="agent-profile-card">
        <div className="agent-profile-top">
          <div className={`live-agent-icon ${flash === "icon" ? "field-flash" : ""}`}><SelectedIcon /></div>
          <div className="agent-name-block">
            {draft.name ? <h3 className={flash === "name" ? "field-flash" : ""}>{draft.name}</h3> : <span className="skeleton skeleton-title" />}
            {draft.name ? <p>{draft.prompt}</p> : <span className="skeleton skeleton-text" />}
          </div>
        </div>
        <div className="agent-chips">
          {draft.direction ? <span className={`agent-chip ${flash === "direction" ? "field-flash" : ""}`}><Layers />{draft.direction}</span> : <span className="skeleton skeleton-chip" />}
          {draft.tools.map((tool) => <span className={`agent-chip ${flash === "tools" ? "field-flash" : ""}`} key={tool}><Wrench />{tool}</span>)}
          {step <= 3 && <span className="skeleton skeleton-chip" />}
          {draft.schedule ? <span className={`agent-chip ${flash === "schedule" ? "field-flash" : ""}`}><CalendarClock />{draft.schedule}</span> : <span className="skeleton skeleton-chip" />}
        </div>
        <div className="agent-detail-grid">
          <section><h4><Zap />{t("app.workspace.maqsad")}</h4><p>{draft.prompt}</p></section>
          <section><h4><BookOpen />{t("app.workspace.korsatmalar")}</h4><p>{draft.instructions || t("app.workspace.foydalanuvchi_bergan_maqsad_asosida_vazifalarni_aniq")}</p></section>
        </div>
        <section className="codex-rules">
          <h4><Shield />{t("app.workspace.codex_qoidalari")}</h4>
          <ul>
            <li>{t("app.workspace.maqsaddan_chetga_chiqmaslik")}</li>
            <li>{t("app.workspace.aniq_va_qisqa_javob_berish")}</li>
            <li>{t("app.workspace.toollarni_faqat_zaruratda_ishlatish")}</li>
            <li>{t("app.workspace.noaniq_malumotni_tekshirish")}</li>
          </ul>
        </section>
      </article>
    </div>
  );
}

function ComingSoonModal({ section, onClose }: { section: SoonKey; onClose: () => void }) {
  useI18n();
  const content = soonContent[section];
  const Icon = content.icon;
  const [registered, setRegistered] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>("button:not([disabled]), [href], input, [tabindex]:not([tabindex='-1'])") ?? []);
    focusable()[0]?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="coming-modal" role="dialog" aria-modal="true" aria-labelledby="coming-title" ref={dialogRef}>
        <Button className="icon-button modal-close" type="button" onClick={onClose} aria-label={t("app.workspace.yopish")}><X /></Button>
        <span className="coming-icon"><Icon /></span>
        <div className="coming-title"><h2 id="coming-title">{soonLabel(section)}</h2><span className="soon-badge"><Clock />{t("app.workspace.tez_orada")}</span></div>
        <p className="coming-description">{content.description} {t("app.workspace.yangi_imkoniyatlar_tayyor_bolganda_shu_bolimda")}</p>
        <div className="coming-preview" aria-hidden="true">
          <div className="preview-sidebar"><span /><span /><span /></div>
          <div className="preview-content"><span /><div><i /><i /><i /></div><span /><span /></div>
        </div>
        <div className="coming-benefits">
          <strong>{t("app.workspace.nimalar_boladi")}</strong>
          <ul>{content.bullets.map((bullet) => <li key={bullet}><Check />{bullet}</li>)}</ul>
        </div>
        <div className="coming-actions">
          <Button className="glass-button" type="button" onClick={onClose}>{t("app.workspace.yopish")}</Button>
          <Button className={`neon-button ${registered ? "registered" : ""}`} type="button" disabled={registered} onClick={() => setRegistered(true)}>
            {registered ? <>{t("app.workspace.royxatga_olindingiz")}<Check /></> : <>{t("app.workspace.chiqqanda_xabar_bering")}<Bell /></>}
          </Button>
        </div>
      </div>
    </div>
  );
}
