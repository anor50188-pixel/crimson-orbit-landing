import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  Bot,
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  Globe,
  Home,
  Loader2,
  Lock,
  Mail,
  Plug,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Trash2,
  Wallet,
  Wrench,
  X,
  Bell,
  HelpCircle,
  Calendar,
  Table2,
  Send,
  Eye,
  Database,
  Instagram,
  Package,
  ShoppingCart,
  TrendingUp,
  StickyNote,
} from "lucide-react";
import wordmark from "@/assets/agentus-wordmark.png";

export const Route = createFileRoute("/mening-toollarim")({
  component: MeningToollarimPage,
  head: () => ({
    meta: [
      { title: "Mening toollarim — Agentus" },
      {
        name: "description",
        content:
          "Toollaringizni boshqaring va yordamchi agentlaringizga ulang.",
      },
    ],
  }),
});

// ————————————————————————————————————————————————————————————————
// Nav
// ————————————————————————————————————————————————————————————————
const navItems = [
  { icon: Home, label: "Asosiy", to: "/" as const },
  { icon: Bot, label: "Agentlarim", to: "/agentlarim" as const },
  { icon: Store, label: "Marketplace" },
  {
    icon: Wrench,
    label: "Mening toollarim",
    to: "/mening-toollarim" as const,
    active: true,
  },
  { icon: Plug, label: "Integratsiyalar" },
  { icon: BookOpen, label: "Kodex" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Wallet, label: "To'lovlar" },
  { icon: Settings, label: "Sozlamalar" },
];

// ————————————————————————————————————————————————————————————————
// Tool catalog — faqat MVP doirasidagi haqiqiy nomlar.
// Sotib olingan sana / o'rnatilgan holat foydalanuvchi ma'lumotidan keladi.
// ————————————————————————————————————————————————————————————————
type ToolTier = "free" | "pro" | "marketplace";
type ToolCategory = "Communication" | "Data" | "AI" | "Automation" | "Files";

type ToolDef = {
  id: string;
  name: string;
  description: string;
  tier: ToolTier;
  category: ToolCategory;
  icon: typeof Wrench;
  accent: string; // tailwind bg class for icon tile
  version: string;
  permissions: string[];
  purchasedAt?: string; // Marketplace uchun
};

