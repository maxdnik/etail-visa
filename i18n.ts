import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        title: "Visa Application Page",
        header: "Visa ETA",
        welcome: "Welcome to the ETA Visa Application",
        description: "Apply for your travel visa quickly and easily.",
        apply_now: "Apply Now",
      },
    },
    es: {
      translation: {
        title: "Página de solicitud de visa",
        header: "Visa ETA",
        welcome: "Bienvenido a la aplicación de visa ETA",
        description: "Solicita tu visa de viaje de manera rápida y sencilla.",
        apply_now: "Solicitar Ahora",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
