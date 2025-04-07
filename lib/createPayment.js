// lib/createPayment.js

const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token:
    process.env.MP_ACCESS_TOKEN ||
    "TEST-40826575685867-022118-6f293a697a6fb4b9dd72baf239352b5a-302817739",
});

async function createPayment(paymentData) {
  try {
    const payment = await mercadopago.payment.create(paymentData);
    return payment.body;
  } catch (error) {
    console.error("💥 Error en createPayment.js:", error);
    throw error;
  }
}

module.exports = { createPayment };
