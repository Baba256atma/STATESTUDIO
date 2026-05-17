/**
 * D7:7:1 — Strategic reality governance guard rails.
 */

import type { StrategicRealitySignal } from "./strategicRealityTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logStrategicRealityDev } from "./strategicRealityDevLog.ts";

export type StrategicRealityGuardCode =
  | "empty_reality_context"
  | "too_many_reality_signals"
  | "invalid_reality_strength"
  | "invalid_reality_region"
  | "duplicate_reality_build"
  | "unsupported_reality_claim"
  | "autonomous_world_governance"
  | "fabricated_operational_reality"
  | "uncontrolled_recursive_simulation"
  | "runaway_reality_orchestration"
  | "corrupted_reality_state";

export type StrategicRealityGuardResult =
  | { ok: true }
  | { ok: false; code: StrategicRealityGuardCode; message: string };

export const DEFAULT_MAX_REALITY_SIGNALS = 96;
export const REALITY_AMBIGUITY_DISCLAIMER =
  "Strategic operational reality reflects evidence-grounded enterprise conditions under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_REALITY_DISCLAIMER =
  "Nexora models operational reality evolution without assigning enterprise authority; strategic decisions remain fully under executive control.";

const PROHIBITED_REALITY_TEXT = [
  "autonomous world governance",
  "autonomous enterprise authority",
  "autonomous enterprise governance",
  "self-governing civilization",
  "self governing civilization",
  "artificial general intelligence",
  "executive replacement ai",
  "executive replacement cognition",
  "uncontrolled recursive simulation",
  "fabricated operational reality",
  "fabricate operational reality",
  "psychological manipulation",
  "hidden psychological governance",
  "override executive",
  "override judgment",
  "manipulative",
] as const;

function containsProhibitedRealityText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_REALITY_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(code: StrategicRealityGuardCode, message: string): StrategicRealityGuardResult {
  const result = { ok: false as const, code, message };
  logStrategicRealityDev("RealityGuard", { code, message });
  return result;
}

export function buildRealityContentFingerprint(input: {
  topologyFingerprint: string;
  completionFingerprint?: string;
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
    completion: input.completionFingerprint ?? null,
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

export function guardEvaluateStrategicReality(input: {
  topologyId: string;
  regionIds: readonly string[];
  realitySignals: readonly StrategicRealitySignal[];
  priorRealityFingerprints?: readonly string[];
  pendingFingerprint?: string;
  operationalRealityCoherenceScore?: number;
  realityInstabilityScore?: number;
}): StrategicRealityGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_reality_context",
      "Topology context is required to evaluate strategic reality"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.realitySignals.length > DEFAULT_MAX_REALITY_SIGNALS) {
    return reject(
      "too_many_reality_signals",
      `Reality signal count ${input.realitySignals.length} exceeds max ${DEFAULT_MAX_REALITY_SIGNALS}`
    );
  }

  if ((input.operationalRealityCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_reality_orchestration",
      "Operational reality coherence score implies uncontrolled reality orchestration"
    );
  }

  if ((input.realityInstabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_reality_orchestration",
      "Reality instability score implies uncontrolled reality orchestration"
    );
  }

  for (const signal of input.realitySignals) {
    if (
      !Number.isFinite(signal.realityStrength) ||
      signal.realityStrength < 0 ||
      signal.realityStrength > 0.92
    ) {
      return reject(
        "invalid_reality_strength",
        `Reality strength ${signal.realityStrength} for ${signal.realityId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_reality_region",
          `Reality region ${regionId} is not in topology for ${signal.realityId}`
        );
      }
    }
  }

  if (input.priorRealityFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_reality_build",
      "Duplicate strategic reality build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardStrategicRealitySemantics(input: {
  headline: string;
  summary: string;
}): StrategicRealityGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_reality_claim",
      "Reality semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedRealityText(combined)) {
    return reject(
      "fabricated_operational_reality",
      "Reality semantics imply fabricated operational reality or autonomous governance"
    );
  }
  if (combined.toLowerCase().includes("autonomous world governance")) {
    return reject("autonomous_world_governance", "Reality semantics imply autonomous world governance");
  }
  if (combined.toLowerCase().includes("uncontrolled recursive simulation")) {
    return reject(
      "uncontrolled_recursive_simulation",
      "Reality semantics imply uncontrolled recursive simulation"
    );
  }
  return { ok: true };
}
