"use client";

import { useMemo, useState } from "react";
import DemoMenu from "../components/DemoMenu";
import IntroScreen from "../components/IntroScreen";
import InterviewFlow from "../components/InterviewFlow";
import ResultsView from "../components/ResultsView";
import RevealScreen from "../components/RevealScreen";
import { computeAllocation } from "../lib/allocation-engine";
import {
  DEFAULT_ANSWERS,
  HENRIQUE_BASELINE,
  SCENARIOS,
} from "../lib/scenarios";
import type { AnswerSet } from "../lib/types";

type Mode = "intro" | "interview" | "reveal" | "results";

export default function Home() {
  const [mode, setMode] = useState<Mode>("intro");
  const [answers, setAnswers] = useState<AnswerSet>(DEFAULT_ANSWERS);
  const [scenarioId, setScenarioId] = useState<string | null>(null);

  const result = useMemo(() => computeAllocation(answers), [answers]);
  const isHenriqueBaseline = useMemo(
    () =>
      JSON.stringify(answers) === JSON.stringify(HENRIQUE_BASELINE) &&
      scenarioId === "henrique",
    [answers, scenarioId],
  );

  function handleStart() {
    setMode("interview");
  }
  function handleInterviewComplete() {
    setMode("reveal");
  }
  function handleRevealContinue() {
    setMode("results");
  }
  function handleReviewAnswers() {
    setMode("interview");
  }
  function handleRestart() {
    setAnswers(DEFAULT_ANSWERS);
    setScenarioId(null);
    setMode("intro");
  }
  function handlePickScenario(id: string) {
    const sc = SCENARIOS.find((s) => s.id === id);
    if (!sc) return;
    setAnswers(sc.apply(HENRIQUE_BASELINE));
    setScenarioId(id);
    setMode("results");
  }

  return (
    <>
      {mode === "intro" && <IntroScreen onStart={handleStart} />}
      {mode === "interview" && (
        <InterviewFlow
          answers={answers}
          onChange={setAnswers}
          onComplete={handleInterviewComplete}
          onExit={() => setMode("intro")}
        />
      )}
      {mode === "reveal" && (
        <RevealScreen
          profile={result.profile}
          onContinue={handleRevealContinue}
        />
      )}
      {mode === "results" && (
        <ResultsView
          result={result}
          baselineDelta={!isHenriqueBaseline}
          onReview={handleReviewAnswers}
          onRestart={handleRestart}
        />
      )}
      <DemoMenu onPickScenario={handlePickScenario} />
    </>
  );
}
