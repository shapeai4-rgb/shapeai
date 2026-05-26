import type { Metadata } from "next";
import { LocalizedPolicyPage } from "@/components/legal/LocalizedPolicyPage";

export const metadata: Metadata = {
  title: "AI Use & Safety Policy | ShapeAI",
};

export default function AiUseSafetyPolicyPage() {
  return <LocalizedPolicyPage policy="aiSafety" />;
}
