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
 * RootWrapper - Handles language direction and fonts
 */
const RootWrapper = () => {
  const { i18n } = useTranslation();
  const prevLang = useRef(i18n.language);

  useEffect(() => {
    const dir = i18n.dir();
    const lang = i18n.language;

    const applyChanges = () => {
      // Save current scroll position
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      // Apply direction and language
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;

      // Update body classes
      document.body.classList.remove("dir-ltr", "dir-rtl", "lang-ar");
      document.body.classList.add(`dir-${dir}`);
      if (lang === "ar") document.body.classList.add("lang-ar");

      // Restore scroll position to prevent jump
      if (prevLang.current !== lang) {
        requestAnimationFrame(() => {
          window.scrollTo(scrollX, scrollY);
        });
        prevLang.current = lang;
      }
    };

    // Batch changes in next frame
    requestAnimationFrame(applyChanges);
  }, [i18n.language]);

  // Determine toast position based on direction
  const toastPosition = i18n.dir() === "rtl" ? "top-left" : "top-right";

  return (
    <Provider store={store}>
      <Toaster
        position={toastPosition}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1a1a",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 20px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <App />
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootWrapper />
  </React.StrictMode>
);