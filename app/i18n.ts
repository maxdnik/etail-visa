"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      title: "Welcome to the Visa Application",
      header: "Visa Application",
      welcome: "Apply for your visa in just a few steps",
      description: "Complete the form and submit your application.",
      apply_now: "Apply Now",
    },
  },
  es: {
    translation: {
      title: "Bienvenido a la solicitud de visa",
      header: "Solicitud de Visa",
      welcome: "Solicita tu visa en solo unos pasos",
      description: "Completa el formulario y envía tu solicitud.",
      apply_now: "Solicitar Ahora",
    },
  },
};

i18n
  .use(initReactI18next) // Conecta i18next con react-i18next
  .init({
    resources,
    lng: "es", // Idioma predeterminado
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;



