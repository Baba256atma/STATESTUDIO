/**
 * D7:5:1 — Strategic recommendation governance guard rails.
 */

import type { StrategicRecommendationSignal } from "./strategicRecommendationTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logRecommendationDev } from "./recommendationDevLog.ts";

export type RecommendationGuardCode =
  | "empty_recommendation_context"
  | "too_many_recommendations"
  | "invalid_recommendation_strength"
  | "invalid_recommendation_region"
  | "duplicate_recommendation_build"
  | "unsupported_recommendation_claim"
  | "autonomous_execution_language"
  | "runaway_intervention_recursion"
  | "corrupted_recommendation_state";

export type RecommendationGuardResult =
  | { ok: true }
  | { ok: false; code: RecommendationGuardCode; message: string };

export const DEFAULT_MAX_RECOMMENDATIONS = 96;
export const RECOMMENDATION_UNCERTAINTY_DISCLAIMER =
  "Strategic recommendations reflect grounded operational intelligence and are advisory, not autonomous directives.";
export const NON_EXECUTION_DISCLAIMER =
  "Recommendations require executive authorization and are never executed automatically by Nexora.";

const PROHIBITED_EXECUTION_TEXT = [
  "auto-execute",
  "autonomous execution",
  "automatically execute",
  "self-executing",
  "override executive",
] as const;

function containsAutonomousExecutionText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_EXECUTION_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(code: RecommendationGuardCode, message: string): RecommendationGuardResult {
  const result = { ok: false as const, code, message };
  logRecommendationDev("RecommendationGuard", { code, message });
  return result;
}

export function buildRecommendationContentFingerprint(input: {
  topologyFingerprint: string;
  foresightFingerprint?: string;
  adaptationFingerprint?: string;
  preventionFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    foresight: input.foresightFingerprint ?? null,
    adaptation: input.adaptationFingerprint ?? null,
    prevention: input.preventionFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardGenerateStrategicRecommendations(input: {
  topologyId: string;
  regionIds: readonly string[];
  recommendations: readonly StrategicRecommendationSignal[];
  priorRecommendationFingerprints?: readonly string[];
  pendingFingerprint?: string;
  recommendationConfidenceScore?: number;
  stabilizationLeverageScore?: number;
}): RecommendationGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_recommendation_context",
      "Topology context is required to generate strategic recommendations"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.recommendations.length > DEFAULT_MAX_RECOMMENDATIONS) {
    return reject(
      "too_many_recommendations",
      `Recommendation count ${input.recommendations.length} exceeds max ${DEFAULT_MAX_RECOMMENDATIONS}`
    );
  }

  if ((input.recommendationConfidenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_intervention_recursion",
      "Recommendation confidence score implies uncontrolled intervention recursion"
    );
  }

  if ((input.stabilizationLeverageScore ?? 0) > 0.95) {
    return reject(
      "runaway_intervention_recursion",
      "Stabilization leverage score implies uncontrolled intervention recursion"
    );
  }

  for (const rec of input.recommendations) {
    if (rec.recommendationStrength < 0 || rec.recommendationStrength > 1) {
      return reject(
        "invalid_recommendation_strength",
        `Recommendation ${rec.recommendationId} strength must be between 0 and 1`
      );
    }
    if (rec.recommendationStrength > 0.92) {
      return reject(
        "unsupported_recommendation_claim",
        `Recommendation ${rec.recommendationId} strength implies excessive certainty`
      );
    }
    for (const regionId of rec.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_recommendation_region",
          `Recommendation ${rec.recommendationId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(rec.executiveLabel ?? "");
    if (containsFalseCertaintyText(label)) {
      return reject(
        "unsupported_recommendation_claim",
        `Recommendation ${rec.recommendationId} contains prohibited certainty language`
      );
    }
    if (containsAutonomousExecutionText(label)) {
      return reject(
        "autonomous_execution_language",
        `Recommendation ${rec.recommendationId} contains prohibited autonomous execution language`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorRecommendationFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_recommendation_build",
      "Identical strategic recommendation generation was already executed"
    );
  }

  return { ok: true };
}

export function guardRecommendationExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): RecommendationGuardResult {
  if (containsFalseCertaintyText(input.headline)) {
    return reject(
      "unsupported_recommendation_claim",
      "Recommendation headline contains prohibited certainty language"
    );
  }
  if (containsFalseCertaintyText(input.summary)) {
    return reject(
      "unsupported_recommendation_claim",
      "Recommendation summary contains prohibited certainty language"
    );
  }
  if (containsAutonomousExecutionText(input.headline)) {
    return reject(
      "autonomous_execution_language",
      "Recommendation headline contains prohibited autonomous execution language"
    );
  }
  if (containsAutonomousExecutionText(input.summary)) {
    return reject(
      "autonomous_execution_language",
      "Recommendation summary contains prohibited autonomous execution language"
    );
  }
  return { ok: true };
}
