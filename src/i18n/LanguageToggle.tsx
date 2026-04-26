import { useEffect, useState, type CSSProperties } from "react";

import { type Locale } from "./messages";
import { getStoredLocale, setStoredLocale, subscribeLocaleChange } from "./runtime";

export default function LanguageToggle() {
  const [locale, setLocale] = useState<Locale>(() => getStoredLocale());

  useEffect(() => {
    return subscribeLocaleChange(setLocale);
  }, []);

  const buttonStyle: CSSProperties = {
    minHeight: 32,
    minWidth: 52,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(6,8,10,0.52)",
    color: "rgba(255,255,255,0.82)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    lineHeight: 1,
    cursor: "pointer",
    transition: "background 160ms ease, color 160ms ease, border-color 160ms ease",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(6,8,10,0.44)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <button
        type="button"
        onClick={() => setStoredLocale("uk")}
        style={{
          ...buttonStyle,
          background: locale === "uk" ? "rgba(255,255,255,0.14)" : buttonStyle.background,
          color: locale === "uk" ? "rgba(255,255,255,0.96)" : buttonStyle.color,
          borderColor:
            locale === "uk" ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.10)",
        }}
      >
        UA
      </button>

      <button
        type="button"
        onClick={() => setStoredLocale("en")}
        style={{
          ...buttonStyle,
          background: locale === "en" ? "rgba(255,255,255,0.14)" : buttonStyle.background,
          color: locale === "en" ? "rgba(255,255,255,0.96)" : buttonStyle.color,
          borderColor:
            locale === "en" ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.10)",
        }}
      >
        EN
      </button>
    </div>
  );
}
