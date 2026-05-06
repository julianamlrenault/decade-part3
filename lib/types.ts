export type IncomeBand =
  | "lt_200k"
  | "200k_500k"
  | "500k_1M"
  | "1M_2M"
  | "gt_2M";

export type AssetsBand =
  | "lt_500k"
  | "500k_1M"
  | "1M_1_9M"
  | "2M_2_9M"
  | "3M_4_9M"
  | "gt_5M";

export type SpendBand =
  | "lt_15k"
  | "15k_30k"
  | "30k_50k"
  | "50k_80k"
  | "gt_80k";

export type Stability =
  | "all_stable"
  | "partial_variable"
  | "highly_variable"
  | "self_employed";

export type LifeEvent =
  | "new_child"
  | "marriage"
  | "property_purchase"
  | "career_change"
  | "inheritance"
  | "none";

export type HorizonItem =
  | "buy_home"
  | "expand_family"
  | "education_funding"
  | "career_break"
  | "early_retirement"
  | "wealth_transfer"
  | "none";

export type HomeTiming =
  | "decided_lt_12mo"
  | "likely_1_3y"
  | "considering_3_5y"
  | "exploring"
  | "dreaming";

export type DrawdownReaction =
  | "sell_all"
  | "sell_some"
  | "hold"
  | "buy_more"
  | "unsure";

export type PriorLoss =
  | "none"
  | "stocks"
  | "structured"
  | "crypto"
  | "international"
  | "other";

export type Intl = "brazil_focused" | "meaningful" | "essential";

export type Goal =
  | "time_freedom"
  | "net_worth_target"
  | "generational_wealth"
  | "passive_income"
  | "family_security"
  | "financial_independence";

export interface AnswerSet {
  age: number;
  spouseAge: number | null;
  dependents: 0 | 1 | 2 | 3;
  lifeEvent: LifeEvent[];
  income: IncomeBand;
  spouseIsCLT: boolean;
  spouseAnnualCLT: number;
  stability: Stability;
  assets: AssetsBand;
  spending: SpendBand;
  horizon: HorizonItem[];
  homeTiming: HomeTiming | null;
  drawdownReaction: DrawdownReaction;
  priorLoss: PriorLoss;
  intl: Intl;
  goals: Goal[];
}

export type ProfileId =
  | "wealth_builder"
  | "family_foundation"
  | "income_optimizer"
  | "wealth_preservation"
  | "wealth_multiplier";

export interface Profile {
  id: ProfileId;
  label: string;
  blurb: string;
  homeFullTarget: number;
  pgblTarget: number;
  investmentShape: {
    core: number;
    inflation: number;
    growth: number;
    global: number;
  };
}

export type BucketId =
  | "reserve"
  | "home"
  | "core"
  | "inflation"
  | "growth"
  | "global"
  | "pgbl";

export interface Bucket {
  id: BucketId;
  label: string;
  pct: number;
  amountBrl: number;
  role: string;
  instruments: string[];
}

export interface AllocationResult {
  profile: Profile;
  buckets: Bucket[];
  totalAssetsBrl: number;
  activeModifiers: { id: string; label: string; effect: string }[];
  flags: { id: string; label: string; note: string }[];
  filters: string[];
  memo: { profile: string; shape: string; decisions: string; exclusions: string };
  deltaFromBaseline: { id: BucketId; label: string; deltaPct: number }[];
}
