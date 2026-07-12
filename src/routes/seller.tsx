import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BarChart3,
  Bot,
  BookOpen,
  CircleHelp,
  Copy,
  CreditCard,
  Crown,
  DollarSign,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Home,
  LineChart,
  MoreVertical,
  Package,
  Pencil,
  Plug,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Store,
  Trash2,
  Upload,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import wordmark from "@/assets/agentus-wordmark.png";
import { isProActive, setProActive } from "@/lib/pro-subscription";

export const Route = createFileRoute("/seller")({
  component: SellerPanelPage,
  head: () => ({
    meta: [
      { title: "Sotuvchi paneli — Agentus" },
      {
        name: "description",
        content:
          "Agentus Sotuvchi paneli — Marketplace agentlaringizni boshqaring, sotuvlarni kuzating va daromadni oling.",
      },
    ],
  }),
});

type AgentStatus = "draft" | "review" | "published" | "rejected" | "paused";

type SavedAgent = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  publishStatus?: AgentStatus;
  price?: number;
};

const AGENTS_KEY = "agentus:agents";

// —————————————————————————————— Navigation ——————————————————————————————
const mainNav = [
  { icon: Home, label: "Asosiy", to: "/" as const },
  { icon: Bot, label: "Agentlarim", to: "/agentlarim" as const },
  { icon: Store, label: "Marketplace", to: null },
  { icon: Wrench, label: "Mening toollarim", to: "/mening-toollarim" as const },
  { icon: Plug, label: "Integratsiyalar", to: null },
  { icon: BookOpen, label: "Kodex", to: null },
  { icon: BarChart3, label: "Analytics", to: null },
  { icon: Wallet, label: "To'lovlar", to: null },
  { icon: Settings, label: "Sozlamalar", to: null },
] as const;

type SellerKey =
  | "products"
  | "drafts"
  | "review"
  | "sales"
  | "earnings"
  | "reviews"
  | "payouts"
  | "settings";

const sellerNav: { key: SellerKey; label: string; icon: typeof Package }[] = [
  { key: "products", label: "Mahsulotlarim", icon: Package },
  { key: "drafts", label: "Qoralamalar", icon: FileText },
  { key: "review", label: "Tekshiruvdagilar", icon: ShieldCheck },
  { key: "sales", label: "Sotuvlar", icon: LineChart },
  { key: "earnings", label: "Daromad", icon: DollarSign },
  { key: "reviews", label: "Sharhlar", icon: Star },
  { key: "payouts", label: "To'lovlar", icon: CreditCard },
  { key: "settings", label: "Sozlamalar", icon: Settings },
];

// —————————————————————————————— Status meta ——————————————————————————————
function statusMeta(s: AgentStatus | undefined) {
  const v: AgentStatus = s ?? "draft";
  switch (v) {
    case "published":
      return { label: "Nashr qilingan", cls: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" };
    case "review":
      return { label: "Tekshiruvda", cls: "bg-amber-500/10 text-amber-400 ring-amber-500/20" };
    case "rejected":
      return { label: "Rad etilgan", cls: "bg-red-500/10 text-red-400 ring-red-500/20" };
    case "paused":
      return { label: "To'xtatilgan", cls: "bg-slate-500/10 text-slate-300 ring-slate-500/20" };
    default:
      return { label: "Qoralama", cls: "bg-violet-500/10 text-violet-300 ring-violet-500/20" };
  }
}

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

// ————————————————————————————— Page ——————————————————————————————
function SellerPanelPage() {
  const [pro, setPro] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPro(isProActive());
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!pro) {
    return (
      <UpgradeScreen
        onActivate={() => {
          setProActive(true);
          setPro(true);
        }}
      />
    );
  }

  return <SellerWorkspace />;
}

