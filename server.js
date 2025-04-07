// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));

// Definir el esquema de Mongoose para las solicitudes de visa
const visaApplicationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  travelPurpose: { type: String, required: true },
  arrivalDate: { type: String, required: true },
  stayDuration: { type: String, required: true },
  passportType: { type: String, required: true },
  passportNumber: { type: String, required: true },
  passportCountry: { type: String, required: true },
  nationality: { type: String, required: true },
  isBiometric: { type: String, required: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  issueDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  birthDate: { type: String, required: true },
  birthPlace: { type: String, required: true },
  gender: { type: String, required: true },
  additionalNationality: { type: String },
  maritalStatus: { type: String, required: true },
  fatherFirstName: { type: String, required: true },
  fatherLastName: { type: String, required: true },
  motherFirstName: { type: String, required: true },
  motherLastName: { type: String, required: true },
  mobilePhone: { type: String, required: true },
  homeCountry: { type: String, required: true },
  homeCity: { type: String, required: true },
  occupationStatus: { type: String, required: true },
  visitedIsrael: { type: String },
  yearOfVisit: { type: String },
  appliedForVisa: { type: String },
  visaApplicationDetails: { type: String },
}, { timestamps: true });

// Crear el modelo de Mongoose basado en el esquema
const VisaApplication = mongoose.model('VisaApplication', visaApplicationSchema);

// Ruta para enviar una solicitud de visa
app.post('/api/submit-visa', async (req, res) => {
  try {
    const newVisaApplication = new VisaApplication(req.body);
    await newVisaApplication.save();

    console.log("✅ Solicitud guardada en MongoDB:", newVisaApplication);

    res.status(201).json({ message: 'Solicitud enviada con éxito.' });
  } catch (error) {
    console.error('❌ Error al guardar la solicitud:', error);
    res.status(500).json({ message: 'Error al guardar la solicitud.' });
  }
});

// Iniciar el servidor Express en el puerto 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
});

// Exportar el modelo para utilizarlo en otros módulos
module.exports = { VisaApplication };


