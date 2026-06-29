/**
 * APP-11:3 — Executive Inbox Prioritization deterministic calculator.
 */

import {
  EXECUTIVE_INBOX_PRIORITIZATION_CALCULATION_VERSION,
  EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS,
  EXECUTIVE_INBOX_PRIORITY_LEVEL_THRESHOLDS,
} from "./executiveInboxPrioritizationEngineConstants.ts";
import { getDimensionLabel } from "./executiveInboxPrioritizationDimensionEvaluator.ts";
import type {
  PriorityCalculation,
  PriorityDimension,
  PriorityDimensionKey,
  PriorityLevel,
} from "./executiveInboxPrioritizationEngineTypes.ts";

export function resolvePriorityLevel(weightedScore: number): PriorityLevel {
  if (weightedScore >= EXECUTIVE_INBOX_PRIORITY_LEVEL_THRESHOLDS.critical) {
    return "critical";
  }
  if (weightedScore >= EXECUTIVE_INBOX_PRIORITY_LEVEL_THRESHOLDS.high) {
    return "high";
  }
  if (weightedScore >= EXECUTIVE_INBOX_PRIORITY_LEVEL_THRESHOLDS.medium) {
    return "medium";
  }
  if (weightedScore >= EXECUTIVE_INBOX_PRIORITY_LEVEL_THRESHOLDS.low) {
    return "low";
  }
  return "informational";
}

export function calculateWeightedScore(
  scores: Readonly<Record<PriorityDimensionKey, number>>,
  weights: Readonly<Record<PriorityDimensionKey, number>>
): number {
  let totalWeight = 0;
  let weightedSum = 0;
  for (const dimensionKey of EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS) {
    const weight = weights[dimensionKey];
    totalWeight += weight;
    weightedSum += scores[dimensionKey] * weight;
  }
  if (totalWeight === 0) {
    return 0;
  }
  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

export function buildPriorityDimensions(
  scores: Readonly<Record<PriorityDimensionKey, number>>,
  weights: Readonly<Record<PriorityDimensionKey, number>>
): readonly PriorityDimension[] {
  return Object.freeze(
    EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS.map((dimensionKey) => {
      const score = scores[dimensionKey];
      const weight = weights[dimensionKey];
      const weightedContribution = Math.round(((score * weight) / 100) * 100) / 100;
      return Object.freeze({
        dimensionKey,
        label: getDimensionLabel(dimensionKey),
        score,
        weight,
        weightedContribution,
        readOnly: true as const,
      });
    })
  );
}

export function calculateExecutivePriority(
  itemId: string,
  scores: Readonly<Record<PriorityDimensionKey, number>>,
  weights: Readonly<Record<PriorityDimensionKey, number>>
): PriorityCalculation {
  const dimensions = buildPriorityDimensions(scores, weights);
  const weightedScore = calculateWeightedScore(scores, weights);
  const priorityLevel = resolvePriorityLevel(weightedScore);
  return Object.freeze({
    calculationId: `priority-calc-${itemId}`,
    weightedScore,
    priorityLevel,
    dimensions,
    weightConfiguration: weights,
    calculationVersion: EXECUTIVE_INBOX_PRIORITIZATION_CALCULATION_VERSION,
    readOnly: true as const,
  });
}

export const ExecutiveInboxPrioritizationCalculator = Object.freeze({
  resolvePriorityLevel,
  calculateWeightedScore,
  buildPriorityDimensions,
  calculateExecutivePriority,
});
