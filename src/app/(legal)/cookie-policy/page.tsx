import type { Metadata } from "next";
import { LocalizedPolicyPage } from "@/components/legal/LocalizedPolicyPage";

export const metadata: Metadata = {
  title: "Cookie Policy | ShapeAI",
};

export default function CookiePolicyPage() {
  return <LocalizedPolicyPage policy="cookies" />;
}
