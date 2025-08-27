import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medical & Nutrition Disclaimer | WeightLoss.AI',
};

export default function MedicalDisclaimerPage() {
  return (
    <>
      <h1>Medical & Nutrition Disclaimer</h1>
      <p>
        Shape AI provides general informational content about nutrition and meal planning. 
        It is not medical advice and is not a substitute for professional diagnosis or 
        treatment.
      </p>
      
      <p>
        <strong>Always consult your GP or a qualified clinician</strong> before starting a diet, changing 
        calorie targets, or if you have conditions such as diabetes, kidney disease, 
        eating disorders, are pregnant or breastfeeding, or are taking medications that 
        interact with diet.
      </p>
      
      <p>
        <strong>GLP‑1 and other prescription treatments:</strong> we do not prescribe or sell medicines. 
        We do not promote prescription‑only medicines. Any references to GLP‑1 are 
        informational; consult a clinician for personalised guidance.
      </p>
      
      <p>
        <strong>Results vary.</strong> We do not guarantee any specific weight‑loss amount or time frame.
      </p>
      
      <p>
        <strong>In an emergency, call 999 or your local emergency number.</strong>
      </p>
    </>
  );
}