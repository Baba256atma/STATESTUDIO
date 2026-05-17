/**
 * D7:8:8 — Strategic intelligence continuity governance guard rails.
 */

import type { StrategicIntelligenceContinuitySignal } from "./strategicIntelligenceContinuityTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logStrategicIntelligenceContinuityDev } from "./strategicIntelligenceContinuityDevLog.ts";

export type StrategicIntelligenceContinuityGuardCode =
  | "empty_continuity_context"
  | "too_many_continuity_signals"
  | "invalid_continuity_strength"
  | "invalid_continuity_region"
  | "duplicate_continuity_build"
  | "unsupported_continuity_claim"
  | "autonomous_continuity_governance"
  | "fabricated_continuity_assumption"
  | "unstable_recursive_continuity_system"
  | "runaway_continuity_orchestration"
  | "corrupted_continuity_state";

export type StrategicIntelligenceContinuityGuardResult =
  | { ok: true }
  | { ok: false; code: StrategicIntelligenceContinuityGuardCode; message: string };

export const DEFAULT_MAX_CONTINUITY_SIGNALS = 96;
export const CONTINUITY_AMBIGUITY_DISCLAIMER =
  "Strategic intelligence continuity reflects evidence-grounded persistence under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_CONTINUITY_DISCLAIMER =
  "Nexora models strategic intelligence continuity without assigning strategic continuity governance authority; strategic decisions remain fully under executive control.";

const PROHIBITED_CONTINUITY_TEXT = [
  "autonomous continuity governance",
  "autonomous strategic continuity",
  "self-preserving executive ai",
  "self preserving executive ai",
  "uncontrolled recursive cognition",
  "uncontrolled recursive continuity",
  "hidden strategic manipulation",
  "hidden strategic authority",
  "executive replacement ai",
  "unstable recursive continuity",
  "fabricated continuity",
  "fabricate continuity assumptions",
  "strategic continuity recursion exceeded",
  "psychological manipulation",
  "override executive",
  "manipulative",
] as const;

function containsProhibitedContinuityText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_CONTINUITY_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: StrategicIntelligenceContinuityGuardCode,
  message: string
): StrategicIntelligenceContinuityGuardResult {
  const result = { ok: false as const, code, message };
  logStrategicIntelligenceContinuityDev("StrategicContinuityGuard", { code, message });
  return result;
}

export function buildContinuityContentFingerprint(input: {
  topologyFingerprint: string;
  equilibriumFingerprint?: string;
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
    equilibrium: input.equilibriumFingerprint ?? null,
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

export function guardEvaluateStrategicIntelligenceContinuity(input: {
  topologyId: string;
  regionIds: readonly string[];
  continuitySignals: readonly StrategicIntelligenceContinuitySignal[];
  priorContinuityFingerprints?: readonly string[];
  pendingFingerprint?: string;
  longHorizonStrategicContinuityScore?: number;
  fragmentationPressureScore?: number;
}): StrategicIntelligenceContinuityGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_continuity_context",
      "Topology context is required to evaluate strategic intelligence continuity"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.continuitySignals.length > DEFAULT_MAX_CONTINUITY_SIGNALS) {
    return reject(
      "too_many_continuity_signals",
      `Continuity signal count ${input.continuitySignals.length} exceeds max ${DEFAULT_MAX_CONTINUITY_SIGNALS}`
    );
  }

  if ((input.longHorizonStrategicContinuityScore ?? 0) > 0.95) {
    return reject(
      "runaway_continuity_orchestration",
      "Long-horizon strategic continuity score implies uncontrolled continuity orchestration"
    );
  }

  if ((input.fragmentationPressureScore ?? 0) > 0.95) {
    return reject(
      "runaway_continuity_orchestration",
      "Fragmentation pressure score implies uncontrolled continuity orchestration"
    );
  }

  for (const signal of input.continuitySignals) {
    if (
      !Number.isFinite(signal.continuityStrength) ||
      signal.continuityStrength < 0 ||
      signal.continuityStrength > 0.92
    ) {
      return reject(
        "invalid_continuity_strength",
        `Continuity strength ${signal.continuityStrength} for ${signal.continuityId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_continuity_region",
          `Continuity region ${regionId} is not in topology for ${signal.continuityId}`
        );
      }
    }
  }

  if (input.priorContinuityFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_continuity_build",
      "Duplicate strategic intelligence continuity build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardStrategicIntelligenceContinuitySemantics(input: {
  headline: string;
  summary: string;
}): StrategicIntelligenceContinuityGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_continuity_claim",
      "Strategic continuity semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedContinuityText(combined)) {
    return reject(
      "fabricated_continuity_assumption",
      "Strategic continuity semantics imply fabricated continuity or autonomous continuity governance"
    );
  }
  if (combined.toLowerCase().includes("autonomous continuity governance")) {
    return reject(
      "autonomous_continuity_governance",
      "Strategic continuity semantics imply autonomous continuity governance"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive continuity")) {
    return reject(
      "unstable_recursive_continuity_system",
      "Strategic continuity semantics imply unstable recursive continuity systems"
    );
  }
  return { ok: true };
}
