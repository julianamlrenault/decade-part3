import {
  ASSETS_AMOUNT_BRL,
  HOME_FACTOR,
  INCOME_TOPS,
  PROFILES,
  SPEND_TOPS,
} from "./questionnaire";
import { HENRIQUE_BASELINE } from "./scenarios";
import type {
  AllocationResult,
  AnswerSet,
  Bucket,
  BucketId,
  Profile,
  ProfileId,
} from "./types";

type ShapeDelta = { core: number; inflation: number; growth: number; global: number };

interface ModifierDef {
  id: string;
  label: string;
  effect: string;
  shapeDelta?: ShapeDelta;
  filter?: string;
  flag?: { label: string; note: string };
  reservePctBonus?: number;
}

const ZERO: ShapeDelta = { core: 0, inflation: 0, growth: 0, global: 0 };

const MODIFIERS: Record<string, ModifierDef> = {
  tolerance_sell_all: {
    id: "tolerance_sell_all",
    label: "Tolerance: sell all on -25%",
    effect: "Strongly reduce growth, lean defensive.",
    shapeDelta: { core: 3, inflation: 5, growth: -10, global: 2 },
    filter: "no_brazil_equity_direct",
  },
  tolerance_sell_some: {
    id: "tolerance_sell_some",
    label: "Tolerance: sell some on -25%",
    effect: "Reduce growth by 3pp in shape, redistribute to inflation and core.",
    shapeDelta: { core: 1, inflation: 2, growth: -3, global: 0 },
  },
  tolerance_buy_more: {
    id: "tolerance_buy_more",
    label: "Tolerance: buy more on -25%",
    effect: "Add 5pp to growth in shape, source from FI and global.",
    shapeDelta: { core: -1.5, inflation: -1.5, growth: 5, global: -2 },
  },
  tolerance_unsure: {
    id: "tolerance_unsure",
    label: "Tolerance: unsure",
    effect: "No allocational change. Flagged for banker review.",
    shapeDelta: ZERO,
    flag: {
      label: "Tolerance unconfirmed",
      note: "Client said 'I'd want to talk to someone'. Default allocation used; banker should validate.",
    },
  },
  intl_brazil_focused: {
    id: "intl_brazil_focused",
    label: "International: not a priority",
    effect: "Reduce global by 2pp in shape.",
    shapeDelta: { core: 0.5, inflation: 1, growth: 0.5, global: -2 },
  },
  intl_meaningful: {
    id: "intl_meaningful",
    label: "International: meaningful exposure",
    effect: "Add 3pp to global in shape, sourced proportionally from FI and growth.",
    shapeDelta: { core: -1, inflation: -1.5, growth: -0.5, global: 3 },
  },
  intl_essential: {
    id: "intl_essential",
    label: "International: essential",
    effect: "Add 8pp to global in shape, sourced proportionally.",
    shapeDelta: { core: -2.5, inflation: -3, growth: -2.5, global: 8 },
  },
  goal_security: {
    id: "goal_security",
    label: "Goal: family security",
    effect: "Add 2pp to inflation, take 1pp from growth and small share from core/global.",
    shapeDelta: { core: -2, inflation: 2, growth: -1, global: 1 },
  },
  goal_succession: {
    id: "goal_succession",
    label: "Goal: generational wealth",
    effect:
      "No allocational change. Flag: discuss term life insurance and family holding structure.",
    shapeDelta: ZERO,
    flag: {
      label: "Discuss succession structure",
      note: "Client signaled generational wealth as a 10-year goal. Banker should review life insurance and holding companies.",
    },
  },
  trauma_structured: {
    id: "trauma_structured",
    label: "Past loss: structured products",
    effect: "Filter: zero COE / autocall / capital-protected notes in core FI.",
    shapeDelta: ZERO,
    filter: "no_coe_autocall",
  },
  trauma_crypto: {
    id: "trauma_crypto",
    label: "Past loss: crypto",
    effect: "Filter: zero speculative alternatives.",
    shapeDelta: ZERO,
    filter: "no_speculative_alts",
  },
  trauma_stocks: {
    id: "trauma_stocks",
    label: "Past loss: individual stocks",
    effect: "Filter: equity exposure via funds only.",
    shapeDelta: ZERO,
    filter: "equity_via_funds_only",
  },
  trauma_intl: {
    id: "trauma_intl",
    label: "Past loss: international",
    effect: "Filter: hedged USD core, no leveraged international exposure.",
    shapeDelta: ZERO,
    filter: "hedged_intl_only",
  },
};

