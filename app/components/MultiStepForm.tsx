"use client";

import { useState } from "react";
import Step1Email from "./steps/Step1Email";
import Step2TravelInfo from "./steps/Step2TravelInfo";
import Step3PassportDetails from "./steps/Step3PassportDetails";
import Step4PersonalDetails from "./steps/Step4PersonalDetails";
import Step5History from "./steps/Step5History";

export default function MultiStepForm() {
  const [step, setStep] = useState(2); // Arranca en el Paso 2 después de la verificación de email
  const [formData, setFormData] = useState({
    email: "",
    travelPurpose: "",
    arrivalDate: "",
    stayDuration: "",
    passportNumber: "",
    nationality: "",
    isBiometric: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    maritalStatus: "",
    fatherFirstName: "",
    motherFirstName: "",
    phoneNumber: "",
    homeAddress: "",
    occupationStatus: "",
    employerName: "",
    employerCountry: "",
    workPhone: "",
    workEmail: "",
    visitedIsrael: "",
    visaApplication: "",
    visaDetails: "",
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {step === 2 && <Step2TravelInfo formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <Step3PassportDetails formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
      {step === 4 && <Step4PersonalDetails formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
      {step === 5 && <Step5History formData={formData} setFormData={setFormData} prevStep={prevStep} />}
    </div>
  );
}
