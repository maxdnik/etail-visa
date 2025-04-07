export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h1 className="text-2xl font-bold text-green-700">¡Pago exitoso! 🎉</h1>
      <p className="text-gray-700">Gracias por tu compra. Recibirás un correo de confirmación.</p>
      <a href="/" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Volver al inicio</a>
    </div>
  );
}
