/**
 * D7:7:7 — Enterprise strategic equilibrium governance guard rails.
 */

import type { EnterpriseStrategicEquilibriumSignal } from "./enterpriseStrategicEquilibriumTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logEnterpriseStrategicEquilibriumDev } from "./enterpriseStrategicEquilibriumDevLog.ts";

export type EnterpriseStrategicEquilibriumGuardCode =
  | "empty_equilibrium_context"
  | "too_many_equilibrium_signals"
  | "invalid_equilibrium_strength"
  | "invalid_equilibrium_region"
  | "duplicate_equilibrium_build"
  | "unsupported_equilibrium_claim"
  | "autonomous_balancing_system"
  | "fabricated_equilibrium_narrative"
  | "unstable_recursive_equilibrium"
  | "runaway_equilibrium_orchestration"
  | "corrupted_equilibrium_state";

export type EnterpriseStrategicEquilibriumGuardResult =
  | { ok: true }
  | { ok: false; code: EnterpriseStrategicEquilibriumGuardCode; message: string };

export const DEFAULT_MAX_EQUILIBRIUM_SIGNALS = 96;
export const EQUILIBRIUM_AMBIGUITY_DISCLAIMER =
  "Strategic equilibrium reflects evidence-grounded systemic balance under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER =
  "Nexora models enterprise equilibrium without assigning operational rebalancing authority; strategic decisions remain fully under executive control.";

const PROHIBITED_EQUILIBRIUM_TEXT = [
  "autonomous operational optimization",
  "autonomous balancing systems",
  "autonomous strategic correction",
  "self-balancing enterprise",
  "self balancing enterprise",
  "hidden governance manipulation",
  "hidden adaptive governance",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive equilibrium",
  "fabricated equilibrium narrative",
  "fabricate equilibrium conditions",
  "uncontrolled equilibrium superintelligence",
  "psychological manipulation",
  "override executive",
  "override judgment",
  "manipulative",
] as const;

function containsProhibitedEquilibriumText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_EQUILIBRIUM_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: EnterpriseStrategicEquilibriumGuardCode,
  message: string
): EnterpriseStrategicEquilibriumGuardResult {
  const result = { ok: false as const, code, message };
  logEnterpriseStrategicEquilibriumDev("EquilibriumGuard", { code, message });
  return result;
}

export function buildEquilibriumContentFingerprint(input: {
  topologyFingerprint: string;
  evolutionFingerprint?: string;
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
    evolution: input.evolutionFingerprint ?? null,
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

export function guardEvaluateStrategicEquilibrium(input: {
  topologyId: string;
  regionIds: readonly string[];
  equilibriumSignals: readonly EnterpriseStrategicEquilibriumSignal[];
  priorEquilibriumFingerprints?: readonly string[];
  pendingFingerprint?: string;
  systemicBalanceScore?: number;
  destabilizationPressureScore?: number;
}): EnterpriseStrategicEquilibriumGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_equilibrium_context",
      "Topology context is required to evaluate strategic equilibrium"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.equilibriumSignals.length > DEFAULT_MAX_EQUILIBRIUM_SIGNALS) {
    return reject(
      "too_many_equilibrium_signals",
      `Equilibrium signal count ${input.equilibriumSignals.length} exceeds max ${DEFAULT_MAX_EQUILIBRIUM_SIGNALS}`
    );
  }

  if ((input.systemicBalanceScore ?? 0) > 0.95) {
    return reject(
      "runaway_equilibrium_orchestration",
      "Systemic balance score implies uncontrolled equilibrium orchestration"
    );
  }

  if ((input.destabilizationPressureScore ?? 0) > 0.95) {
    return reject(
      "runaway_equilibrium_orchestration",
      "Destabilization pressure score implies uncontrolled equilibrium orchestration"
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
      "Duplicate enterprise strategic equilibrium build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardEnterpriseStrategicEquilibriumSemantics(input: {
  headline: string;
  summary: string;
}): EnterpriseStrategicEquilibriumGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_equilibrium_claim",
      "Equilibrium semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedEquilibriumText(combined)) {
    return reject(
      "fabricated_equilibrium_narrative",
      "Equilibrium semantics imply fabricated equilibrium narratives or autonomous balancing systems"
    );
  }
  if (combined.toLowerCase().includes("autonomous balancing systems")) {
    return reject(
      "autonomous_balancing_system",
      "Equilibrium semantics imply autonomous balancing systems"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive equilibrium")) {
    return reject(
      "unstable_recursive_equilibrium",
      "Equilibrium semantics imply unstable recursive equilibrium"
    );
  }
  return { ok: true };
}
