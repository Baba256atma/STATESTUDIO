/**
 * D7:7:5 — Enterprise strategic resilience governance guard rails.
 */

import type { EnterpriseStrategicResilienceSignal } from "./enterpriseStrategicResilienceTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logEnterpriseStrategicResilienceDev } from "./enterpriseStrategicResilienceDevLog.ts";

export type EnterpriseStrategicResilienceGuardCode =
  | "empty_resilience_context"
  | "too_many_resilience_signals"
  | "invalid_resilience_strength"
  | "invalid_resilience_region"
  | "duplicate_resilience_build"
  | "unsupported_resilience_claim"
  | "autonomous_adaptive_governance"
  | "fabricated_resilience_assumption"
  | "unstable_recursive_resilience"
  | "runaway_resilience_orchestration"
  | "corrupted_resilience_state";

export type EnterpriseStrategicResilienceGuardResult =
  | { ok: true }
  | { ok: false; code: EnterpriseStrategicResilienceGuardCode; message: string };

export const DEFAULT_MAX_RESILIENCE_SIGNALS = 96;
export const RESILIENCE_AMBIGUITY_DISCLAIMER =
  "Strategic resilience reflects evidence-grounded adaptive capacity under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_RESILIENCE_DISCLAIMER =
  "Nexora models enterprise resilience without assigning adaptive governance authority; strategic decisions remain fully under executive control.";

const PROHIBITED_RESILIENCE_TEXT = [
  "autonomous adaptive governance",
  "autonomous organizational adaptation",
  "self-healing enterprise",
  "self healing enterprise",
  "autonomous enterprise governance",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive resilience",
  "fabricated resilience assumption",
  "fabricate resilience capacity",
  "uncontrolled resilience optimization",
  "hidden adaptive governance",
  "hidden governance automation",
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
  code: EnterpriseStrategicResilienceGuardCode,
  message: string
): EnterpriseStrategicResilienceGuardResult {
  const result = { ok: false as const, code, message };
  logEnterpriseStrategicResilienceDev("ResilienceGuard", { code, message });
  return result;
}

export function buildResilienceContentFingerprint(input: {
  topologyFingerprint: string;
  driftFingerprint?: string;
  causalityFingerprint?: string;
  syncFingerprint?: string;
  realityFingerprint?: string;
  orchestrationFingerprint?: string;
  momentumFingerprint?: string;
  equilibriumFingerprint?: string;
  resilienceFingerprint?: string;
  governanceFingerprint?: string;
  foresightFingerprint?: string;
  trajectoryFingerprint?: string;
  divergenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    drift: input.driftFingerprint ?? null,
    causality: input.causalityFingerprint ?? null,
    sync: input.syncFingerprint ?? null,
    reality: input.realityFingerprint ?? null,
    orchestration: input.orchestrationFingerprint ?? null,
    momentum: input.momentumFingerprint ?? null,
    equilibrium: input.equilibriumFingerprint ?? null,
    resilience: input.resilienceFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    trajectory: input.trajectoryFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateEnterpriseResilience(input: {
  topologyId: string;
  regionIds: readonly string[];
  resilienceSignals: readonly EnterpriseStrategicResilienceSignal[];
  priorResilienceFingerprints?: readonly string[];
  pendingFingerprint?: string;
  resilienceCapacityScore?: number;
  recoveryPressureScore?: number;
}): EnterpriseStrategicResilienceGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_resilience_context",
      "Topology context is required to evaluate enterprise resilience"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.resilienceSignals.length > DEFAULT_MAX_RESILIENCE_SIGNALS) {
    return reject(
      "too_many_resilience_signals",
      `Resilience signal count ${input.resilienceSignals.length} exceeds max ${DEFAULT_MAX_RESILIENCE_SIGNALS}`
    );
  }

  if ((input.resilienceCapacityScore ?? 0) > 0.95) {
    return reject(
      "runaway_resilience_orchestration",
      "Resilience capacity score implies uncontrolled resilience orchestration"
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
      "Duplicate enterprise strategic resilience build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardEnterpriseStrategicResilienceSemantics(input: {
  headline: string;
  summary: string;
}): EnterpriseStrategicResilienceGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_resilience_claim",
      "Resilience semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedResilienceText(combined)) {
    return reject(
      "fabricated_resilience_assumption",
      "Resilience semantics imply fabricated resilience assumptions or autonomous adaptive governance"
    );
  }
  if (combined.toLowerCase().includes("autonomous adaptive governance")) {
    return reject(
      "autonomous_adaptive_governance",
      "Resilience semantics imply autonomous adaptive governance"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive resilience")) {
    return reject(
      "unstable_recursive_resilience",
      "Resilience semantics imply unstable recursive resilience"
    );
  }
  return { ok: true };
}
