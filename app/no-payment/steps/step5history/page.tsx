"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    "Email verification",
    "Travel information",
    "Passport details",
    "Personal details",
    "Review & Submit",
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
              <div className="flex-1 mx-2 border-t-2 border-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Step5HistoryNoPayment() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    visitedIsrael: "",
    yearOfVisit: "",
    appliedForVisa: "",
    visaApplicationDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("appData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setFormData((previous) => ({ ...previous, ...parsed }));
    }
  }, []);

  const isFormComplete = useMemo(() => {
    if (!formData.visitedIsrael || !formData.appliedForVisa) return false;
    if (formData.visitedIsrael === "Yes" && !formData.yearOfVisit.trim()) return false;
    if (
      formData.appliedForVisa === "Yes" &&
      !formData.visaApplicationDetails.trim()
    ) {
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = async () => {
    if (!isFormComplete || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const storedData = localStorage.getItem("appData");
      const appData = storedData ? JSON.parse(storedData) : {};
      const completeApplication = { ...appData, ...formData, paymentRequired: false };

      localStorage.setItem("appData", JSON.stringify(completeApplication));

      const response = await fetch("/api/submit-visa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeApplication),
      });

      if (!response.ok) {
        let message = "No se pudo enviar el formulario. Inténtalo nuevamente.";
        try {
          const result = await response.json();
          if (result?.message) message = result.message;
        } catch {}
        throw new Error(message);
      }

      router.push("/no-payment/steps/step6success");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo enviar el formulario. Inténtalo nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex justify-between items-center p-4 bg-blue-900 text-white shadow-md w-full fixed top-0 left-0 z-10">
        <h1 className="text-2xl font-bold">{t("header")}</h1>
        <div>
          <button
            onClick={() => i18n.changeLanguage("en")}
            className={`mr-2 px-4 py-2 rounded border border-white ${
              i18n.language === "en"
                ? "bg-white text-blue-900"
                : "bg-transparent text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage("es")}
            className={`px-4 py-2 rounded border border-white ${
              i18n.language === "es"
                ? "bg-white text-blue-900"
                : "bg-transparent text-white"
            }`}
          >
            ES
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-32 border border-gray-200">
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
            onChange={(event) =>
              setFormData({ ...formData, visitedIsrael: event.target.value })
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
              ¿En qué año visitó Israel?*
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.yearOfVisit}
              onChange={(event) =>
                setFormData({ ...formData, yearOfVisit: event.target.value })
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
            onChange={(event) =>
              setFormData({ ...formData, appliedForVisa: event.target.value })
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
              onChange={(event) =>
                setFormData({
                  ...formData,
                  visaApplicationDetails: event.target.value,
                })
              }
            />
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 text-red-700 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => router.push("/no-payment/steps/step4personaldetails")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Atrás
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormComplete || isSubmitting}
            className={`px-4 py-2 rounded text-white ${
              isFormComplete && !isSubmitting
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar formulario"}
          </button>
        </div>
      </div>
    </div>
  );
}
