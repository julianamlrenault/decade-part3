"use client";

import { useMemo, useState } from "react";
import ContextScreen from "./ContextScreen";
import QuestionScreen, { OptionCard } from "./QuestionScreen";
import type {
  AnswerSet,
  AssetsBand,
  DrawdownReaction,
  Goal,
  HomeTiming,
  HorizonItem,
  IncomeBand,
  Intl,
  LifeEvent,
  PriorLoss,
  SpendBand,
  Stability,
} from "../lib/types";

interface Props {
  answers: AnswerSet;
  onChange: (next: AnswerSet) => void;
  onComplete: () => void;
  onExit: () => void;
  startStepIndex?: number;
}

type StepDef =
  | { kind: "context"; id: string }
  | { kind: "question"; id: string };

function buildSequence(answers: AnswerSet): StepDef[] {
  const wantsHome = answers.horizon.includes("buy_home");
  const seq: StepDef[] = [
    { kind: "context", id: "info_q1" },
    { kind: "question", id: "q1" },
    { kind: "question", id: "q2" },
    { kind: "question", id: "q3" },
    { kind: "question", id: "q4" },
    { kind: "context", id: "info_q5" },
    { kind: "question", id: "q5" },
  ];
  if (wantsHome) seq.push({ kind: "question", id: "q6" });
  seq.push(
    { kind: "context", id: "info_q7" },
    { kind: "question", id: "q7" },
    { kind: "question", id: "q8" },
    { kind: "question", id: "q9" },
    { kind: "question", id: "q10" },
  );
  return seq;
}

