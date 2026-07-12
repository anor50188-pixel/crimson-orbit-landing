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

export type AuthFieldType = "text" | "secret" | "url" | "oauth";

export type AuthField = {
  key: string;
  label: string;
  type: AuthFieldType;
  placeholder?: string;
  required?: boolean;
  help?: string;
};

export type PermissionKey = "read" | "write" | "delete" | "execute" | "admin";

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
  developer?: string;
  docsUrl?: string;
  updatedAt?: string;
  authFields?: AuthField[];
  defaultPermissions?: PermissionKey[];
};

export const INSTALLED_TOOLS_KEY = "agentus:installed-tools";
export const TOOL_CONFIGS_KEY = "agentus:tool-configs";

export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "expired"
  | "invalid"
  | "unconfigured";

export type ActivityKind = "success" | "info" | "error";

export type ToolConfig = {
  toolId: string;
  fields: Record<string, string>;
  permissions: Partial<Record<PermissionKey, boolean>>;
  connection: ConnectionStatus;
  lastTestedAt?: string;
  activity: { at: string; message: string; kind: ActivityKind }[];
};

export function readToolConfigs(): Record<string, ToolConfig> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(TOOL_CONFIGS_KEY);
    if (raw) return JSON.parse(raw) as Record<string, ToolConfig>;
  } catch {
    /* ignore */
  }
  return {};
}

export function writeToolConfigs(configs: Record<string, ToolConfig>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOOL_CONFIGS_KEY, JSON.stringify(configs));
  } catch {
    /* ignore */
  }
}

export function isToolConfigured(tool: ToolDef, config?: ToolConfig): boolean {
  const fields = (tool.authFields ?? []).filter((f) => f.required !== false);
  if (fields.length === 0) return true;
  if (!config) return false;
  return fields.every((f) => {
    if (f.type === "oauth") return config.connection === "connected";
    return (config.fields[f.key] ?? "").trim().length > 0;
  });
}

export function isToolReady(tool: ToolDef, config?: ToolConfig): boolean {
  return isToolConfigured(tool, config) && config?.connection === "connected";
}

const f = {
  apiKey: { key: "api_key", label: "API kaliti", type: "secret" as const, placeholder: "sk_live_••••••••", required: true, help: "Provayder konsolidan yarating." },
  oauth: { key: "oauth", label: "OAuth 2.0 tizimiga kirish", type: "oauth" as const, required: true, help: "Hisobingiz bilan bog'lanish uchun avtorizatsiya oching." },
  clientId: { key: "client_id", label: "Mijoz identifikatori", type: "text" as const, placeholder: "1234567890-xxxxx.apps.googleusercontent.com", required: true },
  clientSecret: { key: "client_secret", label: "Mijoz siri", type: "secret" as const, placeholder: "GOCSPX-••••••••", required: true },
  refreshToken: { key: "refresh_token", label: "Tokenni yangilash", type: "secret" as const, placeholder: "1//0g••••••••" },
  botToken: { key: "bot_token", label: "Bot tokeni", type: "secret" as const, placeholder: "123456:AAH••••••••", required: true, help: "@BotFather orqali oling." },
  channelId: { key: "channel_id", label: "Kanal identifikatori", type: "text" as const, placeholder: "@my_channel yoki -1001234567890" },
  webhook: { key: "webhook_url", label: "Vebhuk URL manzili", type: "url" as const, placeholder: "https://api.agentus.uz/hooks/..." },
  baseUrl: { key: "base_url", label: "Asosiy URL", type: "url" as const, placeholder: "https://api.example.com", required: true },
  spreadsheetId: { key: "spreadsheet_id", label: "Elektron jadval identifikatori", type: "text" as const, placeholder: "1AbC••••XYZ" },
  workspaceId: { key: "workspace_id", label: "Ish maydoni identifikatori", type: "text" as const, placeholder: "ws_••••" },
};

