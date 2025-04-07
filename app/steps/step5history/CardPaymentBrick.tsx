"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {}

export default function CardPaymentBrick({}: Props) {
  const [rejectedMessage, setRejectedMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.MercadoPago) {
        const mp = new window.MercadoPago(
          "APP_USR-5e40f71c-c994-4fe2-abd7-dae85b680b33",
          { locale: "es-AR" }
        );

        mp.bricks().create("cardPayment", "paymentBrick_container", {
          initialization: {
            amount: 65,
            payer: {
              email: "maxidimnik@gmail.com",
            },
          },
          callbacks: {
            onReady: () => {
              console.log("💳 Brick listo");
            },
            onSubmit: async (cardFormData) => {
              try {
                const res = await fetch("/api/process-payment", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(cardFormData),
                });

                const result = await res.json();
                console.log("🧾 Resultado:", result);

                if (result.status === "approved") {
                  // 🔁 Lanza el envío de datos en paralelo (sin await)
                  fetch("/api/submit-visa", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: localStorage.getItem("appData") ?? "{}",
                  }).then((res) =>
                    console.log("✅ Visa submit enviada en background")
                  );

                  // ✅ Redirige al usuario sin esperar
                  router.push("/steps/step6success");
                } else if (result.status === "in_process") {
                  // opcional
                } else {
                  setRejectedMessage(
                    `❌ El pago fue rechazado: ${result.status_detail}`
                  );
                  setTimeout(() => location.reload(), 4000);
                }
              } catch (err) {
                console.error("❌ Error al procesar pago:", err);
                setRejectedMessage("❌ Hubo un error al procesar el pago.");
                setTimeout(() => location.reload(), 4000);
              }
            },
            onError: (err) => {
              console.error("💥 Error en el Brick:", err);
            },
          },
        });

        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {rejectedMessage && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded">
          {rejectedMessage}
        </div>
      )}
      <div id="paymentBrick_container" />
    </div>
  );
}
