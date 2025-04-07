// app/api/process-payment/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/lib/createPayment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      token,
      transaction_amount,
      payment_method_id,
      installments,
      payer,
    } = body;

    if (!token || !transaction_amount || !payment_method_id || !payer?.email) {
      return NextResponse.json(
        {
          error: true,
          message: "Faltan datos obligatorios: token, monto, método o email.",
        },
        { status: 400 }
      );
    }

    const paymentData = {
      transaction_amount: Number(transaction_amount),
      token,
      description: "Visa a Israel",
      installments: installments || 1,
      payment_method_id,
      payer: {
        email: payer.email,
        identification: {
          type: payer.identification?.type || "DNI",
          number: payer.identification?.number || "12345678",
        },
      },
    };

    const result = await createPayment(paymentData);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("💥 ERROR en route.ts:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Error desconocido en servidor",
      },
      { status: 500 }
    );
  }
}
