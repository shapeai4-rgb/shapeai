import type { Metadata } from "next";
import { LocalizedPolicyPage } from "@/components/legal/LocalizedPolicyPage";

export const metadata: Metadata = {
  title: "Medical & Nutrition Disclaimer | ShapeAI",
};

export default function MedicalDisclaimerPage() {
  return <LocalizedPolicyPage policy="medical" />;
}
