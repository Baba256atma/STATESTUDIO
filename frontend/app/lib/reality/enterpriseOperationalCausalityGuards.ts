/**
 * D7:7:3 — Enterprise operational causality governance guard rails.
 */

import type { EnterpriseOperationalCausalitySignal } from "./enterpriseOperationalCausalityTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logEnterpriseOperationalCausalityDev } from "./enterpriseOperationalCausalityDevLog.ts";

export type EnterpriseOperationalCausalityGuardCode =
  | "empty_causality_context"
  | "too_many_causality_signals"
  | "invalid_causality_strength"
  | "invalid_causality_region"
  | "duplicate_causality_build"
  | "unsupported_causality_claim"
  | "autonomous_enterprise_diagnosis"
  | "fabricated_causal_reasoning"
  | "unstable_recursive_causality"
  | "runaway_causality_orchestration"
  | "corrupted_causality_state";

export type EnterpriseOperationalCausalityGuardResult =
  | { ok: true }
  | { ok: false; code: EnterpriseOperationalCausalityGuardCode; message: string };

export const DEFAULT_MAX_CAUSALITY_SIGNALS = 96;
export const CAUSALITY_AMBIGUITY_DISCLAIMER =
  "Operational causality reflects evidence-grounded enterprise conditions under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_CAUSALITY_DISCLAIMER =
  "Nexora models operational causality without assigning enterprise diagnostic authority; strategic decisions remain fully under executive control.";

const PROHIBITED_CAUSALITY_TEXT = [
  "autonomous enterprise diagnosis",
  "autonomous enterprise governance",
  "autonomous operational governance",
  "self-governing enterprise",
  "self governing enterprise",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive causality",
  "fabricated causal reasoning",
  "fabricate unsupported causal",
  "speculative ai reasoning",
  "hidden operational manipulation",
  "hidden reasoning engine",
  "psychological manipulation",
  "override executive",
  "override judgment",
  "manipulative",
] as const;

function containsProhibitedCausalityText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_CAUSALITY_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: EnterpriseOperationalCausalityGuardCode,
  message: string
): EnterpriseOperationalCausalityGuardResult {
  const result = { ok: false as const, code, message };
  logEnterpriseOperationalCausalityDev("CausalityGuard", { code, message });
  return result;
}

export function buildCausalityContentFingerprint(input: {
  topologyFingerprint: string;
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

export function guardEvaluateOperationalCausality(input: {
  topologyId: string;
  regionIds: readonly string[];
  causalitySignals: readonly EnterpriseOperationalCausalitySignal[];
  priorCausalityFingerprints?: readonly string[];
  pendingFingerprint?: string;
  causalityClarityScore?: number;
  causalPropagationScore?: number;
}): EnterpriseOperationalCausalityGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_causality_context",
      "Topology context is required to evaluate operational causality"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.causalitySignals.length > DEFAULT_MAX_CAUSALITY_SIGNALS) {
    return reject(
      "too_many_causality_signals",
      `Causality signal count ${input.causalitySignals.length} exceeds max ${DEFAULT_MAX_CAUSALITY_SIGNALS}`
    );
  }

  if ((input.causalityClarityScore ?? 0) > 0.95) {
    return reject(
      "runaway_causality_orchestration",
      "Causality clarity score implies uncontrolled causality orchestration"
    );
  }

  if ((input.causalPropagationScore ?? 0) > 0.95) {
    return reject(
      "runaway_causality_orchestration",
      "Causal propagation score implies uncontrolled causality orchestration"
    );
  }

  for (const signal of input.causalitySignals) {
    if (
      !Number.isFinite(signal.causalityStrength) ||
      signal.causalityStrength < 0 ||
      signal.causalityStrength > 0.92
    ) {
      return reject(
        "invalid_causality_strength",
        `Causality strength ${signal.causalityStrength} for ${signal.causalityId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_causality_region",
          `Causality region ${regionId} is not in topology for ${signal.causalityId}`
        );
      }
    }
  }

  if (input.priorCausalityFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_causality_build",
      "Duplicate enterprise operational causality build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardEnterpriseOperationalCausalitySemantics(input: {
  headline: string;
  summary: string;
}): EnterpriseOperationalCausalityGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_causality_claim",
      "Causality semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedCausalityText(combined)) {
    return reject(
      "fabricated_causal_reasoning",
      "Causality semantics imply unsupported causal inference or autonomous diagnosis"
    );
  }
  if (combined.toLowerCase().includes("autonomous enterprise diagnosis")) {
    return reject(
      "autonomous_enterprise_diagnosis",
      "Causality semantics imply autonomous enterprise diagnosis"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive causality")) {
    return reject(
      "unstable_recursive_causality",
      "Causality semantics imply unstable recursive causality"
    );
  }
  return { ok: true };
}
