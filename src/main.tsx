import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store.ts";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

// i18n import
import "./i18n";
import { useTranslation } from "react-i18next";

/**
 * RootWrapper - Handles language direction,
 * fonts, and toast styling
 */
const RootWrapper = () => {
  const { i18n } = useTranslation();
  const prevLang = useRef(i18n.language);

  useEffect(() => {
    const dir = i18n.dir();
    const lang = i18n.language;

    const applyChanges = () => {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      document.documentElement.dir = dir;
      document.documentElement.lang = lang;

      document.body.classList.remove(
        "dir-ltr",
        "dir-rtl",
        "lang-ar"
      );

      document.body.classList.add(`dir-${dir}`);

      if (lang === "ar") {
        document.body.classList.add("lang-ar");
      }

      if (prevLang.current !== lang) {
        requestAnimationFrame(() => {
          window.scrollTo(scrollX, scrollY);
        });

        prevLang.current = lang;
      }
    };

    requestAnimationFrame(applyChanges);
  }, [i18n.language]);

  const isRTL = i18n.dir() === "rtl";

  const fontFamily = isRTL
    ? "'IBMPlexArabic', 'Inter', sans-serif"
    : "'Inter', 'Montserrat', sans-serif";

  // ✅ Base style مشترك لكل أنواع التوست
  const baseToastStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.85)",
    color: "#1a1a1a",
    borderRadius: "16px",
    padding: "14px 18px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily,
    direction: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "left",
    width: "fit-content",
    maxWidth: "360px",
    minWidth: "280px",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.5)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  };

  return (
    <Provider store={store}>
      <Toaster
        position="top-center"
        containerStyle={{ top: 18 }}
        toastOptions={{
          duration: 3500,
          // ✅ style الافتراضي للتوست العادي
          style: baseToastStyle,
          success: {
            duration: 3000,
            iconTheme: { primary: "#16a34a", secondary: "transparent" },
            // ✅ spread الـ base أولاً ثم override الألوان فقط
            style: {
              ...baseToastStyle,
              background: "rgba(220,252,231,0.88)",
              color: "#14532d",
              border: "1px solid rgba(34,197,94,0.3)",
            },
          },
          error: {
            duration: 4500,
            iconTheme: { primary: "#dc2626", secondary: "transparent" },
            // ✅ spread الـ base أولاً ثم override الألوان فقط
            style: {
              ...baseToastStyle,
              background: "rgba(254,226,226,0.88)",
              color: "#7f1d1d",
              border: "1px solid rgba(239,68,68,0.3)",
            },
          },
        }}
      />
      <App />
    </Provider>
  );
};

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <RootWrapper />
  </React.StrictMode>
);