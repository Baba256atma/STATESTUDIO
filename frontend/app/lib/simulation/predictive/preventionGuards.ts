/**
 * D7:4:6 — Predictive collapse prevention governance guard rails.
 */

import type { CollapsePreventionSignal } from "./collapsePreventionTypes.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { logPreventionDev } from "./preventionDevLog.ts";

export type PreventionGuardCode =
  | "empty_prevention_context"
  | "too_many_prevention_signals"
  | "invalid_prevention_strength"
  | "invalid_prevention_region"
  | "duplicate_prevention_build"
  | "false_certainty_language"
  | "unsupported_prevention_claim"
  | "runaway_intervention_amplification"
  | "corrupted_prevention_state";

export type PreventionGuardResult =
  | { ok: true }
  | { ok: false; code: PreventionGuardCode; message: string };

export const DEFAULT_MAX_PREVENTION_SIGNALS = 96;
export const PREVENTION_UNCERTAINTY_DISCLAIMER =
  "Collapse prevention reflects stabilization potential under current conditions and is indicative, not definitive.";

function reject(code: PreventionGuardCode, message: string): PreventionGuardResult {
  const result = { ok: false as const, code, message };
  logPreventionDev("PreventionGuard", { code, message });
  return result;
}

export function buildPreventionContentFingerprint(input: {
  topologyFingerprint: string;
  cascadeFingerprint?: string;
  recoveryOpportunityFingerprint?: string;
  inflectionFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    cascade: input.cascadeFingerprint ?? null,
    recoveryOpportunity: input.recoveryOpportunityFingerprint ?? null,
    inflection: input.inflectionFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateCollapsePrevention(input: {
  topologyId: string;
  regionIds: readonly string[];
  signals: readonly CollapsePreventionSignal[];
  priorPreventionFingerprints?: readonly string[];
  pendingFingerprint?: string;
  collapseInterruptionScore?: number;
  resiliencePreservationScore?: number;
}): PreventionGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_prevention_context",
      "Topology context is required to evaluate collapse prevention"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_PREVENTION_SIGNALS) {
    return reject(
      "too_many_prevention_signals",
      `Prevention signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_PREVENTION_SIGNALS}`
    );
  }

  if ((input.collapseInterruptionScore ?? 0) > 0.95) {
    return reject(
      "runaway_intervention_amplification",
      "Collapse interruption score implies uncontrolled intervention amplification"
    );
  }

  if ((input.resiliencePreservationScore ?? 0) > 0.95) {
    return reject(
      "runaway_intervention_amplification",
      "Resilience preservation score implies uncontrolled prevention amplification"
    );
  }

  for (const signal of input.signals) {
    if (signal.preventionStrength < 0 || signal.preventionStrength > 1) {
      return reject(
        "invalid_prevention_strength",
        `Prevention signal ${signal.signalId} strength must be between 0 and 1`
      );
    }
    if (signal.preventionStrength > 0.92) {
      return reject(
        "false_certainty_language",
        `Prevention signal ${signal.signalId} strength implies excessive certainty`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_prevention_region",
          `Prevention signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsFalseCertaintyText(label)) {
      return reject(
        "unsupported_prevention_claim",
        `Prevention signal ${signal.signalId} contains prohibited certainty language`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorPreventionFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_prevention_build",
      "Identical collapse prevention evaluation was already executed"
    );
  }

  return { ok: true };
}

export function guardPreventionExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): PreventionGuardResult {
  if (containsFalseCertaintyText(input.headline)) {
    return reject(
      "unsupported_prevention_claim",
      "Prevention headline contains prohibited certainty language"
    );
  }
  if (containsFalseCertaintyText(input.summary)) {
    return reject(
      "unsupported_prevention_claim",
      "Prevention summary contains prohibited certainty language"
    );
  }
  return { ok: true };
}
