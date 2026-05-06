"use client";

import { ArrowRight, Check } from "lucide-react";
import ScreenShell from "./ScreenShell";
import type { Profile } from "../lib/types";

interface Props {
  profile: Profile;
  onContinue: () => void;
}

export default function RevealScreen({ profile, onContinue }: Props) {
  return (
    <ScreenShell variant="atmosphere">
      <div className="flex-1 flex flex-col items-center justify-center text-center pb-6">
        <div className="relative mb-10 fade-up">
          <div className="absolute inset-0 rounded-full blur-2xl bg-[var(--accent)]/30" />
          <div className="relative w-20 h-20 rounded-full border-2 border-[var(--accent)] flex items-center justify-center">
            <Check className="w-9 h-9 text-[var(--accent)]" strokeWidth={2.5} />
          </div>
        </div>

        <div className="eyebrow text-[var(--text-muted)] mb-4 fade-up fade-up-2">
          Profile set
        </div>
        <h1 className="serif text-[42px] sm:text-[48px] leading-tight mb-5 fade-up fade-up-2">
          {profile.label}
        </h1>
        <p className="text-[15px] text-[var(--text-muted)] leading-relaxed max-w-[480px] fade-up fade-up-3">
          {profile.blurb}
        </p>
      </div>

      <div className="pb-6 fade-up fade-up-4">
        <button onClick={onContinue} className="cta-primary">
          See my portfolio
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </ScreenShell>
  );
}
