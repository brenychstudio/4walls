import { useEffect, useMemo, useState } from "react";

import LanguageToggle from "../../i18n/LanguageToggle";
import { messages } from "../../i18n/messages";
import { getStoredLocale, subscribeLocaleChange } from "../../i18n/runtime";
import XRExperienceHost from "../../xr-core/runtime/XRExperienceHost.jsx";

export default function FourWallsXRPage() {
  const [locale, setLocale] = useState(() => getStoredLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    return subscribeLocaleChange(setLocale);
  }, []);

  const returnHref = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("return") || "/";
  }, []);

  const copy = messages[locale];

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100dvh",
        background: "#040506",
        color: "white",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <XRExperienceHost
          mode="kiosk"
          autoStart={true}
          builderLoader={() => import("../../xr/4walls/build4WallsManifest.js")}
        />
      </div>

      <div
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          zIndex: 20,
          pointerEvents: "none",
          maxWidth: 460,
          opacity: 0.78,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            opacity: 0.42,
            marginBottom: 8,
          }}
        >
          {copy.ui.xrThresholdLabel}
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <LanguageToggle />

        <a
          href={returnHref}
          style={{
            padding: "10px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(6,8,10,0.58)",
            color: "rgba(255,255,255,0.88)",
            textDecoration: "none",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontSize: 11,
            lineHeight: 1,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
          }}
        >
          {copy.ui.continueFromXr}
        </a>
      </div>
    </section>
  );
}
