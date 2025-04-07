"use client";

import { useEffect } from "react";

export default function OpenPayProvider() {  // ✅ Asegúrate de que tiene `export default`
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script1 = document.createElement("script");
      script1.src = "https://js.openpay.mx/openpay.v1.min.js";
      script1.async = true;
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.src = "https://js.openpay.mx/openpay-data.v1.min.js";
      script2.async = true;
      document.head.appendChild(script2);

      script2.onload = () => {
        if (window.OpenPay) {
          console.log("✅ OpenPay cargado correctamente.");
          window.OpenPay.setId(process.env.NEXT_PUBLIC_OPENPAY_MERCHANT_ID!);
          window.OpenPay.setApiKey(process.env.NEXT_PUBLIC_OPENPAY_PUBLIC_KEY!);
          window.OpenPay.setSandboxMode(process.env.NEXT_PUBLIC_OPENPAY_SANDBOX === "true");
        } else {
          console.error("❌ OpenPay no está disponible.");
        }
      };
    }
  }, []);

  return null;
}
