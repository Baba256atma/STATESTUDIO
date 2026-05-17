/**
 * D7:7:8 — Enterprise strategic continuity governance guard rails.
 */

import type { EnterpriseStrategicContinuitySignal } from "./enterpriseStrategicContinuityTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logEnterpriseStrategicContinuityDev } from "./enterpriseStrategicContinuityDevLog.ts";

export type EnterpriseStrategicContinuityGuardCode =
  | "empty_continuity_context"
  | "too_many_continuity_signals"
  | "invalid_continuity_strength"
  | "invalid_continuity_region"
  | "duplicate_continuity_build"
  | "unsupported_continuity_claim"
  | "autonomous_continuity_preservation"
  | "fabricated_continuity_narrative"
  | "unstable_recursive_continuity"
  | "runaway_continuity_orchestration"
  | "corrupted_continuity_state";

export type EnterpriseStrategicContinuityGuardResult =
  | { ok: true }
  | { ok: false; code: EnterpriseStrategicContinuityGuardCode; message: string };

export const DEFAULT_MAX_CONTINUITY_SIGNALS = 96;
export const CONTINUITY_AMBIGUITY_DISCLAIMER =
  "Strategic continuity reflects evidence-grounded operational persistence under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_CONTINUITY_DISCLAIMER =
  "Nexora models enterprise continuity without assigning operational preservation authority; strategic decisions remain fully under executive control.";

const PROHIBITED_CONTINUITY_TEXT = [
  "autonomous continuity governance",
  "autonomous continuity preservation",
  "autonomous enterprise survival",
  "self-preserving enterprise",
  "self preserving enterprise",
  "hidden continuity manipulation",
  "hidden operational governance",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive continuity",
  "fabricated continuity narrative",
  "fabricate continuity assumptions",
  "uncontrolled continuity superintelligence",
  "uncontrolled operational adaptation",
  "psychological manipulation",
  "override executive",
  "override judgment",
  "manipulative",
] as const;

function containsProhibitedContinuityText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_CONTINUITY_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: EnterpriseStrategicContinuityGuardCode,
  message: string
): EnterpriseStrategicContinuityGuardResult {
  const result = { ok: false as const, code, message };
  logEnterpriseStrategicContinuityDev("ContinuityGuard", { code, message });
  return result;
}

export function buildContinuityContentFingerprint(input: {
  topologyFingerprint: string;
  equilibriumFingerprint?: string;
  evolutionFingerprint?: string;
  resilienceFingerprint?: string;
  driftFingerprint?: string;
  causalityFingerprint?: string;
  syncFingerprint?: string;
  realityFingerprint?: string;
  orchestrationFingerprint?: string;
  momentumFingerprint?: string;
  operationalEquilibriumFingerprint?: string;
  governanceFingerprint?: string;
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
    causality: input.causalityFingerprint ?? null,
    sync: input.syncFingerprint ?? null,
    reality: input.realityFingerprint ?? null,
    orchestration: input.orchestrationFingerprint ?? null,
    momentum: input.momentumFingerprint ?? null,
    operationalEquilibrium: input.operationalEquilibriumFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    trajectory: input.trajectoryFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateStrategicContinuity(input: {
  topologyId: string;
  regionIds: readonly string[];
  continuitySignals: readonly EnterpriseStrategicContinuitySignal[];
  priorContinuityFingerprints?: readonly string[];
  pendingFingerprint?: string;
  longHorizonContinuityScore?: number;
  continuityFragmentationScore?: number;
}): EnterpriseStrategicContinuityGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_continuity_context",
      "Topology context is required to evaluate strategic continuity"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.continuitySignals.length > DEFAULT_MAX_CONTINUITY_SIGNALS) {
    return reject(
      "too_many_continuity_signals",
      `Continuity signal count ${input.continuitySignals.length} exceeds max ${DEFAULT_MAX_CONTINUITY_SIGNALS}`
    );
  }

  if ((input.longHorizonContinuityScore ?? 0) > 0.95) {
    return reject(
      "runaway_continuity_orchestration",
      "Long-horizon continuity score implies uncontrolled continuity orchestration"
    );
  }

  if ((input.continuityFragmentationScore ?? 0) > 0.95) {
    return reject(
      "runaway_continuity_orchestration",
      "Continuity fragmentation score implies uncontrolled continuity orchestration"
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
      "Duplicate enterprise strategic continuity build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardEnterpriseStrategicContinuitySemantics(input: {
  headline: string;
  summary: string;
}): EnterpriseStrategicContinuityGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_continuity_claim",
      "Continuity semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedContinuityText(combined)) {
    return reject(
      "fabricated_continuity_narrative",
      "Continuity semantics imply fabricated continuity narratives or autonomous continuity preservation"
    );
  }
  if (combined.toLowerCase().includes("autonomous continuity preservation")) {
    return reject(
      "autonomous_continuity_preservation",
      "Continuity semantics imply autonomous continuity preservation"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive continuity")) {
    return reject(
      "unstable_recursive_continuity",
      "Continuity semantics imply unstable recursive continuity"
    );
  }
  return { ok: true };
}