// ————————————————————————————— Upgrade gate ——————————————————————————————
function UpgradeScreen({ onActivate }: { onActivate: () => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 opacity-80 hover:opacity-100">
          <img src={wordmark} alt="Agentus" className="h-6" />
        </Link>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 ring-1 ring-violet-500/30">
          <Crown className="h-8 w-8 text-violet-300" />
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Sotuvchi paneli Pro obunachilar uchun
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Marketplace'da agentlaringizni sotish, sotuvlarni kuzatish va daromad
          olish uchun Pro obuna talab qilinadi. Bepul foydalanuvchilar agent
          yaratishi va sotib olishi mumkin, lekin sotish uchun Pro kerak.
        </p>

        <div className="mt-10 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            "Marketplace'da agent sotish",
            "Real vaqt sotuv statistikasi",
            "Avtomatik daromad chiqarish",
            "Prioritet ko'rib chiqish",
          ].map((t) => (
            <div
              key={t}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-left text-sm text-foreground/90"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              {t}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition hover:from-violet-500 hover:to-violet-400"
          >
            <Crown className="h-4 w-4" />
            Pro obunaga o'tish
          </button>
          <span className="text-xs text-muted-foreground">
            To'lov backend'i ulangach, obuna oqimi shu tugma orqali ochiladi.
          </span>
        </div>

        <div className="mt-12 w-full max-w-xl rounded-xl border border-dashed border-border/60 bg-card/30 p-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Demo rejim
              </div>
              <div className="mt-1 text-sm text-foreground/90">
                Backend ulanmagunga qadar sotuvchi panelini ko'rib chiqish uchun
                Pro rejimni vaqtincha yoqing.
              </div>
            </div>
            <button
              type="button"
              onClick={onActivate}
              className="shrink-0 rounded-lg border border-border/70 bg-background px-3 py-2 text-xs font-medium text-foreground/90 transition hover:bg-accent hover:text-accent-foreground"
            >
              Demo Pro'ni yoqish
            </button>
          </div>
        </div>

        <Link
          to="/"
          className="mt-8 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Asosiy sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}

// ————————————————————————————— Workspace ——————————————————————————————
function SellerWorkspace() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<SavedAgent[]>([]);
  const [active, setActive] = useState<SellerKey>("products");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AgentStatus>("all");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AGENTS_KEY);
      if (raw) setAgents(JSON.parse(raw) as SavedAgent[]);
    } catch {
      /* ignore */
    }
  }, []);

  const products = useMemo(() => {
    return agents.map<SavedAgent>((a) => ({
      ...a,
      publishStatus: a.publishStatus ?? "draft",
    }));
  }, [agents]);

  const counts = useMemo(() => {
    const c = { all: products.length, draft: 0, review: 0, published: 0, rejected: 0, paused: 0 };
    for (const p of products) {
      const s = p.publishStatus ?? "draft";
      c[s] = (c[s] ?? 0) + 1;
    }
    return c;
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (statusFilter !== "all" && (p.publishStatus ?? "draft") !== statusFilter) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [products, statusFilter, query]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
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
            Sotuvchi paneli
          </div>
          {sellerNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActive(item.key)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                  isActive
                    ? "bg-violet-500/10 text-violet-200 ring-1 ring-inset ring-violet-500/25"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.key === "review" && counts.review > 0 ? (
                  <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
                    {counts.review}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border/60 p-4">
          <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-transparent p-3">
            <div className="flex items-center gap-2 text-violet-200">
              <Crown className="h-4 w-4" />
              <span className="text-sm font-medium">Pro Plan</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Marketplace'da sotish faol. Demo rejim.
            </p>
            <button
              type="button"
              onClick={() => {
                setProActive(false);
                navigate({ to: "/seller" });
                window.location.reload();
              }}
              className="mt-3 w-full rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
            >
              Demo'ni o'chirish
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border/60 px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-semibold tracking-tight">
                Sotuvchi paneli
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-300 ring-1 ring-inset ring-violet-500/25">
                <Crown className="h-3 w-3" />
                Pro obunachi
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Agentlaringizni boshqaring, Marketplace kuzatuv va daromad oling.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Yordam"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition hover:text-foreground"
            >
              <CircleHelp className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Bildirishnomalar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-2 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-[11px] font-semibold text-primary">
                A
              </div>
              <span className="hidden text-sm text-foreground/90 sm:inline">Azizbek</span>
            </div>
          </div>
        </header>

        <div className="min-w-0 flex-1 overflow-y-auto p-6">
          {/* Summary cards */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <SummaryCard label="Jami mahsulotlar" value={counts.all} icon={Package} tone="neutral" />
            <SummaryCard label="Nashr qilingan" value={counts.published} icon={ShieldCheck} tone="green" />
            <SummaryCard label="Tekshiruvda" value={counts.review} icon={LineChart} tone="amber" />
            <SummaryCard label="Qoralamalar" value={counts.draft} icon={FileText} tone="violet" />
            <SummaryCard label="Rad etilgan" value={counts.rejected} icon={X} tone="red" />
          </section>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-border/60 px-2 py-1">
              <EyeOff className="h-3 w-3" />
              Demo holati — sotuv, daromad va sharh backend'i ulanmagan.
            </span>
          </div>

          {/* Main grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            {/* Products panel */}
            <section className="min-w-0 rounded-2xl border border-border/60 bg-card/40">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold">Mahsulotlarim</h2>
                  <p className="text-xs text-muted-foreground">
                    Marketplace uchun tayyorlangan agentlar bu yerda ko'rinadi.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Qidirish..."
                      className="h-9 w-56 rounded-lg border border-border/60 bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Filtr
                  </button>
                  <Link
                    to="/agent-yaratish"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 px-3 text-xs font-medium text-white shadow-md shadow-violet-600/20 transition hover:from-violet-500 hover:to-violet-400"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Yangi agent qo'shish
                  </Link>
                </div>
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-5 py-3">
                {(
                  [
                    { k: "all", l: "Barchasi", c: counts.all },
                    { k: "published", l: "Nashr qilingan", c: counts.published },
                    { k: "review", l: "Tekshiruvda", c: counts.review },
                    { k: "draft", l: "Qoralama", c: counts.draft },
                    { k: "rejected", l: "Rad etilgan", c: counts.rejected },
                  ] as const
                ).map((f) => {
                  const isActive = statusFilter === f.k;
                  return (
                    <button
                      key={f.k}
                      type="button"
                      onClick={() => setStatusFilter(f.k as typeof statusFilter)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
                        isActive
                          ? "bg-violet-500/15 text-violet-200 ring-1 ring-inset ring-violet-500/30"
                          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                      }`}
                    >
                      {f.l}
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                        isActive ? "bg-violet-500/20 text-violet-100" : "bg-muted text-muted-foreground"
                      }`}>{f.c}</span>
                    </button>
                  );
                })}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {filtered.length === 0 ? (
                  <EmptyProducts hasAny={products.length > 0} />
                ) : (
                  <table className="w-full min-w-[720px] text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-3 font-medium">Agent</th>
                        <th className="px-3 py-3 font-medium">Holat</th>
                        <th className="px-3 py-3 font-medium">Narx</th>
                        <th className="px-3 py-3 font-medium">Sotuvlar</th>
                        <th className="px-3 py-3 font-medium">Daromad</th>
                        <th className="px-3 py-3 font-medium">Oxirgi yangilanish</th>
                        <th className="px-5 py-3 text-right font-medium">Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => {
                        const meta = statusMeta(p.publishStatus);
                        return (
                          <tr
                            key={p.id}
                            className="border-b border-border/40 transition hover:bg-accent/20"
                          >
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                                  <Bot className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-medium text-foreground">
                                    {p.name}
                                  </div>
                                  <div className="truncate text-xs text-muted-foreground">
                                    {p.description || "Tavsif kiritilmagan"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ring-1 ring-inset ${meta.cls}`}>
                                {meta.label}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-foreground/90">
                              {p.price ? `$${p.price.toFixed(2)}` : "—"}
                            </td>
                            <td className="px-3 py-3 text-muted-foreground">—</td>
                            <td className="px-3 py-3 text-muted-foreground">—</td>
                            <td className="px-3 py-3 text-xs text-muted-foreground">
                              {timeAgo(p.updatedAt ?? p.createdAt)}
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <Link
                                  to="/seller/publish/$agentId"
                                  params={{ agentId: p.id }}
                                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border/60 bg-background px-2.5 text-xs text-foreground/90 transition hover:bg-accent/40"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Tahrirlash
                                </Link>
                                <button
                                  type="button"
                                  disabled={p.publishStatus !== "published"}
                                  title={p.publishStatus === "published" ? "Marketplace'da ko'rish" : "Nashr qilingandan so'ng ko'rinadi"}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground transition hover:text-foreground"
                                  >
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </button>
                                  {menuOpen === p.id ? (
                                    <RowMenu
                                      status={p.publishStatus ?? "draft"}
                                      onClose={() => setMenuOpen(null)}
                                    />
                                  ) : null}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* Right column */}
            <aside className="flex flex-col gap-4">
              <EarningsCard />
              <QuickActionsCard />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Package;
  tone: "neutral" | "green" | "amber" | "violet" | "red";
}) {
  const toneCls = {
    neutral: "bg-primary/10 text-primary ring-primary/20",
    green: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    violet: "bg-violet-500/10 text-violet-300 ring-violet-500/25",
    red: "bg-red-500/10 text-red-400 ring-red-500/20",
  }[tone];
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset ${toneCls}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">Backend kutilmoqda</div>
    </div>
  );
}

function RowMenu({ status, onClose }: { status: AgentStatus; onClose: () => void }) {
  useEffect(() => {
    const handler = () => onClose();
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [onClose]);

  const items: { icon: typeof Pencil; label: string; tone?: "danger" }[] = [
    { icon: Pencil, label: "Listingni tahrirlash" },
    { icon: Upload, label: "Yangi versiya chiqarish" },
    { icon: EyeOff, label: "Vaqtincha yashirish" },
    { icon: Copy, label: "Nusxa olish" },
    { icon: Trash2, label: "Marketplace'dan olib tashlash", tone: "danger" },
  ];
  if (status === "rejected") {
    items.unshift({ icon: ShieldCheck, label: "Rad etish sababini ko'rish" });
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-9 z-20 w-56 overflow-hidden rounded-xl border border-border/70 bg-popover shadow-xl"
    >
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <button
            key={it.label}
            type="button"
            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition hover:bg-accent/40 ${
              it.tone === "danger" ? "text-red-400 hover:bg-red-500/10" : "text-foreground/90"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function EmptyProducts({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300 ring-1 ring-inset ring-violet-500/25">
        <Package className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-medium text-foreground">
        {hasAny ? "Bu filtrga mos mahsulot yo'q" : "Hali Marketplace uchun mahsulot yo'q"}
      </h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Agentlaringizni tayyorlab, Marketplace'ga chiqaring. Nashriyot ustasi
        keyingi versiyada faollashadi.
      </p>
      <Link
        to="/agentlarim"
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs text-foreground/90 transition hover:bg-accent/40"
      >
        <Bot className="h-3.5 w-3.5" />
        Agentlarim bo'limiga o'tish
      </Link>
    </div>
  );
}

function EarningsCard() {
  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Daromad statistikasi</h3>
          <p className="text-xs text-muted-foreground">Real vaqt Marketplace ma'lumotlari</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          Backend kutilmoqda
        </span>
      </div>

      <div className="mt-4 flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-background/60 text-center">
        <LineChart className="h-6 w-6 text-muted-foreground/70" />
        <p className="mt-2 text-xs text-muted-foreground">
          Hozircha real sotuv ma'lumotlari mavjud emas.
        </p>
      </div>

      <ul className="mt-4 space-y-2 text-xs">
        {[
          "Jami daromad",
          "Sotuvlar",
          "Yangi xaridorlar",
          "O'rtacha narx",
          "Qaytarishlar",
        ].map((k) => (
          <li key={k} className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-3 py-2">
            <span className="text-muted-foreground">{k}</span>
            <span className="text-foreground/70">—</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        Marketplace va to'lov backend'i ulangach, daromad statistikasi shu
        yerda ko'rinadi.
      </p>
    </section>
  );
}

function QuickActionsCard() {
  const actions: { icon: typeof Plus; label: string; to?: "/agent-yaratish" | "/agentlarim"; disabled?: boolean }[] = [
    { icon: Plus, label: "Yangi agent qo'shish", to: "/agent-yaratish" },
    { icon: FileText, label: "Qoralama yaratish", to: "/agentlarim" },
    { icon: DollarSign, label: "Daromadni chiqarish", disabled: true },
    { icon: CreditCard, label: "To'lov ma'lumotlari", disabled: true },
    { icon: Settings, label: "Marketplace profilini sozlash", disabled: true },
  ];
  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5">
      <h3 className="text-sm font-semibold">Tezkor amallar</h3>
      <ul className="mt-3 space-y-1.5">
        {actions.map((a) => {
          const Icon = a.icon;
          const inner = (
            <span className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${
              a.disabled
                ? "cursor-not-allowed text-muted-foreground/70"
                : "text-foreground/90 hover:bg-accent/40"
            }`}>
              <Icon className="h-3.5 w-3.5" />
              <span className="flex-1">{a.label}</span>
              {a.disabled ? (
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  Tez orada
                </span>
              ) : null}
            </span>
          );
          return (
            <li key={a.label}>
              {a.to && !a.disabled ? <Link to={a.to}>{inner}</Link> : inner}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
