"use client";

import { useTranslation } from "react-i18next";

const countries = [
  "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", 
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", 
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
  "Fiji", "Finland", "France", 
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", 
  "Haiti", "Honduras", "Hungary", 
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", 
  "Jamaica", "Japan", "Jordan", 
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", 
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", 
  "Oman", 
  "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
  "Qatar", 
  "Romania", "Russia", "Rwanda", 
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", 
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", 
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", 
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
  "Yemen", 
  "Zambia", "Zimbabwe"
];

export default function Step3PassportDetails({ formData, setFormData, nextStep, prevStep }) {
  const { t, i18n } = useTranslation();

  const isFormComplete = formData.passportType && formData.passportNumber && formData.passportCountry && 
    formData.nationality && formData.isBiometric !== undefined && formData.lastName && formData.firstName && 
    formData.issueDate && formData.expiryDate && formData.birthDate && formData.birthPlace && formData.gender;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-blue-900 text-white shadow-md w-full fixed top-0 left-0 z-10">
        <h1 className="text-2xl font-bold">{t("header")}</h1>
        <div>
          <button onClick={() => i18n.changeLanguage("en")} 
            className={`mr-2 px-4 py-2 rounded border border-white ${i18n.language === "en" ? "bg-white text-blue-900" : "bg-transparent text-white"}`}>
            EN
          </button>
          <button onClick={() => i18n.changeLanguage("es")} 
            className={`px-4 py-2 rounded border border-white ${i18n.language === "es" ? "bg-white text-blue-900" : "bg-transparent text-white"}`}>
            ES
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-32 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Paso 3: Detalles del Pasaporte</h2>
        <p className="text-gray-800 text-sm mb-4">Los campos marcados con un asterisco (*) son obligatorios</p>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Tipo de documento y Número de pasaporte */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Tipo de documento de viaje*</label>
            <select className="w-full p-2 border rounded text-gray-900" 
              value={formData.passportType || ""} 
              onChange={(e) => setFormData({ ...formData, passportType: e.target.value })}>
              <option value="">Selecciona</option>
              <option value="Regular">Pasaporte regular (nacional)</option>
              <option value="Diplomatic">Pasaporte diplomático</option>
              <option value="Service">Pasaporte de servicio</option>
              <option value="Official">Pasaporte oficial</option>
              <option value="Laissez">Documento de viaje (Laissez passer)</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Número de pasaporte*</label>
            <input type="text" className="w-full p-2 border rounded text-gray-900" 
              value={formData.passportNumber || ""} 
              onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })} />
          </div>

          {/* Código de país y Nacionalidad */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Código de país del pasaporte*</label>
            <select className="w-full p-2 border rounded text-gray-900" 
              value={formData.passportCountry || ""} 
              onChange={(e) => setFormData({ ...formData, passportCountry: e.target.value })}>
              <option value="">Selecciona</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Nacionalidad*</label>
            <select className="w-full p-2 border rounded text-gray-900" 
              value={formData.nationality || ""} 
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}>
              <option value="">Selecciona</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">¿Su pasaporte es biométrico?*</label>
            <div className="flex gap-4 text-gray-700">
              <label className="flex items-center">
                <input type="radio" value="Yes" checked={formData.isBiometric === "Yes"} 
                  onChange={() => setFormData({ ...formData, isBiometric: "Yes" })} className="mr-2" />
                Sí
              </label>
              <label className="flex items-center">
                <input type="radio" value="No" checked={formData.isBiometric === "No"} 
                  onChange={() => setFormData({ ...formData, isBiometric: "No" })} className="mr-2" />
                No
              </label>
            </div>
          </div>
                    <div>
            <label className="block mb-2 font-semibold text-gray-900"></label>
            <div className="flex gap-4 text-gray-700">

            </div>
          </div>




          {/* Datos personales */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Apellido*</label>
            <input type="text" className="w-full p-2 border rounded text-gray-900" 
              value={formData.lastName || ""} 
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Nombre*</label>
            <input type="text" className="w-full p-2 border rounded text-gray-900" 
              value={formData.firstName || ""} 
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
          </div>

          {/* Fechas */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Fecha de emisión*</label>
            <input type="date" className="w-full p-2 border rounded text-gray-900" 
              value={formData.issueDate || ""} 
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Fecha de vencimiento*</label>
            <input type="date" className="w-full p-2 border rounded text-gray-900" 
              value={formData.expiryDate || ""} 
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Fecha de nacimiento*</label>
            <input type="date" className="w-full p-2 border rounded text-gray-900" 
              value={formData.birthDate || ""} 
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Lugar de nacimiento*</label>
            <select className="w-full p-2 border rounded text-gray-900" value={formData.birthPlace} onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}>
            <option value="">Selecciona</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>  ))}
            </select>

          </div>

          {/* Género y biométrico */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Género*</label>
            <select className="w-full p-2 border rounded text-gray-900" 
              value={formData.gender || ""} 
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
              <option value="">Selecciona</option>
              <option value="Male">Masculino</option>
              <option value="Female">Femenino</option>
              <option value="Other">Otro</option>
            </select>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-4">
          <button onClick={prevStep} className="bg-gray-400 text-white p-2 rounded">Atrás</button>
          <button onClick={nextStep} className={`p-2 rounded ${isFormComplete ? "bg-blue-600 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`} disabled={!isFormComplete}>Detalles Personales</button>
        </div>
      </div>
    </div>
  );
}



