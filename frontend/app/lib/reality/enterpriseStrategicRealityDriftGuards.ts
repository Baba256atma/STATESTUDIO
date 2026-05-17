/**
 * D7:7:4 — Enterprise strategic reality drift governance guard rails.
 */

import type { EnterpriseStrategicRealityDriftSignal } from "./enterpriseStrategicRealityDriftTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logEnterpriseStrategicRealityDriftDev } from "./enterpriseStrategicRealityDriftDevLog.ts";

export type EnterpriseStrategicRealityDriftGuardCode =
  | "empty_drift_context"
  | "too_many_drift_signals"
  | "invalid_drift_strength"
  | "invalid_drift_region"
  | "duplicate_drift_build"
  | "unsupported_drift_claim"
  | "autonomous_strategic_correction"
  | "fabricated_drift_narrative"
  | "unstable_recursive_drift"
  | "runaway_drift_orchestration"
  | "corrupted_drift_state";

export type EnterpriseStrategicRealityDriftGuardResult =
  | { ok: true }
  | { ok: false; code: EnterpriseStrategicRealityDriftGuardCode; message: string };

export const DEFAULT_MAX_DRIFT_SIGNALS = 96;
export const DRIFT_AMBIGUITY_DISCLAIMER =
  "Strategic reality drift reflects evidence-grounded gradual enterprise movement under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_DRIFT_DISCLAIMER =
  "Nexora models strategic reality drift without assigning enterprise correction authority; strategic decisions remain fully under executive control.";

const PROHIBITED_DRIFT_TEXT = [
  "autonomous strategic correction",
  "autonomous enterprise governance",
  "autonomous enterprise control",
  "self-governing enterprise",
  "self governing enterprise",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive drift",
  "fabricated drift narrative",
  "fabricate drift conditions",
  "speculative future hallucination",
  "hidden operational manipulation",
  "hidden governance authority",
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
  code: EnterpriseStrategicRealityDriftGuardCode,
  message: string
): EnterpriseStrategicRealityDriftGuardResult {
  const result = { ok: false as const, code, message };
  logEnterpriseStrategicRealityDriftDev("DriftGuard", { code, message });
  return result;
}

export function buildDriftContentFingerprint(input: {
  topologyFingerprint: string;
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

export function guardEvaluateStrategicRealityDrift(input: {
  topologyId: string;
  regionIds: readonly string[];
  driftSignals: readonly EnterpriseStrategicRealityDriftSignal[];
  priorDriftFingerprints?: readonly string[];
  pendingFingerprint?: string;
  strategicCoherenceScore?: number;
  coherenceDegradationScore?: number;
}): EnterpriseStrategicRealityDriftGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_drift_context",
      "Topology context is required to evaluate strategic reality drift"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.driftSignals.length > DEFAULT_MAX_DRIFT_SIGNALS) {
    return reject(
      "too_many_drift_signals",
      `Drift signal count ${input.driftSignals.length} exceeds max ${DEFAULT_MAX_DRIFT_SIGNALS}`
    );
  }

  if ((input.strategicCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_drift_orchestration",
      "Strategic coherence score implies uncontrolled drift orchestration"
    );
  }

  if ((input.coherenceDegradationScore ?? 0) > 0.95) {
    return reject(
      "runaway_drift_orchestration",
      "Coherence degradation score implies uncontrolled drift orchestration"
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
      "Duplicate enterprise strategic reality drift build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardEnterpriseStrategicRealityDriftSemantics(input: {
  headline: string;
  summary: string;
}): EnterpriseStrategicRealityDriftGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_drift_claim",
      "Drift semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedDriftText(combined)) {
    return reject(
      "fabricated_drift_narrative",
      "Drift semantics imply fabricated drift narrative or autonomous strategic correction"
    );
  }
  if (combined.toLowerCase().includes("autonomous strategic correction")) {
    return reject(
      "autonomous_strategic_correction",
      "Drift semantics imply autonomous strategic correction"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive drift")) {
    return reject(
      "unstable_recursive_drift",
      "Drift semantics imply unstable recursive drift"
    );
  }
  return { ok: true };
}