const BUCKET_LABELS: Record<BucketId, string> = {
  reserve: "Liquidity Reserve",
  home: "Home Bucket",
  core: "Core Fixed Income",
  inflation: "Inflation Protection",
  growth: "Wealth Growth",
  global: "Global Diversification",
  pgbl: "Retirement (PGBL)",
};

const BUCKET_ROLES: Record<BucketId, string> = {
  reserve: "Cash and short-duration credit. Buys you the right to ignore the market for 12+ months.",
  home: "Held against a near-term home decision. Sized by how concrete the plan is.",
  core: "Post-fixed FI and high-grade private credit. The portfolio's anchor.",
  inflation: "IPCA-linked sovereigns and inflation-linked private credit.",
  growth: "Brazilian equity and equity funds. Sized to your real drawdown tolerance.",
  global: "USD-denominated equity and credit. Real diversification beyond Brazil.",
  pgbl: "Retirement vehicle, capped by deductibility (12% of CLT income).",
};

const BUCKET_INSTRUMENTS_BASE: Record<BucketId, string[]> = {
  reserve: ["CDB liquidity", "DI funds", "Tesouro Selic"],
  home: ["Tesouro Selic", "Short-duration CDB", "Conservative DI funds"],
  core: ["Post-fixed CDB", "Crédito privado FI", "LCI / LCA"],
  inflation: ["NTN-B 2030–2045", "Inflation-linked debentures"],
  growth: ["Equity FI (active)", "Index FI", "FII (selective)"],
  global: ["Global equity ETFs (USD)", "Global IG credit", "S&P 500 BDR funds"],
  pgbl: ["PGBL multimercado moderado", "PGBL global allocator"],
};

function applyFilters(bucket: BucketId, filters: string[]): string[] {
  let list = [...BUCKET_INSTRUMENTS_BASE[bucket]];
  if (filters.includes("no_coe_autocall") && bucket === "core") {
    list = list.filter((x) => !/COE|autocall|estruturad/i.test(x));
    list.push("(no COE / autocall)");
  }
  if (filters.includes("equity_via_funds_only") && bucket === "growth") {
    list = list.filter((x) => !/direct|individual stocks/i.test(x));
    list.push("(funds only, no direct stocks)");
  }
  if (filters.includes("no_speculative_alts") && bucket === "growth") {
    list.push("(no speculative alts / crypto)");
  }
  if (filters.includes("hedged_intl_only") && bucket === "global") {
    list = list.map((x) => x.replace("ETF", "ETF (hedged)"));
  }
  if (filters.includes("no_brazil_equity_direct") && bucket === "growth") {
    list = ["Equity FI (active)", "(direct Brazilian equity excluded)"];
  }
  return list;
}

function routeProfile(a: AnswerSet): ProfileId {
  const tolerance: "very_low" | "low" | "moderate" | "high" | "unknown" =
    a.drawdownReaction === "sell_all"
      ? "very_low"
      : a.drawdownReaction === "sell_some"
        ? "low"
        : a.drawdownReaction === "hold"
          ? "moderate"
          : a.drawdownReaction === "buy_more"
            ? "high"
            : "unknown";
  const assets = ASSETS_AMOUNT_BRL[a.assets];
  const income = INCOME_TOPS[a.income];
  const spending = SPEND_TOPS[a.spending] * 12;
  const savingsRate = income > 0 ? (income - spending) / income : 0;

  if (a.lifeEvent.includes("new_child") || a.dependents >= 2) return "family_foundation";
  if (assets > 5_000_000 && (a.age >= 50 || a.goals.includes("generational_wealth")))
    return "wealth_preservation";
  if (savingsRate > 0.4 && tolerance !== "high" && a.dependents === 0)
    return "income_optimizer";
  if (a.age < 32 && !a.horizon.includes("buy_home") && (tolerance === "moderate" || tolerance === "high"))
    return "wealth_builder";
  if (tolerance === "high") return "wealth_multiplier";
  return "family_foundation";
}

function snapTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function clampPct(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function reserveBufferMonths(a: AnswerSet): number {
  let buffer = 6;
  if (a.stability === "partial_variable") buffer += 3;
  if (a.stability === "highly_variable" || a.stability === "self_employed") buffer += 6;
  if (a.lifeEvent.includes("new_child")) buffer += 3;
  const dualCltStable = a.spouseIsCLT && a.stability === "all_stable";
  if (dualCltStable) buffer -= 2;
  return Math.max(3, buffer);
}

function activeModifiers(a: AnswerSet): ModifierDef[] {
  const ids: string[] = [];
  ids.push(`tolerance_${a.drawdownReaction}`);
  ids.push(`intl_${a.intl}`);
  if (a.priorLoss !== "none") {
    if (a.priorLoss === "structured") ids.push("trauma_structured");
    if (a.priorLoss === "crypto") ids.push("trauma_crypto");
    if (a.priorLoss === "stocks") ids.push("trauma_stocks");
    if (a.priorLoss === "international") ids.push("trauma_intl");
  }
  if (a.goals.includes("family_security")) ids.push("goal_security");
  if (a.goals.includes("generational_wealth")) ids.push("goal_succession");
  return ids
    .map((id) => MODIFIERS[id])
    .filter((m): m is ModifierDef => Boolean(m));
}

function largestRemainderRound(values: number[], targetSumDoubled: number): number[] {
  const doubled = values.map((v) => v * 2);
  const floors = doubled.map((v) => Math.floor(v));
  const remainders = doubled.map((v, i) => v - floors[i]);
  const currentSum = floors.reduce((a, b) => a + b, 0);
  let needed = Math.round(targetSumDoubled - currentSum);
  const order = remainders
    .map((r, i) => ({ r, i }))
    .sort((a, b) => b.r - a.r);
  const result = [...floors];
  let cursor = 0;
  while (needed > 0 && cursor < order.length) {
    result[order[cursor].i] += 1;
    cursor += 1;
    needed -= 1;
  }
  while (needed < 0 && cursor < order.length) {
    result[order[order.length - 1 - cursor].i] -= 1;
    cursor += 1;
    needed += 1;
  }
  return result.map((v) => v / 2);
}

export function computeAllocation(a: AnswerSet, totalAssetsBrlOverride?: number): AllocationResult {
  const profileId = routeProfile(a);
  const profile: Profile = PROFILES[profileId];

  const totalAssetsBrl = totalAssetsBrlOverride ?? ASSETS_AMOUNT_BRL[a.assets];
  const monthlySpending = SPEND_TOPS[a.spending];
  const annualIncome = INCOME_TOPS[a.income];
  const essentialMonthly = monthlySpending * 0.7;
  const buffer = reserveBufferMonths(a);
  const liquidityReserveBrl = essentialMonthly * buffer;

  let reservePct = (liquidityReserveBrl / totalAssetsBrl) * 100;
  reservePct = clampPct(snapTo(reservePct, 5), 5, 30);

  const wantsHome = a.horizon.includes("buy_home");
  const homeFactor = wantsHome && a.homeTiming ? HOME_FACTOR[a.homeTiming] : 0;
  const homeRaw = profile.homeFullTarget * homeFactor;
  const homePct = snapTo(homeRaw, 0.5);

  const pgblBrl = Math.min(
    a.spouseIsCLT ? a.spouseAnnualCLT * 0.12 : 0,
    (profile.pgblTarget / 100) * totalAssetsBrl,
  );
  let pgblPct = (pgblBrl / totalAssetsBrl) * 100;
  pgblPct = clampPct(snapTo(pgblPct, 0.5), 0, profile.pgblTarget);

  const structuralSum = reservePct + homePct + pgblPct;
  const available = clampPct(100 - structuralSum, 0, 100);

  const modifiers = activeModifiers(a);

  const baseShape = profile.investmentShape;
  const baseShapeSum =
    baseShape.core + baseShape.inflation + baseShape.growth + baseShape.global;
  const shape = {
    core: (baseShape.core / baseShapeSum) * 100,
    inflation: (baseShape.inflation / baseShapeSum) * 100,
    growth: (baseShape.growth / baseShapeSum) * 100,
    global: (baseShape.global / baseShapeSum) * 100,
  };
  for (const m of modifiers) {
    if (!m.shapeDelta) continue;
    shape.core += m.shapeDelta.core;
    shape.inflation += m.shapeDelta.inflation;
    shape.growth += m.shapeDelta.growth;
    shape.global += m.shapeDelta.global;
  }
  shape.core = Math.max(0, shape.core);
  shape.inflation = Math.max(0, shape.inflation);
  shape.growth = Math.max(0, shape.growth);
  shape.global = Math.max(0, shape.global);
  const shapeSum = shape.core + shape.inflation + shape.growth + shape.global;
  const norm = (v: number) => (shapeSum > 0 ? (v / shapeSum) * 100 : 0);
  const finalShape = {
    core: norm(shape.core),
    inflation: norm(shape.inflation),
    growth: norm(shape.growth),
    global: norm(shape.global),
  };

  const rawInv = [
    (finalShape.core * available) / 100,
    (finalShape.inflation * available) / 100,
    (finalShape.growth * available) / 100,
    (finalShape.global * available) / 100,
  ];
  const rounded = largestRemainderRound(rawInv, available * 2);
  const [corePct, inflationPct, growthPct, globalPct] = rounded;

  const filters = modifiers
    .map((m) => m.filter)
    .filter((f): f is string => Boolean(f));

  const orderedIds: BucketId[] = [
    "reserve",
    "home",
    "core",
    "inflation",
    "growth",
    "global",
    "pgbl",
  ];
  const pctById: Record<BucketId, number> = {
    reserve: reservePct,
    home: homePct,
    core: corePct,
    inflation: inflationPct,
    growth: growthPct,
    global: globalPct,
    pgbl: pgblPct,
  };
  const buckets: Bucket[] = orderedIds.map((id) => ({
    id,
    label: BUCKET_LABELS[id],
    pct: pctById[id],
    amountBrl: Math.round((pctById[id] / 100) * totalAssetsBrl),
    role: BUCKET_ROLES[id],
    instruments: applyFilters(id, filters),
  }));

  const flagsList = modifiers
    .map((m) => (m.flag ? { id: m.id, label: m.flag.label, note: m.flag.note } : null))
    .filter((f): f is { id: string; label: string; note: string } => Boolean(f));
  const savingsRate =
    annualIncome > 0
      ? (annualIncome - monthlySpending * 12) / annualIncome
      : 0;
  if (savingsRate > 0.4) {
    flagsList.push({
      id: "high_savings_rate",
      label: `High savings rate (${Math.round(savingsRate * 100)}%)`,
      note: "Capacity is well above tolerance. Growth is revisitable as behavior normalizes.",
    });
  }

  const baselineResult = a === HENRIQUE_BASELINE ? null : computeAllocation(HENRIQUE_BASELINE);
  const deltaFromBaseline =
    baselineResult === null
      ? buckets.map((b) => ({ id: b.id, label: b.label, deltaPct: 0 }))
      : buckets.map((b) => {
          const base = baselineResult.buckets.find((x) => x.id === b.id)!;
          return { id: b.id, label: b.label, deltaPct: +(b.pct - base.pct).toFixed(2) };
        });

  const protective = reservePct + homePct;
  const incomeFI = corePct + inflationPct;
  const longTerm = growthPct + globalPct;

  const topModifiers = modifiers
    .filter((m) => m.shapeDelta && (m.shapeDelta.core || m.shapeDelta.inflation || m.shapeDelta.growth || m.shapeDelta.global))
    .slice(0, 3)
    .map((m) => `${m.label} → ${m.effect}`)
    .join(" ");

  const exclusionLines: string[] = [];
  if (filters.includes("no_coe_autocall")) exclusionLines.push("No structured products (past COE loss).");
  if (filters.includes("equity_via_funds_only")) exclusionLines.push("No direct stocks (equity exposure via funds only).");
  if (filters.includes("no_speculative_alts")) exclusionLines.push("No speculative alternatives or crypto.");
  if (filters.includes("hedged_intl_only")) exclusionLines.push("Hedged USD only; no leveraged international.");
  if (!a.horizon.includes("buy_home")) exclusionLines.push("No home bucket (no near-term home plan).");

  const memo = {
    profile: `You are a ${profile.label.toLowerCase()} investor. ${profile.blurb}`,
    shape: `${protective.toFixed(1)}% in protective buckets (Reserve + Home), ${incomeFI.toFixed(1)}% in income / inflation, ${longTerm.toFixed(1)}% in growth / global. Designed to make you investable again before optimizing returns.`,
    decisions: topModifiers || "Default profile shape applied with no overriding modifiers.",
    exclusions: exclusionLines.length > 0 ? exclusionLines.join(" ") : "No product filters were triggered.",
  };

  return {
    profile,
    buckets,
    totalAssetsBrl,
    activeModifiers: modifiers.map((m) => ({ id: m.id, label: m.label, effect: m.effect })),
    flags: flagsList,
    filters,
    memo,
    deltaFromBaseline,
  };
}

export function expectedHenrique(): Record<BucketId, number> {
  return {
    reserve: 20,
    home: 17.5,
    core: 20.5,
    inflation: 20,
    growth: 9,
    global: 10,
    pgbl: 3,
  };
}
