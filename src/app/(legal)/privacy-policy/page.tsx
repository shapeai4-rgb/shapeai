import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ShapeAI',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-neutral-ink mb-2">PRIVACY POLICY</h1>
        <p className="text-neutral-slate mb-8">
          <strong>Effective date:</strong> 2 October 2025<br />
          <strong>Data controller:</strong> PREPARING BUSINESS LTD<br />
          Company no.: 16107292<br />
          Registered office: 12 Skinner Lane, Leeds, England, LS7 1DL<br />
          Contact / Data Protection / Support: info@shapeai.co.uk<br />
          Service: https://shapeai.co.uk
        </p>
        
        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">1. Introduction</h2>
        <p className="text-neutral-slate mb-6">
          We respect your privacy. This Policy explains what personal data we collect, why we process it, how long we keep it and how you can exercise your rights. It applies to data collected when you use the Service.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">2. What data we collect</h2>
        <p className="text-neutral-slate mb-4">We collect personal data necessary to provide and improve the Service:</p>
        <ul className="list-disc pl-6 text-neutral-slate mb-6 space-y-2">
          <li><strong>Identity & contact:</strong> name (optional), email, postal/billing address if required.</li>
          <li><strong>Account data:</strong> username, hashed password, profile settings and preferences.</li>
          <li><strong>Payment & transactions:</strong> order refs, transaction IDs, amounts, dates — we do not store full card numbers or CVV unless explicitly stated (payments handled by third-party processors).</li>
          <li><strong>Service usage & content:</strong> token ledger, purchase history, Generation Transaction logs (prompt metadata, words count, days, selected options), generated outputs, download/access logs.</li>
          <li><strong>Health / dietary data (sensitive):</strong> allergies, medical conditions, dietary requirements, weight, height, age — processed only with explicit consent or other lawful basis.</li>
          <li><strong>Technical & device:</strong> IP address, device type, browser, user-agent, access timestamps, crash logs.</li>
          <li><strong>Support & communications:</strong> emails, chat transcripts, attachments.</li>
          <li><strong>Marketing & consent records:</strong> newsletter subscriptions, consent logs.</li>
        </ul>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">3. Purposes & legal bases for processing</h2>
        <p className="text-neutral-slate mb-4">We process personal data for specific purposes and with lawful bases:</p>
        <ul className="list-disc pl-6 text-neutral-slate mb-6 space-y-2">
          <li><strong>To provide and operate the Service</strong> (accounts, deliveries, token purchases): performance of contract.</li>
          <li><strong>Payments and fraud prevention:</strong> legal obligation and legitimate interests.</li>
          <li><strong>Support, refunds and complaints:</strong> performance of contract / legitimate interests.</li>
          <li><strong>Marketing:</strong> consent (you may withdraw anytime).</li>
          <li><strong>Service improvement & analytics:</strong> legitimate interests (we balance interests and minimise data). Health/diet data used for personalisation only with explicit consent.</li>
          <li><strong>Compliance with law:</strong> legal obligation.</li>
        </ul>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">4. Automated decision-making and profiling (AI)</h2>
        <ul className="list-disc pl-6 text-neutral-slate mb-6 space-y-2">
          <li>The Service uses AI to generate meal plans. Generation involves automated processing based on the data you provide (profiling).</li>
          <li>You may request human review of any automated output that significantly affects you — contact info@shapeai.co.uk.</li>
          <li>We will not rely solely on automated processing of special category data in a way that produces legal effects without explicit consent unless permitted by law.</li>
        </ul>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">5. Sharing & international transfers</h2>
        <p className="text-neutral-slate mb-6">
          We share data with third parties to deliver the Service — payment processors, cloud hosting, AI providers, analytics, customer support platforms and advisors. Some recipients may be located outside the UK/EEA; in such cases we use appropriate safeguards (UK adequacy, Standard Contractual Clauses or other lawful mechanisms). We will ensure onward recipients provide adequate protection.
        </p>
        <div className="bg-neutral-lines/10 p-4 rounded-lg text-neutral-slate mb-6">
          <p className="text-sm italic">
            <strong>Note:</strong> Specific providers include payment processors, OpenAI for AI services, cloud hosting providers, analytics services, and customer support platforms. Detailed list available upon request.
          </p>
        </div>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">6. Cookies & similar technologies</h2>
        <p className="text-neutral-slate mb-6">
          We use cookies, localStorage, sessionStorage and pixels to operate the Service, remember preferences, keep sessions and — with consent — for analytics and marketing. Essential cookies do not require consent. See our Cookie Policy for more.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">7. Retention (how long we keep data)</h2>
        <p className="text-neutral-slate mb-4">We retain data only as long as necessary:</p>
        <ul className="list-disc pl-6 text-neutral-slate mb-4 space-y-2">
          <li><strong>Transaction records / Token ledger:</strong> minimum 24 months, up to 6 years for disputes/compliance.</li>
          <li><strong>Account profile & access logs:</strong> while Account active and for a reasonable period after closure for fraud prevention.</li>
          <li><strong>Generation outputs & model logs:</strong> retained for operational, audit and quality purposes; retention minimised.</li>
          <li><strong>Support correspondence:</strong> retained as necessary to resolve issues.</li>
        </ul>
        <p className="text-neutral-slate mb-6">
          We delete or anonymise data when no longer required unless legal obligations require otherwise.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">8. Your rights</h2>
        <p className="text-neutral-slate mb-6">
          You have rights under UK GDPR, including access, rectification, erasure, restriction, portability, objection and withdrawal of consent. To exercise rights contact info@shapeai.co.uk. We may request ID to verify requests and will respond within statutory timeframes (normally one month).
        </p>
        <div className="bg-neutral-lines/10 p-4 rounded-lg text-neutral-slate mb-6">
          <p className="text-sm italic">
            <strong>Note:</strong> We recommend implementing a DSAR (Data Subject Access Request) web form and logging system for efficient processing.
          </p>
        </div>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">9. Security</h2>
        <p className="text-neutral-slate mb-6">
          We implement appropriate technical and organisational measures: TLS encryption in transit, access controls, secure backups, least-privilege access, monitoring and vulnerability management. No system is absolute; in case of personal data breach we will notify affected users and the ICO as required by law.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">10. Children</h2>
        <p className="text-neutral-slate mb-6">
          Service is for users aged 18+. We do not knowingly collect data from children under 18. If you suspect data from a child has been collected contact info@shapeai.co.uk.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">11. Marketing & preferences</h2>
        <p className="text-neutral-slate mb-6">
          Marketing communications require consent; you may opt out via unsubscribe links or by contacting info@shapeai.co.uk. Transactional messages (receipts, security notices) are still sent as needed.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">12. Changes to this Policy</h2>
        <p className="text-neutral-slate mb-6">
          We may update this Policy; material changes will be notified to registered users. Effective date will be updated.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">13. Contact & complaints</h2>
        <div className="bg-neutral-lines/10 p-6 rounded-lg text-neutral-slate">
          <p className="mb-2">For data requests or complaints contact:</p>
          <p><strong>Email:</strong> info@shapeai.co.uk</p>
          <p><strong>Phone:</strong> +44 7822016497</p>
          <p className="mt-4 text-sm">
            You also have the right to complain to the Information Commissioner&apos;s Office (ICO) if you are unhappy with how we use your data: <a href="https://ico.org.uk" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a>
          </p>
        </div>
      </div>
    </div>
  );
}
