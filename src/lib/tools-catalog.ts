import { t, localized, useI18n, getLocale, formatNumber, relativeTime, plural } from '@/i18n';
import type { ComponentType } from "react";
import {
  Calendar,
  FileText,
  Globe,
  Instagram,
  Mail,
  Package,
  Send,
  ShoppingBag,
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

const f = localized(() => ({
  apiKey: { key: "api_key", label: t("app.catalog.api_kaliti"), type: "secret" as const, placeholder: "sk_live_••••••••", required: true, help: t("app.catalog.provayder_konsolidan_yarating") },
  oauth: { key: "oauth", label: t("app.catalog.oauth_20_tizimiga_kirish"), type: "oauth" as const, required: true, help: t("app.catalog.hisobingiz_bilan_boglanish_uchun_avtorizatsiya_oching") },
  clientId: { key: "client_id", label: t("app.catalog.mijoz_identifikatori"), type: "text" as const, placeholder: "1234567890-xxxxx.apps.googleusercontent.com", required: true },
  clientSecret: { key: "client_secret", label: t("app.catalog.mijoz_siri"), type: "secret" as const, placeholder: "GOCSPX-••••••••", required: true },
  refreshToken: { key: "refresh_token", label: t("app.catalog.tokenni_yangilash"), type: "secret" as const, placeholder: "1//0g••••••••" },
  botToken: { key: "bot_token", label: t("app.catalog.bot_tokeni"), type: "secret" as const, placeholder: "123456:AAH••••••••", required: true, help: t("app.catalog.botfather_orqali_oling") },
  channelId: { key: "channel_id", label: t("app.catalog.kanal_identifikatori"), type: "text" as const, placeholder: t("app.catalog.mychannel_yoki_1001234567890") },
  webhook: { key: "webhook_url", label: t("app.catalog.vebhuk_url_manzili"), type: "url" as const, placeholder: "https://api.agentus.uz/hooks/..." },
  baseUrl: { key: "base_url", label: t("app.catalog.asosiy_url"), type: "url" as const, placeholder: "https://api.example.com", required: true },
  spreadsheetId: { key: "spreadsheet_id", label: t("app.catalog.elektron_jadval_identifikatori"), type: "text" as const, placeholder: "1AbC••••XYZ" },
  workspaceId: { key: "workspace_id", label: t("app.catalog.ish_maydoni_identifikatori"), type: "text" as const, placeholder: "ws_••••" },
}));

// Instance (konfiguratsiya) uchun tayyor maydon shablonlari.
const inst = localized(() => ({
  notes: {
    key: "notes", label: t("app.catalog.izohlar"), type: "textarea" as const,
    placeholder: t("app.catalog.bu_konfiguratsiya_nima_uchun_ishlatiladi"),
  } satisfies InstanceField,
  writeMode: {
    key: "write_mode", label: t("app.catalog.yozish_rejimi"), type: "select" as const,
    options: [
      { value: "append", label: t("app.catalog.qoshish") },
      { value: "replace", label: t("app.catalog.almashtirish") },
      { value: "update", label: t("app.workspace.yangilash") },
    ],
  } satisfies InstanceField,
}));

const sheetsInstanceFields: InstanceField[] = localized(() => ([
  { key: "spreadsheet", label: t("app.catalog.elektron_jadval"), type: "text", placeholder: "Hisobot.xlsx", required: true, help: t("app.catalog.fayl_nomi_yoki_spreadsheet_id") },
  { key: "sheet", label: t("app.catalog.varaq"), type: "text", placeholder: "Sheet1" },
  { key: "column", label: t("app.catalog.ustun"), type: "text", placeholder: "A" },
  inst.writeMode,
  { key: "folder", label: t("app.catalog.standart_papka"), type: "text", placeholder: "Reports/2026" },
  inst.notes,
]));

const telegramInstanceFields: InstanceField[] = localized(() => ([
  { key: "chat_id", label: t("app.catalog.chat_kanal"), type: "text", placeholder: t("app.catalog.mychannel_yoki_1001234567890"), required: true },
  { key: "template", label: t("app.catalog.xabar_shabloni"), type: "textarea", placeholder: t("app.catalog.assalomu_alaykum_name") },
  inst.notes,
]));

const gmailInstanceFields: InstanceField[] = localized(() => ([
  { key: "from_alias", label: t("app.catalog.yuboruvchi_alias"), type: "text", placeholder: "noreply@company.uz", required: true },
  { key: "subject_template", label: t("app.catalog.mavzu_shabloni"), type: "text", placeholder: t("app.catalog.haftalik_hisobot_date") },
  { key: "body_template", label: t("app.catalog.xabar_shabloni"), type: "textarea", placeholder: "Salom, ..." },
  inst.notes,
]));

const calendarInstanceFields: InstanceField[] = localized(() => ([
  { key: "calendar_id", label: t("app.catalog.kalendar"), type: "text", placeholder: t("app.catalog.primary_yoki_calendargroupcalendargooglecom"), required: true },
  { key: "default_duration", label: t("app.catalog.standart_davomiylik"), type: "text", placeholder: "30 daqiqa" },
  inst.notes,
]));

const httpInstanceFields: InstanceField[] = localized(() => ([
  { key: "endpoint", label: t("app.catalog.endpoint"), type: "text", placeholder: "/v1/orders", required: true },
  { key: "method", label: t("app.catalog.method"), type: "select", options: [
    { value: "GET", label: t("app.catalog.get") }, { value: "POST", label: t("app.catalog.post") },
    { value: "PUT", label: t("app.catalog.put") }, { value: "DELETE", label: t("app.catalog.delete") },
  ]},
  inst.notes,
]));

const sqlInstanceFields: InstanceField[] = localized(() => ([
  { key: "table", label: t("app.catalog.jadval"), type: "text", placeholder: "orders", required: true },
  { key: "query_template", label: t("app.catalog.query_shabloni"), type: "textarea", placeholder: t("app.catalog.select_from_orders_where") },
  inst.notes,
]));

const notionInstanceFields: InstanceField[] = localized(() => ([
  { key: "database_id", label: t("app.catalog.baza_id"), type: "text", placeholder: "abc123...", required: true },
  { key: "default_status", label: t("app.catalog.standart_status"), type: "text", placeholder: "Yangi" },
  inst.notes,
]));

const genericInstanceFields: InstanceField[] = localized(() => ([
  { key: "target", label: t("app.catalog.manzil_resurs"), type: "text", placeholder: t("app.catalog.malumot_manzili"), required: true },
  inst.notes,
]));

const buildCatalog = (): ToolDef[] => [
  {
    id: "telegram-bot",
    name: t("app.catalog.telegram_bot_api"),
    description: t("app.catalog.telegram_orqali_xabar_yuborish_qabul_qilish"),
    tier: "free", category: "Communication", icon: TelegramIcon,
    accent: "bg-sky-500/15 text-sky-400", version: "1.0.0",
    permissions: [t("app.catalog.xabar_yuborish"), t("app.catalog.xabar_qabul_qilish")],
    developer: "Agentus", docsUrl: "https://core.telegram.org/bots/api",
    updatedAt: "2025-06-30", defaultPermissions: ["read", "write"],
    authFields: [f.botToken, f.channelId, f.webhook],
  },
  {
    id: "google-sheets",
    name: t("app.catalog.google_sheets"),
    description: t("app.catalog.google_sheets_jadvaliga_malumot_yozish_oqish"),
    tier: "free", category: "Data", icon: GoogleSheetsIcon,
    accent: "bg-emerald-500/15 text-emerald-400", version: "1.0.0",
    permissions: [t("app.catalog.sheet_oqish"), t("app.catalog.sheet_yozish")],
    developer: "Google", docsUrl: "https://developers.google.com/sheets/api",
    updatedAt: "2025-06-12", defaultPermissions: ["read", "write"],
    authFields: [f.oauth, f.clientId, f.clientSecret, f.refreshToken, f.spreadsheetId],
  },
  {
    id: "gmail", name: t("app.catalog.gmail_api"),
    description: t("app.catalog.email_yuborish_qabul_qilish_va_avtomatik"),
    tier: "free", category: "Communication", icon: GmailIcon,
    accent: "bg-red-500/15 text-red-400", version: "1.0.0",
    permissions: [t("app.catalog.email_yuborish"), t("app.catalog.inbox_oqish")],
    developer: "Google", docsUrl: "https://developers.google.com/gmail/api",
    updatedAt: "2025-05-28", defaultPermissions: ["read", "write"],
    authFields: [f.oauth, f.clientId, f.clientSecret, f.refreshToken],
  },
  {
    id: "google-calendar", name: t("app.catalog.google_calendar"),
    description: t("app.catalog.tadbirlar_yaratish_uchrashuvlarni_boshqarish_va_eslatmalar"),
    tier: "free", category: "Automation", icon: GoogleCalendarIcon,
    accent: "bg-blue-500/15 text-blue-400", version: "1.0.0",
    permissions: [t("app.catalog.event_yaratish"), t("app.catalog.event_oqish")],
    developer: "Google", docsUrl: "https://developers.google.com/calendar",
    updatedAt: "2025-06-01", defaultPermissions: ["read", "write"],
    authFields: [f.oauth, f.clientId, f.clientSecret, f.refreshToken],
  },
  {
    id: "pdf-reader", name: t("app.catalog.pdf_reader"),
    description: t("app.catalog.pdf_hujjatlarini_oqish_va_matnni_ajratib"),
    tier: "free", category: "Files", icon: PdfReaderIcon,
    accent: "bg-rose-500/15 text-rose-400", version: "1.0.0",
    permissions: [t("app.catalog.fayl_oqish")],
    developer: "Agentus", updatedAt: "2025-04-18",
    defaultPermissions: ["read"], authFields: [],
  },
  {
    id: "http-request", name: t("app.catalog.api_connector"),
    description: t("app.catalog.rest_api_orqali_tashqi_servislar_bilan"),
    tier: "free", category: "Data", icon: ApiConnectorIcon,
    accent: "bg-indigo-500/15 text-indigo-400", version: "1.0.0",
    permissions: [t("app.catalog.http_sorov_yuborish")],
    developer: "Agentus", updatedAt: "2025-05-10",
    defaultPermissions: ["read", "write"],
    authFields: [f.baseUrl, f.apiKey],
  },
  {
    id: "browser-ai", name: t("app.catalog.browser_ai"),
    description: t("app.catalog.internetda_qidirish_saytlarni_oqish_forma_toldirish"),
    tier: "pro", category: "Automation", icon: BrowserAiIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: [t("app.catalog.web_navigatsiya"), t("app.catalog.dom_oqish")],
    developer: t("app.catalog.agentus_labs"), updatedAt: "2026-07-01",
    defaultPermissions: ["read", "execute"], authFields: [f.apiKey],
  },
  {
    id: "vision-ai", name: t("app.catalog.vision_ai"),
    description: t("app.catalog.rasmlar_screenshotlar_pdf_diagrammalar_va_kamerani"),
    tier: "pro", category: "AI", icon: VisionAiIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: [t("app.catalog.rasm_tahlili")],
    developer: t("app.catalog.agentus_labs"), updatedAt: "2026-07-01",
    defaultPermissions: ["read", "execute"], authFields: [f.apiKey],
  },
  {
    id: "code-runner", name: t("app.catalog.code_runner"),
    description: t("app.catalog.python_javascript_va_boshqa_kodlarni_yozish"),
    tier: "pro", category: "Automation", icon: CodeRunnerIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: [t("app.catalog.kod_ishga_tushirish")],
    developer: t("app.catalog.agentus_labs"), updatedAt: "2026-07-01",
    defaultPermissions: ["execute"], authFields: [f.apiKey],
  },
  {
    id: "database-studio", name: t("app.catalog.database_studio"),
    description: t("app.catalog.sql_malumotlar_bazalarini_boshqarish_oqish_yozish"),
    tier: "pro", category: "Data", icon: DatabaseStudioIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: [t("app.catalog.query_bajarish")],
    developer: t("app.catalog.agentus_labs"), updatedAt: "2026-07-01",
    defaultPermissions: ["read", "write", "execute"],
    authFields: [
      { key: "conn_string", label: t("app.catalog.ulanish_satri"), type: "secret", placeholder: "postgres://user:pass@host:5432/db", required: true },
    ],
  },
  {
    id: "cloud-workspace", name: t("app.catalog.cloud_workspace"),
    description: t("app.catalog.google_drive_dropbox_onedrive_va_boshqa"),
    tier: "pro", category: "Files", icon: CloudWorkspaceIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: [t("app.catalog.fayl_oqish"), t("app.catalog.fayl_yozish")],
    developer: t("app.catalog.agentus_labs"), updatedAt: "2026-07-01",
    defaultPermissions: ["read", "write"], authFields: [f.oauth, f.clientId, f.clientSecret],
  },
  {
    id: "ai-studio", name: t("app.catalog.ai_studio"),
    description: t("app.catalog.turli_ai_modellardan_foydalanish_va_ularni"),
    tier: "pro", category: "AI", icon: AiStudioIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: [t("app.catalog.model_chaqirish")],
    developer: t("app.catalog.agentus_labs"), updatedAt: "2026-07-01",
    defaultPermissions: ["execute"], authFields: [f.apiKey],
  },
  {
    id: "automation-hub", name: t("app.catalog.automation_hub"),
    description: t("app.catalog.triggerlar_schedule_webhook_http_sorovlar_va"),
    tier: "pro", category: "Automation", icon: AutomationHubIcon,
    accent: "bg-transparent", version: "1.0.0",
    permissions: [t("app.catalog.workflow_ishga_tushirish")],
    developer: t("app.catalog.agentus_labs"), updatedAt: "2026-07-01",
    defaultPermissions: ["read", "execute"], authFields: [f.apiKey, f.webhook],
  },
  {
    id: "instagram-poster", name: t("app.catalog.instagram_auto_poster"),
    description: t("app.catalog.instagram_ga_avtomatik_post_joylash"),
    tier: "marketplace", category: "Communication", icon: Instagram,
    accent: "bg-pink-500/15 text-pink-400", version: "1.2.0",
    permissions: [t("app.catalog.post_joylash")], purchasedAt: "2025-07-12",
    developer: t("app.catalog.marketplace_studio"), updatedAt: "2025-07-12",
    defaultPermissions: ["write"],
    authFields: [f.oauth, f.clientId, f.clientSecret],
  },
  {
    id: "amazon-kdp", name: t("app.catalog.amazon_kdp_publisher"),
    description: t("app.catalog.kitoblarni_amazon_kdp_ga_avtomatik_joylash"),
    tier: "marketplace", category: "Automation", icon: Package,
    accent: "bg-yellow-500/15 text-yellow-400", version: "1.0.0",
    permissions: [t("app.catalog.kitob_yuklash")], purchasedAt: "2025-07-10",
    developer: t("app.catalog.kdp_tools"), updatedAt: "2025-07-10",
    defaultPermissions: ["write"],
    authFields: [f.apiKey, f.workspaceId],
  },
  {
    id: "uzum-seller", name: t("app.catalog.uzum_seller"),
    description: t("app.catalog.uzum_platformasida_sotuvlarni_boshqarish"),
    tier: "marketplace", category: "Data", icon: ShoppingBag,
    accent: "bg-violet-500/15 text-violet-400", version: "1.1.0",
    permissions: [t("app.catalog.buyurtma_oqish")], purchasedAt: "2025-07-05",
    developer: "Uzum", updatedAt: "2025-07-05",
    defaultPermissions: ["read", "write"],
    authFields: [f.apiKey, f.workspaceId],
  },
  {
    id: "trading-bot", name: t("app.catalog.trading_bot_connector"),
    description: t("app.catalog.kripto_birjalari_bilan_ulanish_va_savdo"),
    tier: "marketplace", category: "Automation", icon: TrendingUp,
    accent: "bg-emerald-500/15 text-emerald-400", version: "0.8.0",
    permissions: [t("app.catalog.trade_yaratish")], purchasedAt: "2025-06-28",
    developer: "TradeLab", updatedAt: "2025-06-28",
    defaultPermissions: ["read", "write", "execute"],
    authFields: [
      f.apiKey,
      { key: "api_secret", label: t("app.catalog.api_siri"), type: "secret", placeholder: "••••••••", required: true },
    ],
  },
  {
    id: "notion-integration", name: t("app.catalog.notion_integration"),
    description: t("app.catalog.notion_bilan_malumot_sinxronizatsiyasi"),
    tier: "marketplace", category: "Data", icon: StickyNote,
    accent: "bg-slate-400/15 text-slate-300", version: "1.0.0",
    permissions: [t("app.catalog.sahifa_oqish"), t("app.catalog.sahifa_yozish")],
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

export const toolCatalog: ToolDef[] = localized(() => {
const entries = buildCatalog();
for (const t of entries) {
  const m = instanceMap[t.id];
  if (m) {
    t.instanceFields = m.fields;
    t.targetFieldKey = m.targetKey;
  } else {
    t.instanceFields = genericInstanceFields;
    t.targetFieldKey = "target";
  }
}

return entries;
});

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
