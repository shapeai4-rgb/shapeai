import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refunds Policy | WeightLoss.AI',
};

export default function RefundsPolicyPage() {
  return (
    <>
      <h1>Refunds Policy (Top‑ups & Digital Content)</h1>
      <p><em>Last updated: August 26, 2025</em></p>

      <p>
        No subscriptions. Purchases on Shape AI are one‑off token top‑ups that give 
        access to generate digital content (plans/PDFs).
      </p>

      <h2>Cooling‑off period for online purchases</h2>
      <p>
        Consumers usually have a 14‑day cancellation period for distance purchases. 
        However, for digital content not supplied on a tangible medium, you lose 
        the right to cancel once you:
      </p>
      <ol>
        <li>explicitly request immediate supply (e.g. tick a box before generation), and</li>
        <li>acknowledge that this means you lose the right to cancel once supply begins.</li>
      </ol>
      <p>
        If you do not give that consent/acknowledgement and we start supply, you may 
        retain cancellation rights.
      </p>

      <h2>Our practice</h2>
      <p>
        Before generation or download begins, we show a checkbox: “I request immediate 
        digital delivery and understand I lose my 14‑day cancellation right once delivery begins.”
      </p>
      <p>
        If you have not started generation/download and are within 14 days, contact us 
        to cancel and we will refund the unused purchase.
      </p>
      <p>
        Tokens used to generate content and completed downloads are non‑refundable unless 
        the content is faulty under the section below.
      </p>

      <h2>Faulty digital content (Consumer Rights Act)</h2>
      <p>
        If a PDF or file we provided is defective (e.g., corrupted, won’t open), we will 
        repair or replace it within a reasonable time. If that’s impossible or fails, 
        you may be entitled to a price reduction or refund for the affected item.
      </p>

      <h2>How to request a refund or cancellation</h2>
      <p>
        Email info@shapeai.co.uk or call +44 7822016497 with your order ID, date, 
        amount, and reason. We aim to respond within 2 business days.
      </p>

      <h2>Chargebacks & abuse</h2>
      <p>
        We reserve the right to suspend accounts for suspected fraud or abuse of 
        refund processes.
      </p>
    </>
  );
}