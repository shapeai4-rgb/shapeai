import React from "react";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { formatMessage, getMessages } from "@/i18n/messages";
import { formatLocalizedDate } from "@/i18n/server";

const BRAND_NAME = "ShapeAI.co.uk";
const COMPANY_LEGAL_NAME = "PREPARING BUSINESS LTD";
const COMPANY_NUMBER = "16107292";
const COMPANY_ADDRESS = "12 Skinner Lane, Leeds, England, LS7 1DL";
const COMPANY_EMAIL = "info@shapeai.co.uk";
const COMPANY_PHONE = "+44 7463 585216";

export type InvoicePdfData = {
  transactionId: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  tokens: number;
  amount: number;
  currency: string;
  description?: string | null;
  locale?: Locale;
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingBottom: 36,
    paddingHorizontal: 40,
    paddingTop: 36,
  },
  hero: {
    backgroundColor: "#10B981",
    borderRadius: 18,
    color: "#FFFFFF",
    marginBottom: 22,
    padding: 24,
  },
  badge: {
    backgroundColor: "#047857",
    borderRadius: 999,
    fontSize: 9,
    marginBottom: 12,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    textTransform: "uppercase",
    width: 124,
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 26,
    marginBottom: 8,
  },
  subtitle: {
    color: "#D1FAE5",
    fontSize: 12,
    lineHeight: 1.6,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
  },
  column: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 18,
  },
  sectionTitle: {
    color: "#475569",
    fontSize: 10,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  bodyText: {
    lineHeight: 1.5,
    marginBottom: 4,
  },
  strong: {
    fontFamily: "Helvetica-Bold",
  },
  table: {
    borderColor: "#E5E7EB",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#ECFDF5",
    borderBottomColor: "#D1FAE5",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  tableRow: {
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  cell: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cellDescription: {
    width: "52%",
  },
  cellQty: {
    textAlign: "right",
    width: "12%",
  },
  cellUnit: {
    textAlign: "right",
    width: "18%",
  },
  cellTotal: {
    textAlign: "right",
    width: "18%",
  },
  totals: {
    marginLeft: "auto",
    marginTop: 14,
    width: 220,
  },
  totalRow: {
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  totalFinal: {
    backgroundColor: "#0F172A",
    borderBottomWidth: 0,
    color: "#FFFFFF",
  },
  footer: {
    color: "#475569",
    fontSize: 10,
    lineHeight: 1.5,
    marginTop: 22,
  },
});

function formatMoney(amount: number, currency: string) {
  return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
}

export function deriveInvoiceNumber(transactionId: string, createdAt: Date) {
  const datePart = [
    createdAt.getUTCFullYear(),
    String(createdAt.getUTCMonth() + 1).padStart(2, "0"),
    String(createdAt.getUTCDate()).padStart(2, "0"),
  ].join("");
  const suffix = transactionId.slice(-6).toUpperCase();
  return `INV-${datePart}-${suffix}`;
}

function InvoicePdfDocument(data: InvoicePdfData) {
  const locale = data.locale ?? DEFAULT_LOCALE;
  const m = getMessages(locale).pdf;
  const invoiceNumber = deriveInvoiceNumber(data.transactionId, data.createdAt);
  const lineDescription =
    data.description?.trim() || formatMessage(m.tokenTopUp, { count: data.tokens });

  return (
    <Document title={`ShapeAI Invoice ${invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.badge}>{m.paidTopUp}</Text>
          <Text style={styles.title}>{m.invoiceReceipt}</Text>
          <Text style={styles.subtitle}>
            {m.subtitle}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.card, styles.column]}>
            <Text style={styles.sectionTitle}>{m.invoiceDetails}</Text>
            <Text style={[styles.bodyText, styles.strong]}>{BRAND_NAME}</Text>
            <Text style={styles.bodyText}>Invoice No: {invoiceNumber}</Text>
            <Text style={styles.bodyText}>{m.paidOn}: {formatLocalizedDate(data.createdAt, locale)}</Text>
            <Text style={styles.bodyText}>{m.status}: {m.paid}</Text>
            <Text style={styles.bodyText}>{m.reference}: {data.transactionId}</Text>
          </View>

          <View style={[styles.card, styles.column]}>
            <Text style={styles.sectionTitle}>{m.seller}</Text>
            <Text style={[styles.bodyText, styles.strong]}>{COMPANY_LEGAL_NAME}</Text>
            <Text style={styles.bodyText}>{m.companyNo}: {COMPANY_NUMBER}</Text>
            <Text style={styles.bodyText}>{COMPANY_ADDRESS}</Text>
            <Text style={styles.bodyText}>{COMPANY_PHONE}</Text>
            <Text style={styles.bodyText}>{COMPANY_EMAIL}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{m.billTo}</Text>
          <Text style={[styles.bodyText, styles.strong]}>{data.customerName}</Text>
          <Text style={styles.bodyText}>{data.customerEmail}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{m.item}</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.cellDescription, styles.strong]}>{m.description}</Text>
              <Text style={[styles.cell, styles.cellQty, styles.strong]}>{m.qty}</Text>
              <Text style={[styles.cell, styles.cellUnit, styles.strong]}>{m.unit}</Text>
              <Text style={[styles.cell, styles.cellTotal, styles.strong]}>{m.totalPaid}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowLast]}>
              <Text style={[styles.cell, styles.cellDescription]}>{lineDescription}</Text>
              <Text style={[styles.cell, styles.cellQty]}>1</Text>
              <Text style={[styles.cell, styles.cellUnit]}>{formatMoney(data.amount, data.currency)}</Text>
              <Text style={[styles.cell, styles.cellTotal]}>{formatMoney(data.amount, data.currency)}</Text>
            </View>
          </View>

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text>{m.subtotal}</Text>
              <Text>{formatMoney(data.amount, data.currency)}</Text>
            </View>
            <View style={[styles.totalRow, styles.totalFinal]}>
              <Text>{m.totalPaid}</Text>
              <Text>{formatMoney(data.amount, data.currency)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          {m.thankYou}
        </Text>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdfBuffer(data: InvoicePdfData) {
  return renderToBuffer(<InvoicePdfDocument {...data} />);
}
