"use client";

import { ArrowRight } from "lucide-react";
import ScreenShell from "./ScreenShell";

export default function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <ScreenShell>
      <div className="flex-1 flex flex-col justify-center pt-10">
        <div className="flex items-center gap-3 mb-10 fade-up">
          <span className="serif text-[28px] tracking-tight">Decade</span>
          <span className="eyebrow text-[var(--text-muted)]">AI</span>
        </div>

        <h1 className="serif text-[44px] sm:text-[52px] leading-[1.05] mb-6 fade-up fade-up-2">
          A few questions about you, then a portfolio built specifically for you.
        </h1>
        <p className="text-[15px] text-[var(--text-muted)] leading-relaxed max-w-[460px] mb-12 fade-up fade-up-3">
          I&apos;ll ask about your goals, your financial picture, and how you actually
          react to risk. About two minutes. Nothing here is a template.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-14 fade-up fade-up-4">
          <Stat number="7" label="purpose buckets" />
          <Stat number="100%" label="explainable" />
          <Stat number="~2 min" label="to complete" />
        </div>
      </div>

      <div className="pb-6 fade-up fade-up-4">
        <button onClick={onStart} className="cta-primary">
          Let&apos;s go
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </ScreenShell>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-t border-[var(--line)] pt-3">
      <div className="serif text-[26px] leading-none">{number}</div>
      <div className="eyebrow text-[var(--text-muted)] mt-2">{label}</div>
    </div>
  );
}
