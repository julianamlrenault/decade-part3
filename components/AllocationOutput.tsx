"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AllocationResult, BucketId } from "../lib/types";

const BUCKET_COLORS: Record<BucketId, string> = {
  reserve: "#6c8db5",
  home: "#c8a978",
  core: "#5a8a7a",
  inflation: "#7fa898",
  growth: "#c97a5a",
  global: "#8a7ab5",
  pgbl: "#b58a5a",
};

function formatBrl(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function AllocationOutput({
  result,
  baselineDelta,
}: {
  result: AllocationResult;
  baselineDelta: boolean;
}) {
  const data = result.buckets
    .filter((b) => b.pct > 0)
    .map((b) => ({ name: b.label, value: b.pct, fill: BUCKET_COLORS[b.id] }));

  const totalPct = result.buckets.reduce((s, b) => s + b.pct, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <span className="eyebrow text-[var(--accent)]">Recommended portfolio</span>
          <h3 className="serif text-[26px] mt-1">{result.profile.label}</h3>
        </div>
        <div className="text-right">
          <div className="eyebrow text-[var(--text-muted)]">Total assets</div>
          <div className="serif text-[20px]">{formatBrl(result.totalAssetsBrl)}</div>
        </div>
      </div>

      <div className="h-60">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={100}
              paddingAngle={1.5}
              strokeWidth={1}
              stroke="#0a0d18"
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => `${(typeof v === "number" ? v : Number(v)).toFixed(1)}%`}
              contentStyle={{
                background: "#141828",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                color: "#f4f3ee",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
        {result.buckets.map((b) => {
          const delta =
            result.deltaFromBaseline.find((d) => d.id === b.id)?.deltaPct ?? 0;
          return (
            <div key={b.id} className="py-3 flex items-baseline gap-3">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0 self-center"
                style={{ background: BUCKET_COLORS[b.id] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[14.5px] text-[var(--text)]">{b.label}</span>
                  <span className="serif text-[18px] tabular-nums">
                    {b.pct.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-0.5">
                  <span className="text-[12px] text-[var(--text-muted)] truncate">
                    {b.role}
                  </span>
                  <span className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0">
                    {formatBrl(b.amountBrl)}
                  </span>
                </div>
                {baselineDelta && delta !== 0 && (
                  <div className="text-[11.5px] mt-0.5 tabular-nums">
                    <span className={delta > 0 ? "text-[#7fc89e]" : "text-[#d99577]"}>
                      {delta > 0 ? "+" : ""}
                      {delta.toFixed(1)}pp vs Henrique baseline
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="py-3 flex items-baseline justify-between">
          <span className="eyebrow text-[var(--text-muted)]">Total</span>
          <span className="serif text-[18px] tabular-nums">
            {totalPct.toFixed(1)}%
          </span>
        </div>
      </div>

      {result.activeModifiers.length > 0 && (
        <div>
          <div className="eyebrow text-[var(--text-muted)] mb-2">
            Active modifiers
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.activeModifiers.map((m) => (
              <span
                key={m.id}
                className="text-[11.5px] px-2.5 py-1 bg-[var(--surface-soft)] border border-[var(--line)] rounded-full text-[var(--text)]"
                title={m.effect}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
