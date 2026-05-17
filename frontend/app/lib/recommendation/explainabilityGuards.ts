/**
 * D7:5:7 — Executive decision explainability governance guard rails.
 */

import type { ExecutiveExplainabilitySignal } from "./executiveExplainabilityTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveDecisionExplainabilityDev } from "./explainabilityDevLog.ts";

export type ExecutiveDecisionExplainabilityGuardCode =
  | "empty_explainability_context"
  | "too_many_explanation_signals"
  | "invalid_explanation_strength"
  | "invalid_explanation_region"
  | "duplicate_explainability_build"
  | "unsupported_explanation_claim"
  | "opaque_reasoning_detected"
  | "fabricated_explanation"
  | "runaway_explainability_amplification"
  | "corrupted_explainability_state";

export type ExecutiveDecisionExplainabilityGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveDecisionExplainabilityGuardCode; message: string };

export const DEFAULT_MAX_EXPLAINABILITY_SIGNALS = 96;
export const EXPLAINABILITY_AMBIGUITY_DISCLAIMER =
  "Explanations trace observable operational signals under current conditions and are indicative, not definitive.";
export const NON_OPAQUE_REASONING_DISCLAIMER =
  "Nexora surfaces traceable signal pathways; executives retain full authority to audit and challenge strategic intelligence.";

const PROHIBITED_OPAQUE_TEXT = [
  "black-box",
  "black box",
  "opaque reasoning",
  "hidden logic",
  "hidden recommendation",
  "fabricated explanation",
  "speculative hallucination",
  "recursion exceeded",
  "reasoning exceeded",
  "cannot explain",
  "proprietary model",
] as const;

function containsProhibitedOpaqueText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_OPAQUE_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveDecisionExplainabilityGuardCode,
  message: string
): ExecutiveDecisionExplainabilityGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveDecisionExplainabilityDev("ExplainabilityGuard", { code, message });
  return result;
}

export function buildExplainabilityContentFingerprint(input: {
  topologyFingerprint: string;
  governanceFingerprint?: string;
  memoryFingerprint?: string;
  comparisonFingerprint?: string;
  recommendationFingerprint?: string;
  confidenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    governance: input.governanceFingerprint ?? null,
    memory: input.memoryFingerprint ?? null,
    comparison: input.comparisonFingerprint ?? null,
    recommendation: input.recommendationFingerprint ?? null,
    confidence: input.confidenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateDecisionExplainability(input: {
  topologyId: string;
  regionIds: readonly string[];
  explanations: readonly ExecutiveExplainabilitySignal[];
  priorExplainabilityFingerprints?: readonly string[];
  pendingFingerprint?: string;
  explanationClarityScore?: number;
  reasoningTransparencyScore?: number;
}): ExecutiveDecisionExplainabilityGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_explainability_context",
      "Topology context is required to evaluate decision explainability"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.explanations.length > DEFAULT_MAX_EXPLAINABILITY_SIGNALS) {
    return reject(
      "too_many_explanation_signals",
      `Explanation signal count ${input.explanations.length} exceeds max ${DEFAULT_MAX_EXPLAINABILITY_SIGNALS}`
    );
  }

  if ((input.explanationClarityScore ?? 0) > 0.95) {
    return reject(
      "runaway_explainability_amplification",
      "Explanation clarity score implies uncontrolled explainability amplification"
    );
  }

  if ((input.reasoningTransparencyScore ?? 0) > 0.95) {
    return reject(
      "runaway_explainability_amplification",
      "Reasoning transparency score implies uncontrolled explainability amplification"
    );
  }

  for (const explanation of input.explanations) {
    if (
      !Number.isFinite(explanation.explanationStrength) ||
      explanation.explanationStrength < 0 ||
      explanation.explanationStrength > 0.92
    ) {
      return reject(
        "invalid_explanation_strength",
        `Explanation strength ${explanation.explanationStrength} for ${explanation.explanationId} is out of allowed range`
      );
    }
    for (const regionId of explanation.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_explanation_region",
          `Explanation region ${regionId} is not in topology for ${explanation.explanationId}`
        );
      }
    }
  }

  if (input.priorExplainabilityFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_explainability_build",
      "Duplicate decision explainability build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardExplainabilityExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveDecisionExplainabilityGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_explanation_claim",
      "Explainability semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedOpaqueText(combined)) {
    return reject("opaque_reasoning_detected", "Explainability semantics imply opaque or black-box reasoning");
  }
  if (combined.toLowerCase().includes("unsupported narrative")) {
    return reject(
      "fabricated_explanation",
      "Explainability semantics imply fabricated or unsupported explanation narratives"
    );
  }
  return { ok: true };
}
