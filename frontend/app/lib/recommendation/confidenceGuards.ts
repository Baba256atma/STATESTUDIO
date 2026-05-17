/**
 * D7:5:2 — Recommendation confidence governance guard rails.
 */

import type { RecommendationConfidenceSignal } from "./recommendationConfidenceTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logConfidenceDev } from "./confidenceDevLog.ts";

export type ConfidenceGuardCode =
  | "empty_confidence_context"
  | "too_many_confidence_signals"
  | "invalid_evidence_strength"
  | "invalid_confidence_region"
  | "duplicate_confidence_build"
  | "false_certainty_language"
  | "unsupported_confidence_claim"
  | "runaway_confidence_amplification"
  | "corrupted_confidence_state";

export type ConfidenceGuardResult =
  | { ok: true }
  | { ok: false; code: ConfidenceGuardCode; message: string };

export const DEFAULT_MAX_CONFIDENCE_SIGNALS = 96;
export const CONFIDENCE_UNCERTAINTY_DISCLAIMER =
  "Recommendation confidence scores reflect evidence strength under current conditions and are indicative, not definitive.";

function reject(code: ConfidenceGuardCode, message: string): ConfidenceGuardResult {
  const result = { ok: false as const, code, message };
  logConfidenceDev("ConfidenceGuard", { code, message });
  return result;
}

export function buildConfidenceContentFingerprint(input: {
  topologyFingerprint: string;
  recommendationFingerprint?: string;
  foresightFingerprint?: string;
  divergenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    recommendation: input.recommendationFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateRecommendationConfidence(input: {
  topologyId: string;
  regionIds: readonly string[];
  signals: readonly RecommendationConfidenceSignal[];
  priorConfidenceFingerprints?: readonly string[];
  pendingFingerprint?: string;
  overallConfidenceScore?: number;
  evidenceStabilityScore?: number;
}): ConfidenceGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_confidence_context",
      "Topology context is required to evaluate recommendation confidence"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_CONFIDENCE_SIGNALS) {
    return reject(
      "too_many_confidence_signals",
      `Confidence signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_CONFIDENCE_SIGNALS}`
    );
  }

  if ((input.overallConfidenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_confidence_amplification",
      "Overall confidence score implies uncontrolled confidence amplification"
    );
  }

  if ((input.evidenceStabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_confidence_amplification",
      "Evidence stability score implies uncontrolled confidence amplification"
    );
  }

  for (const signal of input.signals) {
    if (signal.evidenceStrength < 0 || signal.evidenceStrength > 1) {
      return reject(
        "invalid_evidence_strength",
        `Confidence signal ${signal.recommendationId} evidence strength must be between 0 and 1`
      );
    }
    if (signal.evidenceStrength > 0.92) {
      return reject(
        "false_certainty_language",
        `Confidence signal ${signal.recommendationId} evidence strength implies excessive certainty`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_confidence_region",
          `Confidence signal ${signal.recommendationId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsFalseCertaintyText(label)) {
      return reject(
        "unsupported_confidence_claim",
        `Confidence signal ${signal.recommendationId} contains prohibited certainty language`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorConfidenceFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_confidence_build",
      "Identical recommendation confidence evaluation was already executed"
    );
  }

  return { ok: true };
}

export function guardConfidenceExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): ConfidenceGuardResult {
  if (containsFalseCertaintyText(input.headline)) {
    return reject(
      "unsupported_confidence_claim",
      "Confidence headline contains prohibited certainty language"
    );
  }
  if (containsFalseCertaintyText(input.summary)) {
    return reject(
      "unsupported_confidence_claim",
      "Confidence summary contains prohibited certainty language"
    );
  }
  return { ok: true };
}
