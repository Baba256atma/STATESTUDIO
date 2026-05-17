/**
 * D7:6:2 — Executive attention routing governance guard rails.
 */

import type { ExecutiveAttentionRoutingSignal } from "./executiveAttentionRoutingTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveAttentionRoutingDev } from "./attentionRoutingDevLog.ts";

export type ExecutiveAttentionRoutingGuardCode =
  | "empty_routing_context"
  | "too_many_routing_signals"
  | "invalid_routing_strength"
  | "invalid_routing_region"
  | "duplicate_routing_build"
  | "unsupported_routing_claim"
  | "cognitive_manipulation_detected"
  | "hidden_attention_steering"
  | "dark_pattern_urgency"
  | "runaway_routing_amplification"
  | "corrupted_routing_state";

export type ExecutiveAttentionRoutingGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveAttentionRoutingGuardCode; message: string };

export const DEFAULT_MAX_ROUTING_SIGNALS = 96;
export const ROUTING_AMBIGUITY_DISCLAIMER =
  "Executive attention routing reflects priority-flow indicators under current conditions and is indicative, not definitive.";
export const NON_MANIPULATION_ROUTING_DISCLAIMER =
  "Nexora does not control executive attention or behavior; attention routing assessment remains fully under executive authority.";

const PROHIBITED_ROUTING_TEXT = [
  "cognitive manipulation",
  "hidden attention steering",
  "dark pattern",
  "dark-pattern",
  "manipulative",
  "force attention",
  "forced attention",
  "addictive ux",
  "autonomous workflow steering",
  "override executive",
  "override judgment",
  "behavioral engineering",
] as const;

function containsProhibitedRoutingText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_ROUTING_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveAttentionRoutingGuardCode,
  message: string
): ExecutiveAttentionRoutingGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveAttentionRoutingDev("AttentionGuard", { code, message });
  return result;
}

export function buildAttentionRoutingContentFingerprint(input: {
  topologyFingerprint: string;
  cognitiveUxFingerprint?: string;
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
    cognitiveUx: input.cognitiveUxFingerprint ?? null,
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

export function guardEvaluateExecutiveAttentionRouting(input: {
  topologyId: string;
  regionIds: readonly string[];
  routingSignals: readonly ExecutiveAttentionRoutingSignal[];
  priorAttentionRoutingFingerprints?: readonly string[];
  pendingFingerprint?: string;
  focusStabilityScore?: number;
  attentionFragmentationScore?: number;
}): ExecutiveAttentionRoutingGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_routing_context",
      "Topology context is required to evaluate executive attention routing"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.routingSignals.length > DEFAULT_MAX_ROUTING_SIGNALS) {
    return reject(
      "too_many_routing_signals",
      `Routing signal count ${input.routingSignals.length} exceeds max ${DEFAULT_MAX_ROUTING_SIGNALS}`
    );
  }

  if ((input.focusStabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_routing_amplification",
      "Focus stability score implies uncontrolled routing amplification"
    );
  }

  if ((input.attentionFragmentationScore ?? 0) > 0.95) {
    return reject(
      "runaway_routing_amplification",
      "Attention fragmentation score implies uncontrolled routing amplification"
    );
  }

  for (const signal of input.routingSignals) {
    if (
      !Number.isFinite(signal.routingStrength) ||
      signal.routingStrength < 0 ||
      signal.routingStrength > 0.92
    ) {
      return reject(
        "invalid_routing_strength",
        `Routing strength ${signal.routingStrength} for ${signal.routingId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_routing_region",
          `Routing region ${regionId} is not in topology for ${signal.routingId}`
        );
      }
    }
  }

  if (input.priorAttentionRoutingFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_routing_build",
      "Duplicate executive attention routing build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardAttentionRoutingExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveAttentionRoutingGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_routing_claim",
      "Attention routing semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedRoutingText(combined)) {
    return reject(
      "cognitive_manipulation_detected",
      "Attention routing semantics imply manipulative or dark-pattern interaction design"
    );
  }
  if (combined.toLowerCase().includes("hidden attention steering")) {
    return reject("hidden_attention_steering", "Attention routing semantics imply hidden attention steering");
  }
  if (combined.toLowerCase().includes("dark pattern urgency")) {
    return reject("dark_pattern_urgency", "Attention routing semantics imply dark-pattern urgency escalation");
  }
  return { ok: true };
}
