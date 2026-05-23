import type { MVPCompletionScorecard, PublishReadinessAssessment, PublishReadinessTarget, PublishRisk } from "./mvpCompletionTypes.ts";

const TARGETS: readonly PublishReadinessTarget[] = Object.freeze([
  "internal_demonstrations",
  "executive_demonstrations",
  "pilot_programs",
  "controlled_customer_evaluations",
  "MVP_publication",
]);

export function assessPublishReadiness(scorecard: MVPCompletionScorecard, risks: readonly PublishRisk[]): readonly PublishReadinessAssessment[] {
  const critical = risks.some((risk) => risk.severity === "critical");
  return Object.freeze(
    TARGETS.map((target) => {
      const threshold = target === "MVP_publication" ? 0.82 : target === "controlled_customer_evaluations" ? 0.78 : target === "pilot_programs" ? 0.72 : 0.62;
      const ready = !critical && scorecard.publicationConfidence >= threshold;
      return {
        target,
        ready,
        rationale: ready ? `${target} readiness meets advisory threshold.` : `${target} readiness requires more evidence or stabilization.`,
        confidence: scorecard.publicationConfidence,
      };
    })
  );
}
