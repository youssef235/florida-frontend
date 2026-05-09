import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store.ts";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

// استيراد إعدادات الترجمة i18n
import "./i18n"; 
import { useTranslation } from "react-i18next";

/**
 * مكون RootWrapper للتحكم في اللغات والخطوط بشكل لحظي
 */
const RootWrapper = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // تحديث اتجاه الصفحة (RTL/LTR) واللغة في الـ DOM
    const dir = i18n.dir();
    const lang = i18n.language;

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;

    // تغيير الخط العربي يتم تلقائياً الآن عبر الـ CSS بفضل تغيير الـ dir
  }, [i18n.language]);

  return (
    <Provider store={store}>
      <Toaster />
      <App />
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootWrapper />
  </React.StrictMode>
);