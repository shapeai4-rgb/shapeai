import type { Metadata } from "next";
import { LocalizedPolicyPage } from "@/components/legal/LocalizedPolicyPage";

export const metadata: Metadata = {
  title: "Refund and Return Policy | ShapeAI",
};

export default function RefundAndReturnPolicyPage() {
  return <LocalizedPolicyPage policy="refunds" />;
}
