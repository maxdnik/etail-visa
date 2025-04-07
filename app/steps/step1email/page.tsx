"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

/** Componente de step indicator (barra de pasos) */
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    "Verificación de Email",
    "Información de Viaje",
    "Detalles del Pasaporte",
    "Datos Personales",
    "Revisión y Pago",
  ];

  return (
    <div className="flex items-center justify-center w-full mb-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={label}>
            {/* Circulito del paso */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold 
                  ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white" // Paso completado
                      : isActive
                      ? "border-blue-600 text-blue-600"         // Paso actual
                      : "border-gray-300 text-gray-500"          // Paso pendiente
                  }
                `}
              >
                {stepNumber}
              </div>
              {/* Etiqueta del paso */}
              <div
                className={`text-xs mt-2 ${
                  isActive || isCompleted ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {label}
              </div>
            </div>

            {/* Línea de unión (excepto en el último paso) */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 border-t-2 border-gray-300"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function Step1Email() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Estados locales para el email y la confirmación
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  // Estado para definir si la solicitud es para "Para mí" o "Para otra persona"
  const [applicantType, setApplicantType] = useState("Myself");
  // Estado para los datos personales (cuando es "Para otra persona")
  const [personalDetails, setPersonalDetails] = useState({
    familyName: "",
    firstName: "",
    idNumber: "",
    countryOfIssue: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");

  // Al cargar, se leen los datos guardados en localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("appData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.email) {
        setEmail(parsed.email);
        setConfirmEmail(parsed.email);
      }
      if (parsed.applicantType) {
        setApplicantType(parsed.applicantType);
      }
      if (parsed.applicantDetails) {
        setPersonalDetails(parsed.applicantDetails);
      }
    }
  }, []);

  // Validar email y, si es "Para otra persona", también los datos personales
  const isEmailValid =
    email.trim().length > 0 &&
    confirmEmail.trim().length > 0 &&
    email === confirmEmail;

  const isPersonalDetailsValid =
    applicantType === "Myself" ||
    (
      personalDetails.familyName.trim() &&
      personalDetails.firstName.trim() &&
      personalDetails.idNumber.trim() &&
      personalDetails.countryOfIssue.trim() &&
      personalDetails.phoneNumber.trim()
    );

  const isFormComplete = isEmailValid && isPersonalDetailsValid;

  const handleNextStep = () => {
    if (!isFormComplete) {
      setError(
        applicantType === "SomeoneElse"
          ? "Por favor, complete el email y todos sus datos personales."
          : "Los correos electrónicos deben coincidir y estar completos."
      );
      return;
    }

    // Leer los datos existentes en localStorage
    const storedData = localStorage.getItem("appData");
    let appData = storedData ? JSON.parse(storedData) : {};

    // Fusionar datos actuales
    const updatedData = {
      ...appData,
      email,
      applicantType,
      ...(applicantType === "SomeoneElse" && { applicantDetails: personalDetails }),
    };

    // Guardar en localStorage
    localStorage.setItem("appData", JSON.stringify(updatedData));

    // Navegar al siguiente paso
    router.push("/steps/step2travelinfo");
  };

  // Manejador para actualizar los datos personales
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalDetails({
      ...personalDetails,
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
        {/* Indicador de pasos */}
        <StepIndicator currentStep={1} />

        <h2 className="text-xl font-bold mb-4 text-gray-900">Paso 1: Ingresar Email</h2>
        <p className="text-gray-800 text-sm mb-4">
          Los campos marcados con un asterisco (*) son obligatorios
        </p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Selección del tipo de solicitante */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-900">
            ¿La solicitud es para usted o para otra persona?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="applicantType"
                value="Myself"
                checked={applicantType === "Myself"}
                onChange={(e) => setApplicantType(e.target.value)}
                className="mr-2"
              />
              Para mí
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="applicantType"
                value="SomeoneElse"
                checked={applicantType === "SomeoneElse"}
                onChange={(e) => setApplicantType(e.target.value)}
                className="mr-2"
              />
              Para otra persona
            </label>
          </div>
        </div>

        {/* Si se selecciona "Para otra persona", se muestran los campos adicionales */}
        {applicantType === "SomeoneElse" && (
          <div className="mb-4 p-4 border rounded">
            <h3 className="text-lg font-bold mb-2">Tus datos</h3>
            <p className="text-gray-700 text-sm mb-4">
              Por favor, ingresa tu propia información en esta sección y tu propio correo electrónico en la siguiente pantalla.
              El resto del formulario se referirá a la persona para la que estás solicitando.
            </p>

            {/* Apellido */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-900">
                Apellido*
              </label>
              <input
                type="text"
                name="familyName"
                placeholder="Ingrese aquí"
                className="w-full p-2 border rounded"
                value={personalDetails.familyName}
                onChange={handlePersonalChange}
              />
            </div>

            {/* Nombre */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-900">
                Nombre*
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Ingrese aquí"
                className="w-full p-2 border rounded"
                value={personalDetails.firstName}
                onChange={handlePersonalChange}
              />
            </div>

            {/* Número de pasaporte o identificación */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-900">
                Número de pasaporte o identificación*
              </label>
              <input
                type="text"
                name="idNumber"
                placeholder="Ingrese aquí"
                className="w-full p-2 border rounded"
                value={personalDetails.idNumber}
                onChange={handlePersonalChange}
              />
            </div>

            {/* País de expedición */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-900">
                País de expedición*
              </label>
              <input
                type="text"
                name="countryOfIssue"
                placeholder="Ingrese aquí"
                className="w-full p-2 border rounded"
                value={personalDetails.countryOfIssue}
                onChange={handlePersonalChange}
              />
            </div>

            {/* Número de teléfono */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-900">
                Número de teléfono
              </label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Ingrese número de teléfono: 1 212 1234567"
                className="w-full p-2 border rounded"
                value={personalDetails.phoneNumber}
                onChange={handlePersonalChange}
              />
            </div>
          </div>
        )}

        {/* Campo de Email */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-900">
            Correo electrónico*
          </label>
          <input
            type="email"
            className="w-full p-2 border rounded text-gray-900"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Confirmar Email */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-900">
            Confirmar correo electrónico*
          </label>
          <input
            type="email"
            className="w-full p-2 border rounded text-gray-900"
            placeholder="Confirma tu email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
          />
        </div>

        {/* Botón para continuar */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleNextStep}
            className={`p-2 rounded ${
              isFormComplete
                ? "bg-blue-600 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            disabled={!isFormComplete}
          >
            Siguiente: Información de Viaje
          </button>
        </div>
      </div>
    </div>
  );
}
