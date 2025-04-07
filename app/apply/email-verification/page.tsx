"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function EmailVerification() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      setError("Los correos electrónicos no coinciden.");
      return;
    }
    // Aquí podríamos enviar un email de verificación
    router.push("/apply"); // Redirige al paso 2 del formulario
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
      <Head>
        <title>{t("email_verification")}</title>
        <meta name="description" content="Email Verification Page" />
      </Head>
      <nav className="flex justify-between items-center p-4 bg-blue-900 text-white shadow-md">
        <h1 className="text-2xl font-bold">{t("header")}</h1>
        <div>
          <button onClick={() => changeLanguage("en")} className={`mr-2 px-4 py-2 rounded border border-white ${i18n.language === "en" ? "bg-white text-blue-900" : "bg-transparent text-white"}`}>
            EN
          </button>
          <button onClick={() => changeLanguage("es")} className={`px-4 py-2 rounded border border-white ${i18n.language === "es" ? "bg-white text-blue-900" : "bg-transparent text-white"}`}>
            ES
          </button>
        </div>
      </nav>
      <main className="p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Verificación de Correo</h2>
        <p className="text-gray-700 mb-4">Ingresa tu correo electrónico para comenzar la solicitud.</p>
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg w-80">
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 border rounded mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Confirmar correo electrónico"
            className="w-full p-2 border rounded mb-4"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
            Continuar
          </button>
        </form>
      </main>
    </div>
  );
}
