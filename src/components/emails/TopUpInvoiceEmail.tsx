import React from "react";
import {
  Body,
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

type TopUpInvoiceEmailProps = {
  customerName: string;
  amountLabel: string;
  invoiceNumber: string;
  locale?: Locale;
  transactionId: string;
};

export function TopUpInvoiceEmail({
  customerName,
  amountLabel,
  invoiceNumber,
  locale = DEFAULT_LOCALE,
  transactionId,
}: TopUpInvoiceEmailProps) {
  const m = getMessages(locale).email.invoice;

  return (
    <Html>
      <Head />
      <Preview>{m.attached}</Preview>
      <Body style={{ backgroundColor: "#ECFDF5", fontFamily: "Arial, sans-serif", margin: 0, padding: "32px 16px" }}>
        <Container
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "24px",
            margin: "0 auto",
            maxWidth: "680px",
            overflow: "hidden",
          }}
        >
          <Section style={{ background: "linear-gradient(135deg,#047857 0%,#10B981 100%)", color: "#FFFFFF", padding: "36px 40px 28px" }}>
            <Text
              style={{
                backgroundColor: "rgba(255,255,255,0.16)",
                borderRadius: "999px",
                color: "#FFFFFF",
                display: "inline-block",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                margin: 0,
                padding: "8px 12px",
                textTransform: "uppercase",
              }}
            >
              {m.paidTopUp}
            </Text>
            <Heading as="h1" style={{ color: "#FFFFFF", fontSize: "32px", fontWeight: 800, lineHeight: "1.15", margin: "18px 0 12px" }}>
              {m.ready}
            </Heading>
            <Text style={{ color: "rgba(255,255,255,0.88)", fontSize: "16px", lineHeight: "1.7", margin: 0 }}>
              {m.attached}
            </Text>
          </Section>

          <Section style={{ padding: "32px 40px" }}>
            <Text style={{ color: "#0F172A", fontSize: "15px", lineHeight: "1.7", margin: "0 0 16px" }}>
              {formatMessage(m.greeting, { name: customerName })}
            </Text>
            <Text style={{ color: "#334155", fontSize: "15px", lineHeight: "1.7", margin: "0 0 20px" }}>
              {formatMessage(m.paymentCompleted, { amount: amountLabel })}
            </Text>

            <div
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #E5E7EB",
                borderRadius: "18px",
                padding: "18px",
              }}
            >
              <Text style={{ color: "#475569", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 8px", textTransform: "uppercase" }}>
                {m.details}
              </Text>
              <Text style={{ color: "#0F172A", fontSize: "16px", fontWeight: 800, margin: "0 0 6px" }}>
                {invoiceNumber}
              </Text>
              <Text style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                {m.transactionRef}: {transactionId}
              </Text>
            </div>

            <Hr style={{ borderColor: "#E5E7EB", margin: "24px 0 18px" }} />
            <Text style={{ color: "#64748B", fontSize: "13px", lineHeight: "1.7", margin: 0 }}>
              {m.billingQuestions}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
