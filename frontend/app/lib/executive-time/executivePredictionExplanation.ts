/**
 * APP-1:8 — Executive Prediction Explanation.
 * Deterministic metadata explanations — no LLM or AI generation.
 */

import type { ExecutiveConflictResult } from "./executivePredictionEngineTypes.ts";
import type { ExecutivePredictionContributingFactor } from "./executivePredictionEngineTypes.ts";
import type { ExecutivePredictionTemporalSignals } from "./executivePredictionEngineTypes.ts";

export type ExecutivePredictionExplanation = Readonly<{
  summary: string;
  whyPredictionExists: string;
  temporalSignals: readonly string[];
  assumptions: readonly string[];
  risks: readonly string[];
  conflicts: readonly string[];
}>;

export function buildExecutivePredictionExplanation(input: {
  predictionType: string;
  entityType: string;
  entityId: string;
  horizon: string;
  signals: ExecutivePredictionTemporalSignals;
  factors: readonly ExecutivePredictionContributingFactor[];
  assumptions: readonly string[];
  warnings: readonly string[];
  conflicts: readonly ExecutiveConflictResult[];
}): ExecutivePredictionExplanation {
  const temporalSignals = [
    `Context: ${input.signals.contextId}`,
    `Camera: ${input.signals.cameraContext}`,
    `State: ${input.signals.currentState}`,
    `Priority: ${input.signals.priorityLevel} (${input.signals.priorityConfidence})`,
    `Events in history: ${input.signals.eventCount}`,
  ];
  const risks = [...input.warnings];
  if (input.signals.transitionBlocked) risks.push("Target transition path is blocked.");
  if (input.signals.contextDrift) risks.push("Camera and context perspectives differ.");
  const conflictSummaries = input.conflicts.map(
    (conflict) => `${conflict.conflictType} (${conflict.severity}): ${conflict.explanation}`
  );
  const topFactors = input.factors
    .slice()
    .sort((left, right) => Math.abs(right.weight) - Math.abs(left.weight))
    .slice(0, 3)
    .map((factor) => factor.label);

  const baseSummary = `Deterministic ${input.predictionType} prediction for ${input.entityType}:${input.entityId} at horizon ${input.horizon}.`;
  const summary =
    topFactors.length > 0 ? `${baseSummary} Driven by: ${topFactors.join("; ")}.` : baseSummary;

  return Object.freeze({
    summary,
    whyPredictionExists: `Temporal evaluation requested for ${input.entityId} under context ${input.signals.contextId}.`,
    temporalSignals: Object.freeze(temporalSignals),
    assumptions: Object.freeze([...input.assumptions]),
    risks: Object.freeze(risks),
    conflicts: Object.freeze(conflictSummaries),
  });
}

export function formatExecutivePredictionExplanation(explanation: ExecutivePredictionExplanation): string {
  return [
    explanation.summary,
    explanation.whyPredictionExists,
    `Signals: ${explanation.temporalSignals.join("; ")}.`,
    explanation.conflicts.length > 0 ? `Conflicts: ${explanation.conflicts.join("; ")}.` : "Conflicts: none.",
  ].join(" ");
}
