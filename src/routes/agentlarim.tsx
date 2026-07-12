import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bot,
  BookOpen,
  BarChart3,
  Check,
  Circle,
  Copy,
  Home,
  MoreVertical,
  Pause,
  Pencil,
  Play,
  Plug,
  Plus,
  Search,
  Settings,
  Store,
  Trash2,
  Wallet,
  Wrench,
  X,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import wordmark from "@/assets/agentus-wordmark.png";
import {
  readInstalledToolIds,
  readToolConfigs,
  readToolInstances,
  isToolAuthenticated,
  toolCatalog,
  type ToolDef,
  type ToolInstance,
} from "@/lib/tools-catalog";

export const Route = createFileRoute("/agentlarim")({
  component: AgentlarimPage,
  head: () => ({
    meta: [
      { title: "Agentlarim — Agentus" },
      {
        name: "description",
        content:
          "Yaratgan AI agentlaringizni bir joyda boshqaring — toolar qo'shing, holatini kuzating.",
      },
    ],
  }),
});

type AgentStatus = "active" | "paused" | "error";

type SavedAgent = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status?: AgentStatus;
  tools?: string[];
  lastActivity?: string;
};

const STORAGE_KEY = "agentus:agents";

const navItems = [
  { icon: Home, label: "Asosiy", to: "/" as const },
  { icon: Bot, label: "Agentlarim", to: "/agentlarim" as const, active: true },
  { icon: Store, label: "Marketplace" },
  { icon: Wrench, label: "Mening toollarim", to: "/mening-toollarim" as const },
  { icon: Plug, label: "Integratsiyalar" },
  { icon: BookOpen, label: "Kodex" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Wallet, label: "To'lovlar" },
  { icon: Settings, label: "Sozlamalar" },
];

// Agent'ga qo'shiladigan toollar — foydalanuvchi "Mening toollarim"ga
// o'rnatgan toollargina bu yerda ko'rinadi. Marketplace to'g'ridan-to'g'ri
// agentga o'rnamaydi; oldin foydalanuvchi kutubxonasiga tushishi kerak.
const categories = [
  "Barchasi",
  "Free",
  "Pro",
  "Marketplace",
  "Agentda",
] as const;

function timeAgo(iso?: string) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "hozir";
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m} daqiqa oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  const d = Math.floor(h / 24);
  return `${d} kun oldin`;
}

function statusMeta(s: AgentStatus | undefined) {
  const v = s ?? "active";
  if (v === "active")
    return { dot: "bg-emerald-500", label: "Faol", ring: "ring-emerald-500/20" };
  if (v === "paused")
    return { dot: "bg-amber-500", label: "To'xtatilgan", ring: "ring-amber-500/20" };
  return { dot: "bg-red-500", label: "Xato", ring: "ring-red-500/20" };
}

