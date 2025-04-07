"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-center text-white"
      style={{ backgroundImage: "url('/hero-background.jpg')" }}>
      <div className="bg-black bg-opacity-50 p-8 rounded-lg">
        <h1 className="text-4xl font-bold">{t("welcome")}</h1>
        <p className="mt-4 text-lg">{t("description")}</p>
        <Link href="/apply">
          <button className="mt-6 bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg">
            {t("apply_now")}
          </button>
        </Link>
      </div>
    </section>
  );
}
