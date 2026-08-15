/**
 * CC:8 — Deterministic recommendation priority / confidence policy.
 *
 * Precedence (highest → lowest):
 *   critical + directly goal-linked
 *   > critical + indirectly linked (canonical relationship path)
 *   > attention/important + directly linked
 *   > unresolved
 *   > normal / no-action
 *
 * Confidence means deterministic evidence support under these rules — not model probability.
 */

import { EXECUTIVE_REASONING_REASON } from "./executiveReasoning.ts";
import type {
  NexoraExecutiveReasoningEvidencePack,
  NexoraRecommendationStrength,
} from "./executiveRecommendation.ts";
import type { NexoraExecutiveAssessment } from "./executiveAssessment.ts";

export const EXECUTIVE_RECOMMENDATION_PRIORITY_POLICY = Object.freeze({
  criticalDirectGoalLinked: 100,
  criticalIndirectLinked: 80,
  attentionDirectLinked: 60,
  unresolved: 40,
  normal: 10,
});

export function clampRecommendationConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Math.round(value * 1000) / 1000;
}

export function strengthFromConfidence(
  confidence: number,
): NexoraRecommendationStrength {
  if (confidence >= 0.75) return "strong";
  if (confidence >= 0.45) return "moderate";
  return "weak";
}

export function hasCanonicalLink(
  evidence: NexoraExecutiveReasoningEvidencePack,
  a: string,
  b: string,
): boolean {
  return evidence.relationships.some(
    (r) =>
      (r.sourceSubjectId === a && r.targetSubjectId === b) ||
      (r.sourceSubjectId === b && r.targetSubjectId === a),
  );
}

export function relationshipSupportBetween(
  evidence: NexoraExecutiveReasoningEvidencePack,
  a: string,
  b: string,
): "causal" | "constraining" | "correlated" | "related" | "uncertain" | null {
  const matches = evidence.relationships.filter(
    (r) =>
      (r.sourceSubjectId === a && r.targetSubjectId === b) ||
      (r.sourceSubjectId === b && r.targetSubjectId === a),
  );
  if (matches.length === 0) return null;
  if (matches.some((m) => m.supportKind === "causal")) return "causal";
  if (matches.some((m) => m.supportKind === "constraining")) return "constraining";
  if (matches.some((m) => m.supportKind === "correlated")) return "correlated";
  if (matches.some((m) => m.supportKind === "related")) return "related";
  return "uncertain";
}

export function derivePriorityRank(input: {
  readonly attention?: string;
  readonly goalLinkedDirect: boolean;
  readonly relationshipLinked: boolean;
  readonly unresolved: boolean;
}): { readonly rank: number; readonly code: string } {
  const critical = input.attention === "critical";
  const attention =
    input.attention === "important" || input.attention === "elevated";

  if (critical && input.goalLinkedDirect) {
    return {
      rank: EXECUTIVE_RECOMMENDATION_PRIORITY_POLICY.criticalDirectGoalLinked,
      code: EXECUTIVE_REASONING_REASON.CRITICAL_GOAL_LINKED_CONSTRAINT,
    };
  }
  if (critical && input.relationshipLinked) {
    return {
      rank: EXECUTIVE_RECOMMENDATION_PRIORITY_POLICY.criticalIndirectLinked,
      code: EXECUTIVE_REASONING_REASON.CRITICAL_GOAL_LINKED_CONSTRAINT,
    };
  }
  if (attention && (input.goalLinkedDirect || input.relationshipLinked)) {
    return {
      rank: EXECUTIVE_RECOMMENDATION_PRIORITY_POLICY.attentionDirectLinked,
      code: EXECUTIVE_REASONING_REASON.ATTENTION_GOAL_LINKED_SIGNAL,
    };
  }
  if (input.unresolved) {
    return {
      rank: EXECUTIVE_RECOMMENDATION_PRIORITY_POLICY.unresolved,
      code: EXECUTIVE_REASONING_REASON.INSUFFICIENT_EVIDENCE,
    };
  }
  return {
    rank: EXECUTIVE_RECOMMENDATION_PRIORITY_POLICY.normal,
    code: EXECUTIVE_REASONING_REASON.NO_MATERIAL_ACTION_REQUIRED,
  };
}

export function assessmentHasMaterialIssue(
  assessment: NexoraExecutiveAssessment,
): boolean {
  return (
    assessment.issues.some(
      (i) =>
        i.severity === "critical" ||
        i.severity === "important" ||
        i.severity === "elevated",
    ) || assessment.constraints.length > 0
  );
}
