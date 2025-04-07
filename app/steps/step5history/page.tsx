"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import CardPaymentBrick from "./CardPaymentBrick";

// 🔷 Componente de barra de pasos (mismo de step4)
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    "Email verification",
    "Travel information",
    "Passport details",
    "Personal details",
    "Review & Pay",
  ];

  return (
    <div className="flex items-center justify-center w-full mb-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div className="flex items-center" key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold ${
                  isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {stepNumber}
              </div>
              <div
                className={`text-xs mt-2 ${
                  isActive || isCompleted ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {label}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 border-t-2 border-gray-300"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Step5History() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    visitedIsrael: "",
    yearOfVisit: "",
    appliedForVisa: "",
    visaApplicationDetails: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("appData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setFormData((prev) => ({
        ...prev,
        ...parsed,
      }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
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

      {/* CONTENIDO */}
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-32 border border-gray-200">
        {/* Indicador de pasos */}
        <StepIndicator currentStep={5} />

        <h2 className="text-xl font-bold mb-4 text-gray-900">Paso 5: Historial</h2>
        <p className="text-gray-800 text-sm mb-4">
          Los campos marcados con un asterisco (*) son obligatorios
        </p>

        <div>
          <label className="block mb-2 font-semibold text-gray-900">
            ¿Ha visitado Israel en el pasado?*
          </label>
          <select
            className="w-full p-2 border rounded text-gray-900"
            value={formData.visitedIsrael}
            onChange={(e) =>
              setFormData({ ...formData, visitedIsrael: e.target.value })
            }
          >
            <option value="">Selecciona</option>
            <option value="No">No</option>
            <option value="Yes">Sí</option>
          </select>
        </div>

        {formData.visitedIsrael === "Yes" && (
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              ¿En qué año visitó Israel?
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.yearOfVisit}
              onChange={(e) =>
                setFormData({ ...formData, yearOfVisit: e.target.value })
              }
            />
          </div>
        )}

        <div>
          <label className="block mb-2 font-semibold text-gray-900">
            ¿Ha solicitado una visa o permiso antes?*
          </label>
          <select
            className="w-full p-2 border rounded text-gray-900"
            value={formData.appliedForVisa}
            onChange={(e) =>
              setFormData({ ...formData, appliedForVisa: e.target.value })
            }
          >
            <option value="">Selecciona</option>
            <option value="No">No</option>
            <option value="Yes">Sí</option>
          </select>
        </div>

        {formData.appliedForVisa === "Yes" && (
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              ¿Qué solicitó? Por favor cuéntenos sobre su solicitud*
            </label>
            <textarea
              className="w-full p-2 border rounded text-gray-900"
              value={formData.visaApplicationDetails}
              onChange={(e) =>
                setFormData({ ...formData, visaApplicationDetails: e.target.value })
              }
            />
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Pagar con tarjeta</h3>
          <CardPaymentBrick />
        </div>

        {/* Botón ATRÁS */}
        <div className="flex justify-start mt-6">
          <button
            onClick={() => router.push("/steps/step4personaldetails")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Atrás
          </button>
        </div>
      </div>
    </div>
  );
}

