import { computeAllocation, expectedHenrique } from "../lib/allocation-engine";
import { DEFAULT_ANSWERS, HENRIQUE_BASELINE, SCENARIOS } from "../lib/scenarios";
import type { AnswerSet } from "../lib/types";

let failed = 0;

function check(label: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`PASS  ${label}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${label}${detail ? ` :: ${detail}` : ""}`);
  }
}

function approxEq(a: number, b: number, tol = 0.01) {
  return Math.abs(a - b) < tol;
}

function nearlyOneHundred(label: string, sum: number) {
  check(`${label} sums to 100 (got ${sum.toFixed(2)})`, approxEq(sum, 100, 0.01));
}

const henrique = computeAllocation(HENRIQUE_BASELINE);
const expected = expectedHenrique();
console.log("\n=== Henrique baseline ===");
for (const b of henrique.buckets) {
  const exp = expected[b.id];
  check(
    `Henrique ${b.id} = ${exp}% (got ${b.pct})`,
    approxEq(b.pct, exp, 0.001),
    `delta ${(b.pct - exp).toFixed(2)}`,
  );
}
nearlyOneHundred("Henrique", henrique.buckets.reduce((s, b) => s + b.pct, 0));
check(
  "Henrique routes to Family Foundation",
  henrique.profile.id === "family_foundation",
  henrique.profile.id,
);
check(
  "Henrique flags include succession",
  henrique.flags.some((f) => f.id === "goal_succession"),
);
check(
  "Henrique filters include no_coe_autocall",
  henrique.filters.includes("no_coe_autocall"),
);

console.log("\n=== Scenarios ===");
for (const s of SCENARIOS) {
  const answers = s.apply(HENRIQUE_BASELINE);
  const r = computeAllocation(answers);
  const sum = r.buckets.reduce((acc, b) => acc + b.pct, 0);
  console.log(
    `${s.id.padEnd(28)} ${r.buckets.map((b) => `${b.id}:${b.pct}`).join("  ")}  sum=${sum.toFixed(2)}`,
  );
  nearlyOneHundred(s.id, sum);
}

const homeConfirmed = computeAllocation(SCENARIOS[1].apply(HENRIQUE_BASELINE));
check(
  "home_confirmed_12_24m: Home Bucket increases",
  homeConfirmed.buckets.find((b) => b.id === "home")!.pct > 17.5,
);

const drawdownIntol = computeAllocation(SCENARIOS[2].apply(HENRIQUE_BASELINE));
check(
  "drawdown_intolerance: Growth decreases",
  drawdownIntol.buckets.find((b) => b.id === "growth")!.pct < 9,
);

const noHome = computeAllocation(SCENARIOS[3].apply(HENRIQUE_BASELINE));
check(
  "no_home_long_term: Home = 0",
  noHome.buckets.find((b) => b.id === "home")!.pct === 0,
);
check(
  "no_home_long_term: Core FI larger than baseline",
  noHome.buckets.find((b) => b.id === "core")!.pct > 20.5,
);

// ---------- Simulated chat journey ----------
// This mirrors what the InterviewFlow does when a user walks through the chat
// answering exactly as Henrique would. It must produce HENRIQUE_BASELINE
// and the slide 6 allocation.

console.log("\n=== Simulated chat journey (Henrique answers) ===");

let ans: AnswerSet = { ...DEFAULT_ANSWERS };

// Q1 — household
ans = { ...ans, age: 35 };
// partner age handler also auto-derives spouseIsCLT and spouseAnnualCLT
const partnerAge = 34;
ans = {
  ...ans,
  spouseAge: partnerAge,
  spouseIsCLT: true,
  spouseAnnualCLT: 480_000,
};
ans = { ...ans, dependents: 1 };
// life event: toggle "new_child" — empty array → ["new_child"]
ans = { ...ans, lifeEvent: ["new_child"] };

// Q2 — income + stability
ans = { ...ans, income: "1M_2M" };
ans = { ...ans, stability: "partial_variable" };

// Q3 — assets (new band structure: R$2M lower edge of "R$ 2M – 2.9M")
ans = { ...ans, assets: "2M_2_9M" };

// Q4 — spending
ans = { ...ans, spending: "30k_50k" };

// Q5 — horizon (multi-select)
ans = { ...ans, horizon: ["buy_home", "expand_family", "education_funding"] };

// Q6 — home timing (since buy_home is in horizon)
ans = { ...ans, homeTiming: "exploring" };

// Q7 — drawdown
ans = { ...ans, drawdownReaction: "sell_some" };

// Q8 — prior loss
ans = { ...ans, priorLoss: "structured" };

// Q9 — international
ans = { ...ans, intl: "meaningful" };

// Q10 — goals (max 3)
ans = {
  ...ans,
  goals: ["family_security", "generational_wealth", "time_freedom"],
};

// 1. Resulting AnswerSet must equal HENRIQUE_BASELINE field-by-field.
const baselineKeys = Object.keys(HENRIQUE_BASELINE) as (keyof AnswerSet)[];
for (const key of baselineKeys) {
  const a = JSON.stringify(ans[key]);
  const b = JSON.stringify(HENRIQUE_BASELINE[key]);
  check(`Chat journey produces HENRIQUE_BASELINE.${String(key)}`, a === b, `chat=${a} baseline=${b}`);
}

// 2. The allocation from the chat-built answers must equal slide 6 exactly.
const journeyResult = computeAllocation(ans);
console.log("Chat journey allocation:");
for (const b of journeyResult.buckets) {
  const exp = expected[b.id];
  check(
    `Chat journey ${b.id} = ${exp}% (got ${b.pct})`,
    approxEq(b.pct, exp, 0.001),
    `delta ${(b.pct - exp).toFixed(2)}`,
  );
}
nearlyOneHundred(
  "Chat journey total",
  journeyResult.buckets.reduce((s, b) => s + b.pct, 0),
);

console.log(`\n${failed === 0 ? "OK" : "FAILED"} (${failed} failures)\n`);
process.exit(failed === 0 ? 0 : 1);
