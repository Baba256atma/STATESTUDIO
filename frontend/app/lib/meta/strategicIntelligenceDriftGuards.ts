/**
 * D7:8:4 — Strategic intelligence drift governance guard rails.
 */

import type { StrategicIntelligenceDriftSignal } from "./strategicIntelligenceDriftTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logStrategicIntelligenceDriftDev } from "./strategicIntelligenceDriftDevLog.ts";

export type StrategicIntelligenceDriftGuardCode =
  | "empty_drift_context"
  | "too_many_drift_signals"
  | "invalid_drift_strength"
  | "invalid_drift_region"
  | "duplicate_drift_build"
  | "unsupported_drift_claim"
  | "autonomous_strategic_correction"
  | "fabricated_strategic_drift"
  | "unstable_recursive_intelligence_loop"
  | "runaway_drift_orchestration"
  | "corrupted_drift_state";

export type StrategicIntelligenceDriftGuardResult =
  | { ok: true }
  | { ok: false; code: StrategicIntelligenceDriftGuardCode; message: string };

export const DEFAULT_MAX_DRIFT_SIGNALS = 96;
export const DRIFT_AMBIGUITY_DISCLAIMER =
  "Strategic intelligence drift reflects evidence-grounded coherence degradation under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_DRIFT_DISCLAIMER =
  "Nexora models strategic intelligence drift without assigning strategic correction authority; strategic decisions remain fully under executive control.";

const PROHIBITED_DRIFT_TEXT = [
  "autonomous strategic correction",
  "self-repairing executive ai",
  "self repairing executive ai",
  "uncontrolled recursive cognition",
  "uncontrolled recursive intelligence",
  "hidden behavioral governance",
  "hidden strategic authority",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive intelligence loop",
  "fabricated drift",
  "fabricate drift conditions",
  "strategic drift recursion exceeded",
  "psychological manipulation",
  "override executive",
  "override judgment",
  "manipulative",
] as const;

function containsProhibitedDriftText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_DRIFT_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: StrategicIntelligenceDriftGuardCode,
  message: string
): StrategicIntelligenceDriftGuardResult {
  const result = { ok: false as const, code, message };
  logStrategicIntelligenceDriftDev("StrategicDriftGuard", { code, message });
  return result;
}

export function buildDriftContentFingerprint(input: {
  topologyFingerprint: string;
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

export function guardEvaluateStrategicIntelligenceDrift(input: {
  topologyId: string;
  regionIds: readonly string[];
  driftSignals: readonly StrategicIntelligenceDriftSignal[];
  priorDriftFingerprints?: readonly string[];
  pendingFingerprint?: string;
  strategicIntelligenceCoherenceScore?: number;
  strategicDriftInstabilityScore?: number;
}): StrategicIntelligenceDriftGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_drift_context",
      "Topology context is required to evaluate strategic intelligence drift"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.driftSignals.length > DEFAULT_MAX_DRIFT_SIGNALS) {
    return reject(
      "too_many_drift_signals",
      `Drift signal count ${input.driftSignals.length} exceeds max ${DEFAULT_MAX_DRIFT_SIGNALS}`
    );
  }

  if ((input.strategicIntelligenceCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_drift_orchestration",
      "Strategic intelligence coherence score implies uncontrolled drift orchestration"
    );
  }

  if ((input.strategicDriftInstabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_drift_orchestration",
      "Strategic drift instability score implies uncontrolled drift orchestration"
    );
  }

  for (const signal of input.driftSignals) {
    if (
      !Number.isFinite(signal.driftStrength) ||
      signal.driftStrength < 0 ||
      signal.driftStrength > 0.92
    ) {
      return reject(
        "invalid_drift_strength",
        `Drift strength ${signal.driftStrength} for ${signal.driftId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_drift_region",
          `Drift region ${regionId} is not in topology for ${signal.driftId}`
        );
      }
    }
  }

  if (input.priorDriftFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_drift_build",
      "Duplicate strategic intelligence drift build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardStrategicIntelligenceDriftSemantics(input: {
  headline: string;
  summary: string;
}): StrategicIntelligenceDriftGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_drift_claim",
      "Strategic drift semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedDriftText(combined)) {
    return reject(
      "fabricated_strategic_drift",
      "Strategic drift semantics imply fabricated drift or autonomous strategic correction"
    );
  }
  if (combined.toLowerCase().includes("autonomous strategic correction")) {
    return reject(
      "autonomous_strategic_correction",
      "Strategic drift semantics imply autonomous strategic correction"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive intelligence loop")) {
    return reject(
      "unstable_recursive_intelligence_loop",
      "Strategic drift semantics imply unstable recursive intelligence loops"
    );
  }
  return { ok: true };
}
