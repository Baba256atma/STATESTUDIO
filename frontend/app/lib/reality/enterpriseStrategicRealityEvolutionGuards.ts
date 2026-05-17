/**
 * D7:7:6 — Enterprise strategic reality evolution governance guard rails.
 */

import type { EnterpriseStrategicRealityEvolutionSignal } from "./enterpriseStrategicRealityEvolutionTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logEnterpriseStrategicRealityEvolutionDev } from "./enterpriseStrategicRealityEvolutionDevLog.ts";

export type EnterpriseStrategicRealityEvolutionGuardCode =
  | "empty_evolution_context"
  | "too_many_evolution_signals"
  | "invalid_evolution_strength"
  | "invalid_evolution_region"
  | "duplicate_evolution_build"
  | "unsupported_evolution_claim"
  | "autonomous_organizational_transformation"
  | "fabricated_transformation_narrative"
  | "unstable_recursive_evolution"
  | "runaway_evolution_orchestration"
  | "corrupted_evolution_state";

export type EnterpriseStrategicRealityEvolutionGuardResult =
  | { ok: true }
  | { ok: false; code: EnterpriseStrategicRealityEvolutionGuardCode; message: string };

export const DEFAULT_MAX_EVOLUTION_SIGNALS = 96;
export const EVOLUTION_AMBIGUITY_DISCLAIMER =
  "Strategic reality evolution reflects evidence-grounded transformation under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_EVOLUTION_DISCLAIMER =
  "Nexora models enterprise reality evolution without assigning organizational transformation authority; strategic decisions remain fully under executive control.";

const PROHIBITED_EVOLUTION_TEXT = [
  "autonomous organizational transformation",
  "autonomous enterprise evolution",
  "self-directed organizational transformation",
  "self directed organizational transformation",
  "uncontrolled adaptive ai",
  "uncontrolled adaptive superintelligence",
  "hidden transformation authority",
  "hidden governance optimization",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive evolution",
  "fabricated transformation narrative",
  "fabricate evolutionary trajectories",
  "autonomous enterprise transformation",
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
  code: EnterpriseStrategicRealityEvolutionGuardCode,
  message: string
): EnterpriseStrategicRealityEvolutionGuardResult {
  const result = { ok: false as const, code, message };
  logEnterpriseStrategicRealityEvolutionDev("EvolutionGuard", { code, message });
  return result;
}

export function buildEvolutionContentFingerprint(input: {
  topologyFingerprint: string;
  resilienceFingerprint?: string;
  driftFingerprint?: string;
  causalityFingerprint?: string;
  syncFingerprint?: string;
  realityFingerprint?: string;
  orchestrationFingerprint?: string;
  momentumFingerprint?: string;
  equilibriumFingerprint?: string;
  governanceFingerprint?: string;
  foresightFingerprint?: string;
  trajectoryFingerprint?: string;
  divergenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    resilience: input.resilienceFingerprint ?? null,
    drift: input.driftFingerprint ?? null,
    causality: input.causalityFingerprint ?? null,
    sync: input.syncFingerprint ?? null,
    reality: input.realityFingerprint ?? null,
    orchestration: input.orchestrationFingerprint ?? null,
    momentum: input.momentumFingerprint ?? null,
    equilibrium: input.equilibriumFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    trajectory: input.trajectoryFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateStrategicRealityEvolution(input: {
  topologyId: string;
  regionIds: readonly string[];
  evolutionSignals: readonly EnterpriseStrategicRealityEvolutionSignal[];
  priorEvolutionFingerprints?: readonly string[];
  pendingFingerprint?: string;
  transformationCoherenceScore?: number;
  transitionInstabilityScore?: number;
}): EnterpriseStrategicRealityEvolutionGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_evolution_context",
      "Topology context is required to evaluate strategic reality evolution"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.evolutionSignals.length > DEFAULT_MAX_EVOLUTION_SIGNALS) {
    return reject(
      "too_many_evolution_signals",
      `Evolution signal count ${input.evolutionSignals.length} exceeds max ${DEFAULT_MAX_EVOLUTION_SIGNALS}`
    );
  }

  if ((input.transformationCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_evolution_orchestration",
      "Transformation coherence score implies uncontrolled evolution orchestration"
    );
  }

  if ((input.transitionInstabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_evolution_orchestration",
      "Transition instability score implies uncontrolled evolution orchestration"
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
      "Duplicate enterprise strategic reality evolution build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardEnterpriseStrategicRealityEvolutionSemantics(input: {
  headline: string;
  summary: string;
}): EnterpriseStrategicRealityEvolutionGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_evolution_claim",
      "Evolution semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedEvolutionText(combined)) {
    return reject(
      "fabricated_transformation_narrative",
      "Evolution semantics imply fabricated transformation narratives or autonomous organizational transformation"
    );
  }
  if (combined.toLowerCase().includes("autonomous organizational transformation")) {
    return reject(
      "autonomous_organizational_transformation",
      "Evolution semantics imply autonomous organizational transformation"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive evolution")) {
    return reject(
      "unstable_recursive_evolution",
      "Evolution semantics imply unstable recursive evolution"
    );
  }
  return { ok: true };
}
