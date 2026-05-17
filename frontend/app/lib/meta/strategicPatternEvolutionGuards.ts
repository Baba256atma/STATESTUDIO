/**
 * D7:8:2 — Strategic pattern evolution governance guard rails.
 */

import type { StrategicPatternEvolutionSignal } from "./strategicPatternEvolutionTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logStrategicPatternEvolutionDev } from "./strategicPatternEvolutionDevLog.ts";

export type StrategicPatternEvolutionGuardCode =
  | "empty_pattern_context"
  | "too_many_pattern_signals"
  | "invalid_pattern_strength"
  | "invalid_pattern_region"
  | "duplicate_pattern_build"
  | "unsupported_pattern_claim"
  | "autonomous_strategic_adaptation"
  | "fabricated_strategic_pattern"
  | "unstable_recursive_pattern_system"
  | "runaway_pattern_orchestration"
  | "corrupted_pattern_state";

export type StrategicPatternEvolutionGuardResult =
  | { ok: true }
  | { ok: false; code: StrategicPatternEvolutionGuardCode; message: string };

export const DEFAULT_MAX_PATTERN_SIGNALS = 96;
export const PATTERN_AMBIGUITY_DISCLAIMER =
  "Strategic pattern intelligence reflects evidence-grounded recurring behavior under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_PATTERN_DISCLAIMER =
  "Nexora models strategic pattern evolution without assigning strategic adaptation authority; strategic decisions remain fully under executive control.";

const PROHIBITED_PATTERN_TEXT = [
  "autonomous strategic forecasting",
  "autonomous strategic adaptation",
  "self-evolving enterprise ai",
  "self evolving enterprise ai",
  "uncontrolled recursive intelligence",
  "uncontrolled recursive pattern",
  "hidden executive manipulation",
  "hidden strategic governance",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive pattern",
  "fabricated strategic pattern",
  "fabricate strategic patterns",
  "pattern recursion exceeded",
  "psychological manipulation",
  "override executive",
  "override judgment",
  "manipulative",
] as const;

function containsProhibitedPatternText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_PATTERN_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: StrategicPatternEvolutionGuardCode,
  message: string
): StrategicPatternEvolutionGuardResult {
  const result = { ok: false as const, code, message };
  logStrategicPatternEvolutionDev("PatternGuard", { code, message });
  return result;
}

export function buildPatternContentFingerprint(input: {
  topologyFingerprint: string;
  metaFingerprint?: string;
  realityFingerprint?: string;
  foresightFingerprint?: string;
  trajectoryFingerprint?: string;
  divergenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    meta: input.metaFingerprint ?? null,
    reality: input.realityFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    trajectory: input.trajectoryFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateStrategicPatternEvolution(input: {
  topologyId: string;
  regionIds: readonly string[];
  patternSignals: readonly StrategicPatternEvolutionSignal[];
  priorPatternFingerprints?: readonly string[];
  pendingFingerprint?: string;
  patternCoherenceScore?: number;
  patternInstabilityScore?: number;
}): StrategicPatternEvolutionGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_pattern_context",
      "Topology context is required to evaluate strategic pattern evolution"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.patternSignals.length > DEFAULT_MAX_PATTERN_SIGNALS) {
    return reject(
      "too_many_pattern_signals",
      `Pattern signal count ${input.patternSignals.length} exceeds max ${DEFAULT_MAX_PATTERN_SIGNALS}`
    );
  }

  if ((input.patternCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_pattern_orchestration",
      "Pattern coherence score implies uncontrolled pattern orchestration"
    );
  }

  if ((input.patternInstabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_pattern_orchestration",
      "Pattern instability score implies uncontrolled pattern orchestration"
    );
  }

  for (const signal of input.patternSignals) {
    if (
      !Number.isFinite(signal.patternStrength) ||
      signal.patternStrength < 0 ||
      signal.patternStrength > 0.92
    ) {
      return reject(
        "invalid_pattern_strength",
        `Pattern strength ${signal.patternStrength} for ${signal.patternId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_pattern_region",
          `Pattern region ${regionId} is not in topology for ${signal.patternId}`
        );
      }
    }
  }

  if (input.priorPatternFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_pattern_build",
      "Duplicate strategic pattern evolution build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardStrategicPatternEvolutionSemantics(input: {
  headline: string;
  summary: string;
}): StrategicPatternEvolutionGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_pattern_claim",
      "Strategic pattern semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedPatternText(combined)) {
    return reject(
      "fabricated_strategic_pattern",
      "Strategic pattern semantics imply fabricated patterns or autonomous strategic adaptation"
    );
  }
  if (combined.toLowerCase().includes("autonomous strategic adaptation")) {
    return reject(
      "autonomous_strategic_adaptation",
      "Strategic pattern semantics imply autonomous strategic adaptation"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive pattern")) {
    return reject(
      "unstable_recursive_pattern_system",
      "Strategic pattern semantics imply unstable recursive pattern systems"
    );
  }
  return { ok: true };
}
