import { MercadoPagoConfig, Preference } from 'mercadopago';

const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            title: 'Visa ETA',
            quantity: 1,
            unit_price: 100,
            currency_id: 'ARS',
          },
        ],
        payer: {
          email: body.email,
        },
        back_urls: {
          success: 'http://localhost:3000/steps/step5history?status=approved',
          failure: 'http://localhost:3000/steps/step5history?status=failed',
          pending: 'http://localhost:3000/steps/step5history?status=pending',
        },
        auto_return: 'approved',
      },
    });

    return new Response(
      JSON.stringify({
        preferenceId: preference.id,
        init_point: preference.init_point,
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error('❌ Error al crear preferencia:', err);
    return new Response(JSON.stringify({ message: 'Error al crear preferencia' }), {
      status: 500,
    });
  }
}

