"use client";

import { Beaker, X } from "lucide-react";
import { useState } from "react";
import { SCENARIOS } from "../lib/scenarios";

interface Props {
  onPickScenario: (scenarioId: string) => void;
}

export default function DemoMenu({ onPickScenario }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[300px] bg-[var(--surface)] border border-[var(--line-strong)] rounded-xl p-4 shadow-2xl fade-up">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="eyebrow text-[var(--accent)]">Demo presets</div>
              <div className="text-[12px] text-[var(--text-muted)] mt-0.5">
                Skip the interview and load a prebuilt scenario.
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onPickScenario(s.id);
                  setOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] hover:border-[var(--accent)] transition"
              >
                <div className="text-[13px] text-[var(--text)]">{s.label}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                  {s.blurb}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-[var(--surface)] border border-[var(--line-strong)] rounded-full px-3.5 py-2 text-[12px] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1.5 shadow-lg"
      >
        <Beaker className="w-3.5 h-3.5" />
        Demo
      </button>
    </div>
  );
}
