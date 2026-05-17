/**
 * D7:4:5 — Predictive recovery opportunity governance guard rails.
 */

import type { RecoveryOpportunitySignal } from "./recoveryOpportunityTypes.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { logRecoveryOpportunityDev } from "./recoveryOpportunityDevLog.ts";

export type RecoveryOpportunityGuardCode =
  | "empty_recovery_opportunity_context"
  | "too_many_recovery_signals"
  | "invalid_opportunity_strength"
  | "invalid_recovery_region"
  | "duplicate_recovery_opportunity_build"
  | "false_optimism_certainty"
  | "unsupported_recovery_claim"
  | "runaway_stabilization_amplification"
  | "corrupted_recovery_opportunity_state";

export type RecoveryOpportunityGuardResult =
  | { ok: true }
  | { ok: false; code: RecoveryOpportunityGuardCode; message: string };

export const DEFAULT_MAX_RECOVERY_OPPORTUNITY_SIGNALS = 96;
export const RECOVERY_OPPORTUNITY_UNCERTAINTY_DISCLAIMER =
  "Recovery opportunities reflect stabilization potential under current conditions and are indicative, not definitive.";

function reject(code: RecoveryOpportunityGuardCode, message: string): RecoveryOpportunityGuardResult {
  const result = { ok: false as const, code, message };
  logRecoveryOpportunityDev("RecoveryOpportunityGuard", { code, message });
  return result;
}

export function buildRecoveryOpportunityContentFingerprint(input: {
  topologyFingerprint: string;
  cascadeFingerprint?: string;
  trajectoryFingerprint?: string;
  resilienceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    cascade: input.cascadeFingerprint ?? null,
    trajectory: input.trajectoryFingerprint ?? null,
    resilience: input.resilienceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateRecoveryOpportunities(input: {
  topologyId: string;
  regionIds: readonly string[];
  signals: readonly RecoveryOpportunitySignal[];
  priorRecoveryOpportunityFingerprints?: readonly string[];
  pendingFingerprint?: string;
  recoveryAccelerationScore?: number;
  stabilizationPotentialScore?: number;
}): RecoveryOpportunityGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_recovery_opportunity_context",
      "Topology context is required to evaluate recovery opportunities"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_RECOVERY_OPPORTUNITY_SIGNALS) {
    return reject(
      "too_many_recovery_signals",
      `Recovery opportunity signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_RECOVERY_OPPORTUNITY_SIGNALS}`
    );
  }

  if ((input.recoveryAccelerationScore ?? 0) > 0.95) {
    return reject(
      "runaway_stabilization_amplification",
      "Recovery acceleration score implies uncontrolled stabilization amplification"
    );
  }

  if ((input.stabilizationPotentialScore ?? 0) > 0.95) {
    return reject(
      "runaway_stabilization_amplification",
      "Stabilization potential score implies uncontrolled optimism amplification"
    );
  }

  for (const signal of input.signals) {
    if (signal.opportunityStrength < 0 || signal.opportunityStrength > 1) {
      return reject(
        "invalid_opportunity_strength",
        `Recovery signal ${signal.signalId} opportunity strength must be between 0 and 1`
      );
    }
    if (signal.opportunityStrength > 0.92) {
      return reject(
        "false_optimism_certainty",
        `Recovery signal ${signal.signalId} opportunity strength implies excessive certainty`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_recovery_region",
          `Recovery signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsFalseCertaintyText(label)) {
      return reject(
        "unsupported_recovery_claim",
        `Recovery signal ${signal.signalId} contains prohibited certainty language`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorRecoveryOpportunityFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_recovery_opportunity_build",
      "Identical recovery opportunity evaluation was already executed"
    );
  }

  return { ok: true };
}

export function guardRecoveryOpportunityExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): RecoveryOpportunityGuardResult {
  if (containsFalseCertaintyText(input.headline)) {
    return reject(
      "unsupported_recovery_claim",
      "Recovery opportunity headline contains prohibited certainty language"
    );
  }
  if (containsFalseCertaintyText(input.summary)) {
    return reject(
      "unsupported_recovery_claim",
      "Recovery opportunity summary contains prohibited certainty language"
    );
  }
  return { ok: true };
}
