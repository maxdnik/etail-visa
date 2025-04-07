import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongodb"; // Asegúrate de tener la conexión a MongoDB
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { db } = await connectToDatabase();
    const applicationData = req.body;

    // Guardar en MongoDB
    const result = await db.collection("applications").insertOne(applicationData);
    console.log("✅ Solicitud guardada en MongoDB:", result);

    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar email de confirmación
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: applicationData.email,
      subject: "Confirmación de Solicitud de Visa",
      text: `Hola ${applicationData.firstName}, tu solicitud de visa ha sido recibida exitosamente.`,
    });

    return res.status(201).json({ message: "Solicitud guardada y email enviado." });
  } catch (error) {
    console.error("❌ Error en la API:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
