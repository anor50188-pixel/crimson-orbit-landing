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

import heroPlanet from "@/assets/hero-planet.jpg";
import wordmark from "@/assets/agentus-wordmark.png";

export const Route = createFileRoute("/agent-yaratish")({
  component: AgentCreatePage,
  head: () => ({
    meta: [
      { title: "Agent yaratish — Agentus" },
      {
        name: "description",
        content: "Agentus yordamchisi bilan suhbatda o‘z AI agentingizni yarating.",
      },
      { property: "og:title", content: "Agent yaratish — Agentus" },
      {
        property: "og:description",
        content: "G‘oyangizni yozing, savollarga javob bering va agentingiz jonli shakllanishini kuzating.",
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

const suggestions = [
  { icon: Send, text: "Telegram orqali hisobot yig'uvchi agent yarat" },
  { icon: Instagram, text: "Instagram postlar tayyorlovchi agent" },
  { icon: MessageCircle, text: "Mijozlar bilan avtomatik muloqot qiluvchi bot" },
  { icon: FileSpreadsheet, text: "Excel fayllar bilan ishlovchi agent" },
];

const recentAgents = [
  { name: "Hisobot yig‘uvchi", icon: BarChart3, status: "Faol" },
  { name: "Kontent yordamchisi", icon: Instagram, status: "Qoralama" },
  { name: "Mijozlar boti", icon: MessageCircle, status: "To‘xtatilgan" },
];

const questions = [
  "Agentingizga qanday nom beramiz?",
  "Ikonka tanlang",
  "Qaysi yo‘nalishga tegishli?",
  "Qaysi tool'lar kerak bo'ladi?",
  "Agent qachon ishlasin?",
];

const directions = [
  "Talabalar",
  "Biznes",
  "Marketing",
  "Qo‘llab-quvvatlash",
  "Kontent",
  "Tadqiqot",
  "Ta’lim",
  "Samaradorlik",
];

const iconChoices: { id: string; icon: LucideIcon; label: string }[] = [
  { id: "bot", icon: Bot, label: "Bot" },
  { id: "chart", icon: BarChart3, label: "Grafik" },
  { id: "mail", icon: Mail, label: "Pochta" },
  { id: "megaphone", icon: Megaphone, label: "E’lon" },
  { id: "book", icon: BookOpen, label: "Kitob" },
  { id: "shield", icon: Shield, label: "Himoya" },
  { id: "cart", icon: ShoppingCart, label: "Savat" },
  { id: "spark", icon: Sparkles, label: "Yulduz" },
];

const toolChoices: { name: string; icon: LucideIcon }[] = [
  { name: "Telegram", icon: Send },
  { name: "Web qidiruv", icon: Search },
  { name: "HTTP so‘rov", icon: Globe },
  { name: "Xotira", icon: Database },
  { name: "Kalkulyator", icon: Calculator },
  { name: "Sana/vaqt", icon: Clock },
];

const schedules = ["Qo‘lda", "Har soat", "Har kuni", "Har hafta"];

const carouselCards: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Bot,
    title: "Agent nima?",
    text: "Mustaqil ishlaydigan AI yordamchi: o‘z maqsadi, qoidalari, toollari va xotirasi bor.",
  },
  {
    icon: Wrench,
    title: "Tool nima?",
    text: "Agent o‘ylaydi, tool harakat qiladi: Telegram, veb-qidiruv, API.",
  },
  {
    icon: Users,
    title: "AI Jamoa",
    text: "Mijoz → Lead → Taklif → Shartnoma: agentlar zanjir bo‘lib ishlaydi.",
  },
  {
    icon: Clock,
    title: "24/7 avtonom",
    text: "Jadval bo‘yicha agent o‘zi ishga tushadi.",
  },
  {
    icon: Database,
    title: "Xotira",
    text: "Agent muhim faktlarni eslab qoladi.",
  },
  {
    icon: Shield,
    title: "Xavfsizlik",
    text: "Tokenlar shifrlangan holda saqlanadi.",
  },
  {
    icon: Store,
    title: "Marketplace",
    text: "Tez orada: agentlaringizni soting va daromad qiling.",
  },
];

const soonContent: Record<
  SoonKey,
  { icon: LucideIcon; description: string; bullets: string[] }
> = {
  Marketplace: {
    icon: Store,
    description: "Tayyor agentlarni toping va bir bosishda o‘zingizniki qiling.",
    bullets: ["Reyting va sharhlar", "Kategoriyalar bo‘yicha qidiruv", "Bir bosishda o‘rnatish"],
  },
  "Mening toollarim": {
    icon: Wrench,
    description: "Barcha ulangan toollarni bir joyda boshqaring.",
    bullets: ["Tokenlarni xavfsiz saqlash", "Toolni bir nechta agentga ulash", "Foydalanish statistikasi"],
  },
  "Sotuvchi paneli": {
    icon: Crown,
    description: "Agentingizni soting va daromad oling.",
    bullets: ["75% daromad sizga", "Sotuvlar va reyting statistikasi", "Oylik to‘lovlar"],
  },
  "To'lovlar": {
    icon: Wallet,
    description: "Obuna va to‘lovlarni qulay boshqaring.",
    bullets: ["Payme va Click orqali to‘lov", "To‘lov tarixi", "Tarifni bir bosishda yangilash"],
  },
};

let messageId = 0;
const nextMessageId = () => ++messageId;

function AgentCreatePage() {
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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
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
    if (phase !== "builder" || step !== 0 || carouselPaused) return;
    const timer = window.setInterval(
      () => setCarouselIndex((index) => (index + 1) % carouselCards.length),
      4000,
    );
    return () => window.clearInterval(timer);
  }, [phase, step, carouselPaused]);

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
          tools: current.tools.includes("Web qidiruv")
            ? current.tools
            : [...current.tools, "Web qidiruv"],
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
          text: "O‘zgartirish jonli ko‘rinishga qo‘shildi.",
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
    showToast("Agent e’lon qilindi");
  };

  const testAgent = () => {
    setMessages((current) => [
      ...current,
      {
        id: nextMessageId(),
        role: "assistant",
        text: "Sinov uchun chatga buyruq yozing — o‘zgartirish jonli ko‘rinishda aks etadi.",
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
        <img className="workspace-horizon" src={heroPlanet} alt="" draggable={false} />
        <div className="workspace-stars" aria-hidden="true" />

        <header className="workspace-topbar">
          <div className="topbar-title">
            <button
              className="icon-button mobile-menu-button"
              type="button"
              onClick={() => setMobileMenu(true)}
              aria-label="Menyuni ochish"
            >
              <Menu />
            </button>
            <span>Agentus</span>
            <ChevronRight aria-hidden="true" />
            <strong>{phase === "home" ? "Asosiy" : "Agent yaratish"}</strong>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button"
              type="button"
              onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Yorug‘ mavzuga o‘tish" : "Tungi mavzuga o‘tish"}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
            <span className="language-chip">UZ</span>
            <div className="topbar-popover-wrap">
              <button
                className="icon-button notification-button"
                type="button"
                onClick={() => {
                  setNotificationsOpen((value) => !value);
                  setProfileOpen(false);
                }}
                aria-label="Bildirishnomalar"
                aria-expanded={notificationsOpen}
              >
                <Bell />
              </button>
              {notificationsOpen && (
                <div className="topbar-popover">
                  <strong>Bildirishnomalar</strong>
                  <p>Yangi bildirishnoma yo‘q</p>
                </div>
              )}
            </div>
            <div className="topbar-popover-wrap">
              <button
                className="topbar-avatar"
                type="button"
                onClick={() => {
                  setProfileOpen((value) => !value);
                  setNotificationsOpen(false);
                }}
                aria-label="Profil ma’lumotlari"
                aria-expanded={profileOpen}
              >
                A
              </button>
              {profileOpen && (
                <div className="topbar-popover profile-popover">
                  <strong>Azizbek</strong>
                  <p>Pro tarif</p>
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
          />
        ) : (
          <div className="builder-shell">
            <div className="builder-mobile-tabs" role="tablist" aria-label="Agent qurish ko‘rinishi">
              <button
                type="button"
                role="tab"
                aria-selected={mobilePanel === "chat"}
                className={mobilePanel === "chat" ? "active" : ""}
                onClick={() => setMobilePanel("chat")}
              >
                Chat
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mobilePanel === "live"}
                className={mobilePanel === "live" ? "active" : ""}
                onClick={() => setMobilePanel("live")}
              >
                Jonli ko‘rinish
              </button>
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
                carouselIndex={carouselIndex}
                carouselPaused={carouselPaused}
                onCarousel={setCarouselIndex}
                onPause={setCarouselPaused}
                onPublish={publish}
                onTest={testAgent}
              />
            </div>
          </div>
        )}
      </main>

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
  const items: {
    label: string;
    icon: LucideIcon;
    active?: boolean;
    to?: "/agentlarim";
    soon?: SoonKey;
    badge?: boolean;
  }[] = [
    { label: "Asosiy", icon: Home, active: true },
    { label: "Agentlarim", icon: Bot, to: "/agentlarim" },
    { label: "AI jamoalar", icon: Users },
    { label: "Statistika", icon: BarChart3 },
    { label: "Marketplace", icon: Store, soon: "Marketplace", badge: true },
    { label: "Mening toollarim", icon: Wrench, soon: "Mening toollarim", badge: true },
    { label: "Sotuvchi paneli", icon: Crown, soon: "Sotuvchi paneli", badge: true },
    { label: "To'lovlar", icon: Wallet, soon: "To'lovlar", badge: true },
    { label: "Sozlamalar", icon: Settings },
  ];

  const content = (
    <>
      <div className="sidebar-brand">
        <Link to="/" aria-label="Agentus bosh sahifasi">
          <img src={wordmark} alt="AGENTUS" draggable={false} />
        </Link>
        <span className="collapsed-brand">A.</span>
        <button className="icon-button sidebar-close" type="button" onClick={onClose} aria-label="Menyuni yopish">
          <X />
        </button>
      </div>
      <nav className="sidebar-nav" aria-label="Asosiy bo‘limlar">
        {items.map(({ label, icon: Icon, active, to, soon, badge }) => {
          const className = `sidebar-link ${active ? "active" : ""}`;
          if (to) {
            return (
              <Link key={label} to={to} className={className} title={label} onClick={onClose}>
                <Icon />
                <span className="sidebar-label">{label}</span>
              </Link>
            );
          }
          return (
            <button
              key={label}
              type="button"
              className={className}
              title={label}
              onClick={() => {
                if (active) onHome();
                else if (soon) onSoon(soon);
                else onNotice(`${label} hozircha mavjud emas`);
                onClose();
              }}
            >
              <Icon />
              <span className="sidebar-label">{label}</span>
              {badge && <span className="soon-badge">Tez orada</span>}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="plan-card">
          <div className="plan-title"><Box /><strong>Pro Plan</strong></div>
          <p>Barcha premium imkoniyatlardan foydalaning.</p>
          <button className="neon-button" type="button" onClick={() => onNotice("Rejani yangilash tez orada mavjud bo‘ladi")}>
            Rejani yangilash
          </button>
        </div>
        <div className="sidebar-usage">
          <UsageLine label="Agentlar" value="3 / 10" percent={30} />
          <UsageLine label="So‘rovlar" value="1 240 / 5 000" percent={24.8} />
        </div>
        <button className="sidebar-user" type="button" onClick={() => onNotice("Azizbek · Pro tarif")} title="Azizbek, Pro tarif">
          <span className="user-avatar"><User /></span>
          <span className="sidebar-label user-copy"><strong>Azizbek</strong><small>Pro tarif</small></span>
          <ChevronDown className="sidebar-label" />
        </button>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && <button className="sidebar-overlay" type="button" onClick={onClose} aria-label="Menyuni yopish" />}
      <aside className={`workspace-sidebar ${builder ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {content}
      </aside>
    </>
  );
}

function UsageLine({ label, value, percent }: { label: string; value: string; percent: number }) {
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
}: {
  prompt: string;
  promptRef: React.RefObject<HTMLTextAreaElement | null>;
  onPrompt: (value: string) => void;
  onStart: (prompt: string) => void;
  onNew: () => void;
}) {
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
        <div className="hero-pill"><Sparkles /> Agent yaratish</div>
        <h1>Qanday agent quramiz, <span>Azizbek?</span></h1>
        <p className="hero-description">G‘oyangizni yozing — Agentus uni birga shakllantiramiz.</p>
        <div className="home-prompt-card">
          <textarea
            ref={promptRef}
            value={prompt}
            onChange={(event) => onPrompt(event.target.value)}
            onKeyDown={promptKeyDown}
            placeholder="Agentusdan hisobot yig'uvchi agent qurishni so'rang…"
            rows={3}
            aria-label="Agent g‘oyasi"
          />
          <div className="prompt-footer">
            <span><kbd>Ctrl</kbd><Plus /><kbd>Enter</kbd></span>
            <button className="neon-button create-button" type="button" disabled={!prompt.trim()} onClick={submit}>
              Yaratish <Send />
            </button>
          </div>
        </div>
        <div className="suggestion-grid">
          {suggestions.map(({ icon: Icon, text }) => (
            <button key={text} type="button" onClick={() => onPrompt(text)}>
              <Icon /><span>{text}</span>
            </button>
          ))}
        </div>
        <a className="home-scroll-cue" href="#recent-agents" aria-label="So‘nggi agentlarga o‘tish">
          <span />Pastga suring
        </a>
      </section>

      <div className="home-sections">
        <section className="dashboard-section" id="recent-agents">
          <div className="section-title-row">
            <div><span className="section-kicker">Ish maydoningiz</span><h2>So‘nggi agentlarim</h2></div>
            <Link to="/agentlarim" className="text-link">Barchasini ko‘rish <ArrowRight /></Link>
          </div>
          <div className="recent-grid">
            {recentAgents.map(({ name, icon: Icon, status }) => (
              <article className="dashboard-card recent-card" key={name}>
                <div className="recent-card-top">
                  <span className="agent-icon"><Icon /></span>
                  <StatusPill status={status} />
                </div>
                <h3>{name}</h3>
                <p>Oxirgi ishga tushirish: 2 soat oldin</p>
                <button className="glass-button" type="button" onClick={() => onStart(`${name} agentini sinash`)}>
                  <Play /> Sinash
                </button>
              </article>
            ))}
            <button className="new-agent-card" type="button" onClick={onNew}>
              <Plus /><strong>Yangi agent</strong><span>G‘oyadan ishlaydigan agentgacha</span>
            </button>
          </div>
        </section>

        <section className="dashboard-split-section">
          <div className="dashboard-section usage-section">
            <div className="section-title-row"><div><span className="section-kicker">Joriy oy</span><h2>Foydalanish</h2></div></div>
            <div className="usage-cards">
              <UsageMetric icon={Bot} label="Agentlar" value="3 / 10" percent={30} />
              <UsageMetric icon={Wrench} label="Tool'lar" value="4 / 10" percent={40} />
              <UsageMetric icon={Zap} label="Oylik so‘rovlar" value="1 240 / 5 000" percent={24.8} />
            </div>
          </div>
          <div className="dashboard-section checklist-section">
            <div className="section-title-row">
              <div><span className="section-kicker">Ilk qadamlar</span><h2>Boshlash uchun</h2></div>
              <span className="checklist-progress">1/4</span>
            </div>
            <div className="checklist">
              {["Agent yarating", "Tool ulang", "Agentni sinang", "Jadvalga qo‘ying"].map((item, index) => (
                <div className={index === 0 ? "done" : ""} key={item}>
                  {index === 0 ? <Check /> : <Circle />}<span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const className = status === "Faol" ? "active" : status === "Qoralama" ? "draft" : "paused";
  return <span className={`status-pill ${className}`}><span />{status}</span>;
}

function UsageMetric({ icon: Icon, label, value, percent }: { icon: LucideIcon; label: string; value: string; percent: number }) {
  return (
    <div className="usage-metric dashboard-card">
      <div><span className="metric-icon"><Icon /></span><span>{label}</span><strong>{value}</strong></div>
      <div className="meter-track"><span style={{ width: `${percent}%` }} /></div>
    </div>
  );
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
  const ready = step >= questions.length;
  return (
    <section className={`chat-panel ${mobilePanel === "chat" ? "mobile-active" : ""}`} aria-label="Agentus yordamchisi">
      <header className="chat-header">
        <span className="assistant-avatar"><Brain /></span>
        <div><h2>Agentus yordamchisi</h2><p><span />Savol {Math.min(step + 1, 5)} / 5</p></div>
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
                  ? "Agent tayyor! Endi chat orqali xohlagan narsani o‘zgartirishingiz mumkin."
                  : questions[step],
              }}
            />
            {!ready && (
              <div className="quick-replies">
                {step === 0 && (
                  <><button type="button" onClick={() => onAnswer("Hisobot yig‘uvchi")}>Hisobot yig‘uvchi</button><button type="button" onClick={() => onAnswer("Daily Reporter")}>Daily Reporter</button></>
                )}
                {step === 1 && (
                  <div className="icon-choice-grid">
                    {iconChoices.map(({ id, icon: Icon, label }) => (
                      <button key={id} type="button" onClick={() => onAnswer(id, label)} aria-label={label}><Icon /><span>{label}</span></button>
                    ))}
                  </div>
                )}
                {step === 2 && directions.map((direction) => <button key={direction} type="button" onClick={() => onAnswer(direction)}>{direction}</button>)}
                {step === 3 && (
                  <div className="tool-picker">
                    <div className="tool-choice-grid">
                      {toolChoices.map(({ name, icon: Icon }) => (
                        <button key={name} type="button" className={selectedTools.includes(name) ? "selected" : ""} onClick={() => onToggleTool(name)} aria-pressed={selectedTools.includes(name)}>
                          <Icon />{name}{selectedTools.includes(name) && <Check />}
                        </button>
                      ))}
                    </div>
                    {selectedTools.includes("Telegram") && (
                      <div className="telegram-fields">
                        <label><span>Bot token</span><div><LockKeyhole /><input type="password" autoComplete="off" placeholder="Bot tokenni kiriting" /></div></label>
                        <label><span>Chat ID</span><div><MessageCircle /><input inputMode="numeric" placeholder="Chat ID ni kiriting" /></div></label>
                        <p><LockKeyhole />Shifrlangan holda saqlanadi</p>
                      </div>
                    )}
                    <button className="neon-button tools-continue" type="button" disabled={selectedTools.length === 0} onClick={() => onAnswer(selectedTools)}>Davom etish <ArrowRight /></button>
                  </div>
                )}
                {step === 4 && (
                  <div className="schedule-picker">
                    {schedules.map((schedule) => (
                      <button key={schedule} type="button" onClick={() => onAnswer(schedule)}>{schedule}{schedule !== "Qo‘lda" && <span>Pro</span>}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {typing && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-composer-wrap">
        {ready && (
          <div className="edit-hints">
            {["Nomini o‘zgartir", "Tool qo‘sh", "Qoidalarni qisqartir"].map((hint) => (
              <button key={hint} type="button" onClick={() => onComposer(hint === "Nomini o‘zgartir" ? "Nomini: " : hint)}>{hint}</button>
            ))}
          </div>
        )}
        <form className="chat-composer" onSubmit={onSubmit}>
          <input
            value={composer}
            onChange={(event) => onComposer(event.target.value)}
            placeholder={ready ? "Agentga o‘zgartirish yozing…" : step === 0 ? "Agent nomini yozing…" : "Javobingizni yozing…"}
            aria-label="Agentus yordamchisiga xabar"
          />
          <button type="submit" disabled={!composer.trim() || typing} aria-label="Xabarni yuborish"><Send /></button>
        </form>
      </div>
    </section>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={`chat-bubble-row ${message.role}`}>
      {message.role === "assistant" && <span className="mini-avatar"><Brain /></span>}
      <div className="chat-bubble">{message.text}</div>
    </div>
  );
}

function TypingIndicator() {
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
  carouselIndex,
  carouselPaused,
  onCarousel,
  onPause,
  onPublish,
  onTest,
}: {
  mobilePanel: MobilePanel;
  draft: Draft;
  step: number;
  flash: string;
  published: boolean;
  carouselIndex: number;
  carouselPaused: boolean;
  onCarousel: (index: number) => void;
  onPause: (paused: boolean) => void;
  onPublish: () => void;
  onTest: () => void;
}) {
  const ready = step >= questions.length;
  return (
    <section className={`live-panel ${mobilePanel === "live" ? "mobile-active" : ""}`} aria-label="Agentning jonli ko‘rinishi">
      <div className="live-panel-glow" aria-hidden="true" />
      {ready && (
        <div className="live-actions">
          <button className="glass-button" type="button" onClick={onTest}><Play />Sinab ko‘rish</button>
          <button className="neon-button" type="button" onClick={onPublish}>
            {published ? <>Agentga o‘tish <ArrowRight /></> : <><Upload />Publish</>}
          </button>
        </div>
      )}
      {step === 0 ? (
        <div className="waiting-state">
          <div className="carousel-heading"><span>AGENTUS BILAN TANISHING</span><h2>Agentingiz shu yerda shakllanadi</h2></div>
          <div
            className="info-carousel"
            onMouseEnter={() => onPause(true)}
            onMouseLeave={() => onPause(false)}
          >
            {carouselCards.map(({ icon: Icon, title, text }, index) => {
              let offset = index - carouselIndex;
              if (offset > 3) offset -= carouselCards.length;
              if (offset < -3) offset += carouselCards.length;
              const style = {
                "--offset": offset,
                "--depth": Math.abs(offset),
                zIndex: 10 - Math.abs(offset),
              } as CSSProperties;
              return (
                <article className={`info-card ${Math.abs(offset) > 2 ? "hidden-card" : ""}`} style={style} key={title} aria-hidden={offset !== 0}>
                  <span className="info-card-icon"><Icon /></span>
                  <h3>{title}</h3><p>{text}</p>
                  <span className="info-card-number">0{index + 1}</span>
                </article>
              );
            })}
          </div>
          <div className="carousel-dots">
            {carouselCards.map((card, index) => (
              <button key={card.title} type="button" className={index === carouselIndex ? "active" : ""} onClick={() => onCarousel(index)} aria-label={`${index + 1}-karta`} aria-current={index === carouselIndex ? "true" : undefined} />
            ))}
          </div>
          <p className="carousel-caption">Agentus savollaringizga javob bergach agent shu yerda shakllanadi.</p>
        </div>
      ) : (
        <AgentLiveCard draft={draft} step={step} flash={flash} published={published} ready={ready} />
      )}
    </section>
  );
}

function AgentLiveCard({ draft, step, flash, published, ready }: { draft: Draft; step: number; flash: string; published: boolean; ready: boolean }) {
  const progress = Math.round((step / questions.length) * 100);
  const selectedIcon = iconChoices.find((choice) => choice.id === draft.icon)?.icon ?? Bot;
  const SelectedIcon = selectedIcon;
  return (
    <div className={`agent-live-wrap ${ready ? "ready" : ""}`}>
      <div className="agent-live-heading">
        <div><span className="section-kicker">Jonli agent</span><h2>{ready ? "Agentingiz tayyor" : "Agent qurilmoqda"}</h2></div>
        <div className="readiness">
          <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as CSSProperties}><span>{progress}%</span></div>
          <div><strong>Tayyorlik {progress}%</strong><StatusPill status={published ? "Faol" : "Qoralama"} /></div>
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
          <section><h4><Zap />Maqsad</h4><p>{draft.prompt}</p></section>
          <section><h4><BookOpen />Ko‘rsatmalar</h4><p>{draft.instructions || "Foydalanuvchi bergan maqsad asosida vazifalarni aniq va tartibli bajaradi."}</p></section>
        </div>
        <section className="codex-rules">
          <h4><Shield />Codex qoidalari</h4>
          <ul>
            <li>Maqsaddan chetga chiqmaslik</li>
            <li>Aniq va qisqa javob berish</li>
            <li>Tool'larni faqat zaruratda ishlatish</li>
            <li>Noaniq ma’lumotni tekshirish</li>
          </ul>
        </section>
      </article>
    </div>
  );
}

function ComingSoonModal({ section, onClose }: { section: SoonKey; onClose: () => void }) {
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
        <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Yopish"><X /></button>
        <span className="coming-icon"><Icon /></span>
        <div className="coming-title"><h2 id="coming-title">{section}</h2><span className="soon-badge">Tez orada</span></div>
        <p className="coming-description">{content.description} Yangi imkoniyatlar tayyor bo‘lganda shu bo‘limda ochiladi.</p>
        <div className="coming-preview" aria-hidden="true">
          <div className="preview-sidebar"><span /><span /><span /></div>
          <div className="preview-content"><span /><div><i /><i /><i /></div><span /><span /></div>
        </div>
        <div className="coming-benefits">
          <strong>Nimalar bo‘ladi</strong>
          <ul>{content.bullets.map((bullet) => <li key={bullet}><Check />{bullet}</li>)}</ul>
        </div>
        <div className="coming-actions">
          <button className="glass-button" type="button" onClick={onClose}>Yopish</button>
          <button className="neon-button" type="button" disabled={registered} onClick={() => setRegistered(true)}>
            {registered ? <>Ro‘yxatga olindingiz <Check /></> : <>Chiqqanda xabar bering <Bell /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
