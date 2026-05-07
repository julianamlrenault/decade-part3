"use client";

import { Pencil, RotateCcw } from "lucide-react";
import { useState } from "react";
import AllocationOutput from "./AllocationOutput";
import MemoView from "./MemoView";
import TransitionView from "./TransitionView";
import type { AllocationResult, UserInfo } from "../lib/types";

type Tab = "portfolio" | "memo" | "transition";

interface Props {
  result: AllocationResult;
  userInfo: UserInfo | null;
  baselineDelta: boolean;
  onReview: () => void;
  onRestart: () => void;
}

export default function ResultsView({
  result,
  userInfo,
  baselineDelta,
  onReview,
  onRestart,
}: Props) {
  const [tab, setTab] = useState<Tab>("portfolio");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <header className="px-5 sm:px-8 py-5 flex items-center justify-between border-b border-[var(--line)]">
        <div className="flex items-baseline gap-2.5">
          <span className="serif text-[20px]">Decade</span>
          <span className="eyebrow text-[var(--text-muted)]">AI · suitability</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onReview} className="btn-ghost">
            <Pencil className="w-3.5 h-3.5" />
            Review answers
          </button>
          <button onClick={onRestart} className="btn-ghost">
            <RotateCcw className="w-3.5 h-3.5" />
            Restart
          </button>
        </div>
      </header>

      <main className="flex-1 flex justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-[680px]">
          <div className="flex gap-1 mb-8 border-b border-[var(--line)]">
            <TabButton active={tab === "portfolio"} onClick={() => setTab("portfolio")}>
              Portfolio
            </TabButton>
            <TabButton active={tab === "memo"} onClick={() => setTab("memo")}>
              Memo
            </TabButton>
            <TabButton active={tab === "transition"} onClick={() => setTab("transition")}>
              30-day plan
            </TabButton>
          </div>

          <div className="fade-up">
            {tab === "portfolio" && (
              <AllocationOutput result={result} baselineDelta={baselineDelta} />
            )}
            {tab === "memo" && <MemoView result={result} userInfo={userInfo} />}
            {tab === "transition" && <TransitionView result={result} />}
          </div>

          <p className="text-[11px] text-[var(--text-faint)] mt-12 pt-6 border-t border-[var(--line)]">
            Demonstrative only. Allocations come from a deterministic rules engine
            calibrated against the Decade case study deck. No real LLM is used.
          </p>
        </div>
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-[13px] border-b-2 transition ${
        active
          ? "border-[var(--accent)] text-[var(--text)]"
          : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
      }`}
    >
      {children}
    </button>
  );
}
