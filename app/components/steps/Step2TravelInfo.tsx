"use client";

import { useTranslation } from "react-i18next";

export default function Step2TravelInfo({ formData, setFormData, nextStep, prevStep }) {
  const { t, i18n } = useTranslation();

  const isFormComplete = formData.travelPurpose && formData.arrivalDate && formData.stayDuration;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-blue-900 text-white shadow-md w-full fixed top-0 left-0 z-10">
        <h1 className="text-2xl font-bold">{t("header")}</h1>
        <div>
          <button onClick={() => i18n.changeLanguage("en")} className={`mr-2 px-4 py-2 rounded border border-white ${i18n.language === "en" ? "bg-white text-blue-900" : "bg-transparent text-white"}`}>
            EN
          </button>
          <button onClick={() => i18n.changeLanguage("es")} className={`px-4 py-2 rounded border border-white ${i18n.language === "es" ? "bg-white text-blue-900" : "bg-transparent text-white"}`}>
            ES
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-32 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Paso 2: Información de Viaje</h2>
        <p className="text-gray-800 text-sm mb-4">Los campos marcados con un asterisco (*) son obligatorios</p>

        {/* Propósito del viaje */}
        <label className="block mb-2 font-semibold text-gray-900">¿Cuál es el objetivo principal de su visita?*</label>
        <select
          className="w-full p-2 border rounded mb-4 text-gray-900"
          value={formData.travelPurpose}
          onChange={(e) => setFormData({ ...formData, travelPurpose: e.target.value })}
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
        <label className="block mb-2 font-semibold text-gray-900">¿Cuándo planeas llegar?*</label>
        <input
          type="date"
          className="w-full p-2 border rounded mb-4 text-gray-900"
          value={formData.arrivalDate}
          onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
        />

        {/* Duración de la estadía */}
        <label className="block mb-2 font-semibold text-gray-900">¿Cuánto tiempo piensas quedarte en Israel?*</label>
        <select
          className="w-full p-2 border rounded mb-4 text-gray-900"
          value={formData.stayDuration}
          onChange={(e) => setFormData({ ...formData, stayDuration: e.target.value })}
        >
          <option value="">Selecciona</option>
          <option value="7">Hasta 7 días</option>
          <option value="14">Hasta 14 días</option>
          <option value="30">Hasta 30 días</option>
          <option value="60">Hasta 60 días</option>
          <option value="90">Hasta 90 días</option>
          <option value="90+">Más de 90 días</option>
        </select>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-4">
          <button onClick={prevStep} className="bg-gray-400 text-white p-2 rounded">
            Atrás
          </button>
          <button 
            onClick={nextStep} 
            className={`p-2 rounded ${isFormComplete ? "bg-blue-600 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`}
            disabled={!isFormComplete}
          >
            Ingrese los detalles del pasaporte
          </button>
        </div>
      </div>
    </div>
  );
}

