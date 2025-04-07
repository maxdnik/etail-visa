import { MercadoPagoConfig, Payment } from "mercadopago";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ message: "Falta el ID" }), { status: 400 });
  }

  try {
    const payment = await new Payment(mercadopago).get({ id });

    return new Response(
      JSON.stringify({
        status: payment.status,
        status_detail: payment.status_detail,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error al consultar pago:", err);
    return new Response(JSON.stringify({ message: "Error al verificar estado" }), {
      status: 500,
    });
  }
}
