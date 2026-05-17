/**
 * D7:6:4 — Executive insight prioritization governance guard rails.
 */

import type { ExecutiveInsightPrioritySignal } from "./executiveInsightPrioritizationTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveInsightPrioritizationDev } from "./insightPrioritizationDevLog.ts";

export type ExecutiveInsightPrioritizationGuardCode =
  | "empty_prioritization_context"
  | "too_many_insight_signals"
  | "invalid_insight_strength"
  | "invalid_insight_region"
  | "duplicate_prioritization_build"
  | "unsupported_prioritization_claim"
  | "manipulative_urgency_inflation"
  | "hidden_prioritization_bias"
  | "artificial_executive_steering"
  | "runaway_insight_escalation"
  | "corrupted_prioritization_state";

export type ExecutiveInsightPrioritizationGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveInsightPrioritizationGuardCode; message: string };

export const DEFAULT_MAX_INSIGHT_SIGNALS = 96;
export const PRIORITIZATION_AMBIGUITY_DISCLAIMER =
  "Executive insight prioritization reflects strategic-value indicators under current conditions and is indicative, not definitive.";
export const NON_MANIPULATION_PRIORITIZATION_DISCLAIMER =
  "Nexora does not influence executive perception or focus; insight prioritization remains fully under executive authority.";

const PROHIBITED_PRIORITIZATION_TEXT = [
  "psychological manipulation",
  "behavioral conditioning",
  "addictive urgency",
  "addictive ux",
  "attention addiction",
  "hidden prioritization bias",
  "hidden executive steering",
  "artificial executive steering",
  "force attention",
  "forced attention",
  "manipulative",
  "override executive",
  "override judgment",
  "inflate urgency",
] as const;

function containsProhibitedPrioritizationText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_PRIORITIZATION_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveInsightPrioritizationGuardCode,
  message: string
): ExecutiveInsightPrioritizationGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveInsightPrioritizationDev("PriorityGuard", { code, message });
  return result;
}

export function buildInsightPrioritizationContentFingerprint(input: {
  topologyFingerprint: string;
  cognitiveLoadFingerprint?: string;
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
    cognitiveLoad: input.cognitiveLoadFingerprint ?? null,
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

export function guardEvaluateExecutiveInsightPrioritization(input: {
  topologyId: string;
  regionIds: readonly string[];
  insightSignals: readonly ExecutiveInsightPrioritySignal[];
  priorInsightPrioritizationFingerprints?: readonly string[];
  pendingFingerprint?: string;
  strategicInsightScore?: number;
  urgencyEscalationScore?: number;
}): ExecutiveInsightPrioritizationGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_prioritization_context",
      "Topology context is required to evaluate executive insight prioritization"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.insightSignals.length > DEFAULT_MAX_INSIGHT_SIGNALS) {
    return reject(
      "too_many_insight_signals",
      `Insight signal count ${input.insightSignals.length} exceeds max ${DEFAULT_MAX_INSIGHT_SIGNALS}`
    );
  }

  if ((input.strategicInsightScore ?? 0) > 0.95) {
    return reject(
      "runaway_insight_escalation",
      "Strategic insight score implies uncontrolled prioritization escalation"
    );
  }

  if ((input.urgencyEscalationScore ?? 0) > 0.95) {
    return reject(
      "runaway_insight_escalation",
      "Urgency escalation score implies uncontrolled prioritization escalation"
    );
  }

  for (const signal of input.insightSignals) {
    if (
      !Number.isFinite(signal.priorityStrength) ||
      signal.priorityStrength < 0 ||
      signal.priorityStrength > 0.92
    ) {
      return reject(
        "invalid_insight_strength",
        `Insight strength ${signal.priorityStrength} for ${signal.insightId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_insight_region",
          `Insight region ${regionId} is not in topology for ${signal.insightId}`
        );
      }
    }
  }

  if (input.priorInsightPrioritizationFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_prioritization_build",
      "Duplicate executive insight prioritization build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardInsightPrioritizationExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveInsightPrioritizationGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_prioritization_claim",
      "Insight prioritization semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedPrioritizationText(combined)) {
    return reject(
      "manipulative_urgency_inflation",
      "Insight prioritization semantics imply manipulative urgency or hidden bias"
    );
  }
  if (combined.toLowerCase().includes("hidden executive steering")) {
    return reject(
      "artificial_executive_steering",
      "Insight prioritization semantics imply artificial executive steering"
    );
  }
  if (combined.toLowerCase().includes("hidden prioritization bias")) {
    return reject(
      "hidden_prioritization_bias",
      "Insight prioritization semantics imply hidden prioritization bias"
    );
  }
  return { ok: true };
}
