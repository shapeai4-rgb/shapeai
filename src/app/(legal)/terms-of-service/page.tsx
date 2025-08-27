import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | WeightLoss.AI',
};

export default function TermsOfServicePage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p><em>Last updated: August 26, 2025</em></p>

      <h2>1. About us & contract</h2>
      <p>
        By creating an account or using Shape AI, you agree to these Terms. If you 
        do not agree, do not use the service.
      </p>

      <h2>2. Service description</h2>
      <p>
        Shape AI provides AI‑assisted meal planning, recipe suggestions and downloadable PDFs. 
        Content is informational only and is not medical advice. See the Medical & Nutrition 
        Disclaimer.
      </p>

      <h2>3. Accounts</h2>
      <p>
        Keep your password confidential; you’re responsible for activity on your account. 
        We may suspend accounts for abuse or security concerns.
      </p>

      <h2>4. Tokens & top‑ups (no subscriptions)</h2>
      <p>
        You can purchase token top‑ups to generate plans/PDFs. Tokens are digital credits; 
        pricing and VAT are shown at checkout. Tokens may have expiry if stated at purchase. 
        Tokens are non‑transferable and have no cash value.
      </p>

      <h2>5. Digital content licence</h2>
      <p>
        Generated content (meal plans, PDFs) is licensed to you for personal, non‑commercial 
        use. No redistribution, resale, public posting or training of models, unless we 
        grant written permission.
      </p>

      <h2>6. Acceptable Use</h2>
      <p>
        No scraping, reverse engineering, automated bulk requests, or misuse of the service; 
        no uploading illegal/harmful content; no attempts to bypass safety systems. Do not 
        rely on outputs for medical decisions or emergencies.
      </p>

      <h2>7. AI outputs & accuracy</h2>
      <p>
        Outputs may be incomplete, outdated, or inaccurate. Use judgement and verify 
        ingredients/allergens. We may use third‑party AI providers to process your prompts.
      </p>

      <h2>8. Payments</h2>
      <p>
        Payments are processed by our PSP. You authorise charges for token top‑ups. All 
        prices include applicable taxes unless stated otherwise.
      </p>

      <h2>9. Cancellation & refunds</h2>
      <p>
        See Refunds Policy. For immediate digital supply (e.g., starting generation or 
        downloading), your 14‑day cancellation right does not apply where you’ve given 
        explicit consent and acknowledgement.
      </p>

      <h2>10. Faulty digital content</h2>
      <p>
        If digital content is defective (e.g., corrupted file), contact support. We will 
        repair/replace or refund where required by law.
      </p>

      <h2>11. Liability</h2>
      <p>
        We do not exclude liability for fraud, death or personal injury caused by negligence, 
        or where otherwise unlawful. Otherwise, Shape AI is not liable for indirect or 
        consequential losses or loss of data, profits or business; our total liability is 
        limited to the amount you paid in the 12 months before the claim.
      </p>

      <h2>12. Termination</h2>
      <p>
        You may delete your account at any time. We may suspend or terminate for material 
        breach or risk to the service.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of England & Wales; courts of England have 
        exclusive jurisdiction.
      </p>

      <h2>14. Changes</h2>
      <p>
        We may update these Terms; we’ll notify you of material changes in‑app or by email.
      </p>
    </>
  );
}