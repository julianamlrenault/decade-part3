import type {
  AnswerSet,
  AssetsBand,
  IncomeBand,
  Profile,
  ProfileId,
  SpendBand,
} from "./types";

export const INCOME_TOPS: Record<IncomeBand, number> = {
  lt_200k: 200_000,
  "200k_500k": 500_000,
  "500k_1M": 1_000_000,
  "1M_2M": 2_000_000,
  gt_2M: 3_000_000,
};

// For asset ranges we use the LOWER edge of the band, so a user who picks
// "R$ 2M – 2.9M" sees the engine compute against R$ 2M (matching the case
// brief's Henrique exactly). Top-of-band is reserved for income and spending,
// where it acts as a conservative cushion.
export const ASSETS_AMOUNT_BRL: Record<AssetsBand, number> = {
  lt_500k: 500_000,
  "500k_1M": 500_000,
  "1M_1_9M": 1_000_000,
  "2M_2_9M": 2_000_000,
  "3M_4_9M": 3_000_000,
  gt_5M: 5_000_000,
};

// Spending bands now represent ESSENTIAL fixed expenses only (rent, utilities,
// food, school, healthcare, basic transport — things that can't be paused).
// We use the LOWER edge of each band so picking "R$ 30k – 50k" means the
// engine reads R$ 30k. Aligns with how the assets bands work.
export const SPEND_AMOUNT_BRL: Record<SpendBand, number> = {
  lt_15k: 15_000,
  "15k_30k": 15_000,
  "30k_50k": 30_000,
  "50k_80k": 50_000,
  gt_80k: 80_000,
};

export const PROFILES: Record<ProfileId, Profile> = {
  wealth_builder: {
    id: "wealth_builder",
    label: "Wealth Builder",
    blurb:
      "Under 32, no dependents, long horizon. Tilted toward growth and global diversification.",
    homeFullTarget: 5,
    pgblTarget: 10,
    investmentShape: { core: 16, inflation: 17, growth: 33, global: 34 },
  },
  family_foundation: {
    id: "family_foundation",
    label: "Family Foundation",
    blurb:
      "Building family wealth: stable core, inflation protection, and a sized home bucket. Behavioral discipline matters more than chasing return.",
    homeFullTarget: 35,
    pgblTarget: 8,
    investmentShape: { core: 36, inflation: 31, growth: 20, global: 13 },
  },
  income_optimizer: {
    id: "income_optimizer",
    label: "Income Optimizer",
    blurb:
      "High savings rate, no dependents. Capacity exceeds tolerance: prioritize compounding without forcing risk.",
    homeFullTarget: 25,
    pgblTarget: 12,
    investmentShape: { core: 32, inflation: 28, growth: 22, global: 18 },
  },
  wealth_preservation: {
    id: "wealth_preservation",
    label: "Wealth Preservation",
    blurb:
      "R$5M+, focus on preserving and transferring. Capital protection over capital growth.",
    homeFullTarget: 5,
    pgblTarget: 8,
    investmentShape: { core: 36, inflation: 34, growth: 11, global: 19 },
  },
  wealth_multiplier: {
    id: "wealth_multiplier",
    label: "Wealth Multiplier",
    blurb:
      "High tolerance, long horizon, sophisticated. Engineered for compounding and global exposure.",
    homeFullTarget: 5,
    pgblTarget: 10,
    investmentShape: { core: 14, inflation: 13, growth: 36, global: 37 },
  },
};

export const HOME_FACTOR: Record<string, number> = {
  decided_lt_12mo: 1.0,
  likely_1_3y: 0.85,
  considering_3_5y: 0.65,
  exploring: 0.5,
  dreaming: 0.25,
};

export const QUESTIONS = [
  {
    id: "q1",
    title: "Tell us about your household",
    helper:
      "Age, partner, dependents and any major life event in the next 12 months.",
  },
  {
    id: "q2",
    title: "Annual household income & stability",
    helper: "Combined gross income and how predictable it is.",
  },
  {
    id: "q3",
    title: "Current investable assets",
    helper: "Excludes your primary residence.",
  },
  {
    id: "q4",
    title: "Typical monthly spending",
    helper:
      "Total household spending in a normal month: housing, food, school, healthcare, transport, travel, leisure.",
  },
  {
    id: "q5",
    title: "What is on your horizon in the next 5 years?",
    helper: "Pick everything that applies.",
  },
  {
    id: "q6",
    title: "When are you planning to buy?",
    helper: "Asked only if you intend to buy or upgrade your home.",
  },
  {
    id: "q7",
    title: "Your portfolio drops 25% over six months. Most likely reaction?",
    helper:
      "We measure how a drawdown actually feels, not how you would like to react.",
  },
  {
    id: "q8",
    title: "Have you ever lost significant money on a specific product?",
    helper: "We use this as a product filter, not a label on you.",
  },
  {
    id: "q9",
    title: "How important is international diversification?",
    helper: "Brazil is concentrated. We size USD exposure deliberately.",
  },
  {
    id: "q10",
    title: "What does financial success look like in 10 years?",
    helper: "Pick up to three.",
  },
] as const;

export const INFO_SCREENS: Record<string, { title: string; body: string }> = {
  before_q1: {
    title: "Three decisions matter more than stock-picking",
    body: "Over a 10-year horizon, what shapes wealth outcomes most isn't *which* assets you pick. It is: (1) how much you reserve for liquidity, (2) how much you protect against inflation, (3) how much you diversify outside Brazil. We'll cover all three.",
  },
  before_q5: {
    title: "One portfolio for many goals = goals in conflict",
    body: "Most Brazilian investors use a single allocation for objectives with very different horizons: liquidity in 6 months, a home in 3 years, retirement in 25. The result is predictable: either under-liquid when life happens, or under-allocated when long-term matters most.",
  },
  before_q7: {
    title: "Brazilian equity had 8 drawdowns greater than 15% in the last 25 years",
    body: "The average investor underperformed CDI, not because the asset failed, but because the reaction did. The question that matters is not 'can you handle volatility?' it is 'at what point does a drop start to mess with your sleep?'",
  },
};
