"use client";

import { ArrowRight } from "lucide-react";
import type { AllocationResult, UserInfo } from "../lib/types";

const ADVISOR_EMAIL = "juliana.mlrenault@gmail.com";

function formatBrl(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n);
}

function buildMailto(result: AllocationResult, userInfo: UserInfo | null) {
  const name = userInfo?.name ?? "(name not provided)";
  const subject = `Decade — Suitability result for ${name}`;
  const lines = [
    "Hello,",
    "",
    "I just completed the Decade AI suitability interview and would like to discuss my recommended portfolio.",
    "",
    "--- My contact information ---",
    `Name:  ${userInfo?.name ?? "(not provided)"}`,
    `Email: ${userInfo?.email ?? "(not provided)"}`,
    `Phone: ${userInfo?.phone ?? "(not provided)"}`,
    "",
    "--- My suitability result ---",
    `Profile:      ${result.profile.label}`,
    `Total assets: ${formatBrl(result.totalAssetsBrl)}`,
    "",
    "Allocation:",
    ...result.buckets
      .filter((b) => b.pct > 0)
      .map((b) => `  - ${b.label}: ${b.pct.toFixed(1)}% (${formatBrl(b.amountBrl)})`),
  ];

  if (result.flags.length > 0) {
    lines.push("", "Flags for advisor conversation:");
    for (const f of result.flags) {
      lines.push(`  - ${f.label}: ${f.note}`);
    }
  }

  lines.push("", "Looking forward to hearing from you.", "");

  const body = lines.join("\n");
  return `mailto:${ADVISOR_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export default function AdvisorContactCTA({
  result,
  userInfo,
}: {
  result: AllocationResult;
  userInfo: UserInfo | null;
}) {
  const mailtoHref = buildMailto(result, userInfo);

  return (
    <div className="border-t border-[var(--line)] pt-6 mt-8">
      <a href={mailtoHref} className="cta-primary no-underline">
        Discuss this with a Decade Advisor
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
