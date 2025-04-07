"use client";

import MultiStepForm from "@/app/components/MultiStepForm";

export default function ApplyPage() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
        Completa tu solicitud de visa
      </h2>
      <MultiStepForm />
    </div>
  );
}

