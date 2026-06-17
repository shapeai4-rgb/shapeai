import type { Metadata } from "next";
import { LocalizedPolicyPage } from "@/components/legal/LocalizedPolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | ShapeAI",
};

export default function PrivacyPolicyPage() {
  return <LocalizedPolicyPage policy="privacy" />;
}
