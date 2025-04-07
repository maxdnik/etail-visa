"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [visaRequests, setVisaRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function fetchVisaRequests() {
      try {
        const response = await fetch("http://localhost:5000/admin/visa-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("No autorizado");

        const data = await response.json();
        setVisaRequests(data);
        setLoading(false);
      } catch (error) {
        router.push("/admin/login");
      }
    }

    fetchVisaRequests();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Solicitudes de Visa</h2>

      {loading ? (
        <p className="text-center text-gray-700">Cargando...</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Apellido</th>
              <th className="p-2">Pasaporte</th>
              <th className="p-2">Fecha de Nacimiento</th>
              <th className="p-2">Email</th>
              <th className="p-2">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {visaRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No hay solicitudes registradas.
                </td>
              </tr>
            ) : (
              visaRequests.map((request) => (
                <tr key={request._id} className="border-t">
                  <td className="p-2">{request.firstName}</td>
                  <td className="p-2">{request.lastName}</td>
                  <td className="p-2">{request.passportNumber}</td>
                  <td className="p-2">{new Date(request.birthDate).toLocaleDateString()}</td>
                  <td className="p-2">{request.email}</td>
                  <td className="p-2">{request.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

