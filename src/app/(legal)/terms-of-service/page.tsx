import type { Metadata } from "next";
import { LocalizedPolicyPage } from "@/components/legal/LocalizedPolicyPage";

export const metadata: Metadata = {
  title: "Terms and Conditions | ShapeAI",
};

export default function TermsAndConditionsPage() {
  return <LocalizedPolicyPage policy="terms" />;
}
