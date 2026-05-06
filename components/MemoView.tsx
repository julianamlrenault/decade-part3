"use client";

import { ArrowRight, Flag } from "lucide-react";
import type { AllocationResult } from "../lib/types";

export default function MemoView({ result }: { result: AllocationResult }) {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-[var(--accent)]">Recommendation memo</span>
        <h3 className="serif text-[24px] mt-1">The reasoning, in plain language.</h3>
      </div>

      <div className="space-y-5 text-[14.5px] leading-relaxed text-[var(--text)]">
        <Block label="Profile" body={result.memo.profile} />
        <Block label="Portfolio shape" body={result.memo.shape} />
        <Block label="Reserve sizing" body={result.memo.reserve} />
        <Block
          label="Decisions that shaped this allocation"
          body={result.memo.decisions}
        />
        <Block
          label="What is not in this portfolio (and why)"
          body={result.memo.exclusions}
        />
      </div>

      {result.flags.length > 0 && (
        <div className="border-t border-[var(--line)] pt-5">
          <div className="eyebrow text-[var(--text-muted)] mb-3">
            Flags for banker conversation
          </div>
          <ul className="space-y-3">
            {result.flags.map((f) => (
              <li key={f.id} className="flex gap-2.5 text-[13px]">
                <Flag className="w-3.5 h-3.5 text-[var(--accent)] mt-1 shrink-0" />
                <span>
                  <span className="font-medium text-[var(--text)]">{f.label}.</span>{" "}
                  <span className="text-[var(--text-muted)]">{f.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-[var(--line)] pt-6">
        <button className="inline-flex items-center gap-2 text-[13px] border border-[var(--line-strong)] rounded-full px-4 py-2.5 text-[var(--text)] hover:bg-[var(--surface-soft)] transition">
          Discuss this with a Decade banker
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="eyebrow text-[var(--text-muted)] mb-1.5">{label}</div>
      <p>{body}</p>
    </div>
  );
}
