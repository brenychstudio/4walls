import type { Locale } from "./messages";

export const LOCALE_STORAGE_KEY = "4walls.locale";
export const LOCALE_EVENT_NAME = "4walls:locale-change";

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "uk";
  const value = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return value === "en" ? "en" : "uk";
}

export function setStoredLocale(locale: Locale) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);

  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }

  window.dispatchEvent(
    new CustomEvent(LOCALE_EVENT_NAME, {
      detail: locale,
    }),
  );
}

export function subscribeLocaleChange(handler: (locale: Locale) => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<Locale>;
    handler(customEvent.detail);
  };

  window.addEventListener(LOCALE_EVENT_NAME, listener as EventListener);

  return () => {
    window.removeEventListener(LOCALE_EVENT_NAME, listener as EventListener);
  };
}
