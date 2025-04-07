import { NextResponse } from "next/server";
import mercadopago from "mercadopago";

// Obtén la variable de entorno
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error("MERCADOPAGO_ACCESS_TOKEN no está definido en las variables de entorno.");
}

// Configura Mercado Pago usando el método 'configure'
mercadopago.configure({
  access_token: accessToken,
});

export async function POST(request: Request) {
  const preference = {
    items: [
      {
        title: "Mi Producto",
        unit_price: 100,
        quantity: 1,
      },
    ],
    back_urls: {
      success: "https://tu-dominio.com/success",
      failure: "https://tu-dominio.com/failure",
      pending: "https://tu-dominio.com/pending",
    },
    auto_return: "approved",
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    return NextResponse.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return NextResponse.error();
  }
}
