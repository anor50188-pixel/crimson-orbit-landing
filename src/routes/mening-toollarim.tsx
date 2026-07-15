import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Bot,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  Crown,
  ExternalLink,
  Eye,
  EyeOff,
  Home,
  Info,
  Link2,
  Loader2,
  Lock,
  Plug,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Trash2,
  Unplug,
  Wallet,
  Wrench,
  X,
  Bell,
  HelpCircle,
  RefreshCw,
  Zap,
  History,
} from "lucide-react";
import wordmark from "@/assets/agentus-wordmark.png";
import {
  INSTALLED_TOOLS_KEY,
  readInstalledToolIds,
  readToolConfigs,
  writeToolConfigs,
  isToolAuthenticated,
  toolCatalog,
  writeInstalledToolIds,
  readToolInstances,
  writeToolInstances,
  instancesForTool,
  toolStatus,
  type InstanceField,
  type ToolInstance,
  type ConnectionStatus,
  type PermissionKey,
  type ToolConfig,
  type ToolDef,
  type ActivityKind,
} from "@/lib/tools-catalog";

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
  { icon: Crown, label: "Sotuvchi paneli", to: "/seller" as const },
  { icon: Plug, label: "Integratsiyalar" },
  { icon: BookOpen, label: "Kodex" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Wallet, label: "To'lovlar" },
  { icon: Settings, label: "Sozlamalar" },
];

const catalog = toolCatalog;
const USER_IS_PRO = false;

