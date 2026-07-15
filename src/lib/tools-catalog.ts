import type { ComponentType } from "react";
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
import {
  TelegramIcon,
  GoogleSheetsIcon,
  GmailIcon,
  GoogleCalendarIcon,
  ApiConnectorIcon,
  PdfReaderIcon,
} from "@/components/tool-icons";
import {
  BrowserAiIcon,
  VisionAiIcon,
  CodeRunnerIcon,
  DatabaseStudioIcon,
  CloudWorkspaceIcon,
  AiStudioIcon,
  AutomationHubIcon,
} from "@/components/pro-tool-icons";

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

export type InstanceFieldType = "text" | "textarea" | "select";

export type InstanceField = {
  key: string;
  label: string;
  type: InstanceFieldType;
  placeholder?: string;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
};

export type ToolDef = {
  id: string;
  name: string;
  description: string;
  tier: ToolTier;
  category: ToolCategory;
  icon: ComponentType<{ className?: string }>;
  accent: string;
  version: string;
  permissions: string[];
  purchasedAt?: string;
  developer?: string;
  docsUrl?: string;
  updatedAt?: string;
  authFields?: AuthField[];
  defaultPermissions?: PermissionKey[];
  instanceFields?: InstanceField[];
  /** Instance kartochkasida ko'rinadigan asosiy "manzil" maydoni kaliti. */
  targetFieldKey?: string;
  /** UI'da: "Konfiguratsiya" atamasi tool sohasiga moslashtiriladi. */
  instanceLabel?: string;
};

export const INSTALLED_TOOLS_KEY = "agentus:installed-tools";
export const TOOL_CONFIGS_KEY = "agentus:tool-configs";
export const TOOL_INSTANCES_KEY = "agentus:tool-instances";

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

/** Auth qatlami — bir marta ulanadi. */
export function isToolAuthenticated(tool: ToolDef, config?: ToolConfig): boolean {
  const fields = (tool.authFields ?? []);
  if (fields.length === 0) return true; // auth kerak emas
  return isToolConfigured(tool, config) && config?.connection === "connected";
}

// ————— Konfiguratsiya (instance) qatlami ————————————————————————————
export type ToolInstance = {
  id: string;
  toolId: string;
  name: string;
  fields: Record<string, string>;
  createdAt: string;
  updatedAt?: string;
  connectedAgentIds: string[];
};

export function readToolInstances(): ToolInstance[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TOOL_INSTANCES_KEY);
    if (raw) return JSON.parse(raw) as ToolInstance[];
  } catch {
    /* ignore */
  }
  return [];
}

