import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
import uz from './uz';
import ru from './ru';
import en from './en';
import { dictionaryDifferences, flatten, interpolate, locales, pluralCategory, type Language, type Variables } from './core';

export const dictionaries = { uz, ru, en };
const flattened = { uz: flatten(uz), ru: flatten(ru), en: flatten(en) };
type LeafPaths<T> = { [K in keyof T & string]: T[K] extends string ? K : `${K}.${LeafPaths<T[K]>}` }[keyof T & string];
export type TranslationKey = LeafPaths<typeof uz>;
let language: Language = 'uz';
const listeners = new Set<() => void>();
const missing = new Set<string>(dictionaryDifferences(dictionaries));
export const getLanguage = () => language;
export const getLocale = () => locales[language];
export function setLanguage(next: Language) {
  language = next;
  if (typeof document !== 'undefined') document.documentElement.lang = next;
  try { localStorage.setItem('agentus:language', next); } catch { /* Language still works without storage. */ }
  listeners.forEach(listener => listener());
}
export function t(key: TranslationKey, variables?: Variables): string {
  const value = flattened[language][key];
  if (value === undefined && import.meta.env.DEV && !missing.has(key)) {
    missing.add(key); console.error(`[i18n] Missing key: ${key}`);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('agentus:i18n-missing'));
  }
  return interpolate(value ?? flattened.uz[key] ?? key, variables);
}
export function plural(key: 'agent' | 'tool', count: number) {
  const category = pluralCategory(language, count);
  return t(`app.shared.${key}_${category}` as TranslationKey, { n: formatNumber(count) });
}
export const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(language === 'uz' ? 'ru-RU' : getLocale(), options).format(number);
export const formatDate = (date: string | number | Date, options?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(getLocale(), options).format(new Date(date));
export const relativeTime = (amount: number, unit: Intl.RelativeTimeFormatUnit) => {
  if (language === 'uz' && ['hour','minute','day'].includes(unit)) {
    const key = unit === 'hour' ? 'app.agents.v0_soat_oldin' : unit === 'minute' ? 'app.agents.v0_daqiqa_oldin' : 'app.agents.v0_kun_oldin';
    return t(key, { v0: formatNumber(Math.abs(amount)) });
  }
  return new Intl.RelativeTimeFormat(getLocale(), { numeric: 'auto' }).format(amount, unit);
};
/** Locale-aware module data without recreating or translating stored user input. */
export function localized<T extends object>(factory: () => T): T {
  let cachedLanguage: Language | null = null;
  let cached: T | null = null;
  const current = () => { if (!cached || cachedLanguage !== language) { cached = factory(); cachedLanguage = language; } return cached; };
  return new Proxy({} as T, {
    get: (_target, property) => { const value = Reflect.get(current(), property); return typeof value === 'function' ? value.bind(current()) : value; },
    has: (_target, property) => property in current(),
    ownKeys: () => Reflect.ownKeys(current()),
    getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
  });
}
const LanguageContext = createContext<Language>('uz');
export function useI18n() { const active = useContext(LanguageContext); return { language: active, setLanguage, t, plural, formatNumber, formatDate, relativeTime }; }
export function I18nProvider({ children }: { children: ReactNode }) {
  const active = useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, getLanguage, () => 'uz' as Language);
  const issues = useSyncExternalStore(listener => { if (typeof window === 'undefined') return () => {}; window.addEventListener('agentus:i18n-missing', listener); return () => window.removeEventListener('agentus:i18n-missing', listener); }, () => [...missing].join('\n'), () => '');
  useEffect(() => {
    try { const saved = localStorage.getItem('agentus:language'); if (saved === 'uz' || saved === 'ru' || saved === 'en') setLanguage(saved); } catch { /* Default Uzbek. */ }
    if (missing.size) console.error('[i18n]', [...missing]);
  }, []);
  return <LanguageContext value={active}>{children}{import.meta.env.DEV && issues && <aside className="i18n-dev-banner" role="alert">i18n: <pre>{issues}</pre></aside>}</LanguageContext>;
}