const tabs = [
  { id: "all", label: "Barcha toollar" },
  { id: "free", label: "Free toollar" },
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

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function emptyConfig(tool: ToolDef): ToolConfig {
  const perms: Partial<Record<PermissionKey, boolean>> = {};
  (tool.defaultPermissions ?? []).forEach((p) => (perms[p] = true));
  return {
    toolId: tool.id,
    fields: {},
    permissions: perms,
    connection: "unconfigured",
    activity: [],
  };
}

function MeningToollarimPage() {
  const [installed, setInstalled] = useState<string[]>([]);
  const [configs, setConfigs] = useState<Record<string, ToolConfig>>({});
  const [instances, setInstances] = useState<ToolInstance[]>([]);
  const [tab, setTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");
  const [installing, setInstalling] = useState<string | null>(null);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInstalled(readInstalledToolIds());
    setConfigs(readToolConfigs());
    setInstances(readToolInstances());
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
    writeInstalledToolIds(next);
  };

  const persistConfig = (cfg: ToolConfig) => {
    const next = { ...configs, [cfg.toolId]: cfg };
    setConfigs(next);
    writeToolConfigs(next);
  };

  const persistInstances = (list: ToolInstance[]) => {
    setInstances(list);
    writeToolInstances(list);
  };

  const install = (tool: ToolDef) => {
    if (installed.includes(tool.id)) return;
    if (tool.tier === "pro" && !USER_IS_PRO) return;
    setInstalling(tool.id);
    setTimeout(() => {
      persistInstalled([...installed, tool.id]);
      setInstalling(null);
      // Konfiguratsiya kerak bo'lsa darrov panelni ochamiz
      if ((tool.authFields ?? []).length > 0) setDrawerId(tool.id);
    }, 600);
  };

  const uninstall = (toolId: string) => {
    persistInstalled(installed.filter((id) => id !== toolId));
    const { [toolId]: _removed, ...rest } = configs;
    setConfigs(rest);
    writeToolConfigs(rest);
    persistInstances(instances.filter((i) => i.toolId !== toolId));
  };

  const freeCatalog = useMemo(() => catalog.filter((t) => t.tier === "free"), []);

  const filtered = useMemo(() => {
    return freeCatalog.filter((t) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [freeCatalog, query]);

  const grouped = useMemo(
    () => ({
      free: filtered,
    }),
    [filtered],
  );

  const stats = {
    total: freeCatalog.length,
    installed: installed.filter((id) => freeCatalog.some((t) => t.id === id)).length,
  };

  const drawerTool = useMemo(
    () => catalog.find((t) => t.id === drawerId) ?? null,
    [drawerId],
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-border/60 bg-background lg:flex">
        <div className="px-6 py-6">
          <Link to="/" className="inline-flex">
            <img src={wordmark} alt="AGENTUS" className="h-6 w-auto" draggable={false} />
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

      <main className="relative flex-1 overflow-hidden">
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
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Mening toollarim</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Toollaringizni boshqaring va agentlaringizga ulang.
            </p>
          </div>

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
                  <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/40"}`} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={<Wrench className="h-4 w-4" />} accent="bg-primary/15 text-primary" label="Jami toollar" value={String(stats.total)} hint="Barcha toollaringiz" />
            <StatCard icon={<Check className="h-4 w-4" />} accent="bg-emerald-500/15 text-emerald-400" label="O'rnatilgan" value={String(stats.installed)} hint="Foydalanishga tayyor" />
            <StatCard icon={<Sparkles className="h-4 w-4" />} accent="bg-amber-500/15 text-amber-400" label="Pro toollar" value={String(stats.pro)} hint={USER_IS_PRO ? "Pro reja bilan ochildi" : "Pro reja kerak"} />
            <StatCard icon={<ShoppingBag className="h-4 w-4" />} accent="bg-violet-500/15 text-violet-400" label="Marketplace" value={String(stats.marketplace)} hint="Sotib olingan toollar" />
          </div>

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

          {(tab === "all" || tab === "free") && grouped.free.length > 0 && (
            <ToolSection dotClass="bg-emerald-500" title="Free toollar" count={grouped.free.length} subtitle="Agentus tomonidan bepul beriladigan asosiy toollar.">
              <ToolGrid>
                {grouped.free.map((t) => (
                  <ToolCard key={t.id} tool={t} config={configs[t.id]} instanceCount={instancesForTool(instances, t.id).length} installed={installed.includes(t.id)} installing={installing === t.id} isPro={USER_IS_PRO} onInstall={() => install(t)} onUninstall={() => uninstall(t.id)} onOpenSettings={() => setDrawerId(t.id)} />
                ))}
              </ToolGrid>
            </ToolSection>
          )}

          {(tab === "all" || tab === "pro") && grouped.pro.length > 0 && (
            <ToolSection dotClass="bg-amber-500" title="Pro toollar" count={grouped.pro.length} subtitle="Pro reja bilan ochiladigan kuchli toollar.">
              <ToolGrid>
                {grouped.pro.map((t) => (
                  <ToolCard key={t.id} tool={t} config={configs[t.id]} instanceCount={instancesForTool(instances, t.id).length} installed={installed.includes(t.id)} installing={installing === t.id} isPro={USER_IS_PRO} onInstall={() => install(t)} onUninstall={() => uninstall(t.id)} onOpenSettings={() => setDrawerId(t.id)} />
                ))}
              </ToolGrid>
            </ToolSection>
          )}

          {(tab === "all" || tab === "marketplace") && grouped.marketplace.length > 0 && (
            <ToolSection dotClass="bg-violet-500" title="Marketplace toollari" count={grouped.marketplace.length} subtitle="Marketplace dan sotib olgan toollaringiz.">
              <ToolGrid>
                {grouped.marketplace.map((t) => (
                  <ToolCard key={t.id} tool={t} config={configs[t.id]} instanceCount={instancesForTool(instances, t.id).length} installed={installed.includes(t.id)} installing={installing === t.id} isPro={USER_IS_PRO} onInstall={() => install(t)} onUninstall={() => uninstall(t.id)} onOpenSettings={() => setDrawerId(t.id)} />
                ))}
              </ToolGrid>
            </ToolSection>
          )}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center">
              <p className="text-sm text-muted-foreground">Hech narsa topilmadi.</p>
            </div>
          )}
        </div>

        {drawerId && (
          <div
            aria-hidden
            onClick={() => setDrawerId(null)}
            className="fixed inset-0 z-30 bg-background/40 backdrop-blur-[1px]"
          />
        )}

        <aside
          className={`fixed inset-y-0 right-0 z-40 flex w-full max-w-[520px] flex-col border-l border-border/60 bg-background/95 backdrop-blur transition-transform duration-300 ease-out ${
            drawerId ? "translate-x-0" : "translate-x-full"
          }`}
          aria-hidden={!drawerId}
        >
          {drawerTool && (
            <ToolDrawer
              key={drawerTool.id}
              tool={drawerTool}
              installed={installed.includes(drawerTool.id)}
              config={configs[drawerTool.id] ?? emptyConfig(drawerTool)}
              instances={instancesForTool(instances, drawerTool.id)}
              onClose={() => setDrawerId(null)}
              onUninstall={() => {
                uninstall(drawerTool.id);
                setDrawerId(null);
              }}
              onPersist={persistConfig}
              onPersistInstances={(list) => {
                const others = instances.filter((i) => i.toolId !== drawerTool.id);
                persistInstances([...others, ...list]);
              }}
            />
          )}
        </aside>
      </main>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// Kartochka va boshqa yordamchi komponentlar
// ————————————————————————————————————————————————————————————————
function StatCard({ icon, accent, label, value, hint }: { icon: React.ReactNode; accent: string; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="flex items-start gap-3">
        <span className={`grid h-9 w-9 place-items-center rounded-lg ${accent}`}>{icon}</span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-xl font-semibold">
            {value}
            <span className="ml-1 text-xs font-normal text-muted-foreground">ta</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
        </div>
      </div>
    </div>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button type="button" disabled className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm text-muted-foreground opacity-80">
      {label}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}

function ToolSection({ dotClass, title, count, subtitle, children }: { dotClass: string; title: string; count: number; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <span className={`h-2 w-2 rounded-full ${dotClass}`} />
            {title} <span className="text-muted-foreground">({count})</span>
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <button type="button" disabled className="cursor-not-allowed text-xs text-primary/80 opacity-80">
          Barchasini ko'rish →
        </button>
      </div>
      {children}
    </section>
  );
}

function ToolGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">{children}</div>;
}

function statusPill(status: ConnectionStatus, configured: boolean) {
  if (!configured) return { cls: "bg-amber-500/15 text-amber-400", dot: "bg-amber-400", label: "Konfiguratsiya kerak" };
  if (status === "connected") return { cls: "bg-emerald-500/15 text-emerald-400", dot: "bg-emerald-400", label: "Tayyor" };
  if (status === "expired") return { cls: "bg-amber-500/15 text-amber-400", dot: "bg-amber-400", label: "Muddati tugagan" };
  if (status === "invalid") return { cls: "bg-red-500/15 text-red-400", dot: "bg-red-400", label: "Noto'g'ri hisob" };
  if (status === "disconnected") return { cls: "bg-red-500/15 text-red-400", dot: "bg-red-400", label: "Ulanish amalga oshmadi" };
  return { cls: "bg-amber-500/15 text-amber-400", dot: "bg-amber-400", label: "Konfiguratsiya kerak" };
}

// Ikki qatlamli holat: (o'rnatilgan, autentifikatsiya, konfiguratsiyalar soni)
function statusPillV2(installed: boolean, authed: boolean, instanceCount: number) {
  if (!installed) return { cls: "bg-muted/40 text-muted-foreground", dot: "bg-muted-foreground/60", label: "O'rnatilmagan" };
  if (!authed) return { cls: "bg-amber-500/15 text-amber-400", dot: "bg-amber-400", label: "Autentifikatsiya kerak" };
  if (instanceCount === 0) return { cls: "bg-sky-500/15 text-sky-400", dot: "bg-sky-400", label: "Konfiguratsiya kerak" };
  return { cls: "bg-emerald-500/15 text-emerald-400", dot: "bg-emerald-400", label: "Tayyor" };
}

function ToolCard({
  tool, config, instanceCount, installed, installing, isPro, onInstall, onUninstall, onOpenSettings,
}: {
  tool: ToolDef;
  config?: ToolConfig;
  instanceCount: number;
  installed: boolean;
  installing: boolean;
  isPro: boolean;
  onInstall: () => void;
  onUninstall: () => void;
  onOpenSettings: () => void;
}) {
  const Icon = tool.icon;
  const locked = tool.tier === "pro" && !isPro && !installed;
  const authed = isToolAuthenticated(tool, config);
  const ready = authed && instanceCount > 0;
  const pill = installed ? statusPillV2(installed, authed, instanceCount) : null;

  return (
    <div
      className={`group relative flex flex-col rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-primary/40 hover:bg-card/60 ${
        ready ? "ring-1 ring-primary/20" : ""
      }`}
    >
      <div className="mb-3 flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${tool.accent}`}>
          {locked ? <Lock className="h-4 w-4" /> : <Icon className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{tool.name}</p>
          {installed && pill && (
            <span className={`mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${pill.cls}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${pill.dot}`} />
              {pill.label}
            </span>
          )}
          {!installed && tool.tier === "pro" && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">Pro</span>
          )}
          {!installed && tool.tier === "free" && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">Bepul</span>
          )}
        </div>
      </div>

      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{tool.description}</p>

      <p className="mb-3 text-[10px] text-muted-foreground/70">
        v{tool.version}
        <span className="mx-1.5">•</span>
        <span>Konfiguratsiya: {installed ? instanceCount : 0} ta</span>
      </p>

      <div className="mt-auto flex items-center gap-2">
        {installed ? (
          <>
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex-1 rounded-lg border border-border/60 bg-background/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {!authed ? "Autentifikatsiya qilish" : instanceCount === 0 ? "Konfiguratsiya qo'shish" : "Sozlash"}
            </button>
            <button
              type="button"
              onClick={onUninstall}
              className="rounded-lg border border-border/60 bg-background/40 p-1.5 text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-400"
              aria-label="Olib tashlash"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        ) : locked ? (
          <button type="button" disabled className="flex-1 cursor-not-allowed rounded-lg border border-border/60 bg-background/40 px-2.5 py-1.5 text-xs text-muted-foreground opacity-70">
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

// ————————————————————————————————————————————————————————————————
// Tool Settings Drawer — production-ready
// ————————————————————————————————————————————————————————————————
type DrawerTab = "general" | "auth" | "instances" | "permissions" | "logs";

const drawerTabs: { id: DrawerTab; label: string; icon: typeof Info }[] = [
  { id: "general", label: "Umumiy", icon: Info },
  { id: "auth", label: "Autentifikatsiya", icon: ShieldCheck },
  { id: "instances", label: "Konfiguratsiyalar", icon: Settings },
  { id: "permissions", label: "Ruxsatnomalar", icon: Lock },
  { id: "logs", label: "Yozuvlar", icon: History },
];

const permissionMeta: Record<PermissionKey, { label: string; desc: string }> = {
  read: { label: "O'qish", desc: "Tool ma'lumotlarini o'qishga ruxsat beradi." },
  write: { label: "Yozish", desc: "Yangi ma'lumot yaratish va yangilash imkonini beradi." },
  delete: { label: "O'chirish", desc: "Ma'lumotlarni tanlab o'chirishga ruxsat beradi." },
  execute: { label: "Bajarish", desc: "Tool amallari va workflow'larni ishga tushiradi." },
  admin: { label: "Administrator", desc: "To'liq boshqaruv — ehtiyot bo'lib ishlating." },
};

function ToolDrawer({
  tool, installed, config, instances, onClose, onUninstall, onPersist, onPersistInstances,
}: {
  tool: ToolDef;
  installed: boolean;
  config: ToolConfig;
  instances: ToolInstance[];
  onClose: () => void;
  onUninstall: () => void;
  onPersist: (cfg: ToolConfig) => void;
  onPersistInstances: (list: ToolInstance[]) => void;
}) {
  const Icon = tool.icon;
  const [tab, setTab] = useState<DrawerTab>("general");
  const [draft, setDraft] = useState<ToolConfig>(config);
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState<null | "testing" | "ok" | "fail">(null);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [editingInstance, setEditingInstance] = useState<ToolInstance | null>(null);

  useEffect(() => {
    setDraft(config);
  }, [config.toolId]);

  const fields = tool.authFields ?? [];
  const requiredFields = fields.filter((f) => f.required !== false);
  const allRequiredFilled = requiredFields.every((f) => {
    if (f.type === "oauth") return draft.connection === "connected";
    return (draft.fields[f.key] ?? "").trim().length > 0;
  });
  const authed = isToolAuthenticated(tool, draft);
  const dirty = JSON.stringify(draft) !== JSON.stringify(config);
  const canSave = allRequiredFilled && dirty;

  const pill = statusPillV2(installed, authed, instances.length);

  const pushActivity = (message: string, kind: "success" | "info" | "error") => {
    setDraft((d) => ({
      ...d,
      activity: [
        { at: new Date().toISOString(), message, kind },
        ...d.activity,
      ].slice(0, 25),
    }));
  };

  const testConnection = () => {
    if (!allRequiredFilled) return;
    setTesting("testing");
    setTimeout(() => {
      // Demo: to'ldirilgan bo'lsa muvaffaqiyatli deb hisoblaymiz.
      const ok = allRequiredFilled;
      setTesting(ok ? "ok" : "fail");
      setDraft((d) => ({
        ...d,
        connection: ok ? "connected" : "invalid",
        lastTestedAt: new Date().toISOString(),
        activity: [
          {
            at: new Date().toISOString(),
            message: ok ? "Sinov ulanishi muvaffaqiyatli" : "Ulanish amalga oshmadi",
            kind: (ok ? "success" : "error") as ActivityKind,
          },
          ...d.activity,
        ].slice(0, 25),
      }));
      setTimeout(() => setTesting(null), 1600);
    }, 900);
  };

  const disconnect = () => {
    setDraft((d) => ({ ...d, connection: "disconnected" }));
    pushActivity("Ulanish uzildi", "info");
  };

  const reconnect = () => {
    setDraft((d) => ({ ...d, connection: "unconfigured" }));
    pushActivity("Qayta ulanish talab qilindi", "info");
  };

  const startOauth = () => {
    setOauthLoading(true);
    setTimeout(() => {
      setOauthLoading(false);
      setDraft((d) => ({
        ...d,
        connection: "connected",
        fields: {
          ...d.fields,
          client_id: d.fields.client_id || "demo-client.apps.googleusercontent.com",
        },
        lastTestedAt: new Date().toISOString(),
        activity: [
          { at: new Date().toISOString(), message: "OAuth avtorizatsiya bajarildi (Demo rejimi)", kind: "success" as ActivityKind },
          ...d.activity,
        ].slice(0, 25),
      }));
    }, 1100);
  };

  const save = () => {
    if (!canSave) return;
    const next: ToolConfig = {
      ...draft,
      activity: [
        { at: new Date().toISOString(), message: "Konfiguratsiya saqlandi", kind: "success" as ActivityKind },
        ...draft.activity,
      ].slice(0, 25),
    };
    onPersist(next);
    setDraft(next);
  };

  const saveInstance = (inst: ToolInstance) => {
    const exists = instances.some((i) => i.id === inst.id);
    const next = exists
      ? instances.map((i) => (i.id === inst.id ? inst : i))
      : [...instances, inst];
    onPersistInstances(next);
    setEditingInstance(null);
  };

  const deleteInstance = (id: string) => {
    onPersistInstances(instances.filter((i) => i.id !== id));
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* HEADER */}
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${tool.accent}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tool sozlamalari</p>
              <div className="mt-0.5 flex items-center gap-2">
                <h2 className="truncate text-lg font-semibold">{tool.name}</h2>
                <span className="rounded-md border border-border/60 bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  v{tool.version}
                </span>
              </div>
              <span className={`mt-1.5 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ${pill.cls}`}>
                <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${pill.dot}`} />
                {pill.label}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-card/60 hover:text-foreground" aria-label="Yopish">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-1 overflow-x-auto">
          {drawerTabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-5 py-5 text-sm">
        {tab === "general" && <GeneralTab tool={tool} config={draft} />}
        {tab === "auth" && (
          <AuthTab
            tool={tool}
            draft={draft}
            reveal={reveal}
            setReveal={setReveal}
            onField={(k, v) => setDraft((d) => ({ ...d, fields: { ...d.fields, [k]: v } }))}
            onOauth={startOauth}
            oauthLoading={oauthLoading}
            testing={testing}
            allRequiredFilled={allRequiredFilled}
            onTest={testConnection}
            onDisconnect={disconnect}
            onReconnect={reconnect}
          />
        )}
        {tab === "instances" && (
          <InstancesTab
            tool={tool}
            authed={authed}
            instances={instances}
            onNew={() =>
              setEditingInstance({
                id: crypto.randomUUID(),
                toolId: tool.id,
                name: "",
                fields: {},
                createdAt: new Date().toISOString(),
                connectedAgentIds: [],
              })
            }
            onEdit={(i) => setEditingInstance(i)}
            onDelete={deleteInstance}
            onGoAuth={() => setTab("auth")}
          />
        )}
        {tab === "permissions" && (
          <PermissionsTab
            perms={draft.permissions}
            onToggle={(k) =>
              setDraft((d) => ({
                ...d,
                permissions: { ...d.permissions, [k]: !d.permissions[k] },
              }))
            }
          />
        )}
        {tab === "logs" && <LogsTab activity={draft.activity} />}
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-background/80 px-5 py-3">
        {installed ? (
          <button
            type="button"
            onClick={onUninstall}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/20"
          >
            <Trash2 className="h-3.5 w-3.5" /> O'chirish
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Yopish
          </button>
          {tab !== "instances" && (
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
              canSave
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "cursor-not-allowed bg-primary/40 text-primary-foreground/70"
            }`}
          >
            <Check className="h-3.5 w-3.5" /> Saqlash
          </button>
          )}
        </div>
      </div>

      {/* Ichki konfiguratsiya editori — right slide-over */}
      {editingInstance && (
        <InstanceEditor
          tool={tool}
          instance={editingInstance}
          onCancel={() => setEditingInstance(null)}
          onSave={saveInstance}
        />
      )}
    </div>
  );
}

function GeneralTab({ tool, config }: { tool: ToolDef; config: ToolConfig }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Tavsif</p>
        <p className="leading-relaxed">{tool.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InfoCell label="Dasturchi" value={tool.developer ?? "Agentus"} />
        <InfoCell label="Versiya" value={`v${tool.version}`} />
        <InfoCell label="Kategoriya" value={tool.category} />
        <InfoCell label="Oxirgi yangilanish" value={formatDate(tool.updatedAt)} />
        {tool.purchasedAt && <InfoCell label="Sotib olingan" value={formatDate(tool.purchasedAt)} />}
        <InfoCell label="Oxirgi sinov" value={formatDateTime(config.lastTestedAt)} />
      </div>
      <div className="flex flex-wrap gap-2">
        {tool.docsUrl ? (
          <a
            href={tool.docsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
          >
            <BookOpen className="h-3.5 w-3.5" /> Hujjatlar <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <button type="button" disabled className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground opacity-70">
            <BookOpen className="h-3.5 w-3.5" /> Hujjatlar — Backend kutilmoqda
          </button>
        )}
      </div>
      <div className="rounded-lg border border-border/60 bg-card/40 p-3 text-[11px] text-muted-foreground">
        <div className="mb-1 flex items-center gap-1.5 text-foreground">
          <Info className="h-3.5 w-3.5 text-primary" /> Demo rejimi
        </div>
        Backend hozircha ulanmagan. Kiritilgan qiymatlar faqat brauzeringizda saqlanadi va real API'larga yuborilmaydi.
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/30 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-sm">{value}</p>
    </div>
  );
}

function AuthTab({
  tool, draft, reveal, setReveal, onField, onOauth, oauthLoading, testing, allRequiredFilled, onTest, onDisconnect, onReconnect,
}: {
  tool: ToolDef;
  draft: ToolConfig;
  reveal: Record<string, boolean>;
  setReveal: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onField: (k: string, v: string) => void;
  onOauth: () => void;
  oauthLoading: boolean;
  testing: null | "testing" | "ok" | "fail";
  allRequiredFilled: boolean;
  onTest: () => void;
  onDisconnect: () => void;
  onReconnect: () => void;
}) {
  const fields = tool.authFields ?? [];
  if (fields.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 bg-card/30 p-6 text-center text-xs text-muted-foreground">
        <Zap className="mx-auto mb-2 h-4 w-4 text-primary" />
        Bu tool uchun autentifikatsiya talab qilinmaydi. Darrov foydalanishingiz mumkin.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {fields.map((field) => {
        if (field.type === "oauth") {
          const connected = draft.connection === "connected";
          return (
            <div key={field.key} className="rounded-lg border border-border/60 bg-card/40 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{field.label}</p>
                  {field.help && <p className="mt-0.5 text-[11px] text-muted-foreground">{field.help}</p>}
                </div>
                {connected ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-400">
                    <Check className="h-3 w-3" /> Ulangan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-400">
                    <AlertCircle className="h-3 w-3" /> Sozlanmagan
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onOauth}
                disabled={oauthLoading}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary hover:bg-primary/20 disabled:opacity-70"
              >
                {oauthLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
                {connected ? "Qayta avtorizatsiya" : "Avtorizatsiya oching"}
              </button>
            </div>
          );
        }
        const isSecret = field.type === "secret";
        const shown = !!reveal[field.key];
        return (
          <div key={field.key}>
            <label className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>
                {field.label}
                {field.required !== false && <span className="ml-1 text-red-400">*</span>}
              </span>
              {field.help && <span className="text-[10px] opacity-70">{field.help}</span>}
            </label>
            <div className="relative">
              <input
                type={isSecret && !shown ? "password" : "text"}
                value={draft.fields[field.key] ?? ""}
                onChange={(e) => onField(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 pr-16 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/60"
              />
              <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
                {isSecret && (
                  <button
                    type="button"
                    onClick={() => setReveal((r) => ({ ...r, [field.key]: !r[field.key] }))}
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                    aria-label="Ko'rsatish/yashirish"
                  >
                    {shown ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const v = draft.fields[field.key];
                    if (v && typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(v).catch(() => {});
                    }
                  }}
                  className="rounded p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Nusxa olish"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="rounded-lg border border-border/60 bg-card/40 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium">Ulanish holati</p>
          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${statusPill(draft.connection, allRequiredFilled).cls}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusPill(draft.connection, allRequiredFilled).dot}`} />
            {statusPill(draft.connection, allRequiredFilled).label}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onTest}
            disabled={!allRequiredFilled || testing === "testing"}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              testing === "ok"
                ? "bg-emerald-500/20 text-emerald-400"
                : testing === "fail"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-primary text-primary-foreground hover:opacity-90"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {testing === "testing" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : testing === "ok" ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            {testing === "ok" ? "Muvaffaqiyatli" : testing === "fail" ? "Qayta urinib ko'ring" : "Sinov ulanishi"}
          </button>
          <button
            type="button"
            onClick={onReconnect}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Qayta ulaning
          </button>
          <button
            type="button"
            onClick={onDisconnect}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground hover:border-red-500/40 hover:text-red-400"
          >
            <Unplug className="h-3.5 w-3.5" /> Uzish
          </button>
        </div>
      </div>
    </div>
  );
}

function PermissionsTab({
  perms, onToggle,
}: {
  perms: Partial<Record<PermissionKey, boolean>>;
  onToggle: (k: PermissionKey) => void;
}) {
  const keys: PermissionKey[] = ["read", "write", "delete", "execute", "admin"];
  return (
    <div className="space-y-2">
      {keys.map((k) => {
        const on = !!perms[k];
        return (
          <div key={k} className="flex items-start justify-between rounded-lg border border-border/60 bg-card/40 px-3 py-2.5">
            <div className="min-w-0 pr-3">
              <p className="text-sm">{permissionMeta[k].label}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{permissionMeta[k].desc}</p>
            </div>
            <button
              type="button"
              onClick={() => onToggle(k)}
              role="switch"
              aria-checked={on}
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-primary" : "bg-border/80"}`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${on ? "translate-x-[18px]" : "translate-x-0.5"}`} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// Konfiguratsiyalar tab
// ————————————————————————————————————————————————————————————————
function InstancesTab({
  tool, authed, instances, onNew, onEdit, onDelete, onGoAuth,
}: {
  tool: ToolDef;
  authed: boolean;
  instances: ToolInstance[];
  onNew: () => void;
  onEdit: (i: ToolInstance) => void;
  onDelete: (id: string) => void;
  onGoAuth: () => void;
}) {
  if (!authed) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 bg-card/30 p-6 text-center text-xs text-muted-foreground">
        <ShieldCheck className="mx-auto mb-2 h-5 w-5 text-amber-400" />
        <p className="mb-1 text-sm text-foreground">Avval autentifikatsiyani yakunlang</p>
        <p className="mb-3">Bir marta ulanganingizdan so'ng, cheksiz konfiguratsiya yaratishingiz mumkin.</p>
        <button
          type="button"
          onClick={onGoAuth}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
        >
          <ShieldCheck className="h-3.5 w-3.5" /> Autentifikatsiyaga o'tish
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Konfiguratsiyalar</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Bir tool uchun bir nechta konfiguratsiya yaratishingiz mumkin.
          </p>
        </div>
        <button
          type="button"
          onClick={onNew}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> Yangi konfiguratsiya
        </button>
      </div>

      {instances.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 bg-card/30 p-6 text-center text-xs text-muted-foreground">
          <Settings className="mx-auto mb-2 h-5 w-5 text-primary/70" />
          <p>Hali konfiguratsiya yo'q.</p>
          <p className="mt-1 opacity-70">
            "Yangi konfiguratsiya" bosib birinchi manzilingizni qo'shing.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {instances.map((inst) => {
            const target = tool.targetFieldKey ? inst.fields[tool.targetFieldKey] : "";
            return (
              <li
                key={inst.id}
                className="group flex items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3"
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tool.accent}`}>
                  <tool.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{inst.name || "Nomsiz konfiguratsiya"}</p>
                    <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                      Tayyor
                    </span>
                  </div>
                  {target && (
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{target}</p>
                  )}
                  <p className="mt-0.5 text-[10px] text-muted-foreground/80">
                    Agentlarda: {inst.connectedAgentIds.length} ta
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(inst)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-background/60 hover:text-foreground"
                    aria-label="Tahrirlash"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(inst.id)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                    aria-label="O'chirish"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="rounded-lg border border-border/60 bg-card/40 p-3 text-[11px] text-muted-foreground">
        <div className="mb-1 flex items-center gap-1.5 text-foreground">
          <Info className="h-3.5 w-3.5 text-primary" /> Eslatma
        </div>
        Barcha konfiguratsiyalar bitta ulangan akkaunt va ruxsatlar orqali ishlaydi.
        API yoki OAuth sozlamalarini o'zgartirish uchun Autentifikatsiya bo'limidan foydalaning.
      </div>
    </div>
  );
}

function InstanceEditor({
  tool, instance, onCancel, onSave,
}: {
  tool: ToolDef;
  instance: ToolInstance;
  onCancel: () => void;
  onSave: (i: ToolInstance) => void;
}) {
  const [draft, setDraft] = useState<ToolInstance>(instance);
  const fields = tool.instanceFields ?? [];
  const requiredOk = fields
    .filter((f) => f.required)
    .every((f) => (draft.fields[f.key] ?? "").trim().length > 0);
  const canSave = draft.name.trim().length > 0 && requiredOk;

  const set = (k: string, v: string) =>
    setDraft((d) => ({ ...d, fields: { ...d.fields, [k]: v } }));

  return (
    <>
      <div
        aria-hidden
        onClick={onCancel}
        className="absolute inset-0 z-40 bg-background/50 backdrop-blur-[1px]"
      />
      <aside className="absolute inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col border-l border-border/60 bg-background shadow-2xl">
        <div className="flex items-start justify-between border-b border-border/60 px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {tool.name} · Konfiguratsiya
            </p>
            <h3 className="mt-0.5 text-base font-semibold">
              {draft.name.trim() || "Yangi konfiguratsiya"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-card/60 hover:text-foreground"
            aria-label="Yopish"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 text-sm">
          <div>
            <label className="mb-1 block text-[11px] text-muted-foreground">
              Konfiguratsiya nomi <span className="text-red-400">*</span>
            </label>
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Masalan: Haftalik hisobot"
              className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
            />
            <p className="mt-1 text-[10px] text-muted-foreground/80">
              Agent ichida shu nom bilan ko'rinadi.
            </p>
          </div>

          {fields.map((field) => (
            <InstanceFieldInput
              key={field.key}
              field={field}
              value={draft.fields[field.key] ?? ""}
              onChange={(v) => set(field.key, v)}
            />
          ))}

          <div className="rounded-lg border border-border/60 bg-card/40 p-3 text-[11px] text-muted-foreground">
            <div className="mb-1 flex items-center gap-1.5 text-foreground">
              <Bot className="h-3.5 w-3.5 text-primary" /> Bog'langan agentlar
            </div>
            {draft.connectedAgentIds.length === 0
              ? "Hozircha hech qaysi agentga biriktirilmagan. Agentlarim sahifasidan biriktiring."
              : `${draft.connectedAgentIds.length} ta agent foydalanmoqda.`}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border/60 px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave({ ...draft, updatedAt: new Date().toISOString() })}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium ${
              canSave
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "cursor-not-allowed bg-primary/40 text-primary-foreground/70"
            }`}
          >
            <Check className="h-3.5 w-3.5" /> Konfiguratsiyani saqlash
          </button>
        </div>
      </aside>
    </>
  );
}

function InstanceFieldInput({
  field, value, onChange,
}: {
  field: InstanceField;
  value: string;
  onChange: (v: string) => void;
}) {
  const label = (
    <label className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
      <span>
        {field.label}
        {field.required && <span className="ml-1 text-red-400">*</span>}
      </span>
      {field.help && <span className="text-[10px] opacity-70">{field.help}</span>}
    </label>
  );

  if (field.type === "textarea") {
    return (
      <div>
        {label}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="w-full resize-y rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        {label}
        <div className="flex flex-wrap gap-1.5">
          {(field.options ?? []).map((opt) => {
            const active = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  active
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
      />
    </div>
  );
}

function LogsTab({ activity }: { activity: ToolConfig["activity"] }) {
  if (activity.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 bg-card/30 px-4 py-8 text-center text-xs text-muted-foreground">
        <History className="mx-auto mb-2 h-5 w-5 text-primary/70" />
        Hozircha faoliyat qayd etilmagan.
      </div>
    );
  }
  return (
    <ul className="space-y-1.5">
      {activity.map((a, i) => {
        const dot =
          a.kind === "success" ? "bg-emerald-400" : a.kind === "error" ? "bg-red-400" : "bg-muted-foreground/50";
        return (
          <li key={i} className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-card/40 px-3 py-2">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <div className="min-w-0 flex-1">
              <p className="text-xs">{a.message}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{formatDateTime(a.at)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// Yordamchi eksport — bo'lib ketishi ehtimoli uchun ishlatilmagan symbol'lar.
export const _drawerConst = INSTALLED_TOOLS_KEY;
