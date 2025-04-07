import { MercadoPagoConfig, Payment } from "mercadopago";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function GET() {
  try {
    const payment = await new Payment(mercadopago).create({
      body: {
        transaction_amount: 10000,
        token: "faketoken", // 👈 este no funcionará, pero nos sirve para testear
        description: "Visa ETA test directo",
        installments: 1,
        payment_method_id: "visa",
        issuer_id: "1",
        binary_mode: true,
        payer: {
          email: "test@test.com",
          identification: {
            type: "DNI",
            number: "12345678",
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        status: payment.status,
        detail: payment.status_detail,
        id: payment.id,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Error controlado:", err.message);
    return new Response(
      JSON.stringify({
        error: err.message,
        cause: err.cause,
        stack: err.stack,
      }),
      { status: 500 }
    );
  }
}