export const toolCatalog: ToolDef[] = [
  {
    id: "telegram-bot",
    name: "Telegram Bot API",
    description: "Telegram orqali xabarlarni yuborish va qabul qilish.",
    tier: "free", category: "Communication", icon: Send,
    accent: "bg-sky-500/15 text-sky-400", version: "1.0.0",
    permissions: ["Xabar yuborish", "Xabar qabul qilish"],
    developer: "Agentus", docsUrl: "https://core.telegram.org/bots/api",
    updatedAt: "2025-06-30", defaultPermissions: ["read", "write"],
    authFields: [f.botToken, f.channelId, f.webhook],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Google Sheets ga yozish va o'qish.",
    tier: "free", category: "Data", icon: Table2,
    accent: "bg-emerald-500/15 text-emerald-400", version: "1.0.0",
    permissions: ["Sheet o'qish", "Sheet yozish"],
    developer: "Google", docsUrl: "https://developers.google.com/sheets/api",
    updatedAt: "2025-06-12", defaultPermissions: ["read", "write"],
    authFields: [f.oauth, f.clientId, f.clientSecret, f.refreshToken, f.spreadsheetId],
  },
  {
    id: "gmail", name: "Gmail API",
    description: "Email yuborish va qabul qilish.",
    tier: "free", category: "Communication", icon: Mail,
    accent: "bg-red-500/15 text-red-400", version: "1.0.0",
    permissions: ["Email yuborish", "Inbox o'qish"],
    developer: "Google", docsUrl: "https://developers.google.com/gmail/api",
    updatedAt: "2025-05-28", defaultPermissions: ["read", "write"],
    authFields: [f.oauth, f.clientId, f.clientSecret, f.refreshToken],
  },
  {
    id: "google-calendar", name: "Google Calendar",
    description: "Tadbirlar yaratish va boshqarish.",
    tier: "free", category: "Automation", icon: Calendar,
    accent: "bg-blue-500/15 text-blue-400", version: "1.0.0",
    permissions: ["Event yaratish", "Event o'qish"],
    developer: "Google", docsUrl: "https://developers.google.com/calendar",
    updatedAt: "2025-06-01", defaultPermissions: ["read", "write"],
    authFields: [f.oauth, f.clientId, f.clientSecret, f.refreshToken],
  },
  {
    id: "pdf-reader", name: "PDF Reader",
    description: "PDF fayllarni o'qish va tahlil qilish.",
    tier: "free", category: "Files", icon: FileText,
    accent: "bg-rose-500/15 text-rose-400", version: "1.0.0",
    permissions: ["Fayl o'qish"],
    developer: "Agentus", updatedAt: "2025-04-18",
    defaultPermissions: ["read"], authFields: [],
  },
  {
    id: "http-request", name: "HTTP Request",
    description: "REST API ga so'rov yuborish.",
    tier: "free", category: "Data", icon: Globe,
    accent: "bg-indigo-500/15 text-indigo-400", version: "1.0.0",
    permissions: ["HTTP so'rov yuborish"],
    developer: "Agentus", updatedAt: "2025-05-10",
    defaultPermissions: ["read", "write"],
    authFields: [f.baseUrl, f.apiKey],
  },
  {
    id: "advanced-browser", name: "Advanced Browser",
    description: "Web sahifalar bilan chuqur ishlash.",
    tier: "pro", category: "Automation", icon: Globe,
    accent: "bg-purple-500/15 text-purple-400", version: "0.9.0",
    permissions: ["Web navigatsiya", "DOM o'qish"],
    developer: "Agentus Labs", updatedAt: "2025-06-25",
    defaultPermissions: ["read", "execute"], authFields: [f.apiKey],
  },
  {
    id: "ai-vision", name: "AI Vision",
    description: "Rasmlarni tahlil qilish va matn ajratish.",
    tier: "pro", category: "AI", icon: Eye,
    accent: "bg-fuchsia-500/15 text-fuchsia-400", version: "0.8.0",
    permissions: ["Rasm tahlili"],
    developer: "Agentus Labs", updatedAt: "2025-06-20",
    defaultPermissions: ["read", "execute"], authFields: [f.apiKey],
  },
  {
    id: "deep-research", name: "Deep Research",
    description: "Internetdan chuqur ma'lumot yig'ish.",
    tier: "pro", category: "AI", icon: Search,
    accent: "bg-amber-500/15 text-amber-400", version: "0.7.0",
    permissions: ["Web qidiruv", "Kontent tahlili"],
    developer: "Agentus Labs", updatedAt: "2025-06-15",
    defaultPermissions: ["read", "execute"], authFields: [f.apiKey],
  },
  {
    id: "sql-database", name: "SQL Database",
    description: "SQL orqali ma'lumotlar bazasi bilan ishlash.",
    tier: "pro", category: "Data", icon: Database,
    accent: "bg-cyan-500/15 text-cyan-400", version: "0.9.0",
    permissions: ["Query bajarish"],
    developer: "Agentus Labs", updatedAt: "2025-06-05",
    defaultPermissions: ["read", "write", "execute"],
    authFields: [
      { key: "conn_string", label: "Ulanish satri", type: "secret", placeholder: "postgres://user:pass@host:5432/db", required: true },
    ],
  },
  {
    id: "automation-suite", name: "Automation Suite",
    description: "Murakkab avtomatlashtirish jarayonlarini yaratish.",
    tier: "pro", category: "Automation", icon: Sparkles,
    accent: "bg-orange-500/15 text-orange-400", version: "0.5.0",
    permissions: ["Workflow ishga tushirish"],
    developer: "Agentus Labs", updatedAt: "2025-06-10",
    defaultPermissions: ["read", "execute"],
    authFields: [f.apiKey, f.webhook],
  },
  {
    id: "instagram-poster", name: "Instagram Auto Poster",
    description: "Instagram ga avtomatik post joylash.",
    tier: "marketplace", category: "Communication", icon: Instagram,
    accent: "bg-pink-500/15 text-pink-400", version: "1.2.0",
    permissions: ["Post joylash"], purchasedAt: "2025-07-12",
    developer: "Marketplace Studio", updatedAt: "2025-07-12",
    defaultPermissions: ["write"],
    authFields: [f.oauth, f.clientId, f.clientSecret],
  },
  {
    id: "amazon-kdp", name: "Amazon KDP Publisher",
    description: "Kitoblarni Amazon KDP ga avtomatik joylash.",
    tier: "marketplace", category: "Automation", icon: Package,
    accent: "bg-yellow-500/15 text-yellow-400", version: "1.0.0",
    permissions: ["Kitob yuklash"], purchasedAt: "2025-07-10",
    developer: "KDP Tools", updatedAt: "2025-07-10",
    defaultPermissions: ["write"],
    authFields: [f.apiKey, f.workspaceId],
  },
  {
    id: "uzum-seller", name: "Uzum Seller",
    description: "Uzum platformasida sotuvlarni boshqarish.",
    tier: "marketplace", category: "Data", icon: ShoppingBag,
    accent: "bg-violet-500/15 text-violet-400", version: "1.1.0",
    permissions: ["Buyurtma o'qish"], purchasedAt: "2025-07-05",
    developer: "Uzum", updatedAt: "2025-07-05",
    defaultPermissions: ["read", "write"],
    authFields: [f.apiKey, f.workspaceId],
  },
  {
    id: "trading-bot", name: "Trading Bot Connector",
    description: "Kripto birjalari bilan ulanish va savdo.",
    tier: "marketplace", category: "Automation", icon: TrendingUp,
    accent: "bg-emerald-500/15 text-emerald-400", version: "0.8.0",
    permissions: ["Trade yaratish"], purchasedAt: "2025-06-28",
    developer: "TradeLab", updatedAt: "2025-06-28",
    defaultPermissions: ["read", "write", "execute"],
    authFields: [
      f.apiKey,
      { key: "api_secret", label: "API siri", type: "secret", placeholder: "••••••••", required: true },
    ],
  },
  {
    id: "notion-integration", name: "Notion Integration",
    description: "Notion bilan ma'lumot sinxronizatsiyasi.",
    tier: "marketplace", category: "Data", icon: StickyNote,
    accent: "bg-slate-400/15 text-slate-300", version: "1.0.0",
    permissions: ["Sahifa o'qish", "Sahifa yozish"],
    purchasedAt: "2025-06-18",
    developer: "Notion", docsUrl: "https://developers.notion.com",
    updatedAt: "2025-06-18", defaultPermissions: ["read", "write"],
    authFields: [f.apiKey, f.workspaceId],
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
