import { ru, type Dictionary } from "./ru";

/**
 * Localization entry point. Add a new language by creating a dictionary with the
 * same shape as `ru` and registering it here; then expose a locale switcher.
 */
export const dictionaries = { ru } satisfies Record<string, Dictionary>;
export type Locale = keyof typeof dictionaries;
export const DEFAULT_LOCALE: Locale = "ru";

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale];
}

/** Hook form so components stay ready for a locale context later. */
export function useT(): Dictionary {
  return getDictionary(DEFAULT_LOCALE);
}

export function formatDate(iso: string | null | undefined, locale: Locale = DEFAULT_LOCALE): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

export { pluralRu } from "./plural";
export type { Dictionary };
