import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { formatMessage, getMessages } from "@/i18n/messages";

type RegistrationConfirmationEmailProps = {
  firstName: string;
  email: string;
  tokenBalance: number;
  dashboardUrl: string;
  locale?: Locale;
  supportEmail: string;
};

const colors = {
  accent: "#10B981",
  accentDark: "#047857",
  ink: "#0F172A",
  slate: "#475569",
  mist: "#F8FAFC",
  line: "#E5E7EB",
};

const shell = {
  backgroundColor: "#ECFDF5",
  fontFamily: "Arial, sans-serif",
  margin: 0,
  padding: "32px 16px",
};

const card = {
  backgroundColor: "#FFFFFF",
  border: `1px solid ${colors.line}`,
  borderRadius: "24px",
  margin: "0 auto",
  maxWidth: "680px",
  overflow: "hidden" as const,
};

const hero = {
  background: `linear-gradient(135deg, ${colors.accentDark} 0%, ${colors.accent} 100%)`,
  color: "#FFFFFF",
  padding: "36px 40px 28px",
};

const badge = {
  backgroundColor: "rgba(255,255,255,0.16)",
  borderRadius: "999px",
  color: "#FFFFFF",
  display: "inline-block",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  padding: "8px 12px",
  textTransform: "uppercase" as const,
};

const section = {
  padding: "32px 40px",
};

const statCard = {
  backgroundColor: colors.mist,
  border: `1px solid ${colors.line}`,
  borderRadius: "18px",
  padding: "18px",
};

const statLabel = {
  color: colors.slate,
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
};

const statValue = {
  color: colors.ink,
  fontSize: "22px",
  fontWeight: 800,
  margin: 0,
};

export function RegistrationConfirmationEmail({
  firstName,
  email,
  tokenBalance,
  dashboardUrl,
  locale = DEFAULT_LOCALE,
  supportEmail,
}: RegistrationConfirmationEmailProps) {
  const m = getMessages(locale).email.registration;

  return (
    <Html>
      <Head />
      <Preview>{m.created}</Preview>
      <Body style={shell}>
        <Container style={card}>
          <Section style={hero}>
            <Text style={badge}>{m.welcome}</Text>
            <Heading
              as="h1"
              style={{
                color: "#FFFFFF",
                fontSize: "34px",
                fontWeight: 800,
                lineHeight: "1.15",
                margin: "18px 0 12px",
              }}
            >
              {formatMessage(m.accountReady, { name: firstName })}
            </Heading>
            <Text
              style={{
                color: "rgba(255,255,255,0.88)",
                fontSize: "16px",
                lineHeight: "1.7",
                margin: 0,
                maxWidth: "520px",
              }}
            >
              {m.body}
            </Text>
          </Section>

          <Section style={section}>
            <div style={{ display: "grid", gap: "16px", marginBottom: "28px" }}>
              <div style={statCard}>
                <Text style={statLabel}>{m.accountStatus}</Text>
                <Text style={statValue}>{m.active}</Text>
              </div>
              <div style={statCard}>
                <Text style={statLabel}>{m.registeredEmail}</Text>
                <Text style={{ ...statValue, fontSize: "18px", wordBreak: "break-word" as const }}>
                  {email}
                </Text>
              </div>
              <div style={statCard}>
                <Text style={statLabel}>{m.startingBalance}</Text>
                <Text style={statValue}>{tokenBalance} tokens</Text>
              </div>
            </div>

            <div
              style={{
                backgroundColor: colors.mist,
                border: `1px solid ${colors.line}`,
                borderRadius: "20px",
                marginBottom: "28px",
                padding: "22px 24px",
              }}
            >
              <Text style={{ color: colors.ink, fontSize: "14px", fontWeight: 800, margin: "0 0 14px" }}>
                {m.accountDetails}
              </Text>
              <Text style={{ color: colors.slate, fontSize: "15px", lineHeight: "1.7", margin: 0 }}>
                {m.transactional}
              </Text>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <Button
                href={dashboardUrl}
                style={{
                  backgroundColor: colors.accentDark,
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  marginRight: "12px",
                  padding: "14px 22px",
                  textDecoration: "none",
                }}
              >
                {m.dashboard}
              </Button>
            </div>

            <Hr style={{ borderColor: colors.line, margin: "0 0 18px" }} />
            <Text style={{ color: colors.slate, fontSize: "13px", lineHeight: "1.7", margin: 0 }}>
              {formatMessage(m.footer, { email: supportEmail })}
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: colors.mist,
              borderTop: `1px solid ${colors.line}`,
              color: colors.slate,
              fontSize: "12px",
              padding: "18px 40px",
            }}
          >
            ShapeAI.co.uk · PREPARING BUSINESS LTD
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
