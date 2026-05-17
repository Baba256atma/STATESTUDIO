/**
 * D7:6:3 — Executive cognitive load balancing governance guard rails.
 */

import type { ExecutiveCognitiveLoadSignal } from "./executiveCognitiveLoadTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveCognitiveLoadBalancingDev } from "./cognitiveLoadBalancingDevLog.ts";

export type ExecutiveCognitiveLoadBalancingGuardCode =
  | "empty_load_context"
  | "too_many_load_signals"
  | "invalid_load_strength"
  | "invalid_load_region"
  | "duplicate_load_build"
  | "unsupported_load_claim"
  | "psychological_manipulation_detected"
  | "addictive_urgency_detected"
  | "hidden_cognitive_steering"
  | "runaway_load_amplification"
  | "corrupted_load_state";

export type ExecutiveCognitiveLoadBalancingGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveCognitiveLoadBalancingGuardCode; message: string };

export const DEFAULT_MAX_LOAD_SIGNALS = 96;
export const LOAD_AMBIGUITY_DISCLAIMER =
  "Executive cognitive load balancing reflects workload indicators under current conditions and is indicative, not definitive.";
export const NON_MANIPULATION_LOAD_DISCLAIMER =
  "Nexora does not influence executive psychology or behavior; cognitive load assessment remains fully under executive authority.";

const PROHIBITED_LOAD_TEXT = [
  "psychological manipulation",
  "behavioral conditioning",
  "addictive urgency",
  "addictive ux",
  "productivity addiction",
  "hidden cognitive steering",
  "hidden executive steering",
  "force attention",
  "forced attention",
  "manipulative",
  "override executive",
  "override judgment",
] as const;

function containsProhibitedLoadText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_LOAD_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveCognitiveLoadBalancingGuardCode,
  message: string
): ExecutiveCognitiveLoadBalancingGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveCognitiveLoadBalancingDev("LoadGuard", { code, message });
  return result;
}

export function buildCognitiveLoadContentFingerprint(input: {
  topologyFingerprint: string;
  attentionRoutingFingerprint?: string;
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
    attentionRouting: input.attentionRoutingFingerprint ?? null,
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

export function guardEvaluateExecutiveCognitiveLoad(input: {
  topologyId: string;
  regionIds: readonly string[];
  loadSignals: readonly ExecutiveCognitiveLoadSignal[];
  priorCognitiveLoadFingerprints?: readonly string[];
  pendingFingerprint?: string;
  cognitiveBalanceScore?: number;
  overloadEscalationScore?: number;
}): ExecutiveCognitiveLoadBalancingGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_load_context",
      "Topology context is required to evaluate executive cognitive load balancing"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.loadSignals.length > DEFAULT_MAX_LOAD_SIGNALS) {
    return reject(
      "too_many_load_signals",
      `Load signal count ${input.loadSignals.length} exceeds max ${DEFAULT_MAX_LOAD_SIGNALS}`
    );
  }

  if ((input.cognitiveBalanceScore ?? 0) > 0.95) {
    return reject(
      "runaway_load_amplification",
      "Cognitive balance score implies uncontrolled load amplification"
    );
  }

  if ((input.overloadEscalationScore ?? 0) > 0.95) {
    return reject(
      "runaway_load_amplification",
      "Overload escalation score implies uncontrolled load amplification"
    );
  }

  for (const signal of input.loadSignals) {
    if (
      !Number.isFinite(signal.loadStrength) ||
      signal.loadStrength < 0 ||
      signal.loadStrength > 0.92
    ) {
      return reject(
        "invalid_load_strength",
        `Load strength ${signal.loadStrength} for ${signal.loadId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_load_region",
          `Load region ${regionId} is not in topology for ${signal.loadId}`
        );
      }
    }
  }

  if (input.priorCognitiveLoadFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_load_build",
      "Duplicate executive cognitive load build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardCognitiveLoadExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveCognitiveLoadBalancingGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_load_claim",
      "Cognitive load semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedLoadText(combined)) {
    return reject(
      "psychological_manipulation_detected",
      "Cognitive load semantics imply psychological manipulation or behavioral conditioning"
    );
  }
  if (combined.toLowerCase().includes("addictive urgency")) {
    return reject("addictive_urgency_detected", "Cognitive load semantics imply addictive urgency systems");
  }
  if (combined.toLowerCase().includes("hidden cognitive steering")) {
    return reject("hidden_cognitive_steering", "Cognitive load semantics imply hidden cognitive steering");
  }
  return { ok: true };
}
