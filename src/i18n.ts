/*
 * Created by Asad on 21 Nov 2024
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your JSON translation files
import enTranslation from "./translations/en.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