export function writeToolInstances(list: ToolInstance[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOOL_INSTANCES_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function instancesForTool(list: ToolInstance[], toolId: string) {
  return list.filter((i) => i.toolId === toolId);
}

/** Ready = auth ulangan VA kamida bitta konfiguratsiya bor. */
export function toolStatus(
  tool: ToolDef,
  config: ToolConfig | undefined,
  instances: ToolInstance[],
): "unconfigured" | "auth-needed" | "configs-needed" | "ready" {
  if (!isToolAuthenticated(tool, config)) {
    if ((tool.authFields ?? []).length === 0) {
      return instancesForTool(instances, tool.id).length > 0 ? "ready" : "configs-needed";
    }
    return "auth-needed";
  }
  return instancesForTool(instances, tool.id).length > 0 ? "ready" : "configs-needed";
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

// Instance (konfiguratsiya) uchun tayyor maydon shablonlari.
const inst = {
  notes: {
    key: "notes", label: "Izohlar", type: "textarea" as const,
    placeholder: "Bu konfiguratsiya nima uchun ishlatiladi?",
  } satisfies InstanceField,
  writeMode: {
    key: "write_mode", label: "Yozish rejimi", type: "select" as const,
    options: [
      { value: "append", label: "Qo'shish" },
      { value: "replace", label: "Almashtirish" },
      { value: "update", label: "Yangilash" },
    ],
  } satisfies InstanceField,
};

const sheetsInstanceFields: InstanceField[] = [
  { key: "spreadsheet", label: "Elektron jadval", type: "text", placeholder: "Hisobot.xlsx", required: true, help: "Fayl nomi yoki Spreadsheet ID." },
  { key: "sheet", label: "Varaq", type: "text", placeholder: "Sheet1" },
  { key: "column", label: "Ustun", type: "text", placeholder: "A" },
  inst.writeMode,
  { key: "folder", label: "Standart papka", type: "text", placeholder: "Reports/2026" },
  inst.notes,
];

const telegramInstanceFields: InstanceField[] = [
  { key: "chat_id", label: "Chat / kanal", type: "text", placeholder: "@my_channel yoki -1001234567890", required: true },
  { key: "template", label: "Xabar shabloni", type: "textarea", placeholder: "Assalomu alaykum, {name}..." },
  inst.notes,
];

const gmailInstanceFields: InstanceField[] = [
  { key: "from_alias", label: "Yuboruvchi alias", type: "text", placeholder: "noreply@company.uz", required: true },
  { key: "subject_template", label: "Mavzu shabloni", type: "text", placeholder: "Haftalik hisobot — {date}" },
  { key: "body_template", label: "Xabar shabloni", type: "textarea", placeholder: "Salom, ..." },
  inst.notes,
];

const calendarInstanceFields: InstanceField[] = [
  { key: "calendar_id", label: "Kalendar", type: "text", placeholder: "primary yoki calendar@group.calendar.google.com", required: true },
  { key: "default_duration", label: "Standart davomiylik", type: "text", placeholder: "30 daqiqa" },
  inst.notes,
];

const httpInstanceFields: InstanceField[] = [
  { key: "endpoint", label: "Endpoint", type: "text", placeholder: "/v1/orders", required: true },
  { key: "method", label: "Method", type: "select", options: [
    { value: "GET", label: "GET" }, { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" }, { value: "DELETE", label: "DELETE" },
  ]},
  inst.notes,
];

const sqlInstanceFields: InstanceField[] = [
  { key: "table", label: "Jadval", type: "text", placeholder: "orders", required: true },
  { key: "query_template", label: "Query shabloni", type: "textarea", placeholder: "SELECT * FROM orders WHERE ..." },
  inst.notes,
];

const notionInstanceFields: InstanceField[] = [
  { key: "database_id", label: "Baza ID", type: "text", placeholder: "abc123...", required: true },
  { key: "default_status", label: "Standart status", type: "text", placeholder: "Yangi" },
  inst.notes,
];

const genericInstanceFields: InstanceField[] = [
  { key: "target", label: "Manzil / resurs", type: "text", placeholder: "Ma'lumot manzili", required: true },
  inst.notes,
];

export const toolCatalog: ToolDef[] = [
  {
    id: "telegram-bot",
    name: "Telegram Bot API",
    description: "Telegram orqali xabar yuborish, qabul qilish va botlarni boshqarish.",
    tier: "free", category: "Communication", icon: TelegramIcon,
    accent: "bg-sky-500/15 text-sky-400", version: "1.0.0",
    permissions: ["Xabar yuborish", "Xabar qabul qilish"],
    developer: "Agentus", docsUrl: "https://core.telegram.org/bots/api",
    updatedAt: "2025-06-30", defaultPermissions: ["read", "write"],
    authFields: [f.botToken, f.channelId, f.webhook],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Google Sheets jadvaliga ma'lumot yozish, o'qish va yangilash.",
    tier: "free", category: "Data", icon: GoogleSheetsIcon,
    accent: "bg-emerald-500/15 text-emerald-400", version: "1.0.0",
    permissions: ["Sheet o'qish", "Sheet yozish"],
    developer: "Google", docsUrl: "https://developers.google.com/sheets/api",
    updatedAt: "2025-06-12", defaultPermissions: ["read", "write"],
    authFields: [f.oauth, f.clientId, f.clientSecret, f.refreshToken, f.spreadsheetId],
  },
  {
    id: "gmail", name: "Gmail API",
    description: "Email yuborish, qabul qilish va avtomatik javob berish.",
    tier: "free", category: "Communication", icon: GmailIcon,
    accent: "bg-red-500/15 text-red-400", version: "1.0.0",
    permissions: ["Email yuborish", "Inbox o'qish"],
    developer: "Google", docsUrl: "https://developers.google.com/gmail/api",
    updatedAt: "2025-05-28", defaultPermissions: ["read", "write"],
    authFields: [f.oauth, f.clientId, f.clientSecret, f.refreshToken],
  },
  {
    id: "google-calendar", name: "Google Calendar",
    description: "Tadbirlar yaratish, uchrashuvlarni boshqarish va eslatmalar qo'shish.",
    tier: "free", category: "Automation", icon: GoogleCalendarIcon,
    accent: "bg-blue-500/15 text-blue-400", version: "1.0.0",
    permissions: ["Event yaratish", "Event o'qish"],
    developer: "Google", docsUrl: "https://developers.google.com/calendar",
    updatedAt: "2025-06-01", defaultPermissions: ["read", "write"],
    authFields: [f.oauth, f.clientId, f.clientSecret, f.refreshToken],
  },
  {
    id: "pdf-reader", name: "PDF Reader",
    description: "PDF hujjatlarini o'qish va matnni ajratib olish.",
    tier: "free", category: "Files", icon: PdfReaderIcon,
    accent: "bg-rose-500/15 text-rose-400", version: "1.0.0",
    permissions: ["Fayl o'qish"],
    developer: "Agentus", updatedAt: "2025-04-18",
    defaultPermissions: ["read"], authFields: [],
  },
  {
    id: "http-request", name: "API Connector",
    description: "REST API orqali tashqi servislar bilan ma'lumot almashish.",
    tier: "free", category: "Data", icon: ApiConnectorIcon,
    accent: "bg-indigo-500/15 text-indigo-400", version: "1.0.0",
    permissions: ["HTTP so'rov yuborish"],
    developer: "Agentus", updatedAt: "2025-05-10",
    defaultPermissions: ["read", "write"],
    authFields: [f.baseUrl, f.apiKey],
  },
  {
    id: "browser-ai", name: "Browser AI",
    description: "Internetda qidirish, saytlarni o'qish, forma to'ldirish va ma'lumot yig'ish.",
    tier: "pro", category: "Automation", icon: BrowserAiIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: ["Web navigatsiya", "DOM o'qish"],
    developer: "Agentus Labs", updatedAt: "2026-07-01",
    defaultPermissions: ["read", "execute"], authFields: [f.apiKey],
  },
  {
    id: "vision-ai", name: "Vision AI",
    description: "Rasmlar, screenshotlar, PDF, diagrammalar va kamerani tahlil qilish.",
    tier: "pro", category: "AI", icon: VisionAiIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: ["Rasm tahlili"],
    developer: "Agentus Labs", updatedAt: "2026-07-01",
    defaultPermissions: ["read", "execute"], authFields: [f.apiKey],
  },
  {
    id: "code-runner", name: "Code Runner",
    description: "Python, JavaScript va boshqa kodlarni yozish, ishga tushirish va natija olish.",
    tier: "pro", category: "Automation", icon: CodeRunnerIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: ["Kod ishga tushirish"],
    developer: "Agentus Labs", updatedAt: "2026-07-01",
    defaultPermissions: ["execute"], authFields: [f.apiKey],
  },
  {
    id: "database-studio", name: "Database Studio",
    description: "SQL ma'lumotlar bazalarini boshqarish, o'qish, yozish va tahlil qilish.",
    tier: "pro", category: "Data", icon: DatabaseStudioIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: ["Query bajarish"],
    developer: "Agentus Labs", updatedAt: "2026-07-01",
    defaultPermissions: ["read", "write", "execute"],
    authFields: [
      { key: "conn_string", label: "Ulanish satri", type: "secret", placeholder: "postgres://user:pass@host:5432/db", required: true },
    ],
  },
  {
    id: "cloud-workspace", name: "Cloud Workspace",
    description: "Google Drive, Dropbox, OneDrive va boshqa bulutli xotiralar bilan ishlash.",
    tier: "pro", category: "Files", icon: CloudWorkspaceIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: ["Fayl o'qish", "Fayl yozish"],
    developer: "Agentus Labs", updatedAt: "2026-07-01",
    defaultPermissions: ["read", "write"], authFields: [f.oauth, f.clientId, f.clientSecret],
  },
  {
    id: "ai-studio", name: "AI Studio",
    description: "Turli AI modellardan foydalanish va ularni birgalikda ishlatish (Claude, GPT, Gemini va boshqalar).",
    tier: "pro", category: "AI", icon: AiStudioIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: ["Model chaqirish"],
    developer: "Agentus Labs", updatedAt: "2026-07-01",
    defaultPermissions: ["execute"], authFields: [f.apiKey],
  },
  {
    id: "automation-hub", name: "Automation Hub",
    description: "Triggerlar, schedule, webhook, HTTP so'rovlar va jarayonlarni avtomatlashtirish.",
    tier: "pro", category: "Automation", icon: AutomationHubIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: ["Workflow ishga tushirish"],
    developer: "Agentus Labs", updatedAt: "2026-07-01",
    defaultPermissions: ["read", "execute"], authFields: [f.apiKey, f.webhook],
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

// Instance shablonlari va "manzil" maydonini har bir toolga biriktiramiz.
const instanceMap: Record<string, { fields: InstanceField[]; targetKey: string }> = {
  "google-sheets": { fields: sheetsInstanceFields, targetKey: "spreadsheet" },
  "telegram-bot": { fields: telegramInstanceFields, targetKey: "chat_id" },
  gmail: { fields: gmailInstanceFields, targetKey: "from_alias" },
  "google-calendar": { fields: calendarInstanceFields, targetKey: "calendar_id" },
  "http-request": { fields: httpInstanceFields, targetKey: "endpoint" },
  "sql-database": { fields: sqlInstanceFields, targetKey: "table" },
  "notion-integration": { fields: notionInstanceFields, targetKey: "database_id" },
};

for (const t of toolCatalog) {
  const m = instanceMap[t.id];
  if (m) {
    t.instanceFields = m.fields;
    t.targetFieldKey = m.targetKey;
  } else {
    t.instanceFields = genericInstanceFields;
    t.targetFieldKey = "target";
  }
}

export function readInstalledToolIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(INSTALLED_TOOLS_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    /* ignore */
  }
  return ["telegram-bot", "google-sheets", "gmail", "google-calendar", "http-request", "pdf-reader"];
}

export function writeInstalledToolIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(INSTALLED_TOOLS_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}
