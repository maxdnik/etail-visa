"use client";

import "./globals.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => {
      console.log("✅ SDK de Mercado Pago cargado correctamente.");
    };
    script.onerror = () => {
      console.error("❌ Error al cargar el SDK de Mercado Pago.");
    };
    document.head.appendChild(script);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <html lang="es">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className="antialiased">{children}</body>
      </html>
    </I18nextProvider>
  );
}


