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

type TopUpInvoiceEmailProps = {
  customerName: string;
  amountLabel: string;
  invoiceNumber: string;
  transactionId: string;
};

export function TopUpInvoiceEmail({
  customerName,
  amountLabel,
  invoiceNumber,
  transactionId,
}: TopUpInvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your ShapeAI invoice is attached.</Preview>
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
              Paid top-up
            </Text>
            <Heading as="h1" style={{ color: "#FFFFFF", fontSize: "32px", fontWeight: 800, lineHeight: "1.15", margin: "18px 0 12px" }}>
              Your ShapeAI invoice is ready.
            </Heading>
            <Text style={{ color: "rgba(255,255,255,0.88)", fontSize: "16px", lineHeight: "1.7", margin: 0 }}>
              We have attached the PDF invoice for your successful token purchase.
            </Text>
          </Section>

          <Section style={{ padding: "32px 40px" }}>
            <Text style={{ color: "#0F172A", fontSize: "15px", lineHeight: "1.7", margin: "0 0 16px" }}>
              Hi {customerName},
            </Text>
            <Text style={{ color: "#334155", fontSize: "15px", lineHeight: "1.7", margin: "0 0 20px" }}>
              Your payment was completed successfully. The attached invoice covers a
              top-up totalling {amountLabel}.
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
                Invoice details
              </Text>
              <Text style={{ color: "#0F172A", fontSize: "16px", fontWeight: 800, margin: "0 0 6px" }}>
                {invoiceNumber}
              </Text>
              <Text style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Transaction reference: {transactionId}
              </Text>
            </div>

            <Hr style={{ borderColor: "#E5E7EB", margin: "24px 0 18px" }} />
            <Text style={{ color: "#64748B", fontSize: "13px", lineHeight: "1.7", margin: 0 }}>
              If you have any billing questions, contact info@shapeai.co.uk.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
