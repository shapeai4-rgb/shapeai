import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | ShapeAI',
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-neutral-ink mb-2">COOKIE POLICY</h1>
        <p className="text-neutral-slate mb-8">
          <strong>Effective date:</strong> 2 October 2025<br />
          <strong>Data controller:</strong> PREPARING BUSINESS LTD<br />
          Company no.: 16107292<br />
          Registered office: 12 Skinner Lane, Leeds, England, LS7 1DL<br />
          Service / Site: https://shapeai.co.uk<br />
          Contact: info@shapeai.co.uk
        </p>
        
        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">1. Overview</h2>
        <p className="text-neutral-slate mb-6">
          This Cookie Policy explains how ShapeAI uses cookies and similar technologies on the Site. It complements the Privacy Policy. By using the Site or interacting with the cookie banner you may accept, reject or customise non-essential cookies.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">2. What are cookies?</h2>
        <p className="text-neutral-slate mb-6">
          Cookies are small text files stored on your device. Similar technologies (localStorage, sessionStorage, pixels) perform comparable functions. They help the Site function, remember preferences, secure sessions, measure performance and — with consent — support analytics and marketing.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">3. Categories of cookies we use</h2>
        <ul className="list-disc pl-6 text-neutral-slate mb-6 space-y-2">
          <li><strong>Essential / Strictly necessary:</strong> session, authentication, checkout references (required for login and token top-up).</li>
          <li><strong>Functional:</strong> UI preferences, saved generator settings.</li>
          <li><strong>Performance / Analytics:</strong> usage metrics, error tracking. May operate under legitimate interests or consent.</li>
          <li><strong>AI quality & diagnostics:</strong> ephemeral identifiers to correlate model requests with non-identifiable diagnostics. Consent requested for analytics-style collection.</li>
          <li><strong>Security / Anti-fraud:</strong> bot detection and payment security (may operate under legitimate interests).</li>
          <li><strong>Marketing / Advertising:</strong> campaign tracking and remarketing — requires explicit consent.</li>
        </ul>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">4. Typical cookies (examples)</h2>
        <p className="text-neutral-slate mb-4">Illustrative examples (replace with live names in cookie control panel):</p>
        <div className="bg-neutral-lines/10 p-6 rounded-lg text-neutral-slate mb-6">
          <div className="space-y-3 text-sm">
            <div><strong>shapeai_session</strong> — session login (Essential) — lifetime: session.</div>
            <div><strong>csrf_token</strong> — CSRF protection (Essential) — lifetime: session.</div>
            <div><strong>consent_v1</strong> — stored consent version (Functional) — 6–12 months.</div>
            <div><strong>ui_prefs</strong> — UI preferences (Functional) — ~6 months.</div>
            <div><strong>perf_metrics</strong> — analytics (Performance) — 1–3 months.</div>
            <div><strong>ai_quality_id</strong> — AI diagnostics correlation (AI quality) — short (minutes–hours).</div>
            <div><strong>tokens_txn</strong> — checkout transaction ref (Payment flow) — short.</div>
            <div><strong>campaign_src</strong> — marketing attribution (Marketing) — 30–90 days.</div>
          </div>
        </div>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">5. Consent and lawful basis</h2>
        <ul className="list-disc pl-6 text-neutral-slate mb-6 space-y-2">
          <li>Essential cookies are used without consent.</li>
          <li>Non-essential cookies are set only after consent via the cookie banner, except where legitimate interests apply (narrow security/analytics). You may withdraw consent anytime.</li>
        </ul>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">6. How we record and retain consent</h2>
        <p className="text-neutral-slate mb-6">
          We record consent with banner text/version, ISO 8601 timestamp and technical metadata (IP, user-agent). Consent records retained 24 months minimum and up to 6 years for disputed/enterprise matters.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">7. Third parties and international transfers</h2>
        <p className="text-neutral-slate mb-6">
          Third parties (payment processors, AI providers, hosting, analytics) may set cookies and process data outside the UK/EEA. Where transfers occur we use UK adequacy, Standard Contractual Clauses or equivalent safeguards. Live list of providers available in cookie control panel.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">8. How to manage or withdraw consent</h2>
        <ul className="list-disc pl-6 text-neutral-slate mb-6 space-y-2">
          <li>Use cookie banner to accept/reject or open settings.</li>
          <li>Use Manage Cookies link in footer to change preferences.</li>
          <li>Remove cookies via browser settings (this may impair functionality).</li>
        </ul>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">9. Consequences of withdrawing consent</h2>
        <p className="text-neutral-slate mb-6">
          Withdrawing consent may affect features (e.g., analytics, AI diagnostics, personalised ads, some debugging ability). You may be logged out or lose saved preferences.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">10. Changes to this Policy</h2>
        <p className="text-neutral-slate mb-6">
          We may update this Policy; material changes will be notified.
        </p>

        <hr className="my-8 border-neutral-lines" />

        <h2 className="text-2xl font-semibold text-neutral-ink mt-8 mb-4">11. Contact</h2>
        <div className="bg-neutral-lines/10 p-6 rounded-lg text-neutral-slate">
          <p className="mb-2">For cookie questions contact:</p>
          <p><strong>Email:</strong> info@shapeai.co.uk</p>
          <p><strong>Postal:</strong> PREPARING BUSINESS LTD — 12 Skinner Lane, Leeds, England, LS7 1DL</p>
        </div>
      </div>
    </div>
  );
}
