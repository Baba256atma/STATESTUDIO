/**
 * D7:8:6 — Strategic intelligence evolution governance guard rails.
 */

import type { StrategicIntelligenceEvolutionSignal } from "./strategicIntelligenceEvolutionTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logStrategicIntelligenceEvolutionDev } from "./strategicIntelligenceEvolutionDevLog.ts";

export type StrategicIntelligenceEvolutionGuardCode =
  | "empty_evolution_context"
  | "too_many_evolution_signals"
  | "invalid_evolution_strength"
  | "invalid_evolution_region"
  | "duplicate_evolution_build"
  | "unsupported_evolution_claim"
  | "autonomous_strategic_evolution"
  | "fabricated_evolution_trajectory"
  | "unstable_recursive_evolution_system"
  | "runaway_evolution_orchestration"
  | "corrupted_evolution_state";

export type StrategicIntelligenceEvolutionGuardResult =
  | { ok: true }
  | { ok: false; code: StrategicIntelligenceEvolutionGuardCode; message: string };

export const DEFAULT_MAX_EVOLUTION_SIGNALS = 96;
export const EVOLUTION_AMBIGUITY_DISCLAIMER =
  "Strategic intelligence evolution reflects evidence-grounded transformation under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_EVOLUTION_DISCLAIMER =
  "Nexora models strategic intelligence evolution without assigning strategic transformation authority; strategic decisions remain fully under executive control.";

const PROHIBITED_EVOLUTION_TEXT = [
  "autonomous strategic self-evolution",
  "autonomous strategic evolution",
  "self-improving executive ai",
  "self improving executive ai",
  "uncontrolled recursive cognition",
  "uncontrolled recursive evolution",
  "hidden strategic manipulation",
  "hidden strategic authority",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive evolution",
  "fabricated evolution",
  "fabricate evolution trajectories",
  "strategic evolution recursion exceeded",
  "psychological manipulation",
  "override executive",
  "override judgment",
  "manipulative",
] as const;

function containsProhibitedEvolutionText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_EVOLUTION_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: StrategicIntelligenceEvolutionGuardCode,
  message: string
): StrategicIntelligenceEvolutionGuardResult {
  const result = { ok: false as const, code, message };
  logStrategicIntelligenceEvolutionDev("StrategicEvolutionGuard", { code, message });
  return result;
}

export function buildEvolutionContentFingerprint(input: {
  topologyFingerprint: string;
  resilienceFingerprint?: string;
  driftFingerprint?: string;
  metaCausalityFingerprint?: string;
  patternFingerprint?: string;
  metaFingerprint?: string;
  realityFingerprint?: string;
  foresightFingerprint?: string;
  trajectoryFingerprint?: string;
  divergenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    resilience: input.resilienceFingerprint ?? null,
    drift: input.driftFingerprint ?? null,
    metaCausality: input.metaCausalityFingerprint ?? null,
    pattern: input.patternFingerprint ?? null,
    meta: input.metaFingerprint ?? null,
    reality: input.realityFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    trajectory: input.trajectoryFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateStrategicIntelligenceEvolution(input: {
  topologyId: string;
  regionIds: readonly string[];
  evolutionSignals: readonly StrategicIntelligenceEvolutionSignal[];
  priorEvolutionFingerprints?: readonly string[];
  pendingFingerprint?: string;
  strategicEvolutionCoherenceScore?: number;
  transformationPressureScore?: number;
}): StrategicIntelligenceEvolutionGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_evolution_context",
      "Topology context is required to evaluate strategic intelligence evolution"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.evolutionSignals.length > DEFAULT_MAX_EVOLUTION_SIGNALS) {
    return reject(
      "too_many_evolution_signals",
      `Evolution signal count ${input.evolutionSignals.length} exceeds max ${DEFAULT_MAX_EVOLUTION_SIGNALS}`
    );
  }

  if ((input.strategicEvolutionCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_evolution_orchestration",
      "Strategic evolution coherence score implies uncontrolled evolution orchestration"
    );
  }

  if ((input.transformationPressureScore ?? 0) > 0.95) {
    return reject(
      "runaway_evolution_orchestration",
      "Transformation pressure score implies uncontrolled evolution orchestration"
    );
  }

  for (const signal of input.evolutionSignals) {
    if (
      !Number.isFinite(signal.evolutionStrength) ||
      signal.evolutionStrength < 0 ||
      signal.evolutionStrength > 0.92
    ) {
      return reject(
        "invalid_evolution_strength",
        `Evolution strength ${signal.evolutionStrength} for ${signal.evolutionId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_evolution_region",
          `Evolution region ${regionId} is not in topology for ${signal.evolutionId}`
        );
      }
    }
  }

  if (input.priorEvolutionFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_evolution_build",
      "Duplicate strategic intelligence evolution build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardStrategicIntelligenceEvolutionSemantics(input: {
  headline: string;
  summary: string;
}): StrategicIntelligenceEvolutionGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_evolution_claim",
      "Strategic evolution semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedEvolutionText(combined)) {
    return reject(
      "fabricated_evolution_trajectory",
      "Strategic evolution semantics imply fabricated evolution or autonomous strategic self-evolution"
    );
  }
  if (combined.toLowerCase().includes("autonomous strategic evolution")) {
    return reject(
      "autonomous_strategic_evolution",
      "Strategic evolution semantics imply autonomous strategic evolution"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive evolution")) {
    return reject(
      "unstable_recursive_evolution_system",
      "Strategic evolution semantics imply unstable recursive evolution systems"
    );
  }
  return { ok: true };
}
