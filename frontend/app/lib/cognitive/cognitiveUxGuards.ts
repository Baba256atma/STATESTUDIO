/**
 * D7:6:1 — Executive cognitive UX governance guard rails.
 */

import type { ExecutiveCognitiveSignal } from "./executiveCognitiveUxTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveCognitiveUxDev } from "./cognitiveUxDevLog.ts";

export type ExecutiveCognitiveUxGuardCode =
  | "empty_cognitive_context"
  | "too_many_cognitive_signals"
  | "invalid_cognitive_strength"
  | "invalid_cognitive_region"
  | "duplicate_cognitive_build"
  | "unsupported_cognitive_claim"
  | "cognitive_manipulation_detected"
  | "dark_pattern_ux_detected"
  | "hidden_attention_steering"
  | "runaway_cognitive_amplification"
  | "corrupted_cognitive_state";

export type ExecutiveCognitiveUxGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveCognitiveUxGuardCode; message: string };

export const DEFAULT_MAX_COGNITIVE_SIGNALS = 96;
export const COGNITIVE_AMBIGUITY_DISCLAIMER =
  "Executive cognitive UX intelligence reflects attention-priority indicators under current conditions and is indicative, not definitive.";
export const NON_MANIPULATION_UX_DISCLAIMER =
  "Nexora does not steer executive attention or behavior; cognitive UX orchestration remains fully under executive control.";

const PROHIBITED_UX_TEXT = [
  "cognitive manipulation",
  "dark pattern",
  "dark-pattern",
  "hidden attention steering",
  "hidden persuasion",
  "force attention",
  "forced attention",
  "manipulative ux",
  "autonomous workflow",
  "override executive",
  "override judgment",
  "gaming-style",
] as const;

function containsProhibitedUxText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_UX_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveCognitiveUxGuardCode,
  message: string
): ExecutiveCognitiveUxGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveCognitiveUxDev("CognitiveGuard", { code, message });
  return result;
}

export function buildCognitiveUxContentFingerprint(input: {
  topologyFingerprint: string;
  orchestrationFingerprint?: string;
  consensusFingerprint?: string;
  advisoryFingerprint?: string;
  explainabilityFingerprint?: string;
  governanceFingerprint?: string;
  recommendationFingerprint?: string;
  confidenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    orchestration: input.orchestrationFingerprint ?? null,
    consensus: input.consensusFingerprint ?? null,
    advisory: input.advisoryFingerprint ?? null,
    explainability: input.explainabilityFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    recommendation: input.recommendationFingerprint ?? null,
    confidence: input.confidenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateExecutiveCognitiveUx(input: {
  topologyId: string;
  regionIds: readonly string[];
  cognitiveSignals: readonly ExecutiveCognitiveSignal[];
  priorCognitiveUxFingerprints?: readonly string[];
  pendingFingerprint?: string;
  cognitiveClarityScore?: number;
  cognitiveLoadScore?: number;
}): ExecutiveCognitiveUxGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_cognitive_context",
      "Topology context is required to evaluate executive cognitive UX"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.cognitiveSignals.length > DEFAULT_MAX_COGNITIVE_SIGNALS) {
    return reject(
      "too_many_cognitive_signals",
      `Cognitive signal count ${input.cognitiveSignals.length} exceeds max ${DEFAULT_MAX_COGNITIVE_SIGNALS}`
    );
  }

  if ((input.cognitiveClarityScore ?? 0) > 0.95) {
    return reject(
      "runaway_cognitive_amplification",
      "Cognitive clarity score implies uncontrolled UX amplification"
    );
  }

  if ((input.cognitiveLoadScore ?? 0) > 0.95) {
    return reject(
      "runaway_cognitive_amplification",
      "Cognitive load score implies uncontrolled UX amplification"
    );
  }

  for (const signal of input.cognitiveSignals) {
    if (
      !Number.isFinite(signal.cognitiveStrength) ||
      signal.cognitiveStrength < 0 ||
      signal.cognitiveStrength > 0.92
    ) {
      return reject(
        "invalid_cognitive_strength",
        `Cognitive strength ${signal.cognitiveStrength} for ${signal.signalId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_cognitive_region",
          `Cognitive region ${regionId} is not in topology for ${signal.signalId}`
        );
      }
    }
  }

  if (input.priorCognitiveUxFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_cognitive_build",
      "Duplicate executive cognitive UX build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardCognitiveUxExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveCognitiveUxGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_cognitive_claim",
      "Cognitive UX semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedUxText(combined)) {
    return reject(
      "cognitive_manipulation_detected",
      "Cognitive UX semantics imply manipulative or dark-pattern interaction design"
    );
  }
  if (combined.toLowerCase().includes("dark pattern ux")) {
    return reject("dark_pattern_ux_detected", "Cognitive UX semantics imply dark-pattern behavior");
  }
  if (combined.toLowerCase().includes("hidden attention steering")) {
    return reject("hidden_attention_steering", "Cognitive UX semantics imply hidden attention steering");
  }
  return { ok: true };
}
