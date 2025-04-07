"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export default function Home() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleApplyClick = () => {
    console.log("Redirigiendo...");
    router.push("/steps/step1email");
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50">
      <nav className="flex justify-between items-center p-4 bg-blue-900 text-white shadow-md">
        <h1 className="text-2xl font-bold">{t("header")}</h1>
        <div>
          <button
            onClick={() => changeLanguage("en")}
            className={`mr-2 px-4 py-2 rounded border border-white ${
              i18n.language === "en" ? "bg-white text-blue-900" : "bg-transparent text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage("es")}
            className={`px-4 py-2 rounded border border-white ${
              i18n.language === "es" ? "bg-white text-blue-900" : "bg-transparent text-white"
            }`}
          >
            ES
          </button>
        </div>
      </nav>
      <main className="p-8">
        <section className="relative h-[500px] flex items-center justify-center text-center text-white bg-gray-100">
          <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl">
            <h1 className="text-5xl font-extrabold text-blue-900">{t("welcome")}</h1>
            <p className="mt-4 text-xl text-gray-700">{t("description")}</p>
            <button 
              onClick={handleApplyClick} 
              className="mt-6 bg-blue-900 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
            >
              {t("apply_now")}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

