"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="flex justify-between p-4 bg-blue-500 text-white">
      <h1 className="text-lg font-bold">{t("header")}</h1>
      <div>
        <button
          onClick={() => changeLanguage("en")}
          className={`mr-2 px-4 py-2 rounded ${
            i18n.language === "en" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage("es")}
          className={`px-4 py-2 rounded ${
            i18n.language === "es" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
          }`}
        >
          ES
        </button>
      </div>
      <Link href="/admin" className="ml-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-blue-900">
  Admin
</Link>

    </nav>
  );
}

