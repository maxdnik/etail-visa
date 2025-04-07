"use client";
import { useTranslation } from "react-i18next";

export default function Step5History({ formData, setFormData, prevStep }) {
  const { t, i18n } = useTranslation();

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/submit-visa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Solicitud enviada con éxito");
      } else {
        alert("Error al enviar la solicitud: " + data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un problema al enviar la solicitud.");
    }
  };

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

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-32 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Paso 5: Historial</h2>
        <p className="text-gray-800 text-sm mb-4">Los campos marcados con un asterisco (*) son obligatorios</p>

        {/* Pregunta sobre visitas previas */}
        <div>
          <label className="block mb-2 font-semibold text-gray-900">¿Ha visitado Israel en el pasado?*</label>
          <select className="w-full p-2 border rounded text-gray-900" value={formData.visitedIsrael} onChange={(e) => setFormData({ ...formData, visitedIsrael: e.target.value })}>
            <option value="">Selecciona</option>
            <option value="No">No</option>
            <option value="Yes">Sí</option>
          </select>
        </div>

        {/* Año de la visita (solo si selecciona Sí) */}
        {formData.visitedIsrael === "Yes" && (
          <div>
            <label className="block mb-2 font-semibold text-gray-900">¿En qué año visitó Israel?</label>
            <input type="text" className="w-full p-2 border rounded text-gray-900" value={formData.yearOfVisit} onChange={(e) => setFormData({ ...formData, yearOfVisit: e.target.value })} />
          </div>
        )}

        {/* Pregunta sobre aplicaciones previas */}
        <div>
          <label className="block mb-2 font-semibold text-gray-900">¿Ha solicitado una visa o permiso antes?*</label>
          <select className="w-full p-2 border rounded text-gray-900" value={formData.appliedForVisa} onChange={(e) => setFormData({ ...formData, appliedForVisa: e.target.value })}>
            <option value="">Selecciona</option>
            <option value="No">No</option>
            <option value="Yes">Sí</option>
          </select>
        </div>

        {/* Detalles de la solicitud previa (solo si selecciona Sí) */}
        {formData.appliedForVisa === "Yes" && (
          <div>
            <label className="block mb-2 font-semibold text-gray-900">¿Qué solicitó? Por favor cuéntenos sobre su solicitud*</label>
            <textarea className="w-full p-2 border rounded text-gray-900" value={formData.visaApplicationDetails} onChange={(e) => setFormData({ ...formData, visaApplicationDetails: e.target.value })} />
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-between mt-4">
          <button onClick={prevStep} className="bg-gray-400 text-white p-2 rounded">Atrás</button>
          <button onClick={handleSubmit} className="bg-green-600 text-white p-2 rounded">Enviar</button>
        </div>
      </div>
    </div>
  );
}
