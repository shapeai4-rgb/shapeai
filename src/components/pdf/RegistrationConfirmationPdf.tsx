import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

type RegistrationConfirmationPdfProps = {
  firstName: string;
  fullName?: string | null;
  email: string;
  tokenBalance: number;
  createdAt: string;
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 36,
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
    marginBottom: 14,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    textTransform: "uppercase",
    width: 118,
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 26,
    lineHeight: 1.2,
    marginBottom: 10,
  },
  subtitle: {
    color: "#D1FAE5",
    fontSize: 12,
    lineHeight: 1.6,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    marginBottom: 12,
  },
  statGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    borderWidth: 1,
    flexGrow: 1,
    padding: 14,
  },
  statLabel: {
    color: "#475569",
    fontSize: 9,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  statValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
  },
  row: {
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    paddingTop: 8,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    color: "#475569",
  },
  value: {
    fontFamily: "Helvetica-Bold",
    maxWidth: "60%",
    textAlign: "right",
  },
  step: {
    color: "#334155",
    lineHeight: 1.7,
    marginBottom: 10,
  },
  footer: {
    bottom: 18,
    color: "#64748B",
    fontSize: 9,
    left: 36,
    position: "absolute",
    right: 36,
    textAlign: "center",
  },
});

export function RegistrationConfirmationPdf({
  firstName,
  fullName,
  email,
  tokenBalance,
  createdAt,
}: RegistrationConfirmationPdfProps) {
  return (
    <Document title="ShapeAI Registration Confirmation">
      <Page size="A4" style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.badge}>Welcome to ShapeAI</Text>
          <Text style={styles.title}>Registration confirmation</Text>
          <Text style={styles.subtitle}>
            Your ShapeAI account is active. This document confirms your registration
            and records the initial account details issued at signup.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account snapshot</Text>
          <View style={styles.statGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Status</Text>
              <Text style={styles.statValue}>Active</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Starting balance</Text>
              <Text style={styles.statValue}>{tokenBalance} tokens</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registration details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>First name</Text>
            <Text style={styles.value}>{firstName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Full name</Text>
            <Text style={styles.value}>{fullName || firstName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.label}>Registered on</Text>
            <Text style={styles.value}>{createdAt}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next steps</Text>
          <Text style={styles.step}>1. Sign in and open your ShapeAI dashboard.</Text>
          <Text style={styles.step}>2. Generate your first personalised meal plan.</Text>
          <Text style={styles.step}>3. Top up tokens when you want longer or more detailed plans.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <Text style={styles.step}>Website: shapeai.co.uk</Text>
          <Text style={styles.step}>Email: info@shapeai.co.uk</Text>
          <Text style={{ color: "#334155", lineHeight: 1.7 }}>
            Company: PREPARING BUSINESS LTD, 12 Skinner Lane, Leeds, England, LS7 1DL
          </Text>
        </View>

        <Text style={styles.footer}>
          ShapeAI.co.uk · PREPARING BUSINESS LTD · Registration confirmation
        </Text>
      </Page>
    </Document>
  );
}
