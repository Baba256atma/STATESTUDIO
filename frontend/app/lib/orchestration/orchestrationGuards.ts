/**
 * D7:5:10 — Unified executive orchestration governance guard rails.
 */

import type { UnifiedExecutiveOrchestrationSignal } from "./unifiedExecutiveOrchestrationTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logUnifiedExecutiveOrchestrationDev } from "./orchestrationDevLog.ts";

export type UnifiedExecutiveOrchestrationGuardCode =
  | "empty_orchestration_context"
  | "too_many_orchestration_signals"
  | "invalid_orchestration_strength"
  | "invalid_orchestration_region"
  | "duplicate_orchestration_build"
  | "unsupported_orchestration_claim"
  | "autonomous_orchestration_authority"
  | "hidden_executive_control"
  | "runaway_orchestration_amplification"
  | "corrupted_orchestration_state";

export type UnifiedExecutiveOrchestrationGuardResult =
  | { ok: true }
  | { ok: false; code: UnifiedExecutiveOrchestrationGuardCode; message: string };

export const DEFAULT_MAX_ORCHESTRATION_SIGNALS = 96;
export const ORCHESTRATION_AMBIGUITY_DISCLAIMER =
  "Unified orchestration intelligence reflects cross-system coordination indicators under current conditions and is indicative, not definitive.";
export const NON_AUTONOMOUS_ORCHESTRATION_DISCLAIMER =
  "Nexora does not execute strategic actions without executive authority; unified orchestration assessment remains fully under executive control.";

const PROHIBITED_ORCHESTRATION_TEXT = [
  "autonomous orchestration authority",
  "hidden executive control",
  "override executive",
  "override judgment",
  "autonomous strategic command",
  "self-governing executive",
  "executive replacement",
  "autonomous enterprise superintelligence",
  "orchestration enforcement",
  "mandate strategic action",
] as const;

function containsProhibitedOrchestrationText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_ORCHESTRATION_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: UnifiedExecutiveOrchestrationGuardCode,
  message: string
): UnifiedExecutiveOrchestrationGuardResult {
  const result = { ok: false as const, code, message };
  logUnifiedExecutiveOrchestrationDev("OrchestrationGuard", { code, message });
  return result;
}

export function buildOrchestrationContentFingerprint(input: {
  topologyFingerprint: string;
  consensusFingerprint?: string;
  advisoryFingerprint?: string;
  explainabilityFingerprint?: string;
  governanceFingerprint?: string;
  memoryFingerprint?: string;
  comparisonFingerprint?: string;
  recommendationFingerprint?: string;
  confidenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    consensus: input.consensusFingerprint ?? null,
    advisory: input.advisoryFingerprint ?? null,
    explainability: input.explainabilityFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    memory: input.memoryFingerprint ?? null,
    comparison: input.comparisonFingerprint ?? null,
    recommendation: input.recommendationFingerprint ?? null,
    confidence: input.confidenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateUnifiedExecutiveOrchestration(input: {
  topologyId: string;
  regionIds: readonly string[];
  orchestrationSignals: readonly UnifiedExecutiveOrchestrationSignal[];
  priorOrchestrationFingerprints?: readonly string[];
  pendingFingerprint?: string;
  orchestrationCoherenceScore?: number;
  orchestrationInstabilityScore?: number;
}): UnifiedExecutiveOrchestrationGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_orchestration_context",
      "Topology context is required to evaluate unified executive orchestration"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.orchestrationSignals.length > DEFAULT_MAX_ORCHESTRATION_SIGNALS) {
    return reject(
      "too_many_orchestration_signals",
      `Orchestration signal count ${input.orchestrationSignals.length} exceeds max ${DEFAULT_MAX_ORCHESTRATION_SIGNALS}`
    );
  }

  if ((input.orchestrationCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_orchestration_amplification",
      "Orchestration coherence score implies uncontrolled orchestration amplification"
    );
  }

  if ((input.orchestrationInstabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_orchestration_amplification",
      "Orchestration instability score implies uncontrolled orchestration amplification"
    );
  }

  for (const signal of input.orchestrationSignals) {
    if (
      !Number.isFinite(signal.orchestrationStrength) ||
      signal.orchestrationStrength < 0 ||
      signal.orchestrationStrength > 0.92
    ) {
      return reject(
        "invalid_orchestration_strength",
        `Orchestration strength ${signal.orchestrationStrength} for ${signal.orchestrationId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_orchestration_region",
          `Orchestration region ${regionId} is not in topology for ${signal.orchestrationId}`
        );
      }
    }
  }

  if (input.priorOrchestrationFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_orchestration_build",
      "Duplicate unified executive orchestration build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardOrchestrationExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): UnifiedExecutiveOrchestrationGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_orchestration_claim",
      "Orchestration semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedOrchestrationText(combined)) {
    return reject(
      "autonomous_orchestration_authority",
      "Orchestration semantics imply autonomous orchestration authority or hidden control"
    );
  }
  if (combined.toLowerCase().includes("autonomously execute strategic")) {
    return reject(
      "hidden_executive_control",
      "Orchestration semantics imply autonomous strategic execution"
    );
  }
  return { ok: true };
}
