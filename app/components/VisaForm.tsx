"use client";

import { useState } from "react";

export default function VisaForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    passportNumber: "",
    nationality: "",
    birthDate: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
  };

  return (
    <section className="p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Solicitud de Visa ETA</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <input
            type="text"
            name="passportNumber"
            placeholder="Número de Pasaporte"
            value={formData.passportNumber}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <input
            type="date"
            name="birthDate"
            placeholder="Fecha de Nacimiento"
            value={formData.birthDate}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <select
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md w-full"
          >
            <option value="">Selecciona tu nacionalidad</option>
            <option value="Argentina">Argentina</option>
            <option value="Chile">Chile</option>
            <option value="Uruguay">Uruguay</option>
            <option value="EEUU">Estados Unidos</option>
          </select>
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 w-full md:w-auto"
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

