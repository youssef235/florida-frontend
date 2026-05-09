import { useTranslation } from "react-i18next";

const LangButton = () => {
  const { i18n } = useTranslation();

  return (
    <button
      onClick={() =>
        i18n.changeLanguage(
          i18n.language === "en" ? "ar" : "en"
        )
      }
    >
      Switch Language
    </button>
  );
};