/**
 * D7:8:5 — Strategic intelligence resilience governance guard rails.
 */

import type { StrategicIntelligenceResilienceSignal } from "./strategicIntelligenceResilienceTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logStrategicIntelligenceResilienceDev } from "./strategicIntelligenceResilienceDevLog.ts";

export type StrategicIntelligenceResilienceGuardCode =
  | "empty_resilience_context"
  | "too_many_resilience_signals"
  | "invalid_resilience_strength"
  | "invalid_resilience_region"
  | "duplicate_resilience_build"
  | "unsupported_resilience_claim"
  | "autonomous_strategic_adaptation"
  | "fabricated_resilience_capacity"
  | "unstable_recursive_resilience_system"
  | "runaway_resilience_orchestration"
  | "corrupted_resilience_state";

export type StrategicIntelligenceResilienceGuardResult =
  | { ok: true }
  | { ok: false; code: StrategicIntelligenceResilienceGuardCode; message: string };

export const DEFAULT_MAX_RESILIENCE_SIGNALS = 96;
export const RESILIENCE_AMBIGUITY_DISCLAIMER =
  "Strategic intelligence resilience reflects evidence-grounded capacity under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_RESILIENCE_DISCLAIMER =
  "Nexora models strategic intelligence resilience without assigning strategic adaptation authority; strategic decisions remain fully under executive control.";

const PROHIBITED_RESILIENCE_TEXT = [
  "autonomous strategic adaptation",
  "self-healing executive ai",
  "self healing executive ai",
  "uncontrolled recursive cognition",
  "uncontrolled recursive resilience",
  "hidden strategic governance",
  "hidden strategic authority",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive resilience",
  "fabricated resilience",
  "fabricate resilience capacity",
  "strategic resilience recursion exceeded",
  "psychological manipulation",
  "override executive",
  "override judgment",
  "manipulative",
] as const;

function containsProhibitedResilienceText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_RESILIENCE_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: StrategicIntelligenceResilienceGuardCode,
  message: string
): StrategicIntelligenceResilienceGuardResult {
  const result = { ok: false as const, code, message };
  logStrategicIntelligenceResilienceDev("StrategicResilienceGuard", { code, message });
  return result;
}

export function buildResilienceContentFingerprint(input: {
  topologyFingerprint: string;
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

export function guardEvaluateStrategicIntelligenceResilience(input: {
  topologyId: string;
  regionIds: readonly string[];
  resilienceSignals: readonly StrategicIntelligenceResilienceSignal[];
  priorResilienceFingerprints?: readonly string[];
  pendingFingerprint?: string;
  strategicResilienceCapacityScore?: number;
  recoveryPressureScore?: number;
}): StrategicIntelligenceResilienceGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_resilience_context",
      "Topology context is required to evaluate strategic intelligence resilience"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.resilienceSignals.length > DEFAULT_MAX_RESILIENCE_SIGNALS) {
    return reject(
      "too_many_resilience_signals",
      `Resilience signal count ${input.resilienceSignals.length} exceeds max ${DEFAULT_MAX_RESILIENCE_SIGNALS}`
    );
  }

  if ((input.strategicResilienceCapacityScore ?? 0) > 0.95) {
    return reject(
      "runaway_resilience_orchestration",
      "Strategic resilience capacity score implies uncontrolled resilience orchestration"
    );
  }

  if ((input.recoveryPressureScore ?? 0) > 0.95) {
    return reject(
      "runaway_resilience_orchestration",
      "Recovery pressure score implies uncontrolled resilience orchestration"
    );
  }

  for (const signal of input.resilienceSignals) {
    if (
      !Number.isFinite(signal.resilienceStrength) ||
      signal.resilienceStrength < 0 ||
      signal.resilienceStrength > 0.92
    ) {
      return reject(
        "invalid_resilience_strength",
        `Resilience strength ${signal.resilienceStrength} for ${signal.resilienceId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_resilience_region",
          `Resilience region ${regionId} is not in topology for ${signal.resilienceId}`
        );
      }
    }
  }

  if (input.priorResilienceFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_resilience_build",
      "Duplicate strategic intelligence resilience build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardStrategicIntelligenceResilienceSemantics(input: {
  headline: string;
  summary: string;
}): StrategicIntelligenceResilienceGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_resilience_claim",
      "Strategic resilience semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedResilienceText(combined)) {
    return reject(
      "fabricated_resilience_capacity",
      "Strategic resilience semantics imply fabricated resilience or autonomous strategic adaptation"
    );
  }
  if (combined.toLowerCase().includes("autonomous strategic adaptation")) {
    return reject(
      "autonomous_strategic_adaptation",
      "Strategic resilience semantics imply autonomous strategic adaptation"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive resilience")) {
    return reject(
      "unstable_recursive_resilience_system",
      "Strategic resilience semantics imply unstable recursive resilience systems"
    );
  }
  return { ok: true };
}
