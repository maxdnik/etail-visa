"use client";

import { useTranslation } from "react-i18next";

export default function Step6Success() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-blue-900 text-white shadow-md w-full fixed top-0 left-0 z-10">
        <h1 className="text-2xl font-bold">{t("header")}</h1>
        <div>
          <button
            onClick={() => i18n.changeLanguage("en")}
            className={
              "mr-2 px-4 py-2 rounded border border-white " +
              (i18n.language === "en"
                ? "bg-white text-blue-900"
                : "bg-transparent text-white")
            }
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage("es")}
            className={
              "px-4 py-2 rounded border border-white " +
              (i18n.language === "es"
                ? "bg-white text-blue-900"
                : "bg-transparent text-white")
            }
          >
            ES
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <div className="flex items-center justify-center px-4 pt-32">
        <div className="max-w-xl p-6 bg-white rounded-xl shadow-md border border-green-300 text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-4">
            ✅ Datos enviados correctamente
          </h1>
          <p className="text-gray-800 text-lg">
            El pago fue procesado con éxito. Sus datos están siendo analizados y en breve
            recibirá una confirmación al email brindado.
          </p>
        </div>
      </div>
    </div>
  );
}
