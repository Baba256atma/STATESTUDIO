/**
 * D7:5:5 — Executive-readable recommendation learning semantics.
 */

import type {
  ExecutiveRecommendationLearningSemantics,
  StrategicRecommendationMemoryState,
} from "./recommendationMemoryTypes.ts";
import {
  LEARNING_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_LEARNING_DISCLAIMER,
} from "./learningGuards.ts";

export function buildExecutiveRecommendationLearningSemantics(input: {
  state: StrategicRecommendationMemoryState;
}): ExecutiveRecommendationLearningSemantics {
  const logisticsOutcome = input.state.historicalOutcomeRecords.find((r) =>
    r.recordId.includes("successful-recovery")
  );
  const fragilityPattern = input.state.patternLearningRecords.find((r) =>
    r.recordId.includes("operational-history-similarity")
  );
  const validatedMemory = input.state.activeMemorySignals.find((m) => m.memoryState === "validated");
  const topOutcome = input.state.historicalOutcomeRecords[0];

  const headline =
    logisticsOutcome || validatedMemory
      ? "Current recovery conditions resemble previous logistics stabilization patterns that historically improved resilience coordination and reduced dependency fragility."
      : fragilityPattern
        ? fragilityPattern.explanation
        : topOutcome
          ? topOutcome.explanation
          : input.state.executiveLearningLabel === "validated"
            ? "Validated strategic memory may reinforce future recommendation quality under comparable operational conditions."
            : input.state.executiveLearningLabel === "volatile"
              ? "Volatile learning conditions may reflect shifting pathways; historical memory remains indicative rather than definitive."
              : "Strategic recommendation memory remains under active assessment across prior operational experience.";

  const summaryParts: string[] = [];
  if (input.state.executiveLearningLabel === "validated") {
    summaryParts.push(
      "Validated learning suggests prior recommendations may align with successful historical pathways."
    );
  } else if (input.state.executiveLearningLabel === "volatile") {
    summaryParts.push(
      "Volatile learning patterns may shift as operational and predictive conditions evolve."
    );
  } else if (input.state.executiveLearningLabel === "emerging") {
    summaryParts.push(
      "Emerging memory patterns may gradually inform recommendation refinement without autonomous policy changes."
    );
  } else if (input.state.executiveLearningLabel === "degraded") {
    summaryParts.push(
      "Degraded memory signals may warrant executive review of prior intervention outcomes."
    );
  } else {
    summaryParts.push(
      "Stable learning memory may support consistent recommendation calibration across recurring operational cycles."
    );
  }
  summaryParts.push(
    `Indicative learning stability is ${(input.state.learningStabilityScore * 100).toFixed(0)}% with pattern recurrence at ${(input.state.patternRecurrenceScore * 100).toFixed(0)}% and validation confidence at ${(input.state.validationConfidenceScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.learningAmbiguityDisclaimer || LEARNING_AMBIGUITY_DISCLAIMER);
  summaryParts.push(
    input.state.nonAutonomousLearningDisclaimer || NON_AUTONOMOUS_LEARNING_DISCLAIMER
  );

  const memorySummaries = input.state.activeMemorySignals.map((m) => {
    const drivers = (m.dominantLearningDrivers ?? []).join(", ") || "learning_drivers";
    return `${m.memoryId}: ${m.memoryState} memory (${drivers}, strength ${(m.memoryStrength * 100).toFixed(0)}%).`;
  });

  const outcomeSummaries = input.state.historicalOutcomeRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const patternSummaries = input.state.patternLearningRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.validatedRecommendationZones.length > 0) {
    bullets.push(
      `Validated recommendation zones: ${input.state.validatedRecommendationZones.join(", ")}.`
    );
  }
  if (input.state.repeatedFailureZones.length > 0) {
    bullets.push(`Repeated failure zones: ${input.state.repeatedFailureZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora records recommendation history for executive learning support under executive control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    memorySummaries: Object.freeze(memorySummaries),
    outcomeSummaries: Object.freeze(outcomeSummaries),
    patternSummaries: Object.freeze(patternSummaries),
    bullets: Object.freeze(bullets),
  });
}