const catalog: ToolDef[] = [
  // Free
  {
    id: "telegram-bot",
    name: "Telegram Bot API",
    description: "Telegram orqali xabarlarni yuborish va qabul qilish.",
    tier: "free",
    category: "Communication",
    icon: Send,
    accent: "bg-sky-500/15 text-sky-400",
    version: "1.0.0",
    permissions: ["Xabar yuborish", "Xabar qabul qilish"],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Google Sheets ga yozish va o'qish.",
    tier: "free",
    category: "Data",
    icon: Table2,
    accent: "bg-emerald-500/15 text-emerald-400",
    version: "1.0.0",
    permissions: ["Sheet o'qish", "Sheet yozish"],
  },
  {
    id: "gmail",
    name: "Gmail API",
    description: "Email yuborish va qabul qilish.",
    tier: "free",
    category: "Communication",
    icon: Mail,
    accent: "bg-red-500/15 text-red-400",
    version: "1.0.0",
    permissions: ["Email yuborish", "Inbox o'qish"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Tadbirlar yaratish va boshqarish.",
    tier: "free",
    category: "Automation",
    icon: Calendar,
    accent: "bg-blue-500/15 text-blue-400",
    version: "1.0.0",
    permissions: ["Event yaratish", "Event o'qish"],
  },
  {
    id: "pdf-reader",
    name: "PDF Reader",
    description: "PDF fayllarni o'qish va tahlil qilish.",
    tier: "free",
    category: "Files",
    icon: FileText,
    accent: "bg-rose-500/15 text-rose-400",
    version: "1.0.0",
    permissions: ["Fayl o'qish"],
  },
  {
    id: "http-request",
    name: "HTTP Request",
    description: "REST API ga so'rov yuborish.",
    tier: "free",
    category: "Data",
    icon: Globe,
    accent: "bg-indigo-500/15 text-indigo-400",
    version: "1.0.0",
    permissions: ["HTTP so'rov yuborish"],
  },
  // Pro
  {
    id: "advanced-browser",
    name: "Advanced Browser",
    description: "Web sahifalar bilan chuqur ishlash.",
    tier: "pro",
    category: "Automation",
    icon: Globe,
    accent: "bg-purple-500/15 text-purple-400",
    version: "0.9.0",
    permissions: ["Web navigatsiya", "DOM o'qish"],
  },
  {
    id: "ai-vision",
    name: "AI Vision",
    description: "Rasmlarni tahlil qilish va matn ajratish.",
    tier: "pro",
    category: "AI",
    icon: Eye,
    accent: "bg-fuchsia-500/15 text-fuchsia-400",
    version: "0.8.0",
    permissions: ["Rasm tahlili"],
  },
  {
    id: "deep-research",
    name: "Deep Research",
    description: "Internetdan chuqur ma'lumot yig'ish.",
    tier: "pro",
    category: "AI",
    icon: Search,
    accent: "bg-amber-500/15 text-amber-400",
    version: "0.7.0",
    permissions: ["Web qidiruv", "Kontent tahlili"],
  },
  {
    id: "sql-database",
    name: "SQL Database",
    description: "SQL orqali ma'lumotlar bazasi bilan ishlash.",
    tier: "pro",
    category: "Data",
    icon: Database,
    accent: "bg-cyan-500/15 text-cyan-400",
    version: "0.9.0",
    permissions: ["Query bajarish"],
  },
  {
    id: "automation-suite",
    name: "Automation Suite",
    description: "Murakkab avtomatlashtirish jarayonlarini yaratish.",
    tier: "pro",
    category: "Automation",
    icon: Sparkles,
    accent: "bg-orange-500/15 text-orange-400",
    version: "0.5.0",
    permissions: ["Workflow ishga tushirish"],
  },
  // Marketplace
  {
    id: "instagram-poster",
    name: "Instagram Auto Poster",
    description: "Instagram ga avtomatik post joylash.",
    tier: "marketplace",
    category: "Communication",
    icon: Instagram,
    accent: "bg-pink-500/15 text-pink-400",
    version: "1.2.0",
    permissions: ["Post joylash"],
    purchasedAt: "2025-07-12",
  },
  {
    id: "amazon-kdp",
    name: "Amazon KDP Publisher",
    description: "Kitoblarni Amazon KDP ga avtomatik joylash.",
    tier: "marketplace",
    category: "Automation",
    icon: Package,
    accent: "bg-yellow-500/15 text-yellow-400",
    version: "1.0.0",
    permissions: ["Kitob yuklash"],
    purchasedAt: "2025-07-10",
  },
  {
    id: "uzum-seller",
    name: "Uzum Seller",
    description: "Uzum platformasida sotuvlarni boshqarish.",
    tier: "marketplace",
    category: "Data",
    icon: ShoppingBag,
    accent: "bg-violet-500/15 text-violet-400",
    version: "1.1.0",
    permissions: ["Buyurtma o'qish"],
    purchasedAt: "2025-07-05",
  },
  {
    id: "trading-bot",
    name: "Trading Bot Connector",
    description: "Kripto birjalari bilan ulanish va savdo.",
    tier: "marketplace",
    category: "Automation",
    icon: TrendingUp,
    accent: "bg-emerald-500/15 text-emerald-400",
    version: "0.8.0",
    permissions: ["Trade yaratish"],
    purchasedAt: "2025-06-28",
  },
  {
    id: "notion-integration",
    name: "Notion Integration",
    description: "Notion bilan ma'lumot sinxronizatsiyasi.",
    tier: "marketplace",
    category: "Data",
    icon: StickyNote,
    accent: "bg-slate-400/15 text-slate-300",
    version: "1.0.0",
    permissions: ["Sahifa o'qish", "Sahifa yozish"],
    purchasedAt: "2025-06-18",
  },
];

const INSTALLED_KEY = "agentus:installed-tools";
// Pro rejasi — hozircha demo (backend yo'q).
const USER_IS_PRO = false;

const tabs = [
  { id: "all", label: "Barcha toollar" },
  { id: "free", label: "Free toollar" },
  { id: "pro", label: "Pro toollar" },
  { id: "marketplace", label: "Marketplace toollari" },
  { id: "installed", label: "O'rnatilgan toollar" },
] as const;
type TabId = (typeof tabs)[number]["id"];

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function MeningToollarimPage() {
  const [installed, setInstalled] = useState<string[]>([]);
  const [tab, setTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");
  const [installing, setInstalling] = useState<string | null>(null);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // localStorage — brauzerda saqlanuvchi demo holat
  useEffect(() => {
    try {
      const raw = localStorage.getItem(INSTALLED_KEY);
      if (raw) setInstalled(JSON.parse(raw));
      else setInstalled(["telegram-bot", "google-sheets", "gmail"]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const persistInstalled = (next: string[]) => {
    setInstalled(next);
    try {
      localStorage.setItem(INSTALLED_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const install = (tool: ToolDef) => {
    if (installed.includes(tool.id)) return;
    if (tool.tier === "pro" && !USER_IS_PRO) return;
    setInstalling(tool.id);
    setTimeout(() => {
      persistInstalled([...installed, tool.id]);
      setInstalling(null);
    }, 750);
  };

  const uninstall = (toolId: string) => {
    persistInstalled(installed.filter((id) => id !== toolId));
  };

  // Filtered by tab + query
  const filtered = useMemo(() => {
    return catalog.filter((t) => {
      if (tab === "free" && t.tier !== "free") return false;
      if (tab === "pro" && t.tier !== "pro") return false;
      if (tab === "marketplace" && t.tier !== "marketplace") return false;
      if (tab === "installed" && !installed.includes(t.id)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tab, query, installed]);

  const grouped = useMemo(() => {
    return {
      free: filtered.filter((t) => t.tier === "free"),
      pro: filtered.filter((t) => t.tier === "pro"),
      marketplace: filtered.filter((t) => t.tier === "marketplace"),
    };
  }, [filtered]);

  const stats = {
    total: catalog.length,
    installed: installed.length,
    pro: catalog.filter((t) => t.tier === "pro").length,
    marketplace: catalog.filter((t) => t.tier === "marketplace").length,
  };

  const drawerTool = useMemo(
    () => catalog.find((t) => t.id === drawerId) ?? null,
    [drawerId],
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* SIDEBAR */}
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-border/60 bg-background lg:flex">
        <div className="px-6 py-6">
          <Link to="/" className="inline-flex">
            <img
              src={wordmark}
              alt="AGENTUS"
              className="h-6 w-auto"
              draggable={false}
            />
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map(({ icon: Icon, label, to, active }) => {
            const cls = `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
            }`;
            if (to) {
              return (
                <Link key={label} to={to} className={cls}>
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              );
            }
            return (
              <button
                key={label}
                type="button"
                disabled
                className={`${cls} w-full cursor-not-allowed text-left opacity-60`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            );
          })}
        </nav>
        <div className="mx-3 mb-3 rounded-xl border border-border/60 bg-card/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-primary/15 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            Pro Plan
          </div>
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
            Barcha premium imkoniyatlardan foydalaning.
          </p>
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg bg-primary/80 px-3 py-2 text-xs font-medium text-primary-foreground opacity-70"
          >
            Rejani yangilash
          </button>
        </div>
        <div className="mx-3 mb-4 flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-3 py-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            A
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Azizbek</p>
            <p className="truncate text-[10px] text-primary/80">Pro Plan</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="relative flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div />
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-card/60 hover:text-foreground"
            >
              <HelpCircle className="h-4 w-4" /> Yordam markazi
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:bg-card/60 hover:text-foreground"
              aria-label="Bildirishnomalar"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-2 py-1">
              <div className="grid h-6 w-6 place-items-center rounded-full bg-primary/20 text-[11px] font-semibold text-primary">
                A
              </div>
              <span className="text-sm">Azizbek</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
        </header>

        <div
          ref={scrollRef}
          className={`h-[calc(100vh-65px)] overflow-y-auto px-6 pb-24 pt-6 transition-[filter] duration-300 ${
            drawerId ? "blur-[1px]" : ""
          }`}
        >
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Mening toollarim
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Toollaringizni boshqaring va agentlaringizga ulang.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-5 flex flex-wrap gap-2">
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors ${
                    active
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground hover:bg-card/60 hover:text-foreground"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      active ? "bg-primary" : "bg-muted-foreground/40"
                    }`}
                  />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<Wrench className="h-4 w-4" />}
              accent="bg-primary/15 text-primary"
              label="Jami toollar"
              value={String(stats.total)}
              hint="Barcha toollaringiz"
            />
            <StatCard
              icon={<Check className="h-4 w-4" />}
              accent="bg-emerald-500/15 text-emerald-400"
              label="O'rnatilgan"
              value={String(stats.installed)}
              hint="Foydalanishga tayyor"
            />
            <StatCard
              icon={<Sparkles className="h-4 w-4" />}
              accent="bg-amber-500/15 text-amber-400"
              label="Pro toollar"
              value={String(stats.pro)}
              hint={USER_IS_PRO ? "Pro reja bilan ochildi" : "Pro reja kerak"}
            />
            <StatCard
              icon={<ShoppingBag className="h-4 w-4" />}
              accent="bg-violet-500/15 text-violet-400"
              label="Marketplace"
              value={String(stats.marketplace)}
              hint="Sotib olingan toollar"
            />
          </div>

          {/* Search + filters */}
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tool qidirish..."
                className="w-full rounded-lg border border-border/60 bg-background/60 py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary/60"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterPill label="Barchasi" />
              <FilterPill label="Tavsiya etilgan" />
              <button
                type="button"
                disabled
                title="Rejalashtirilgan"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground opacity-80"
              >
                <Plus className="h-4 w-4" /> Tool qo'shish
              </button>
            </div>
          </div>

          {/* Sections */}
          {(tab === "all" || tab === "free") && grouped.free.length > 0 && (
            <ToolSection
              dotClass="bg-emerald-500"
              title="Free toollar"
              count={grouped.free.length}
              subtitle="Agentus tomonidan bepul beriladigan asosiy toollar."
            >
              <ToolGrid>
                {grouped.free.map((t) => (
                  <ToolCard
                    key={t.id}
                    tool={t}
                    installed={installed.includes(t.id)}
                    installing={installing === t.id}
                    isPro={USER_IS_PRO}
                    onInstall={() => install(t)}
                    onUninstall={() => uninstall(t.id)}
                    onOpenSettings={() => setDrawerId(t.id)}
                  />
                ))}
              </ToolGrid>
            </ToolSection>
          )}

          {(tab === "all" || tab === "pro") && grouped.pro.length > 0 && (
            <ToolSection
              dotClass="bg-amber-500"
              title="Pro toollar"
              count={grouped.pro.length}
              subtitle="Pro reja bilan ochiladigan kuchli toollar."
            >
              <ToolGrid>
                {grouped.pro.map((t) => (
                  <ToolCard
                    key={t.id}
                    tool={t}
                    installed={installed.includes(t.id)}
                    installing={installing === t.id}
                    isPro={USER_IS_PRO}
                    onInstall={() => install(t)}
                    onUninstall={() => uninstall(t.id)}
                    onOpenSettings={() => setDrawerId(t.id)}
                  />
                ))}
              </ToolGrid>
            </ToolSection>
          )}

          {(tab === "all" || tab === "marketplace") &&
            grouped.marketplace.length > 0 && (
              <ToolSection
                dotClass="bg-violet-500"
                title="Marketplace toollari"
                count={grouped.marketplace.length}
                subtitle="Marketplace dan sotib olgan toollaringiz."
              >
                <ToolGrid>
                  {grouped.marketplace.map((t) => (
                    <ToolCard
                      key={t.id}
                      tool={t}
                      installed={installed.includes(t.id)}
                      installing={installing === t.id}
                      isPro={USER_IS_PRO}
                      onInstall={() => install(t)}
                      onUninstall={() => uninstall(t.id)}
                      onOpenSettings={() => setDrawerId(t.id)}
                    />
                  ))}
                </ToolGrid>
              </ToolSection>
            )}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                Hech narsa topilmadi.
              </p>
            </div>
          )}
        </div>

        {/* Drawer overlay */}
        {drawerId && (
          <div
            aria-hidden
            onClick={() => setDrawerId(null)}
            className="fixed inset-0 z-30 bg-background/40 backdrop-blur-[1px]"
          />
        )}

        {/* Tool Settings Drawer */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-border/60 bg-background/95 backdrop-blur transition-transform duration-300 ease-out ${
            drawerId ? "translate-x-0" : "translate-x-full"
          }`}
          aria-hidden={!drawerId}
        >
          {drawerTool && (
            <ToolDrawer
              tool={drawerTool}
              installed={installed.includes(drawerTool.id)}
              onClose={() => setDrawerId(null)}
              onUninstall={() => {
                uninstall(drawerTool.id);
                setDrawerId(null);
              }}
            />
          )}
        </aside>
      </main>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// Small subcomponents
// ————————————————————————————————————————————————————————————————
function StatCard({
  icon,
  accent,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  accent: string;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="flex items-start gap-3">
        <span
          className={`grid h-9 w-9 place-items-center rounded-lg ${accent}`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-xl font-semibold">
            {value}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              ta
            </span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
        </div>
      </div>
    </div>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm text-muted-foreground opacity-80"
    >
      {label}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}

function ToolSection({
  dotClass,
  title,
  count,
  subtitle,
  children,
}: {
  dotClass: string;
  title: string;
  count: number;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <span className={`h-2 w-2 rounded-full ${dotClass}`} />
            {title}{" "}
            <span className="text-muted-foreground">({count})</span>
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <button
          type="button"
          disabled
          className="cursor-not-allowed text-xs text-primary/80 opacity-80"
        >
          Barchasini ko'rish →
        </button>
      </div>
      {children}
    </section>
  );
}

function ToolGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {children}
    </div>
  );
}

function ToolCard({
  tool,
  installed,
  installing,
  isPro,
  onInstall,
  onUninstall,
  onOpenSettings,
}: {
  tool: ToolDef;
  installed: boolean;
  installing: boolean;
  isPro: boolean;
  onInstall: () => void;
  onUninstall: () => void;
  onOpenSettings: () => void;
}) {
  const Icon = tool.icon;
  const locked = tool.tier === "pro" && !isPro && !installed;
  return (
    <div
      className={`group relative flex flex-col rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-primary/40 hover:bg-card/60 ${
        installed ? "ring-1 ring-primary/20" : ""
      }`}
    >
      <div className="mb-3 flex items-start gap-3">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${tool.accent}`}
        >
          {locked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <Icon className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">{tool.name}</p>
          </div>
          {installed && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
              <Check className="h-3 w-3" /> O'rnatilgan
            </span>
          )}
          {tool.tier === "pro" && !installed && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
              Pro
            </span>
          )}
          {tool.tier === "free" && !installed && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
              Bepul
            </span>
          )}
        </div>
      </div>

      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {tool.description}
      </p>

      {/* Placeholder for future backend metric — currently unknown, kept honest */}
      <p className="mb-3 text-[10px] text-muted-foreground/70">
        {tool.purchasedAt
          ? `Sotib olingan: ${formatDate(tool.purchasedAt)}`
          : `v${tool.version}`}
        <span className="mx-1.5">•</span>
        <span title="Backend tayyor bo'lgach real ma'lumot chiqadi">
          Bog'langan agentlar: —
        </span>
      </p>

      <div className="mt-auto flex items-center gap-2">
        {installed ? (
          <>
            <button
              type="button"
              onClick={onUninstall}
              className="flex-1 rounded-lg border border-border/60 bg-background/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-400"
            >
              Olib tashlash
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="rounded-lg border border-border/60 bg-background/40 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Sozlamalar"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </>
        ) : locked ? (
          <button
            type="button"
            disabled
            className="flex-1 cursor-not-allowed rounded-lg border border-border/60 bg-background/40 px-2.5 py-1.5 text-xs text-muted-foreground opacity-70"
          >
            <Lock className="mr-1 inline h-3 w-3" /> Pro Reja
          </button>
        ) : (
          <button
            type="button"
            onClick={onInstall}
            disabled={installing}
            className="flex-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-70"
          >
            {installing ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" /> O'rnatilmoqda...
              </span>
            ) : (
              "O'rnatish"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function ToolDrawer({
  tool,
  installed,
  onClose,
  onUninstall,
}: {
  tool: ToolDef;
  installed: boolean;
  onClose: () => void;
  onUninstall: () => void;
}) {
  const Icon = tool.icon;
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between border-b border-border/60 px-5 py-4">
        <div className="flex items-start gap-3">
          <span
            className={`grid h-10 w-10 place-items-center rounded-lg ${tool.accent}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Tool sozlamalari
            </p>
            <h2 className="mt-0.5 text-lg font-semibold">{tool.name}</h2>
            <p className="text-xs text-muted-foreground">v{tool.version}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-card/60 hover:text-foreground"
          aria-label="Yopish"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 text-sm">
        <section>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            Tavsif
          </p>
          <p className="text-sm leading-relaxed">{tool.description}</p>
        </section>

        <section>
          <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            Ruxsatnomalar
          </p>
          <ul className="space-y-1.5">
            {tool.permissions.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2.5 py-1.5 text-xs"
              >
                <Check className="h-3.5 w-3.5 text-emerald-400" /> {p}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            Bog'langan agentlar
          </p>
          <div className="rounded-md border border-dashed border-border/60 bg-card/30 px-3 py-4 text-center text-xs text-muted-foreground">
            Hozircha bu tool hech qaysi agentga ulanmagan.
            <br />
            <span className="text-[10px] opacity-70">
              (Backend tayyor bo'lgach real ma'lumot chiqadi.)
            </span>
          </div>
        </section>

        {tool.purchasedAt && (
          <section>
            <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Marketplace
            </p>
            <p className="text-xs text-muted-foreground">
              Sotib olingan sana:{" "}
              <span className="text-foreground">
                {formatDate(tool.purchasedAt)}
              </span>
            </p>
          </section>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border/60 px-5 py-4">
        <button
          type="button"
          disabled
          title="Rejalashtirilgan"
          className="flex-1 cursor-not-allowed rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs text-muted-foreground opacity-80"
        >
          Yangilash
        </button>
        {installed && (
          <button
            type="button"
            onClick={onUninstall}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/20"
          >
            <Trash2 className="h-3.5 w-3.5" /> Olib tashlash
          </button>
        )}
      </div>
    </div>
  );
}