export default function InterviewFlow({
  answers,
  onChange,
  onComplete,
  onExit,
  startStepIndex = 0,
}: Props) {
  const [stepIndex, setStepIndex] = useState(startStepIndex);
  const sequence = useMemo(() => buildSequence(answers), [answers]);
  const totalQuestions = sequence.filter((s) => s.kind === "question").length;
  const stepNumber = sequence.slice(0, stepIndex + 1).filter((s) => s.kind === "question").length;
  const progress = (stepIndex + 1) / sequence.length;

  function set(patch: Partial<AnswerSet>) {
    onChange({ ...answers, ...patch });
  }
  function toggleArr<K extends "horizon" | "goals" | "lifeEvent">(
    key: K,
    value: HorizonItem | Goal | LifeEvent,
    max?: number,
  ) {
    const arr = answers[key] as readonly (HorizonItem | Goal | LifeEvent)[];
    const has = arr.includes(value);
    let next = has ? arr.filter((x) => x !== value) : [...arr, value];
    if (key === "lifeEvent" && value === "none" && !has) {
      next = ["none"];
    } else if (key === "lifeEvent" && value !== "none" && !has) {
      next = next.filter((x) => x !== "none");
    }
    if (max && next.length > max) return;
    onChange({ ...answers, [key]: next } as AnswerSet);
  }

  function advance() {
    if (stepIndex < sequence.length - 1) {
      setStepIndex(stepIndex + 1);
      window.scrollTo({ top: 0 });
    } else {
      onComplete();
    }
  }
  function goBack() {
    if (stepIndex === 0) {
      onExit();
    } else {
      setStepIndex(stepIndex - 1);
      window.scrollTo({ top: 0 });
    }
  }

  const step = sequence[stepIndex];
  const stepLabel =
    step.kind === "question"
      ? `Question ${stepNumber} of ${totalQuestions}`
      : "Decade AI";

  if (step.kind === "context") {
    if (step.id === "info_q1") {
      return (
        <ContextScreen
          progress={progress}
          stepLabel={stepLabel}
          eyebrow="A note before we start"
          title="Three decisions matter more than your investment allocation."
          body="Over a 10-year horizon, what shapes your wealth generation most isn't which assets you pick. It's three sizing choices: how much you reserve for liquidity, how much you protect against inflation, and how much you diversify."
          closing="We'll cover all three."
          onContinue={advance}
          onBack={goBack}
        />
      );
    }
    if (step.id === "info_q5") {
      return (
        <ContextScreen
          progress={progress}
          stepLabel={stepLabel}
          eyebrow="One more point before we move on"
          title="One portfolio for many goals means goals in conflict."
          body="Most Brazilian investors rely on a single allocation for objectives with very different time horizons: liquidity in six months, a home purchase in three years, retirement in twenty-five."
          closing="The outcome is predictable: either insufficient liquidity when life happens, or underinvestment when long-term objectives matter most."
          onContinue={advance}
          onBack={goBack}
        />
      );
    }
    if (step.id === "info_q7") {
      return (
        <ContextScreen
          progress={progress}
          stepLabel={stepLabel}
          eyebrow="The next point matters."
          title="Brazilian equity had 8 drawdowns greater than 15% in the last 25 years."
          body="The average investor underperformed CDI — not because markets failed, but because behavior did."
          stats={[
            {
              number: "8x",
              caption: "drawdowns greater than 15% in Brazilian equity over 25 years.",
            },
          ]}
          closing="The relevant question is not whether volatility can be tolerated, but when volatility becomes emotionally intolerable."
          source="Source: Anbima / Ibovespa · 1999–2024"
          onContinue={advance}
          onBack={goBack}
        />
      );
    }
  }

  // Questions
  switch (step.id) {
    case "q1":
      return (
        <QuestionScreen
          progress={progress}
          stepLabel={stepLabel}
          title="Tell me about your household."
          helper="Your age, partner if any, dependents, and any major life event coming up in the next 12 months."
          onContinue={advance}
          onBack={goBack}
          continueDisabled={!answers.age}
        >
          <div className="space-y-5 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="eyebrow text-[var(--text-muted)] block mb-2">
                  Your age
                </label>
                <input
                  type="number"
                  className="input-dark"
                  value={answers.age || ""}
                  onChange={(e) =>
                    set({ age: e.target.value ? Number(e.target.value) : 0 })
                  }
                />
              </div>
              <div>
                <label className="eyebrow text-[var(--text-muted)] block mb-2">
                  Partner age
                </label>
                <input
                  type="number"
                  placeholder="optional"
                  className="input-dark"
                  value={answers.spouseAge ?? ""}
                  onChange={(e) => {
                    const v = e.target.value ? Number(e.target.value) : null;
                    set({
                      spouseAge: v,
                      spouseIsCLT: v !== null,
                      spouseAnnualCLT: v !== null ? 480_000 : 0,
                    });
                  }}
                />
              </div>
            </div>
            <div>
              <label className="eyebrow text-[var(--text-muted)] block mb-2">
                Dependents
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`pill-dark ${answers.dependents === n ? "selected" : ""}`}
                    onClick={() => set({ dependents: n as 0 | 1 | 2 | 3 })}
                  >
                    {n === 3 ? "3+" : n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="eyebrow text-[var(--text-muted)] block mb-2">
                Major life event in the next 12 months
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    ["new_child", "New child"],
                    ["marriage", "Marriage"],
                    ["property_purchase", "Property purchase"],
                    ["career_change", "Career change"],
                    ["inheritance", "Inheritance"],
                    ["none", "None"],
                  ] as [LifeEvent, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={`pill-dark ${answers.lifeEvent.includes(id) ? "selected" : ""}`}
                    onClick={() => toggleArr("lifeEvent", id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </QuestionScreen>
      );
    case "q2":
      return (
        <QuestionScreen
          progress={progress}
          stepLabel={stepLabel}
          title="What's your annual household income, and how predictable is it?"
          helper="We use net income (after taxes) since that's what you actually live on and save from."
          onContinue={advance}
          onBack={goBack}
        >
          <div className="space-y-6 mt-2">
            <div>
              <div className="eyebrow text-[var(--text-muted)] mb-3">
                Combined annual net income (after taxes)
              </div>
              <div className="space-y-2">
                {(
                  [
                    ["lt_200k", "Less than R$ 200k"],
                    ["200k_500k", "R$ 200k – 500k"],
                    ["500k_1M", "R$ 500k – 1M"],
                    ["1M_2M", "R$ 1M – 2M"],
                    ["gt_2M", "R$ 2M and above"],
                  ] as [IncomeBand, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={`card-option ${answers.income === id ? "selected" : ""}`}
                    onClick={() => set({ income: id })}
                  >
                    <span className="text-[15px]">{label}</span>
                    <CheckIcon />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="eyebrow text-[var(--text-muted)] mb-3">Stability</div>
              <div className="space-y-2">
                {(
                  [
                    ["all_stable", "All stable", "CLT or fixed salary, predictable month to month"],
                    ["partial_variable", "Stable plus partial variable", "Bonus or commission under 40% of total"],
                    ["highly_variable", "Highly variable", "Most income from bonus or commission"],
                    ["self_employed", "Self-employed / business owner", "Income depends on business performance"],
                  ] as [Stability, string, string][]
                ).map(([id, title, helper]) => (
                  <button
                    key={id}
                    type="button"
                    className={`card-option ${answers.stability === id ? "selected" : ""}`}
                    onClick={() => set({ stability: id })}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px]">{title}</div>
                      <div className="text-[12.5px] text-[var(--text-muted)] mt-1">
                        {helper}
                      </div>
                    </div>
                    <CheckIcon />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </QuestionScreen>
      );
    case "q3": {
      const opts: OptionCard[] = (
        [
          ["lt_500k", "Less than R$ 500k"],
          ["500k_1M", "R$ 500k – 1M"],
          ["1M_1_9M", "R$ 1M – 1.9M"],
          ["2M_2_9M", "R$ 2M – 2.9M"],
          ["3M_4_9M", "R$ 3M – 4.9M"],
          ["gt_5M", "R$ 5M and above"],
        ] as [AssetsBand, string][]
      ).map(([id, title]) => ({ id, title }));
      return (
        <QuestionScreen
          progress={progress}
          stepLabel={stepLabel}
          title="How much do you currently have invested?"
          helper="Excludes your primary residence. Brokerage, retirement accounts, savings, fixed income — all of it."
          options={opts}
          selected={answers.assets}
          onSelect={(id) => set({ assets: id as AssetsBand })}
          onContinue={advance}
          onBack={goBack}
        />
      );
    }
    case "q4": {
      const spendBands: [SpendBand, string][] = [
        ["lt_15k", "Less than R$ 15k"],
        ["15k_30k", "R$ 15k – 30k"],
        ["30k_50k", "R$ 30k – 50k"],
        ["50k_80k", "R$ 50k – 80k"],
        ["gt_80k", "R$ 80k and above"],
      ];
      return (
        <QuestionScreen
          progress={progress}
          stepLabel={stepLabel}
          title="What are your monthly expenses?"
          helper="We split spending into two parts: fixed (housing, utilities, food, school, healthcare, basic transport — things that can't be paused) and variable (travel, leisure, things you can cut quickly). Both feed the advisor's view of your total cash burn."
          onContinue={advance}
          onBack={goBack}
        >
          <div className="space-y-6 mt-2">
            <div>
              <div className="eyebrow text-[var(--text-muted)] mb-1">
                Fixed expenses
              </div>
              <div className="text-[12.5px] text-[var(--text-muted)] mb-3">
                The things you can&apos;t cut quickly.
              </div>
              <div className="space-y-2">
                {spendBands.map(([id, label]) => (
                  <button
                    key={`fixed-${id}`}
                    type="button"
                    className={`card-option ${answers.spending === id ? "selected" : ""}`}
                    onClick={() => set({ spending: id })}
                  >
                    <span className="text-[15px]">{label}</span>
                    <CheckIcon />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="eyebrow text-[var(--text-muted)] mb-1">
                Variable expenses
              </div>
              <div className="text-[12.5px] text-[var(--text-muted)] mb-3">
                Travel, leisure, dining out, things you could cut next month.
              </div>
              <div className="space-y-2">
                {spendBands.map(([id, label]) => (
                  <button
                    key={`variable-${id}`}
                    type="button"
                    className={`card-option ${answers.variableSpending === id ? "selected" : ""}`}
                    onClick={() => set({ variableSpending: id })}
                  >
                    <span className="text-[15px]">{label}</span>
                    <CheckIcon />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </QuestionScreen>
      );
    }
    case "q5": {
      const opts: OptionCard[] = (
        [
          ["buy_home", "Buy or upgrade primary home"],
          ["expand_family", "Expand family"],
          ["education_funding", "Fund children's education"],
          ["career_break", "Career break or business venture"],
          ["early_retirement", "Plan for early retirement"],
          ["wealth_transfer", "Wealth transfer to next generation"],
        ] as [HorizonItem, string][]
      ).map(([id, title]) => ({ id, title }));
      return (
        <QuestionScreen
          progress={progress}
          stepLabel={stepLabel}
          title="What's on your horizon in the next five years?"
          helper="Pick everything that fits. We'll size buckets specifically for the ones you choose."
          options={opts}
          selected={answers.horizon}
          multiple
          onSelect={(id) => toggleArr("horizon", id as HorizonItem)}
          onContinue={advance}
          onBack={goBack}
          continueDisabled={answers.horizon.length === 0}
        />
      );
    }
    case "q6": {
      const opts: OptionCard[] = (
        [
          ["decided_lt_12mo", "Decided", "Closing within 12 months"],
          ["likely_1_3y", "Likely", "Within 1-3 years"],
          ["considering_3_5y", "Considering", "3-5 years away"],
          ["exploring", "Exploring", "No specific timeline"],
          ["dreaming", "Aspirational", "More aspiration than plan"],
        ] as [HomeTiming, string, string][]
      ).map(([id, title, helper]) => ({ id, title, helper }));
      return (
        <QuestionScreen
          progress={progress}
          stepLabel={stepLabel}
          title="Your home plan — how concrete is it?"
          helper="Sizing the home bucket depends on how concrete the plan is, not just whether it exists."
          options={opts}
          selected={answers.homeTiming ?? undefined}
          onSelect={(id) => set({ homeTiming: id as HomeTiming })}
          onContinue={advance}
          onBack={goBack}
          continueDisabled={!answers.homeTiming}
        />
      );
    }
    case "q7": {
      const opts: OptionCard[] = (
        [
          ["sell_all", "Sell everything immediately", "Cut losses, prevent further damage"],
          ["sell_some", "Sell some", "Reduce exposure, secure what's left"],
          ["hold", "Hold and wait", "Stick with the plan, wait for recovery"],
          ["buy_more", "Buy more", "Take advantage of lower prices"],
          ["unsure", "Not sure", "I'd want to talk to someone first"],
        ] as [DrawdownReaction, string, string][]
      ).map(([id, title, helper]) => ({ id, title, helper }));
      return (
        <QuestionScreen
          progress={progress}
          stepLabel={stepLabel}
          title="Imagine your portfolio drops 25% over six months. What's your first move?"
          options={opts}
          selected={answers.drawdownReaction}
          onSelect={(id) => set({ drawdownReaction: id as DrawdownReaction })}
          onContinue={advance}
          onBack={goBack}
        />
      );
    }
    case "q8": {
      const opts: OptionCard[] = (
        [
          ["none", "No, never"],
          ["stocks", "Yes — individual stocks"],
          ["structured", "Yes — structured products (COE, autocall)"],
          ["crypto", "Yes — crypto / digital assets"],
          ["international", "Yes — international assets"],
          ["other", "Yes — something else"],
        ] as [PriorLoss, string][]
      ).map(([id, title]) => ({ id, title }));
      return (
        <QuestionScreen
          progress={progress}
          stepLabel={stepLabel}
          title="Have you lost money on an investment that still bothers you?"
          helper="No judgment. The answer changes the portfolio, not how we read you."
          options={opts}
          selected={answers.priorLoss}
          onSelect={(id) => set({ priorLoss: id as PriorLoss })}
          onContinue={advance}
          onBack={goBack}
        />
      );
    }
    case "q9": {
      const opts: OptionCard[] = (
        [
          ["brazil_focused", "Keep it minimal", "Mostly BRL, USD only as a small hedge"],
          ["meaningful", "Meaningful exposure", "A real USD allocation, not just a sleeve"],
          ["essential", "Significant weighting", "USD as a core position"],
        ] as [Intl, string, string][]
      ).map(([id, title, helper]) => ({ id, title, helper }));
      return (
        <QuestionScreen
          progress={progress}
          stepLabel={stepLabel}
          title="How much of your portfolio should be in USD-denominated assets?"
          helper="USD exposure helps hedge purchasing power against BRL volatility while providing access to innovation-driven sectors largely absent from B3 — technology, cloud, AI."
          options={opts}
          selected={answers.intl}
          onSelect={(id) => set({ intl: id as Intl })}
          onContinue={advance}
          onBack={goBack}
        />
      );
    }
    case "q10": {
      const opts: OptionCard[] = (
        [
          ["time_freedom", "Time freedom", "Work because I want to, not because I have to"],
          ["net_worth_target", "Specific net-worth target", ""],
          ["generational_wealth", "Generational wealth", "Transfer to children"],
          ["passive_income", "Stable passive income", ""],
          ["family_security", "Family security", "Protected against downside"],
          ["financial_independence", "Full financial independence", ""],
        ] as [Goal, string, string][]
      ).map(([id, title, helper]) => ({ id, title, helper: helper || undefined }));
      return (
        <QuestionScreen
          progress={progress}
          stepLabel={stepLabel}
          title="Last one — what does success look like in 10 years?"
          helper="Pick up to three. These shape how I phrase your recommendation."
          options={opts}
          selected={answers.goals}
          multiple
          maxSelections={3}
          onSelect={(id) => toggleArr("goals", id as Goal, 3)}
          onContinue={advance}
          onBack={goBack}
          continueDisabled={answers.goals.length === 0}
          continueLabel="See my recommendation"
        />
      );
    }
  }

  return null;
}

function CheckIcon() {
  return (
    <svg
      className="ck w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
