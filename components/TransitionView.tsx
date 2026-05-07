"use client";

import type { AllocationResult, BucketId } from "../lib/types";

interface Stage {
  day: string;
  title: string;
  body: string;
}

export default function TransitionView({ result }: { result: AllocationResult }) {
  const pct = (id: BucketId) =>
    result.buckets.find((b) => b.id === id)?.pct ?? 0;

  const reservePct = pct("reserve");
  const homePct = pct("home");
  const corePct = pct("core");
  const inflPct = pct("inflation");
  const growthPct = pct("growth");
  const globalPct = pct("global");
  const pgblPct = pct("pgbl");

  const stages: Stage[] = [];

  if (reservePct > 0) {
    stages.push({
      day: "Day 0–3",
      title: "Free up liquidity and protect cash flow",
      body: `Carve out the ${reservePct.toFixed(1)}% Liquidity Reserve from the existing fund. CDB liquidity + DI funds. The household stops being one event away from liquidating the rest.`,
    });
  }

  if (corePct + inflPct > 0) {
    const parts: string[] = [];
    if (corePct > 0) parts.push(`${corePct.toFixed(1)}% post-fixed credit`);
    if (inflPct > 0) parts.push(`${inflPct.toFixed(1)}% IPCA-linked sovereigns`);
    stages.push({
      day: "Day 3–7",
      title: "Stand up the long-term core",
      body: `Move ${(corePct + inflPct).toFixed(1)}% into the income / inflation engine: ${parts.join(" + ")}. This is where compounding actually happens.`,
    });
  }

  if (homePct > 0) {
    stages.push({
      day: "Day 7–14",
      title: "Earmark the home bucket",
      body: `Park ${homePct.toFixed(1)}% in short-duration FI dedicated to the home decision. Sized to current commitment, not full intent.`,
    });
  }

  if (growthPct > 0 || globalPct > 0) {
    const parts: string[] = [];
    if (growthPct > 0) parts.push(`${growthPct.toFixed(1)}% growth`);
    if (globalPct > 0) parts.push(`${globalPct.toFixed(1)}% global`);
    const title =
      growthPct > 0 && globalPct > 0
        ? "Stage growth and global"
        : growthPct > 0
          ? "Stage growth"
          : "Stage global";
    stages.push({
      day: "Day 14–21",
      title,
      body: `Phase in ${parts.join(" and ")} over multiple weeks rather than at once. Avoids entry concentration and lets the household feel the volatility on a small position first.`,
    });
  }

  if (pgblPct > 0) {
    stages.push({
      day: "Day 21–30",
      title: "Open PGBL and finalize",
      body: `Open the ${pgblPct.toFixed(1)}% PGBL, capped by deductibility.`,
    });
  } else if (result.filters.length > 0) {
    stages.push({
      day: "Day 21–30",
      title: "Finalize",
      body: "",
    });
  }

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
            {s.body && (
              <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed">
                {s.body}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
