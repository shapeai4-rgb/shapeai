import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund and Return Policy | ShapeAI',
};

export default function RefundAndReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-neutral-ink mb-2">REFUND & RETURN POLICY</h1>
        <p className="text-neutral-slate mb-8">
          <strong>Effective date:</strong> 2 October 2025<br />
          <strong>PREPARING BUSINESS LTD</strong><br />
          Company no.: 16107292<br />
          Registered office: 12 Skinner Lane, Leeds, England, LS7 1DL<br />
          Support email: info@shapeai.co.uk | Phone: +44 7418 638914<br />
          Service: https://shapeai.co.uk
        </p>
        
        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">1. Summary (customer-facing)</h2>
        <ul className="list-disc pl-6 text-neutral-slate mb-6 space-y-2">
          <li>Refunds are processed under this Policy and applicable UK consumer law.</li>
          <li>Acknowledgement: within 5 business days; refund processing: 5–10 business days after approval (timing to reach your account depends on payment provider).</li>
          <li>Refunds will not exceed the original fiat amount paid for Tokens or Services (less any non-refundable processor fees).</li>
          <li>Redeemed Tokens (used in Generation Transactions) are generally non-refundable except for system errors, materially defective or mis-described Products, or as required by law.</li>
          <li>Promotional/bonus Tokens are non-refundable unless promotion terms say otherwise.</li>
          <li>To request a refund, contact info@shapeai.co.uk with your order / generation ID and supporting evidence.</li>
          <li>Refunds are issued in the original purchase currency (EUR, GBP, USD).</li>
        </ul>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">2. Scope and legal note</h2>
        <p className="text-neutral-slate mb-6">
          This Policy applies to refunds for Tokens and digital Services (AI-generated meal plans, downloadable PDFs, bespoke plans) on the Service. It does not limit statutory rights you cannot waive under UK law (Consumer Contracts Regulations 2013, Consumer Rights Act 2015).
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">3. Definitions (key)</h2>
        <ul className="list-disc pl-6 text-neutral-slate mb-6 space-y-2">
          <li><strong>Tokens</strong> — internal credits used for purchases.</li>
          <li><strong>Generation Transaction</strong> — recorded token deduction for a confirmed generation (includes words, days, options and total tokens).</li>
          <li><strong>Unused Tokens</strong> — tokens not redeemed.</li>
          <li><strong>Redeemed Tokens</strong> — tokens spent on Generation Transactions or other redemptions.</li>
        </ul>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">4. Refund principles (binding rules)</h2>
        <p className="text-neutral-slate mb-4">
          4.1 <strong>Refund cap.</strong> Refunds do not exceed the original paid amount (net of non-refundable processor fees) in the original purchase currency (EUR, GBP, USD).
        </p>
        <p className="text-neutral-slate mb-4">
          4.2 <strong>No refund for redeemed Tokens except:</strong> (a) system error prevented delivery of output; (b) Product is materially defective or not as described; (c) otherwise required by law. In such cases we will either re-credit the exact Tokens to your Account or issue a fiat refund in the original purchase currency (EUR, GBP, USD) equal to the token value recorded for that Generation Transaction, displayed with exactly two decimal places.
        </p>
        <p className="text-neutral-slate mb-4">
          4.3 <strong>Partial failures / corrupt output.</strong> If output is corrupted or incomplete we will offer: (i) an immediate free repeat generation of the same request (no Tokens deducted); or (ii) refund / re-credit for the affected Generation Transaction.
        </p>
        <p className="text-neutral-slate mb-4">
          4.4 <strong>Unused Tokens.</strong> Refundable if request received before redemption. Non-refundable processor fees may be deducted.
        </p>
        <p className="text-neutral-slate mb-4">
          4.5 <strong>Promotional Tokens.</strong> Non-refundable except where promotion terms state otherwise.
        </p>
        <p className="text-neutral-slate mb-6">
          4.6 <strong>Bespoke / custom work.</strong> Non-refundable once substantial manual work commences, unless bespoke contract sets different terms. Pro rata refund may apply under bespoke agreement.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">5. How to request a refund (procedure)</h2>
        <p className="text-neutral-slate mb-6">
          Send an email to info@shapeai.co.uk including: order/generation reference, account email, whether the claim concerns Unused Tokens or a Redeemed Product, evidence (screenshots, file names, timestamps), and preferred refund method. We will: acknowledge within 5 business days, investigate, request additional information if needed, and if approved process refund within 5–10 business days.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">6. Investigation, evidence and decisions</h2>
        <p className="text-neutral-slate mb-6">
          We will examine transaction logs, checkout records, delivery/download timestamps and your evidence. If refund approved we will normally refund to the original payment method or offer an alternative after verification. If rejected, we will explain reasons and escalation options.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">7. Chargebacks, fraud and abuse</h2>
        <p className="text-neutral-slate mb-6">
          If a chargeback is raised during a pending refund, we will treat it as a dispute and may provide full evidence to the payment provider. We reserve the right to refuse refunds and to suspend/close Accounts where fraud or abuse is detected.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">8. Changes to this Policy</h2>
        <p className="text-neutral-slate mb-6">
          We may update this Policy; material changes will be notified to registered users and published on the Service.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">9. Record keeping and retention</h2>
        <p className="text-neutral-slate mb-6">
          We retain records necessary to substantiate refund decisions — order id, Generation Transaction logs, token nominal at checkout, download/access logs, timestamps, IP and user agent — for at least 24 months and up to 6 years for enterprise/disputed matters.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">10. Escalation and disputes</h2>
        <p className="text-neutral-slate mb-6">
          If dissatisfied, escalate to info@shapeai.co.uk with reasons and references. We will re-review within 10 business days. This Policy does not affect statutory rights.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">11. Practical examples (illustrative)</h2>
        <div className="bg-neutral-lines/10 p-6 rounded-lg text-neutral-slate mb-6">
          <p className="mb-4"><strong>Generation failure:</strong> 15-word description (40 tokens) + 3 days (60 tokens) = 100 tokens. If system fails to deliver, we will re-credit 100 tokens or refund fiat equivalent.</p>
          <p><strong>Options example:</strong> 7 days (140), 25 words (50), Intermittent Fasting +10, Protein Target +5, 2 cuisines +10 → total 215 tokens; refund for defective output will refer to recorded 215 token transaction.</p>
        </div>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">12. Contact details</h2>
        <div className="bg-neutral-lines/10 p-6 rounded-lg text-neutral-slate">
          <p className="mb-2"><strong>Support email:</strong> info@shapeai.co.uk | <strong>Phone:</strong> +44 7418 638914</p>
          <p><strong>Postal:</strong> PREPARING BUSINESS LTD — 12 Skinner Lane, Leeds, England, LS7 1DL</p>
        </div>
      </div>
    </div>
  );
}
