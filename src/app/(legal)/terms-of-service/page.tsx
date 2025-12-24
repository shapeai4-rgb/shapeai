import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | ShapeAI',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-neutral-ink mb-2">TERMS & CONDITIONS</h1>
        <p className="text-neutral-slate mb-8">
          <strong>Effective date:</strong> 2 October 2025<br />
          <strong>PREPARING BUSINESS LTD</strong><br />
          Company no.: 16107292<br />
          Registered office: 12 Skinner Lane, Leeds, England, LS7 1DL<br />
          Email: info@shapeai.co.uk | Phone: +44 7418 638914<br />
          Service: https://shapeai.co.uk
        </p>
        
        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">1. Introduction</h2>
        <p className="text-neutral-slate mb-4">
          1.1 These Terms & Conditions (&quot;Terms&quot;) govern your access to and use of the ShapeAI website and services (the &quot;Service&quot;) provided by PREPARING BUSINESS LTD (&quot;we&quot;, &quot;us&quot;, &quot;our&quot; or the &quot;Company&quot;). By registering for an account, topping up Tokens, requesting or downloading AI-generated meal plans, or otherwise using the Service you accept and agree to be bound by these Terms.
        </p>
        <p className="text-neutral-slate mb-6">
          1.2 If you do not accept these Terms, stop using the Service immediately.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">2. Definitions</h2>
        <p className="text-neutral-slate mb-4">In these Terms:</p>
        <ul className="list-disc pl-6 text-neutral-slate mb-6 space-y-2">
          <li><strong>Account</strong> — your registered user account.</li>
          <li><strong>Tokens</strong> — internal virtual credits used to purchase or redeem Products and Services on the Service.</li>
          <li><strong>Product(s)/Service(s)</strong> — AI-generated meal plans, downloadable files (PDFs), bespoke plans, and any other items offered via the Service.</li>
          <li><strong>Generator</strong> — the AI model(s) and algorithms used to create personalised content.</li>
          <li><strong>Generation Transaction</strong> — a recorded token deduction corresponding to a confirmed generation request (includes prompt length, day count, options and total tokens charged).</li>
          <li><strong>User / You</strong> — the person or legal entity using the Service.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">3. Eligibility and account security</h2>
        <p className="text-neutral-slate mb-4">
          3.1 You must be 18 years or older to use the Service. By creating an Account or using the Service you confirm that you are at least 18 years old. If you act on behalf of a legal entity you confirm you have authority to bind that entity.
        </p>
        <p className="text-neutral-slate mb-4">
          3.1A We do not routinely verify age, but we reserve the right to request proof of age and to suspend or close Accounts where we reasonably believe the user is under 18.
        </p>
        <p className="text-neutral-slate mb-4">
          3.2 Provide accurate, complete and current information during registration. You are responsible for maintaining the confidentiality of Account credentials and for all activity under your Account.
        </p>
        <p className="text-neutral-slate mb-6">
          3.3 Immediately notify us of any unauthorised use of your Account at info@shapeai.co.uk.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">4. Tokens — nature, pricing structure and display (PRICING STRUCTURE INCLUDED)</h2>
        <p className="text-neutral-slate mb-4">
          4.1 <strong>Nature of Tokens.</strong> Tokens are virtual accounting units used on the Service. Tokens are not cash, e-money, securities or investments and confer only the rights set out in these Terms.
        </p>
        <p className="text-neutral-slate mb-4">
          4.2 <strong>Pricing Structure for Meal Plan Generation (summary).</strong> Token cost for a generation is the sum of: (a) base generation cost determined by the length of your description (words); (b) duration-based cost determined by number of days requested; and (c) additional costs for selected options (Goals, Structure, Diet). The Service displays the full Pricing Structure and worked examples.
        </p>
        <p className="text-neutral-slate mb-4">
          4.3 <strong>Word-length (base) cost.</strong> Base cost = 30 tokens for up to 10 words in the description. Then +10 tokens per each additional block of up to 10 words (rounding up).<br />
          <em>Examples: 0–10 words = 30 tokens; 15 words = 40 tokens; 25 words = 50 tokens.</em>
        </p>
        <p className="text-neutral-slate mb-4">
          4.4 <strong>Day-based cost.</strong> Day cost = 20 tokens for day 1, plus +20 tokens for each additional day. Maximum days per request: 180 days.<br />
          <em>Examples: 1 day = 20 tokens; 7 days = 140 tokens; 30 days = 600 tokens.</em>
        </p>
        <p className="text-neutral-slate mb-4">
          4.5 <strong>Options & add-ons.</strong> Examples of option costs (full list on Service): Activity Level +5, Calorie Method +5, Protein Target +5, Meals per day +5, Snacks +5, Intermittent Fasting +10, Leftovers Strategy +10, Diet Type +10 per chosen type, Cuisines +5 per cuisine, Allergens +5 per allergen, Other Exclusions +10 if field filled.
        </p>
        <p className="text-neutral-slate mb-4">
          4.6 <strong>Total cost calculation.</strong><br />
          <code className="bg-neutral-lines/20 px-2 py-1 rounded text-sm">total_tokens = word_cost_tokens + day_cost_tokens + sum(selected_option_token_costs)</code>
        </p>
        <p className="text-neutral-slate mb-4">
          4.7 <strong>Display & consent.</strong> Prior to confirmation the Service will display a token breakdown (word cost, day cost, each selected add-on) and the total tokens (and, when applicable, fiat equivalent). Fiat amounts are shown with exactly two (2) decimal places. By confirming you authorise deduction of the displayed Tokens from your Account.
        </p>
        <p className="text-neutral-slate mb-4">
          4.8 <strong>Issuance, redemption and transfers.</strong> Tokens are credited to your Account after successful payment. Tokens are typically non-transferable and bound to your Account, unless expressly allowed in writing.
        </p>
        <p className="text-neutral-slate mb-6">
          4.9 <strong>Changes to pricing.</strong> We may change Token pricing or the Pricing Structure at any time; changes apply prospectively to purchases or generation requests made after the change is posted.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">5. Ordering, payment and checkout</h2>
        <p className="text-neutral-slate mb-4">
          5.1 All purchases and generation requests are subject to acceptance. We may refuse or cancel orders for suspected fraud, errors or other valid reasons.
        </p>
        <p className="text-neutral-slate mb-4">
          5.2 Payments are processed through third-party payment providers; we generally do not store full card data. You warrant you are authorised to use the chosen payment method.
        </p>
        <p className="text-neutral-slate mb-4">
          5.3 At checkout you will see: Token quantity, Token nominal value (fiat equivalent), and the total fiat to be charged in the selected purchase currency (EUR, GBP or USD), plus any taxes/fees. Fiat amounts are shown with exactly two (2) decimal places. Confirm these before completing payment.
        </p>
        <p className="text-neutral-slate mb-6">
          5.4 For immediate digital supply (downloadable PDFs), risk passes to you upon delivery of access/download link.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">6. Delivery, storage and audit logs</h2>
        <p className="text-neutral-slate mb-4">
          6.1 Generated outputs (meal plans, PDFs) are delivered electronically. We may retain copies, prompts, model outputs and metadata for operational, audit and dispute-resolution purposes. See Privacy Policy for details.
        </p>
        <p className="text-neutral-slate mb-6">
          6.2 We keep transaction logs and Generation Transaction records to verify charges and handle refunds/disputes.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">7. Refunds, cancellations and generation failures (summary)</h2>
        <p className="text-neutral-slate mb-4">
          7.1 If you consented at checkout to immediate supply of digital content and you downloaded or opened it, your statutory right to cancel may be lost for that transaction. See the Refund & Returns Policy for full rules.
        </p>
        <p className="text-neutral-slate mb-4">
          7.2 Tokens redeemed in a Generation Transaction are generally non-refundable except where: (a) a system error prevented delivery and no output was supplied; (b) the delivered product is materially defective or not as described; or (c) required by law. In such cases we will generally re-credit Tokens or issue a fiat refund for the token value of the affected transaction.
        </p>
        <p className="text-neutral-slate mb-6">
          7.3 For partial failures (e.g., corrupt file) we will offer either a free repeat generation (no extra Tokens) or refund/re-credit for the affected transaction. Support decisions are based on transaction logs and evidence.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">8. Health, medical disclaimers and AI content</h2>
        <p className="text-neutral-slate mb-4">
          8.1 The Service provides AI-generated meal plans based on information you supply. Outputs are not medical advice. Consult a qualified healthcare practitioner before relying on outputs if you have medical conditions, are pregnant, breastfeeding, elderly, or taking medication.
        </p>
        <p className="text-neutral-slate mb-4">
          8.2 Sensitive health/dietary data will be processed only with your explicit consent or other lawful basis; see Privacy Policy.
        </p>
        <p className="text-neutral-slate mb-6">
          8.3 We are not liable for adverse health outcomes resulting from use of generated outputs. You assume responsibility for decisions based on the Service.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">9. Intellectual property rights</h2>
        <p className="text-neutral-slate mb-4">
          9.1 <strong>Ownership.</strong> All intellectual property rights in and to the Service, including the website, software, the Generator, designs and content, are and remain the property of PREPARING BUSINESS LTD or, where they belong to third parties, are lawfully licensed to PREPARING BUSINESS LTD. Nothing in these Terms transfers any ownership rights in such intellectual property to you.
        </p>
        <p className="text-neutral-slate mb-6">
          9.2 On purchase or lawful access we grant a limited, non-exclusive, non-transferable licence for personal, non-commercial use of purchased Products unless otherwise agreed in writing. Commercial use requires prior written consent.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">10. User obligations and prohibited content</h2>
        <p className="text-neutral-slate mb-4">
          10.1 You must not: (a) submit illegal, offensive, infringing or harmful content; (b) attempt to reverse-engineer or subvert the Generator; (c) abuse the Service or attempt unauthorised access; (d) use outputs to provide professional medical advice without appropriate qualifications.
        </p>
        <p className="text-neutral-slate mb-6">
          10.2 We may remove content and suspend Accounts that breach these rules.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">11. Warranties and disclaimers</h2>
        <p className="text-neutral-slate mb-4">
          11.1 We warrant we have authority to provide the Service. Except as expressly provided, the Service and Products are provided &quot;as is&quot; and &quot;as available&quot; and we disclaim implied warranties to the fullest extent permitted by law.
        </p>
        <p className="text-neutral-slate mb-6">
          11.2 We do not guarantee results or specific health or fitness outcomes.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">12. Limitation of liability</h2>
        <p className="text-neutral-slate mb-4">
          12.1 Nothing in these Terms excludes liability for death or personal injury resulting from negligence or any liability that cannot be excluded by law.
        </p>
        <p className="text-neutral-slate mb-4">
          12.2 Subject to clause 12.1, our aggregate liability to you for claims connected to these Terms is limited to the total amount you paid to us in the 12 months prior to the claim.
        </p>
        <p className="text-neutral-slate mb-6">
          12.3 We are not liable for indirect, special or consequential losses (lost profits, data loss, reputational loss).
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">13. Indemnity</h2>
        <p className="text-neutral-slate mb-6">
          You indemnify and hold harmless the Company and its representatives from claims, liabilities, losses, damages and expenses (including legal fees) arising from your breach of these Terms, misuse of the Service, or violation of applicable law.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">14. Data protection and privacy</h2>
        <p className="text-neutral-slate mb-4">
          14.1 We process personal data in accordance with our Privacy Policy, which explains categories of data, purposes, retention and your rights. By using the Service you consent to such processing.
        </p>
        <p className="text-neutral-slate mb-6">
          14.2 To exercise data rights contact info@shapeai.co.uk.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">15. Third-party services and links</h2>
        <p className="text-neutral-slate mb-6">
          15.1 The Service may integrate with or link to third-party services (payment processors, AI providers, analytics). We are not responsible for third-party terms, availability or privacy practices. Use of third-party services is subject to their terms.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">16. Suspension, restriction and termination</h2>
        <p className="text-neutral-slate mb-4">
          16.1 We may suspend or terminate Accounts where we reasonably suspect breach, fraud or illegal activity, or to protect platform integrity.
        </p>
        <p className="text-neutral-slate mb-6">
          16.2 Termination does not affect accrued rights.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">17. Changes to the Service and Terms</h2>
        <p className="text-neutral-slate mb-6">
          17.1 We may change the Service and these Terms. Material changes will be notified to registered users by email or prominent notice. Continued use after changes constitutes acceptance.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">18. Complaints and dispute resolution</h2>
        <p className="text-neutral-slate mb-6">
          18.1 For complaints contact info@shapeai.co.uk. If unresolved, consumers may pursue statutory remedies or alternative dispute resolution where applicable.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">19. Force majeure</h2>
        <p className="text-neutral-slate mb-6">
          19.1 We are not liable for failures caused by events beyond our control (acts of God, strikes, outages, cyber incidents, third-party failures).
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">20. Severability and waiver</h2>
        <p className="text-neutral-slate mb-6">
          20.1 If a provision is unenforceable, it will be severed and remaining provisions remain in force. No waiver of rights is effective unless in writing.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">21. Entire agreement and assignment</h2>
        <p className="text-neutral-slate mb-6">
          21.1 These Terms together with the Privacy Policy and any documents incorporated by reference form the entire agreement. You may not assign rights without our consent. We may assign or subcontract.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">22. Governing law and jurisdiction</h2>
        <p className="text-neutral-slate mb-4">
          22.1 These Terms are governed by the laws of England and Wales.
        </p>
        <p className="text-neutral-slate mb-6">
          22.2 Unless you are habitually resident in Scotland or Northern Ireland, the courts of England and Wales have exclusive jurisdiction. Consumers in the EU may have additional rights.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">23. Contact details</h2>
        <div className="bg-neutral-lines/10 p-6 rounded-lg text-neutral-slate">
          <p className="mb-2"><strong>PREPARING BUSINESS LTD</strong></p>
          <p className="mb-2">12 Skinner Lane, Leeds, England, LS7 1DL</p>
          <p className="mb-2">Company no.: 16107292</p>
          <p>Email: info@shapeai.co.uk | Phone: +44 7418 638914</p>
        </div>
      </div>
    </div>
  );
}
