"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

/** Componente interno para mostrar el indicador de pasos */
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
            {/* Círculo del paso */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold 
                  ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white" // Paso completado
                      : isActive
                      ? "border-blue-600 text-blue-600"         // Paso actual
                      : "border-gray-300 text-gray-500"         // Paso pendiente
                  }
                `}
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

            {/* Línea que une con el siguiente círculo (excepto en el último) */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 border-t-2 border-gray-300"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Step2TravelInfo() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Estado local para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    travelPurpose: "",
    arrivalDate: "",
    stayDuration: "",
  });

  // Al montar, recuperamos lo que haya en localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("appData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      // Fusionamos los campos existentes que nos interesan
      setFormData((prev) => ({
        ...prev,
        ...parsed,
      }));
    }
  }, []);

  // Validar si el formulario está completo
  const isFormComplete =
    formData.travelPurpose &&
    formData.arrivalDate &&
    formData.stayDuration;

  // Función para avanzar al siguiente paso
  const handleNextStep = () => {
    if (!isFormComplete) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // 1. Leer lo que ya haya en localStorage
    const storedData = localStorage.getItem("appData");
    let appData = storedData ? JSON.parse(storedData) : {};

    // 2. Fusionar con los datos actuales de este paso
    const updatedData = {
      ...appData,
      travelPurpose: formData.travelPurpose,
      arrivalDate: formData.arrivalDate,
      stayDuration: formData.stayDuration,
    };

    // 3. Guardar los datos en localStorage
    localStorage.setItem("appData", JSON.stringify(updatedData));

    // 4. Redirigir al siguiente paso
    router.push("/steps/step3passportdetails");
  };

  // Handler para actualizar el estado local
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-blue-900 text-white shadow-md w-full fixed top-0 left-0 z-10">
        <h1 className="text-2xl font-bold">{t("header")}</h1>
        <div>
          <button 
            onClick={() => i18n.changeLanguage("en")} 
            className={`mr-2 px-4 py-2 rounded border border-white ${
              i18n.language === "en" ? "bg-white text-blue-900" : "bg-transparent text-white"
            }`}
          >
            EN
          </button>
          <button 
            onClick={() => i18n.changeLanguage("es")} 
            className={`px-4 py-2 rounded border border-white ${
              i18n.language === "es" ? "bg-white text-blue-900" : "bg-transparent text-white"
            }`}
          >
            ES
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-32 border border-gray-200">
        {/* Indicador de pasos. Este es el paso 2 */}
        <StepIndicator currentStep={2} />

        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Paso 2: Información de Viaje
        </h2>
        <p className="text-gray-800 text-sm mb-4">
          Los campos marcados con un asterisco (*) son obligatorios
        </p>

        {/* Propósito del viaje */}
        <label className="block mb-2 font-semibold text-gray-900">
          ¿Cuál es el objetivo principal de su visita?*
        </label>
        <select
          name="travelPurpose"
          className="w-full p-2 border rounded mb-4 text-gray-900"
          value={formData.travelPurpose || ""}
          onChange={handleChange}
        >
          <option value="">Selecciona</option>
          <option value="Tourism">Visita (Turismo)</option>
          <option value="Business">Negocios</option>
          <option value="Study">Estudio a corto plazo</option>
          <option value="Work">Trabajo</option>
          <option value="Volunteering">Voluntariado</option>
          <option value="Culture">Cultura / Deporte hasta 30 días</option>
          <option value="Taglit">Taglit Birthright Israel / Masa Israel</option>
          <option value="Experts">Expertos extranjeros a corto plazo</option>
          <option value="Journalism">Periodismo</option>
        </select>

        {/* Fecha de llegada */}
        <label className="block mb-2 font-semibold text-gray-900">
          ¿Cuándo planeas llegar?*
        </label>
        <input
          type="date"
          name="arrivalDate"
          className="w-full p-2 border rounded mb-4 text-gray-900"
          value={formData.arrivalDate || ""}
          onChange={handleChange}
        />

        {/* Duración de la estadía */}
        <label className="block mb-2 font-semibold text-gray-900">
          ¿Cuánto tiempo piensas quedarte en Israel?*
        </label>
        <select
          name="stayDuration"
          className="w-full p-2 border rounded mb-4 text-gray-900"
          value={formData.stayDuration || ""}
          onChange={handleChange}
        >
          <option value="">Selecciona</option>
          <option value="7">Hasta 7 días</option>
          <option value="14">Hasta 14 días</option>
          <option value="30">Hasta 30 días</option>
          <option value="60">Hasta 60 días</option>
          <option value="90">Hasta 90 días</option>
          <option value="90+">Más de 90 días</option>
        </select>

        {/* Botón para avanzar */}
        <div className="flex justify-end mt-4">
          <button 
            onClick={handleNextStep} 
            className={`p-2 rounded ${
              isFormComplete ? "bg-blue-600 text-white" : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            disabled={!isFormComplete}
          >
            Siguiente: Información del Pasaporte
          </button>
        </div>
      </div>
    </div>
  );
}
