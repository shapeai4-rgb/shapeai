import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | WeightLoss.AI',
};

export default function CookiePolicyPage() {
  return (
    <>
      <h1>Cookie Policy</h1>
      <p><em>Last updated: August 26, 2025</em></p>

      <h2>About cookies & similar technologies</h2>
      <p>
        We use cookies, SDKs and similar technologies to: (i) provide secure sign‑in and 
        tokens checkout; (ii) remember your preferences; (iii) measure usage (with your 
        consent); and (iv) deliver/measure marketing (with your consent).
      </p>

      <h2>Categories we use</h2>
      <ul>
        <li><strong>Strictly necessary (always on):</strong> security, session, load‑balancing, consent records.</li>
        <li><strong>Analytics (consent):</strong> measuring usage and performance; A/B testing.</li>
        <li><strong>Marketing (consent):</strong> ads remarketing, conversions; email/web beacons.</li>
      </ul>

      <h2>Your choices</h2>
      <p>
        On first visit we show a banner with Accept all / Reject all / Manage. You can change 
        your selection anytime in Cookie Settings (footer). Non‑essential cookies are off by 
        default unless you consent. We honour browser ‘reject’/withdrawal immediately.
      </p>

      <h2>What we set</h2>
      <p>
        We maintain a live list in Cookie Settings showing cookie/SDK name, provider, purpose, 
        expiry and type (1st/3rd party). Examples: __Host-session (necessary, session); 
        consent_state (necessary, 6 months); [analytics]_cid (analytics, 12 months); 
        fbp/ttclid/gclid (marketing, variable).
      </p>
    </>
  );
}