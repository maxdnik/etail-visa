"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


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

// Componente interno de StepIndicator
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

            {/* Línea para unir con el siguiente step (excepto en el último) */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 border-t-2 border-gray-300"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Step3PassportDetails() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Estado local
  const [formData, setFormData] = useState({
    passportType: "",
    passportNumber: "",
    passportCountry: "",
    nationality: "",
    isBiometric: "",
    lastName: "",
    firstName: "",
    issueDate: "",
    expiryDate: "",
    birthDate: "",
    birthPlace: "",
    gender: "",
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

  // Verificar si el formulario está completo
  const isFormComplete =
    formData.passportType &&
    formData.passportNumber &&
    formData.passportCountry &&
    formData.nationality &&
    formData.isBiometric &&
    formData.lastName &&
    formData.firstName &&
    formData.issueDate &&
    formData.expiryDate &&
    formData.birthDate &&
    formData.birthPlace &&
    formData.gender;

  // Función para ir al siguiente paso
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
      passportType: formData.passportType,
      passportNumber: formData.passportNumber,
      passportCountry: formData.passportCountry,
      nationality: formData.nationality,
      isBiometric: formData.isBiometric,
      lastName: formData.lastName,
      firstName: formData.firstName,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      birthDate: formData.birthDate,
      birthPlace: formData.birthPlace,
      gender: formData.gender,
    };

    localStorage.setItem("appData", JSON.stringify(updatedData));

    // Redirigir
    router.push("/steps/step4personaldetails");
  };

  // Manejadores de cambio
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-32 border border-gray-200">
        {/* Integración del StepIndicator. Este es el paso 3 */}
        <StepIndicator currentStep={3} />

        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Paso 3: Detalles del Pasaporte
        </h2>
        <p className="text-gray-800 text-sm mb-4">
          Los campos marcados con un asterisco (*) son obligatorios
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Tipo de Pasaporte */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Tipo de documento de viaje*
            </label>
            <select
              name="passportType"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.passportType}
              onChange={handleChange}
            >
              <option value="">Selecciona</option>
              <option value="Regular">Pasaporte Regular</option>
              <option value="Diplomatic">Pasaporte Diplomático</option>
              <option value="Service">Pasaporte de Servicio</option>
              <option value="Official">Pasaporte Oficial</option>
            </select>
          </div>

          {/* Número de Pasaporte */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Número de pasaporte*
            </label>
            <input
              type="text"
              name="passportNumber"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.passportNumber}
              onChange={handleChange}
            />
          </div>

          {/* País del Pasaporte */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              País del pasaporte*
            </label>
            <input
              type="text"
              name="passportCountry"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.passportCountry}
              onChange={handleChange}
            />
          </div>

          {/* Nacionalidad */} 
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Nacionalidad*
            </label>
            <select
              name="birthPlace"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.nationality}
              onChange={handleChange}
            >
              <option value="">Seleccione un país</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* ¿Es Biométrico? */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              ¿Su pasaporte es biométrico?*
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isBiometric"
                  value="Yes"
                  checked={formData.isBiometric === "Yes"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Sí
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isBiometric"
                  value="No"
                  checked={formData.isBiometric === "No"}
                  onChange={handleChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {/* Fecha de emisión */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Fecha de emisión *
            </label>
            <input
              type="date"
              name="issueDate"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.issueDate}
              onChange={handleChange}
            />
          </div>

          {/* Fecha de Vencimiento */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Fecha de vencimiento*
            </label>
            <input
              type="date"
              name="expiryDate"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Fecha de nacimiento*
            </label>
            <input
              type="date"
              name="birthDate"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Nombre*
            </label>
            <input
              type="text"
              name="firstName"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Apellido*
            </label>
            <input
              type="text"
              name="lastName"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          {/* Lugar de Nacimiento */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Lugar de nacimiento*
            </label>
            <select
              name="birthPlace"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.birthPlace}
              onChange={handleChange}
            >
              <option value="">Seleccione un país</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Género */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">
              Género*
            </label>
            <select
              name="gender"
              className="w-full p-2 border rounded text-gray-900"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Selecciona</option>
              <option value="Male">Masculino</option>
              <option value="Female">Femenino</option>
              <option value="Other">Otro</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-4">
          <button onClick={() => router.back()} className="bg-gray-400 text-white p-2 rounded">
            Atrás
          </button>
          <button
            onClick={handleNextStep}
            className={`p-2 rounded ${
              isFormComplete ? "bg-blue-600 text-white" : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            disabled={!isFormComplete}
          >
            Siguiente: Detalles Personales
          </button>
        </div>
      </div>
    </div>
  );
}


           
