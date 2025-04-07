"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

// Componente interno para mostrar la barra de pasos
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
                      ? "bg-blue-600 border-blue-600 text-white" // Pasos previos (completados)
                      : isActive
                      ? "border-blue-600 text-blue-600"         // Paso actual
                      : "border-gray-300 text-gray-500"         // Pasos futuros (pendientes)
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

            {/* Línea de unión (si no es el último) */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 border-t-2 border-gray-300"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Côte d'Ivoire",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia (Czech Republic)",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Holy See",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (formerly Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine State",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

export default function Step4PersonalDetails() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    additionalNationality: "",
    maritalStatus: "",
    fatherFirstName: "",
    fatherLastName: "",
    motherFirstName: "",
    motherLastName: "",
    homeCountry: "",
    homeCity: "",
    mobilePhone: "",
    occupationStatus: "",
    organizationName: "",
    role: "",
    workCountryCode: "",
    workPhone: "",
    workEmail: "",
  });

  // Al montar, recuperamos localStorage y fusionamos
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

  const isEmployed =
    formData.occupationStatus === "Employed" ||
    formData.occupationStatus === "Self-employed";

  // Validación
  const isFormComplete =
    (formData.additionalNationality === "" ||
      formData.additionalNationality !== undefined) &&
    formData.maritalStatus &&
    formData.fatherFirstName &&
    formData.fatherLastName &&
    formData.motherFirstName &&
    formData.motherLastName &&
    formData.mobilePhone &&
    formData.homeCountry &&
    formData.homeCity &&
    formData.occupationStatus &&
    (!isEmployed ||
      (formData.organizationName?.trim() &&
       formData.role?.trim() &&
       formData.workCountryCode?.trim() &&
       formData.workPhone?.trim() &&
       formData.workEmail?.trim()));

  const handleNextStep = () => {
    if (!isFormComplete) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Guardar en localStorage
    const storedData = localStorage.getItem("appData");
    let appData = storedData ? JSON.parse(storedData) : {};

    const updatedData = {
      ...appData,
      additionalNationality: formData.additionalNationality,
      maritalStatus: formData.maritalStatus,
      fatherFirstName: formData.fatherFirstName,
      fatherLastName: formData.fatherLastName,
      motherFirstName: formData.motherFirstName,
      motherLastName: formData.motherLastName,
      homeCountry: formData.homeCountry,
      homeCity: formData.homeCity,
      mobilePhone: formData.mobilePhone,
      occupationStatus: formData.occupationStatus,
      organizationName: formData.organizationName,
      role: formData.role,
      workCountryCode: formData.workCountryCode,
      workPhone: formData.workPhone,
      workEmail: formData.workEmail,
    };

    localStorage.setItem("appData", JSON.stringify(updatedData));

    router.push("/steps/step5history");
  };

  const handlePrevStep = () => {
    router.back();
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
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
        {/* StepIndicator en paso 4 */}
        <StepIndicator currentStep={4} />

        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Paso 4: Datos Personales
        </h2>
        <p className="text-gray-800 text-sm mb-4">
          Los campos marcados con un asterisco (*) son obligatorios
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Nacionalidad adicional */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              ¿Tiene otras nacionalidades?
            </label>
            <select
              name="additionalNationality"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.additionalNationality || ""}
              onChange={handleChange}
            >
              <option value="">Selecciona</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Estado civil */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Estado civil*
            </label>
            <select
              name="maritalStatus"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.maritalStatus || ""}
              onChange={handleChange}
            >
              <option value="">Selecciona</option>
              <option value="Single">Soltero</option>
              <option value="Married">Casado</option>
              <option value="Divorced">Divorciado</option>
              <option value="Widower">Viudo</option>
            </select>
          </div>

          {/* Información del padre */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Nombre del padre*
            </label>
            <input
              type="text"
              name="fatherFirstName"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.fatherFirstName || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Apellido del padre*
            </label>
            <input
              type="text"
              name="fatherLastName"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.fatherLastName || ""}
              onChange={handleChange}
            />
          </div>

          {/* Información de la madre */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Nombre de la madre*
            </label>
            <input
              type="text"
              name="motherFirstName"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.motherFirstName || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Apellido de la madre*
            </label>
            <input
              type="text"
              name="motherLastName"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.motherLastName || ""}
              onChange={handleChange}
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              País de residencia*
            </label>
            <select
              name="homeCountry"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.homeCountry || ""}
              onChange={handleChange}
            >
              <option value="">Selecciona</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Ciudad*
            </label>
            <input
              type="text"
              name="homeCity"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.homeCity || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Teléfono*
            </label>
            <input
              type="text"
              name="mobilePhone"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.mobilePhone || ""}
              onChange={handleChange}
            />
          </div>

          {/* Ocupación */}
          <div className="col-span-2">
            <label className="block mb-2 font-semibold text-gray-900">
              Estado de ocupación*
            </label>
            <select
              name="occupationStatus"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.occupationStatus || ""}
              onChange={handleChange}
            >
              <option value="">Selecciona</option>
              <option value="Employed">Empleado</option>
              <option value="Unemployed">Desempleado</option>
              <option value="Student">Estudiante</option>
              <option value="Retired">Jubilado</option>
              <option value="Self-employed">Trabajador Autónomo</option>
            </select>
          </div>

          {/* Si está empleado o es autónomo */}
          {isEmployed && (
            <>
              <div>
                <label className="block mb-2 font-semibold text-gray-900">
                  Nombre de la organización*
                </label>
                <input
                  type="text"
                  name="organizationName"
                  className="w-full p-2 border rounded text-gray-900"
                  value={formData.organizationName || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-900">
                  Rol*
                </label>
                <input
                  type="text"
                  name="role"
                  className="w-full p-2 border rounded text-gray-900"
                  value={formData.role || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-900">
                  Código de país*
                </label>
                <input
                  type="text"
                  name="workCountryCode"
                  className="w-full p-2 border rounded text-gray-900"
                  value={formData.workCountryCode || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-900">
                  Teléfono del trabajo*
                </label>
                <input
                  type="text"
                  name="workPhone"
                  className="w-full p-2 border rounded text-gray-900"
                  value={formData.workPhone || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-900">
                  Email laboral*
                </label>
                <input
                  type="email"
                  name="workEmail"
                  className="w-full p-2 border rounded text-gray-900"
                  value={formData.workEmail || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-4">
          <button onClick={handlePrevStep} className="bg-gray-400 text-white p-2 rounded">
            Atrás
          </button>
          <button
            onClick={handleNextStep}
            className={`p-2 rounded ${
              isFormComplete
                ? "bg-blue-600 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            disabled={!isFormComplete}
          >
            Siguiente: Historial
          </button>
        </div>
      </div>
    </div>
  );
}

