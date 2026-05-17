/**
 * D7:5:5 — Recommendation memory + learning governance guard rails.
 */

import type { StrategicRecommendationMemorySignal } from "./recommendationMemoryTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logRecommendationMemoryDev } from "./learningDevLog.ts";

export type RecommendationLearningGuardCode =
  | "empty_learning_context"
  | "too_many_memory_signals"
  | "invalid_memory_strength"
  | "invalid_memory_region"
  | "duplicate_memory_build"
  | "unsupported_learning_claim"
  | "uncontrolled_self_learning"
  | "autonomous_recommendation_rewrite"
  | "runaway_learning_amplification"
  | "corrupted_memory_state";

export type RecommendationLearningGuardResult =
  | { ok: true }
  | { ok: false; code: RecommendationLearningGuardCode; message: string };

export const DEFAULT_MAX_MEMORY_SIGNALS = 96;
export const LEARNING_AMBIGUITY_DISCLAIMER =
  "Strategic memory and learning reflect historical patterns under current conditions and are indicative, not definitive.";
export const NON_AUTONOMOUS_LEARNING_DISCLAIMER =
  "Nexora does not modify recommendation policies without executive direction; executives retain full strategic control.";

const PROHIBITED_SELF_LEARNING_TEXT = [
  "self-improving",
  "autonomous learning",
  "rewrite recommendation",
  "machine learning loop",
  "hidden optimization",
  "automatically optimize",
  "auto-optimize",
  "uncontrolled learning",
  "self-modifying",
  "override executive",
] as const;

function containsProhibitedSelfLearningText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_SELF_LEARNING_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: RecommendationLearningGuardCode,
  message: string
): RecommendationLearningGuardResult {
  const result = { ok: false as const, code, message };
  logRecommendationMemoryDev("LearningGuard", { code, message });
  return result;
}

export function buildMemoryContentFingerprint(input: {
  topologyFingerprint: string;
  comparisonFingerprint?: string;
  recommendationFingerprint?: string;
  confidenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    comparison: input.comparisonFingerprint ?? null,
    recommendation: input.recommendationFingerprint ?? null,
    confidence: input.confidenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateRecommendationLearning(input: {
  topologyId: string;
  regionIds: readonly string[];
  memories: readonly StrategicRecommendationMemorySignal[];
  priorMemoryFingerprints?: readonly string[];
  pendingFingerprint?: string;
  learningStabilityScore?: number;
  patternRecurrenceScore?: number;
}): RecommendationLearningGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_learning_context",
      "Topology context is required to evaluate recommendation learning"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.memories.length > DEFAULT_MAX_MEMORY_SIGNALS) {
    return reject(
      "too_many_memory_signals",
      `Memory signal count ${input.memories.length} exceeds max ${DEFAULT_MAX_MEMORY_SIGNALS}`
    );
  }

  if ((input.learningStabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_learning_amplification",
      "Learning stability score implies uncontrolled learning amplification"
    );
  }

  if ((input.patternRecurrenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_learning_amplification",
      "Pattern recurrence score implies uncontrolled learning amplification"
    );
  }

  for (const memory of input.memories) {
    if (!Number.isFinite(memory.memoryStrength) || memory.memoryStrength < 0 || memory.memoryStrength > 0.92) {
      return reject(
        "invalid_memory_strength",
        `Memory strength ${memory.memoryStrength} for ${memory.memoryId} is out of allowed range`
      );
    }
    for (const regionId of memory.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_memory_region",
          `Memory region ${regionId} is not in topology for ${memory.memoryId}`
        );
      }
    }
  }

  if (input.priorMemoryFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject("duplicate_memory_build", "Duplicate recommendation memory build fingerprint detected");
  }

  return { ok: true };
}

export function guardLearningExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): RecommendationLearningGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_learning_claim",
      "Learning semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedSelfLearningText(combined)) {
    return reject(
      "uncontrolled_self_learning",
      "Learning semantics imply uncontrolled or autonomous self-learning"
    );
  }
  if (combined.toLowerCase().includes("rewrite recommendation policy")) {
    return reject(
      "autonomous_recommendation_rewrite",
      "Learning semantics imply autonomous recommendation policy rewriting"
    );
  }
  return { ok: true };
}
