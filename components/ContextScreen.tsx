"use client";

import { ArrowRight } from "lucide-react";
import ScreenShell from "./ScreenShell";

interface BigStat {
  number: string;
  caption: string;
}

interface Props {
  progress: number;
  stepLabel: string;
  eyebrow?: string;
  title: string;
  body: string;
  stats?: BigStat[];
  source?: string;
  closing?: string;
  onContinue: () => void;
  onBack?: () => void;
}

export default function ContextScreen({
  progress,
  stepLabel,
  eyebrow = "Decade AI · context",
  title,
  body,
  stats,
  source,
  closing,
  onContinue,
  onBack,
}: Props) {
  return (
    <ScreenShell
      progress={progress}
      showProgress
      topRightLabel={stepLabel}
      onBack={onBack}
      variant="atmosphere"
    >
      <div className="flex-1 flex flex-col justify-center pt-10 pb-6">
        <div className="eyebrow text-[var(--accent)] mb-4 fade-up">{eyebrow}</div>
        <h2 className="serif text-[34px] sm:text-[40px] leading-[1.1] mb-5 fade-up fade-up-2">
          {title}
        </h2>
        <p className="text-[15px] text-[var(--text-muted)] leading-relaxed max-w-[520px] mb-10 fade-up fade-up-3">
          {body}
        </p>

        {stats && stats.length > 0 && (
          <div className="space-y-7 mt-2 fade-up fade-up-3">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="serif text-[48px] sm:text-[56px] leading-none text-[var(--text)]">
                  {s.number}
                </div>
                <div className="text-[14px] text-[var(--text-muted)] mt-2 max-w-[480px] leading-snug">
                  {s.caption}
                </div>
              </div>
            ))}
          </div>
        )}

        {closing && (
          <p className="text-[15px] text-[var(--text)] leading-relaxed mt-10 max-w-[480px] fade-up fade-up-4">
            {closing}
          </p>
        )}

        {source && (
          <div className="text-[11px] text-[var(--text-faint)] mt-10 fade-up fade-up-4">
            {source}
          </div>
        )}
      </div>

      <div className="pb-6 fade-up fade-up-4">
        <button onClick={onContinue} className="cta-primary">
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </ScreenShell>
  );
}
