/**
 * Phase 5:2 — Advisory priority scoring (prioritization, not recommendation).
 */

import type {
  AdvisoryInputImpact,
  AdvisoryInputPriority,
  StandardizedAdvisoryInput,
} from "./advisoryContextContract.ts";

const PRIORITY_SCORE: Readonly<Record<AdvisoryInputPriority, number>> = Object.freeze({
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
});

const IMPACT_BOOST: Readonly<Record<AdvisoryInputImpact, number>> = Object.freeze({
  low: 0,
  moderate: 0.1,
  high: 0.2,
  transformational: 0.35,
});

export function mapLevelToPriority(level: string): AdvisoryInputPriority {
  if (level === "critical" || level === "immediate_attention" || level === "decision_required") {
    return "critical";
  }
  if (
    level === "high" ||
    level === "degraded" ||
    level === "investigate" ||
    level === "major_drift" ||
    level === "transformational"
  ) {
    return "high";
  }
  if (
    level === "moderate" ||
    level === "watch" ||
    level === "review" ||
    level === "minor_drift" ||
    level === "active"
  ) {
    return "moderate";
  }
  return "low";
}

export function mapLevelToImpact(level: string): AdvisoryInputImpact {
  if (level === "transformational" || level === "critical") return "transformational";
  if (level === "high" || level === "major_drift") return "high";
  if (level === "moderate" || level === "degraded" || level === "watch") return "moderate";
  return "low";
}

export function computeAdvisoryInputScore(
  priority: AdvisoryInputPriority,
  impact: AdvisoryInputImpact
): number {
  return PRIORITY_SCORE[priority] + IMPACT_BOOST[impact];
}

export function rankAdvisoryInputs(
  inputs: readonly StandardizedAdvisoryInput[]
): readonly StandardizedAdvisoryInput[] {
  return Object.freeze(
    [...inputs].sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return PRIORITY_SCORE[right.priority] - PRIORITY_SCORE[left.priority];
    })
  );
}

export function resolveContextPriority(
  ranked: readonly StandardizedAdvisoryInput[]
): AdvisoryInputPriority {
  const top = ranked[0];
  if (!top) return "low";
  return top.priority;
}
