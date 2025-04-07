"use client";

import React, { useState, useEffect } from "react"; // Asegúrate de importar useEffect
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export default function Step1Email() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");

  // useEffect bien estructurado
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
      setConfirmEmail(savedEmail);
    }
  }, []); // No debe haber caracteres extraños aquí

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      setError("Los correos electrónicos no coinciden.");
      return;
    }
    localStorage.setItem("email", email);
    router.push("/steps/travel-info"); // Redirige al siguiente paso
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
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
    </div>
  );
}

  );
}
