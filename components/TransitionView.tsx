"use client";

import type { AllocationResult } from "../lib/types";

interface Stage {
  day: string;
  title: string;
  body: string;
}

export default function TransitionView({ result }: { result: AllocationResult }) {
  const reservePct = result.buckets.find((b) => b.id === "reserve")!.pct;
  const homePct = result.buckets.find((b) => b.id === "home")!.pct;
  const corePct = result.buckets.find((b) => b.id === "core")!.pct;
  const inflPct = result.buckets.find((b) => b.id === "inflation")!.pct;
  const growthPct = result.buckets.find((b) => b.id === "growth")!.pct;
  const globalPct = result.buckets.find((b) => b.id === "global")!.pct;
  const pgblPct = result.buckets.find((b) => b.id === "pgbl")!.pct;

  const stages: Stage[] = [
    {
      day: "Day 0–3",
      title: "Free up liquidity and protect cash flow",
      body: `Carve out the ${reservePct.toFixed(1)}% Liquidity Reserve from the existing fund. CDB liquidity + DI funds. The household stops being one event away from liquidating the rest.`,
    },
    {
      day: "Day 3–7",
      title: "Stand up the long-term core",
      body: `Move ${(corePct + inflPct).toFixed(1)}% into the income / inflation engine: post-fixed credit and IPCA-linked sovereigns. This is where compounding actually happens.`,
    },
    {
      day: "Day 7–14",
      title: "Earmark the home bucket",
      body:
        homePct > 0
          ? `Park ${homePct.toFixed(1)}% in short-duration FI dedicated to the home decision. Sized to current commitment, not full intent.`
          : "No home bucket this round. The pp is redeployed into the long-term engine.",
    },
    {
      day: "Day 14–21",
      title: "Stage growth and global",
      body: `Phase in ${growthPct.toFixed(1)}% growth and ${globalPct.toFixed(1)}% global over multiple weeks rather than at once. Avoids entry concentration and lets the household feel the volatility on a small position first.`,
    },
    {
      day: "Day 21–30",
      title: "Open PGBL and finalize",
      body: `Open the ${pgblPct.toFixed(1)}% PGBL, capped by deductibility. Confirm filters: ${result.filters.length > 0 ? result.filters.join(", ") : "none active"}.`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-[var(--accent)]">30-day transition</span>
        <h3 className="serif text-[24px] mt-1">
          From one fund to a structured portfolio, staged.
        </h3>
        <p className="text-[13.5px] text-[var(--text-muted)] mt-2 leading-relaxed">
          The full allocation is not implemented in one trade. Stages reduce execution
          risk and let the household feel each layer as it lands.
        </p>
      </div>

      <ol className="border-l border-[var(--line)] space-y-6 pl-6 ml-1.5">
        {stages.map((s, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[var(--bg)] border-2 border-[var(--accent)]" />
            <div className="eyebrow text-[var(--text-muted)] mb-1.5">{s.day}</div>
            <div className="serif text-[18px] mb-1.5">{s.title}</div>
            <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