function AgentlarimPage() {
  const [agents, setAgents] = useState<SavedAgent[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [marketQuery, setMarketQuery] = useState("");
  const [marketCategory, setMarketCategory] =
    useState<(typeof categories)[number]>("Barchasi");
  const [installing, setInstalling] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAgents(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // Kliklar bo'yicha kontekst menyusi yopilishi
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-agent-menu]") && !t.closest("[data-menu-trigger]")) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFocusedId(null);
        setMenuOpen(null);
        setRenameId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const persist = (next: SavedAgent[]) => {
    setAgents(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const updateAgent = (id: string, patch: Partial<SavedAgent>) =>
    persist(agents.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const deleteAgent = (id: string) => {
    persist(agents.filter((a) => a.id !== id));
    if (focusedId === id) setFocusedId(null);
    if (menuOpen === id) setMenuOpen(null);
  };

  const duplicateAgent = (a: SavedAgent) => {
    const copy: SavedAgent = {
      ...a,
      id: `${Date.now()}`,
      name: `${a.name} (nusxa)`,
      createdAt: new Date().toISOString(),
    };
    persist([...agents, copy]);
  };

  const focusedAgent = useMemo(
    () => agents.find((a) => a.id === focusedId) ?? null,
    [agents, focusedId],
  );

  // Foydalanuvchi kutubxonasi — "Mening toollarim"da o'rnatilgan toollar.
  const [userTools, setUserTools] = useState<ToolDef[]>([]);
  useEffect(() => {
    const ids = new Set(readInstalledToolIds());
    setUserTools(toolCatalog.filter((t) => ids.has(t.id)));
  }, [focusedId]);

  const filteredTools = useMemo(() => {
    const agentInstalled = new Set(focusedAgent?.tools ?? []);
    return userTools.filter((t) => {
      if (marketCategory === "Agentda" && !agentInstalled.has(t.name))
        return false;
      if (marketCategory === "Free" && t.tier !== "free") return false;
      if (marketCategory === "Pro" && t.tier !== "pro") return false;
      if (marketCategory === "Marketplace" && t.tier !== "marketplace")
        return false;
      if (marketQuery.trim()) {
        const q = marketQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [focusedAgent, marketCategory, marketQuery, userTools]);

  const installTool = (tool: ToolDef) => {
    if (!focusedAgent) return;
    const already = (focusedAgent.tools ?? []).includes(tool.name);
    if (already) return;
    setInstalling(tool.id);
    setTimeout(() => {
      const next = [...(focusedAgent.tools ?? []), tool.name];
      updateAgent(focusedAgent.id, {
        tools: next,
        lastActivity: new Date().toISOString(),
      });
      setInstalling(null);
    }, 700);
  };

  return (
    <div
      ref={rootRef}
      className="flex min-h-screen bg-background text-foreground"
    >
      {/* SIDEBAR */}
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
            Rejalashtirilgan
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
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <Link
            to="/agent-yaratish"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Orqaga
          </Link>
          <Link
            to="/agent-yaratish"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_20px_-8px_var(--primary)] transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> Yangi agent
          </Link>
        </header>

        {/* Content area with focus-blur */}
        <div className="relative">
          <div
            className={`px-6 pt-6 pb-24 transition-[filter,opacity] duration-300 ${
              focusedId ? "pointer-events-none" : ""
            }`}
          >
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Agentlarim</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Siz yaratgan agentlar shu yerda saqlanadi (demo — brauzerda saqlanmoqda).
                </p>
              </div>
              <div className="hidden text-right text-xs text-muted-foreground sm:block">
                Jami: <span className="text-foreground">{agents.length}</span> agent
              </div>
            </div>

            {agents.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {agents.map((a) => {
                  const isFocused = focusedId === a.id;
                  const dim = focusedId && !isFocused;
                  return (
                    <li key={a.id} className="relative">
                      <AgentCard
                        agent={a}
                        dimmed={!!dim}
                        focused={isFocused}
                        menuOpen={menuOpen === a.id}
                        renaming={renameId === a.id}
                        renameValue={renameValue}
                        onRenameChange={setRenameValue}
                        onRenameCommit={() => {
                          if (renameValue.trim()) {
                            updateAgent(a.id, { name: renameValue.trim() });
                          }
                          setRenameId(null);
                        }}
                        onRenameCancel={() => setRenameId(null)}
                        onOpenMenu={() =>
                          setMenuOpen((cur) => (cur === a.id ? null : a.id))
                        }
                        onOpen={() => {
                          setMenuOpen(null);
                          // Sahifa hali qurilmagan — halol xabar
                          alert(
                            "Agent Workspace hali tayyor emas (Rejalashtirilgan).",
                          );
                        }}
                        onAddTools={() => {
                          setMenuOpen(null);
                          setFocusedId(a.id);
                        }}
                        onPause={() => {
                          updateAgent(a.id, { status: "paused" });
                          setMenuOpen(null);
                        }}
                        onResume={() => {
                          updateAgent(a.id, { status: "active" });
                          setMenuOpen(null);
                        }}
                        onRename={() => {
                          setRenameId(a.id);
                          setRenameValue(a.name);
                          setMenuOpen(null);
                        }}
                        onDuplicate={() => {
                          duplicateAgent(a);
                          setMenuOpen(null);
                        }}
                        onDelete={() => deleteAgent(a.id)}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Blur overlay when focused (over non-focused cards) */}
          {focusedId && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-background/30 backdrop-blur-[2px] transition-opacity"
            />
          )}
        </div>

        {/* Tool Marketplace slide-in */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-border/60 bg-background/95 backdrop-blur transition-transform duration-300 ease-out ${
            focusedId ? "translate-x-0" : "translate-x-full"
          }`}
          aria-hidden={!focusedId}
        >
          {focusedAgent && (
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between border-b border-border/60 px-5 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Tool Marketplace
                  </p>
                  <h2 className="mt-0.5 text-lg font-semibold">
                    {focusedAgent.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    🧰 {(focusedAgent.tools ?? []).length} ta tool o'rnatilgan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFocusedId(null)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-card/60 hover:text-foreground"
                  aria-label="Yopish"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="border-b border-border/60 px-5 py-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={marketQuery}
                    onChange={(e) => setMarketQuery(e.target.value)}
                    placeholder="Tool qidiring..."
                    className="w-full rounded-lg border border-border/60 bg-card/60 py-2 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary/60"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setMarketCategory(c)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                        marketCategory === c
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
                {userTools.length === 0 ? (
                  <div className="py-10 text-center text-xs text-muted-foreground">
                    <p className="mb-3">
                      Kutubxonangizda hali toollar yo'q.
                    </p>
                    <Link
                      to="/mening-toollarim"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                    >
                      <Plus className="h-3 w-3" /> Mening toollarimga o'tish
                    </Link>
                  </div>
                ) : filteredTools.length === 0 ? (
                  <p className="py-10 text-center text-xs text-muted-foreground">
                    Hech narsa topilmadi.
                  </p>
                ) : (
                  filteredTools.map((t) => {
                    const installed = (focusedAgent.tools ?? []).includes(t.name);
                    const isInstalling = installing === t.id;
                    return (
                      <div
                        key={t.id}
                        className="animate-fade-in rounded-xl border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40"
                      >
                        <div className="flex items-start gap-3">
                          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${t.accent}`}>
                            <t.icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-medium">
                                {t.name}
                              </p>
                              <span className="rounded-full border border-border/60 px-1.5 py-[1px] text-[9px] uppercase tracking-wider text-muted-foreground">
                                {t.category}
                              </span>
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                              {t.description}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => installTool(t)}
                            disabled={installed || isInstalling}
                            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                              installed
                                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : isInstalling
                                  ? "bg-primary/70 text-primary-foreground"
                                  : "bg-primary text-primary-foreground hover:brightness-110"
                            }`}
                          >
                            {installed ? (
                              <span className="inline-flex items-center gap-1">
                                <Check className="h-3 w-3" /> O'rnatilgan
                              </span>
                            ) : isInstalling ? (
                              <span className="inline-flex items-center gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                O'rnatilmoqda
                              </span>
                            ) : (
                              "O'rnatish"
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-border/60 px-5 py-3 text-[10px] text-muted-foreground">
                Faqat "Mening toollarim"da o'rnatilgan toollar ko'rinadi.{" "}
                <Link to="/mening-toollarim" className="text-primary hover:underline">
                  Kutubxonaga o'tish →
                </Link>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-12 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
        <Bot className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted-foreground">
        Hozircha agent yo'q. Birinchi agentingizni yaratib ko'ring.
      </p>
      <Link
        to="/agent-yaratish"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        <Plus className="h-4 w-4" /> Agent yaratish
      </Link>
    </div>
  );
}

type CardProps = {
  agent: SavedAgent;
  dimmed: boolean;
  focused: boolean;
  menuOpen: boolean;
  renaming: boolean;
  renameValue: string;
  onRenameChange: (v: string) => void;
  onRenameCommit: () => void;
  onRenameCancel: () => void;
  onOpenMenu: () => void;
  onOpen: () => void;
  onAddTools: () => void;
  onPause: () => void;
  onResume: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

function AgentCard(props: CardProps) {
  const {
    agent,
    dimmed,
    focused,
    menuOpen,
    renaming,
    renameValue,
    onRenameChange,
    onRenameCommit,
    onRenameCancel,
    onOpenMenu,
    onOpen,
    onAddTools,
    onPause,
    onResume,
    onRename,
    onDuplicate,
    onDelete,
  } = props;

  const [confirmDelete, setConfirmDelete] = useState(false);
  const status = statusMeta(agent.status);
  const toolsCount = agent.tools?.length ?? 0;

  return (
    <div
      className={`group relative rounded-2xl border bg-card/60 p-5 transition-all duration-300 ${
        focused
          ? "border-primary/60 shadow-[0_0_40px_-10px_var(--primary)] ring-1 ring-primary/40 pointer-events-auto z-10"
          : "border-border/60 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_0_30px_-15px_var(--primary)]"
      } ${dimmed ? "opacity-60 blur-[1px]" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <Bot className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            {renaming ? (
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => onRenameChange(e.target.value)}
                onBlur={onRenameCommit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onRenameCommit();
                  if (e.key === "Escape") onRenameCancel();
                }}
                className="w-full rounded-md border border-primary/60 bg-background px-2 py-1 text-sm outline-none"
              />
            ) : (
              <p className="truncate text-sm font-semibold">{agent.name}</p>
            )}
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/80">
              {new Date(agent.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          type="button"
          data-menu-trigger
          onClick={onOpenMenu}
          className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-card/80 hover:text-foreground group-hover:opacity-100 data-[open=true]:opacity-100"
          data-open={menuOpen}
          aria-label="Menyu"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {menuOpen && (
          <div
            data-agent-menu
            className="absolute right-3 top-12 z-20 w-48 origin-top-right animate-scale-in rounded-xl border border-border/80 bg-popover p-1 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]"
          >
            <MenuItem icon={Play} label="Ochish" onClick={onOpen} />
            <MenuItem
              icon={Wrench}
              label="Tool qo'shish"
              onClick={onAddTools}
              accent
            />
            {agent.status === "paused" ? (
              <MenuItem icon={Play} label="Faollashtirish" onClick={onResume} />
            ) : (
              <MenuItem icon={Pause} label="To'xtatish" onClick={onPause} />
            )}
            <MenuItem icon={Pencil} label="Nomini o'zgartirish" onClick={onRename} />
            <MenuItem icon={Copy} label="Nusxa olish" onClick={onDuplicate} />
            <div className="my-1 h-px bg-border/60" />
            {confirmDelete ? (
              <div className="px-2 py-1.5 text-[11px]">
                <p className="mb-1.5 text-muted-foreground">O'chirishni tasdiqlang?</p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={onDelete}
                    className="flex-1 rounded-md bg-primary px-2 py-1 text-primary-foreground"
                  >
                    Ha
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 rounded-md border border-border/60 px-2 py-1"
                  >
                    Yo'q
                  </button>
                </div>
              </div>
            ) : (
              <MenuItem
                icon={Trash2}
                label="O'chirish"
                onClick={() => setConfirmDelete(true)}
                danger
              />
            )}
          </div>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {agent.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${status.dot} ring-2 ${status.ring}`}
          />
          {status.label}
        </span>
        <span className="inline-flex items-center gap-1">
          <Wrench className="h-3 w-3" /> {toolsCount} ta tool
        </span>
        <span className="inline-flex items-center gap-1">
          <Circle className="h-2 w-2 fill-current" /> {timeAgo(agent.lastActivity ?? agent.createdAt)}
        </span>
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
  accent,
}: {
  icon: typeof Wrench;
  label: string;
  onClick: () => void;
  danger?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] transition-colors ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : accent
            ? "text-primary hover:bg-primary/10"
            : "text-foreground hover:bg-card/80"
      }`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}