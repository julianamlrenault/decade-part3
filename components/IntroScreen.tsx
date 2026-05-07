"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import ScreenShell from "./ScreenShell";
import type { UserInfo } from "../lib/types";

export default function IntroScreen({
  onStart,
}: {
  onStart: (info: UserInfo) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isValid =
    name.trim().length > 0 && email.trim().length > 0 && phone.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onStart({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  }

  return (
    <ScreenShell>
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col pt-10">
          <div className="flex items-center gap-3 mb-10 fade-up">
            <span className="serif text-[28px] tracking-tight">Decade</span>
            <span className="eyebrow text-[var(--text-muted)]">AI</span>
          </div>

          <h1 className="serif text-[44px] sm:text-[52px] leading-[1.05] mb-6 fade-up fade-up-2">
            A few questions about you, then a portfolio built specifically for you.
          </h1>
          <p className="text-[15px] text-[var(--text-muted)] leading-relaxed max-w-[460px] mb-10 fade-up fade-up-3">
            I&apos;ll ask about your goals, your financial picture, and how you actually
            react to risk. About two minutes. Nothing here is a template.
          </p>

          <div className="border border-[var(--line)] rounded-lg p-5 mb-10 fade-up fade-up-3 bg-[var(--surface-soft)]">
            <div className="eyebrow text-[var(--accent)] mb-2">
              Confidence from clarity
            </div>
            <p className="text-[14px] text-[var(--text)] leading-relaxed">
              Roughly{" "}
              <span className="font-semibold">3 in 10 Brazilians invest at all</span>
              &nbsp;&mdash; and most cite uncertainty, not income, as the reason they
              don&apos;t. Confidence comes from clarity: knowing exactly why every R$
              is where it is.
            </p>
            <div className="text-[11px] text-[var(--text-faint)] mt-3">
              Source: ANBIMA &mdash; Raio X do Investidor
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10 fade-up fade-up-4">
            <Stat number="7" label="purpose buckets" />
            <Stat number="100%" label="explainable" />
            <Stat number="~2 min" label="to complete" />
          </div>

          <div className="space-y-3 mb-8 fade-up fade-up-4">
            <Field
              label="Name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={setName}
            />
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
            />
            <Field
              label="Phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={setPhone}
            />
          </div>
        </div>

        <div className="pb-6 fade-up fade-up-4">
          <button
            type="submit"
            disabled={!isValid}
            className="cta-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Let&apos;s go
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
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

function Field({
  label,
  type,
  autoComplete,
  value,
  onChange,
}: {
  label: string;
  type: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-[var(--text-muted)] block mb-1.5">{label}</span>
      <input
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-[var(--line)] rounded-md px-3 py-2.5 text-[14px] text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition"
      />
    </label>
  );
}
