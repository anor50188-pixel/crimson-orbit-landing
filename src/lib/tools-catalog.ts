import {
  Calendar,
  Database,
  Eye,
  FileText,
  Globe,
  Instagram,
  Mail,
  Package,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  StickyNote,
  Table2,
  TrendingUp,
  Wrench,
} from "lucide-react";

export type ToolTier = "free" | "pro" | "marketplace";
export type ToolCategory =
  | "Communication"
  | "Data"
  | "AI"
  | "Automation"
  | "Files";

export type ToolDef = {
  id: string;
  name: string;
  description: string;
  tier: ToolTier;
  category: ToolCategory;
  icon: typeof Wrench;
  accent: string;
  version: string;
  permissions: string[];
  purchasedAt?: string;
};

export const INSTALLED_TOOLS_KEY = "agentus:installed-tools";

// Foydalanuvchi Mening toollarim sahifasida boshqaradigan yagona katalog.
export const toolCatalog: ToolDef[] = [
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

export function readInstalledToolIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(INSTALLED_TOOLS_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    /* ignore */
  }
  // Yangi foydalanuvchi uchun sukut bo'yicha bepul asosiy toollar o'rnatilgan hisoblanadi.
  return ["telegram-bot", "google-sheets", "gmail"];
}

export function writeInstalledToolIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(INSTALLED_TOOLS_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}