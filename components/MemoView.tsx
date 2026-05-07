"use client";

import { ArrowRight, Flag } from "lucide-react";
import type { AllocationResult, UserInfo } from "../lib/types";

const BANKER_EMAIL = "juliana.mlrenault@gmail.com";

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
    lines.push("", "Flags for banker conversation:");
    for (const f of result.flags) {
      lines.push(`  - ${f.label}: ${f.note}`);
    }
  }

  lines.push("", "Looking forward to hearing from you.", "");

  const body = lines.join("\n");
  return `mailto:${BANKER_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export default function MemoView({
  result,
  userInfo,
}: {
  result: AllocationResult;
  userInfo: UserInfo | null;
}) {
  const mailtoHref = buildMailto(result, userInfo);

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-[var(--accent)]">Recommendation memo</span>
        <h3 className="serif text-[24px] mt-1">The reasoning, in plain language.</h3>
      </div>

      <div className="space-y-5 text-[14.5px] leading-relaxed text-[var(--text)]">
        <Block label="Profile" body={result.memo.profile} />
        <Block label="Portfolio shape" body={result.memo.shape} />
        <Block label="Reserve sizing" body={result.memo.reserve} />
        <Block
          label="Decisions that shaped this allocation"
          body={result.memo.decisions}
        />
        <Block
          label="What is not in this portfolio (and why)"
          body={result.memo.exclusions}
        />
      </div>

      {result.flags.length > 0 && (
        <div className="border-t border-[var(--line)] pt-5">
          <div className="eyebrow text-[var(--text-muted)] mb-3">
            Flags for banker conversation
          </div>
          <ul className="space-y-3">
            {result.flags.map((f) => (
              <li key={f.id} className="flex gap-2.5 text-[13px]">
                <Flag className="w-3.5 h-3.5 text-[var(--accent)] mt-1 shrink-0" />
                <span>
                  <span className="font-medium text-[var(--text)]">{f.label}.</span>{" "}
                  <span className="text-[var(--text-muted)]">{f.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-[var(--line)] pt-6">
        <a
          href={mailtoHref}
          className="inline-flex items-center gap-2 text-[13px] border border-[var(--line-strong)] rounded-full px-4 py-2.5 text-[var(--text)] hover:bg-[var(--surface-soft)] transition"
        >
          Discuss this with a Decade banker
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="eyebrow text-[var(--text-muted)] mb-1.5">{label}</div>
      <p>{body}</p>
    </div>
  );
}
