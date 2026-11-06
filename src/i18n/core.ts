export type Language = 'uz' | 'ru' | 'en';
export type Dictionary = { [key: string]: string | Dictionary };
export type Variables = Record<string, string | number>;
export const locales: Record<Language, string> = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' };
export function flatten(dictionary: Dictionary, prefix = ''): Record<string, string> {
  return Object.fromEntries(Object.entries(dictionary).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [[path, value]] : Object.entries(flatten(value, path));
  }));
}
export function interpolate(value: string, variables: Variables = {}) {
  return value.replace(/\{(\w+)\}/g, (match, name: string) => String(variables[name] ?? match));
}
export function pluralCategory(language: Language, count: number) {
  // Uzbek product grammar uses singular only for exactly one.
  return language === 'uz' ? (count === 1 ? 'one' : 'other') : new Intl.PluralRules(locales[language]).select(count);
}
export function dictionaryDifferences(dictionaries: Record<Language, Dictionary>) {
  const keys = new Set(Object.values(dictionaries).flatMap(dictionary => Object.keys(flatten(dictionary))));
  return [...keys].flatMap(key => (['uz', 'ru', 'en'] as const).filter(language => !(key in flatten(dictionaries[language]))).map(language => `${language}: ${key}`));
}