import type { AnswerSet } from "./types";

export const DEFAULT_ANSWERS: AnswerSet = {
  age: 30,
  spouseAge: null,
  dependents: 0,
  lifeEvent: [],
  income: "500k_1M",
  spouseIsCLT: false,
  spouseAnnualCLT: 0,
  stability: "all_stable",
  assets: "500k_1M",
  spending: "15k_30k",
  horizon: [],
  homeTiming: null,
  drawdownReaction: "hold",
  priorLoss: "none",
  intl: "meaningful",
  goals: [],
};

export const HENRIQUE_BASELINE: AnswerSet = {
  age: 35,
  spouseAge: 34,
  dependents: 1,
  lifeEvent: ["new_child"],
  income: "1M_2M",
  spouseIsCLT: true,
  spouseAnnualCLT: 480_000,
  stability: "partial_variable",
  assets: "2M_2_9M",
  spending: "30k_50k",
  horizon: ["buy_home", "expand_family", "education_funding"],
  homeTiming: "exploring",
  drawdownReaction: "sell_some",
  priorLoss: "structured",
  intl: "meaningful",
  goals: ["family_security", "generational_wealth", "time_freedom"],
};

export interface Scenario {
  id: string;
  label: string;
  blurb: string;
  apply: (base: AnswerSet) => AnswerSet;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "henrique",
    label: "Henrique baseline",
    blurb: "Default case as described in the brief.",
    apply: (b) => b,
  },
  {
    id: "home_confirmed_12_24m",
    label: "Home confirmed in 12–24 months",
    blurb: "Home moves from undecided to a near-term commitment.",
    apply: (b) => ({ ...b, homeTiming: "likely_1_3y" }),
  },
  {
    id: "drawdown_intolerance",
    label: "Drawdown intolerance confirmed",
    blurb: "After reflection, the client says they would sell everything in a -25% scenario.",
    apply: (b) => ({ ...b, drawdownReaction: "sell_all" }),
  },
  {
    id: "no_home_long_term",
    label: "No home, full long-term",
    blurb: "Client decides not to buy. The home bucket is freed for long-term wealth.",
    apply: (b) => ({
      ...b,
      horizon: b.horizon.filter((h) => h !== "buy_home"),
      homeTiming: null,
    }),
  },
];
