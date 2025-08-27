import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Use & Safety Policy | WeightLoss.AI',
};

export default function AiUseSafetyPolicyPage() {
  return (
    <>
      <h1>AI Use & Safety Policy</h1>
      <p><em>Last updated: August 26, 2025</em></p>

      <h2>Our approach</h2>
      <ul>
        <li><strong>Transparency:</strong> we disclose when AI is used to generate plans, meal suggestions and PDFs.</li>
        <li><strong>Human control:</strong> you decide what to generate; you can edit or ignore suggestions.</li>
        <li><strong>Safety:</strong> we filter prompts/outputs to reduce harmful or medically unsafe advice, but cannot guarantee prevention of all issues.</li>
        <li><strong>Privacy:</strong> prompts may be processed by vetted AI vendors under data protection agreements. Special category data (e.g., nutrition/health inputs) is processed only with your explicit consent.</li>
      </ul>

      <h2>What AI can and cannot do</h2>
      <p><strong>Can:</strong> organise meals by macros, surface substitutions, generate shopping lists, explain recipes.</p>
      <p><strong>Cannot:</strong> diagnose conditions, prescribe medication, or guarantee weight‑loss outcomes. Outputs may be wrong or not suitable for your health context.</p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Verify ingredients for allergens/intolerances.</li>
        <li>Consult a qualified professional for medical questions, GLP‑1 usage, or significant dietary changes.</li>
        <li>Do not use the service for emergencies.</li>
      </ul>

      <h2>Model & provider changes</h2>
      <p>
        We may change models/providers to improve safety and quality; we will maintain 
        or improve protections.
      </p>
    </>
  );
}