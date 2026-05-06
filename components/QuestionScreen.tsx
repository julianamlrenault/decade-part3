"use client";

import { ArrowRight, Check } from "lucide-react";
import ScreenShell from "./ScreenShell";

export interface OptionCard {
  id: string;
  title: string;
  helper?: string;
}

interface Props {
  progress: number;
  stepLabel: string;
  title: string;
  helper?: string;
  options?: OptionCard[];
  selected?: string | string[];
  multiple?: boolean;
  maxSelections?: number;
  onSelect?: (id: string) => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

export default function QuestionScreen({
  progress,
  stepLabel,
  title,
  helper,
  options,
  selected,
  multiple,
  onSelect,
  onContinue,
  continueDisabled,
  continueLabel = "Continue",
  onBack,
  children,
}: Props) {
  const isSelected = (id: string) =>
    Array.isArray(selected) ? selected.includes(id) : selected === id;

  return (
    <ScreenShell
      progress={progress}
      showProgress
      topRightLabel={stepLabel}
      onBack={onBack}
    >
      <div className="flex-1 flex flex-col pt-6">
        <h2 className="serif text-[30px] sm:text-[34px] leading-tight mb-3 fade-up">
          {title}
        </h2>
        {helper && (
          <p className="text-[14px] text-[var(--text-muted)] mb-6 max-w-[520px] fade-up fade-up-2">
            {helper}
          </p>
        )}

        {options && options.length > 0 && (
          <div className="space-y-2.5 mt-2 fade-up fade-up-2">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelect?.(opt.id)}
                className={`card-option ${isSelected(opt.id) ? "selected" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] text-[var(--text)]">{opt.title}</div>
                  {opt.helper && (
                    <div className="text-[12.5px] text-[var(--text-muted)] mt-1">
                      {opt.helper}
                    </div>
                  )}
                </div>
                <Check className="ck w-4 h-4" />
              </button>
            ))}
          </div>
        )}

        {children && <div className="mt-2 fade-up fade-up-2">{children}</div>}
      </div>

      <div className="pt-6 pb-6 fade-up fade-up-3">
        <button
          onClick={onContinue}
          disabled={continueDisabled}
          className="cta-primary"
        >
          {continueLabel}
          <ArrowRight className="w-4 h-4" />
        </button>
        {multiple && (
          <p className="text-[11.5px] text-[var(--text-faint)] text-center mt-3">
            Pick all that apply
          </p>
        )}
      </div>
    </ScreenShell>
  );
}
