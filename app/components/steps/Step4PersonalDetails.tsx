"use client";

import { useTranslation } from "react-i18next";

const countries = [
  "NO", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", 
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

export default function Step4PersonalDetails({ formData, setFormData, nextStep, prevStep }) {
  const { t, i18n } = useTranslation();

  const isEmployed = formData.occupationStatus === "Employed" || formData.occupationStatus === "Self-employed";

const isFormComplete = 
    (formData.additionalNationality === "" || formData.additionalNationality !== undefined) &&
    formData.maritalStatus &&
    formData.fatherFirstName && formData.fatherLastName &&
    formData.motherFirstName && formData.motherLastName &&
    formData.mobilePhone && formData.homeCountry &&
    formData.homeCity && formData.occupationStatus &&
    (!isEmployed || (
      formData.organizationName?.trim() &&
      formData.role?.trim() &&
      formData.workCountryCode?.trim() &&
      formData.workPhone?.trim() &&
      formData.workEmail?.trim()
    ));

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
        <h2 className="text-xl font-bold mb-4 text-gray-900">Paso 4: Datos Personales</h2>
        <p className="text-gray-800 text-sm mb-4">Los campos marcados con un asterisco (*) son obligatorios</p>

        <div className="grid grid-cols-2 gap-4">
          {/* Nacionalidad adicional */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">¿Tiene otras nacionalidades?</label>
            <select className="w-full p-2 border rounded text-gray-900" value={formData.additionalNationality} onChange={(e) => setFormData({ ...formData, additionalNationality: e.target.value })}>
            <option value="">Selecciona</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>  ))}
            </select>
          </div>

          {/* Estado civil */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Estado civil*</label>
            <select className="w-full p-2 border rounded text-gray-900" value={formData.maritalStatus} onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}>
              <option value="">Selecciona</option>
              <option value="Single">Soltero</option>
              <option value="Married">Casado</option>
              <option value="Divorced">Divorciado</option>
              <option value="Widower">Viudo</option>
            </select>
          </div>

          {/* Información de los padres */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Nombre del padre*</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded text-gray-900" 
              value={formData.fatherFirstName || ""} 
              onChange={(e) => setFormData({ ...formData, fatherFirstName: e.target.value })} 
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Apellido del padre*</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded text-gray-900" 
              value={formData.fatherLastName || ""} 
              onChange={(e) => setFormData({ ...formData, fatherLastName: e.target.value })} 
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Nombre de la madre*</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded text-gray-900" 
              value={formData.motherFirstName || ""} 
              onChange={(e) => setFormData({ ...formData, motherFirstName: e.target.value })} 
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Apellido de la madre*</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded text-gray-900" 
              value={formData.motherLastName || ""} 
              onChange={(e) => setFormData({ ...formData, motherLastName: e.target.value })} 
            />
          </div>
          {/* Dirección */}
          <div>
            <label className="block mb-2 font-semibold text-gray-900">País de residencia*</label>
            <select className="w-full p-2 border rounded text-gray-900" value={formData.homeCountry} onChange={(e) => setFormData({ ...formData, homeCountry: e.target.value })}>
              <option value="">Selecciona</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Ciudad*</label>
            <input type="text" className="w-full p-2 border rounded text-gray-900" value={formData.homeCity || ""}  // Asegura que siempre haya un valor
            onChange={(e) => setFormData({ ...formData, homeCity: e.target.value })} />

          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900">Telefono*</label>
            <input type="text" className="w-full p-2 border rounded text-gray-900" value={formData.mobilePhone || ""}  // Asegura que siempre haya un valor
            onChange={(e) => setFormData({ ...formData, mobilePhone: e.target.value })} />

          </div>

        

          {/* Ocupación */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold text-gray-900">Estado de ocupación*</label>
              <select className="w-full p-2 border rounded text-gray-900" value={formData.occupationStatus} onChange={(e) => setFormData({ ...formData, occupationStatus: e.target.value })}>
                <option value="">Selecciona</option>
                <option value="Employed">Empleado</option>
                <option value="Unemployed">Desempleado</option>
                <option value="Student">Estudiante</option>
                <option value="Retired">Jubilado</option>
                <option value="Self-employed">Trabajador Autónomo</option>
              </select>
            </div>

  {/* Si está empleado o es autónomo, mostrar estos campos */}
  {isEmployed && (
    <>
      <div>
        <label className="block mb-2 font-semibold text-gray-900">Nombre de la organización*</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded text-gray-900" 
          value={formData.organizationName} 
          onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} 
          required
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-900">Rol*</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded text-gray-900" 
          value={formData.role} 
          onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
          required
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-900">Código de país*</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded text-gray-900" 
          value={formData.workCountryCode} 
          onChange={(e) => setFormData({ ...formData, workCountryCode: e.target.value })} 
          required
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-900">Teléfono del trabajo*</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded text-gray-900" 
          value={formData.workPhone} 
          onChange={(e) => setFormData({ ...formData, workPhone: e.target.value })} 
          required
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-900">Email laboral*</label>
        <input 
          type="email" 
          className="w-full p-2 border rounded text-gray-900" 
          value={formData.workEmail} 
          onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })} 
          required
        />
      </div>
    </>
  )}

        </div>

        <div className="flex justify-between mt-4">
          <button onClick={prevStep} className="bg-gray-400 text-white p-2 rounded">Atrás</button>
          <button onClick={nextStep} className={`p-2 rounded ${isFormComplete ? "bg-blue-600 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`} disabled={!isFormComplete}>Detalles Personales</button>

        </div>
      </div>
    </div>
  );
}


