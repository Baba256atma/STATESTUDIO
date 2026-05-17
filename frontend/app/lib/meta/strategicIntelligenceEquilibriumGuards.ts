/**
 * D7:8:7 — Strategic intelligence equilibrium governance guard rails.
 */

import type { StrategicIntelligenceEquilibriumSignal } from "./strategicIntelligenceEquilibriumTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logStrategicIntelligenceEquilibriumDev } from "./strategicIntelligenceEquilibriumDevLog.ts";

export type StrategicIntelligenceEquilibriumGuardCode =
  | "empty_equilibrium_context"
  | "too_many_equilibrium_signals"
  | "invalid_equilibrium_strength"
  | "invalid_equilibrium_region"
  | "duplicate_equilibrium_build"
  | "unsupported_equilibrium_claim"
  | "autonomous_strategic_equilibrium"
  | "fabricated_equilibrium_balance"
  | "unstable_recursive_equilibrium_system"
  | "runaway_equilibrium_orchestration"
  | "corrupted_equilibrium_state";

export type StrategicIntelligenceEquilibriumGuardResult =
  | { ok: true }
  | { ok: false; code: StrategicIntelligenceEquilibriumGuardCode; message: string };

export const DEFAULT_MAX_EQUILIBRIUM_SIGNALS = 96;
export const EQUILIBRIUM_AMBIGUITY_DISCLAIMER =
  "Strategic intelligence equilibrium reflects evidence-grounded balance under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER =
  "Nexora models strategic intelligence equilibrium without assigning strategic balance authority; strategic decisions remain fully under executive control.";

const PROHIBITED_EQUILIBRIUM_TEXT = [
  "autonomous strategic equilibrium",
  "self-balancing executive ai",
  "self balancing executive ai",
  "uncontrolled recursive cognition",
  "uncontrolled recursive equilibrium",
  "hidden strategic manipulation",
  "hidden strategic authority",
  "executive replacement ai",
  "unstable recursive equilibrium",
  "fabricated equilibrium",
  "fabricate equilibrium balance",
  "strategic equilibrium recursion exceeded",
  "psychological manipulation",
  "override executive",
  "manipulative",
] as const;

function containsProhibitedEquilibriumText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_EQUILIBRIUM_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: StrategicIntelligenceEquilibriumGuardCode,
  message: string
): StrategicIntelligenceEquilibriumGuardResult {
  const result = { ok: false as const, code, message };
  logStrategicIntelligenceEquilibriumDev("StrategicEquilibriumGuard", { code, message });
  return result;
}

export function buildEquilibriumContentFingerprint(input: {
  topologyFingerprint: string;
  evolutionFingerprint?: string;
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
    evolution: input.evolutionFingerprint ?? null,
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

export function guardEvaluateStrategicIntelligenceEquilibrium(input: {
  topologyId: string;
  regionIds: readonly string[];
  equilibriumSignals: readonly StrategicIntelligenceEquilibriumSignal[];
  priorEquilibriumFingerprints?: readonly string[];
  pendingFingerprint?: string;
  strategicEquilibriumCoherenceScore?: number;
  equilibriumPressureScore?: number;
}): StrategicIntelligenceEquilibriumGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_equilibrium_context",
      "Topology context is required to evaluate strategic intelligence equilibrium"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.equilibriumSignals.length > DEFAULT_MAX_EQUILIBRIUM_SIGNALS) {
    return reject(
      "too_many_equilibrium_signals",
      `Equilibrium signal count ${input.equilibriumSignals.length} exceeds max ${DEFAULT_MAX_EQUILIBRIUM_SIGNALS}`
    );
  }

  if ((input.strategicEquilibriumCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_equilibrium_orchestration",
      "Strategic equilibrium coherence score implies uncontrolled equilibrium orchestration"
    );
  }

  if ((input.equilibriumPressureScore ?? 0) > 0.95) {
    return reject(
      "runaway_equilibrium_orchestration",
      "Equilibrium pressure score implies uncontrolled equilibrium orchestration"
    );
  }

  for (const signal of input.equilibriumSignals) {
    if (
      !Number.isFinite(signal.equilibriumStrength) ||
      signal.equilibriumStrength < 0 ||
      signal.equilibriumStrength > 0.92
    ) {
      return reject(
        "invalid_equilibrium_strength",
        `Equilibrium strength ${signal.equilibriumStrength} for ${signal.equilibriumId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_equilibrium_region",
          `Equilibrium region ${regionId} is not in topology for ${signal.equilibriumId}`
        );
      }
    }
  }

  if (input.priorEquilibriumFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_equilibrium_build",
      "Duplicate strategic intelligence equilibrium build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardStrategicIntelligenceEquilibriumSemantics(input: {
  headline: string;
  summary: string;
}): StrategicIntelligenceEquilibriumGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_equilibrium_claim",
      "Strategic equilibrium semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedEquilibriumText(combined)) {
    return reject(
      "fabricated_equilibrium_balance",
      "Strategic equilibrium semantics imply fabricated balance or autonomous strategic equilibrium"
    );
  }
  if (combined.toLowerCase().includes("autonomous strategic equilibrium")) {
    return reject(
      "autonomous_strategic_equilibrium",
      "Strategic equilibrium semantics imply autonomous strategic equilibrium"
    );
  }
  return { ok: true };
}
