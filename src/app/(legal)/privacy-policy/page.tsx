import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | WeightLoss.AI',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p><em>Last updated: August 26, 2025</em></p>

      <h2>Who we are</h2>
      <p>
        We are PREPARING BUSINESS LTD (&quot;Shape AI&quot;, &quot;we&quot;, &quot;us&quot;). We provide AI-assisted meal 
        planning and nutrition content at shapeai.co.uk.
      </p>

      <h2>What this policy covers</h2>
      <p>
        This policy explains how we collect, use, share and protect your personal data when 
        you use our website, create an account, purchase token top‑ups, generate plans/PDFs, 
        contact support, or interact with our communications.
      </p>
      
      <h2>Personal data we collect</h2>
      <ul>
        <li><strong>Account & identity:</strong> name, email, password (hashed), country, timezone, language.</li>
        <li><strong>Contact:</strong> messages to support, feedback form data (name, email, phone, message).</li>
        <li><strong>Purchase & billing:</strong> token orders (amount, currency, VAT), payment method metadata from our PSP (last4, brand, expiry month/year, transaction IDs). We do not store full card numbers.</li>
        <li><strong>Usage:</strong> plan IDs, generation timestamps, tokens balance/usage, device & log data (IP, user‑agent, referrer, events).</li>
        <li><strong>Nutrition & preferences (may include special category health data):</strong> diet types, allergens/intolerances, exclusions, cuisines, goals (weight/height/age/activity), GLP‑1 mode, other preferences you provide.</li>
        <li><strong>Cookies & similar tech:</strong> strictly necessary cookies; consent‑based analytics/marketing cookies; SDKs and pixels as described in our Cookie Policy.</li>
      </ul>

      <h2>Why we process data & legal bases</h2>
      <ul>
        <li><strong>Provide the service (create account, generate content, deliver PDFs, support):</strong> performance of a contract.</li>
        <li><strong>Payments & fraud prevention:</strong> legal obligation and legitimate interests.</li>
        <li><strong>Analytics, A/B tests, marketing:</strong> consent via the cookie banner (for non‑essential cookies/SDKs).</li>
        <li><strong>Nutrition/health‑related inputs:</strong> explicit consent (you can withdraw at any time in Settings or by contacting us). If you withdraw consent, some features may not work.</li>
        <li><strong>Security & abuse prevention:</strong> legitimate interests.</li>
      </ul>

      <h2>Automated decision‑making & profiling</h2>
      <p>
        We use machine‑learning models to suggest meal plans and shopping lists based on your inputs. 
        Output quality can vary. We do not make decisions with legal or similarly significant effects 
        without human review.
      </p>

      <h2>How we share data</h2>
      <ul>
        <li><strong>Processors (on our instructions):</strong> cloud hosting, database, email service, analytics (only with consent), payment service provider (PSP), error monitoring, LLM/AI vendors (to process your prompts and generate plans), and PDF generation/rendering tools.</li>
        <li>When required by law or to protect rights, safety or security.</li>
        <li><strong>Business transfers:</strong> if we undergo a reorganisation, merger or sale.</li>
      </ul>

      <h2>International transfers</h2>
      <p>
        Some processors may be outside the UK. Where required, we use an appropriate transfer 
        mechanism and risk assessment (e.g. UK IDTA / UK addendum to SCCs). See the 
        “Subprocessors & Data Locations” page.
      </p>
      
      <h2>How long we keep data (retention)</h2>
      <ul>
        <li><strong>Account & billing records:</strong> for as long as you have an account and as required by tax/accounting law (typically 6 years in the UK).</li>
        <li><strong>Tokens & plans metadata:</strong> for account history and audit, until deletion request.</li>
        <li><strong>Health‑related inputs:</strong> until you delete them or withdraw consent.</li>
        <li><strong>Logs:</strong> typically 90 days (security), aggregated analytics longer (if consented).</li>
      </ul>
      
      <h2>Your rights (UK GDPR)</h2>
      <p>
        Access; rectification; erasure; restriction; portability; objection (incl. to direct marketing); 
        withdraw consent at any time. You can exercise rights via info@shapeai.co.uk. You also have 
        a right to complain to the ICO (ico.org.uk) if you are unhappy with how we use your data.
      </p>
      
      <h2>Children</h2>
      <p>
        Our service is not directed to children. You must be 16+ (or older if required by your country). 
        We do not knowingly collect personal data from children.
      </p>
      
      <h2>Contact & DPO</h2>
      <p>
        Data controller: PREPARING BUSINESS LTD.
        <br />
        DPO/Privacy contact: info@shapeai.co.uk · +44 7822016497.
      </p>
      
      <h2>Changes to this policy</h2>
      <p>
        We will post updates on this page and, where appropriate, notify you in‑app or via email.
      </p>
    </>
  );
}