/**
 * D7:4:7 — Predictive strategic adaptation governance guard rails.
 */

import type { StrategicAdaptationSignal } from "./strategicAdaptationTypes.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { logAdaptationDev } from "./adaptationDevLog.ts";

export type AdaptationGuardCode =
  | "empty_adaptation_context"
  | "too_many_adaptation_signals"
  | "invalid_adaptation_strength"
  | "invalid_adaptation_region"
  | "duplicate_adaptation_build"
  | "false_certainty_language"
  | "unsupported_adaptation_claim"
  | "runaway_adaptive_amplification"
  | "corrupted_adaptation_state";

export type AdaptationGuardResult =
  | { ok: true }
  | { ok: false; code: AdaptationGuardCode; message: string };

export const DEFAULT_MAX_ADAPTATION_SIGNALS = 96;
export const ADAPTATION_UNCERTAINTY_DISCLAIMER =
  "Strategic adaptation reflects organizational flexibility potential under current conditions and is indicative, not definitive.";

function reject(code: AdaptationGuardCode, message: string): AdaptationGuardResult {
  const result = { ok: false as const, code, message };
  logAdaptationDev("AdaptationGuard", { code, message });
  return result;
}

export function buildAdaptationContentFingerprint(input: {
  topologyFingerprint: string;
  preventionFingerprint?: string;
  recoveryOpportunityFingerprint?: string;
  resilienceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    prevention: input.preventionFingerprint ?? null,
    recoveryOpportunity: input.recoveryOpportunityFingerprint ?? null,
    resilience: input.resilienceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateStrategicAdaptation(input: {
  topologyId: string;
  regionIds: readonly string[];
  signals: readonly StrategicAdaptationSignal[];
  priorAdaptationFingerprints?: readonly string[];
  pendingFingerprint?: string;
  adaptiveResilienceScore?: number;
  strategicFlexibilityScore?: number;
}): AdaptationGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_adaptation_context",
      "Topology context is required to evaluate strategic adaptation"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_ADAPTATION_SIGNALS) {
    return reject(
      "too_many_adaptation_signals",
      `Adaptation signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_ADAPTATION_SIGNALS}`
    );
  }

  if ((input.adaptiveResilienceScore ?? 0) > 0.95) {
    return reject(
      "runaway_adaptive_amplification",
      "Adaptive resilience score implies uncontrolled adaptive amplification"
    );
  }

  if ((input.strategicFlexibilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_adaptive_amplification",
      "Strategic flexibility score implies uncontrolled adaptive amplification"
    );
  }

  for (const signal of input.signals) {
    if (signal.adaptationStrength < 0 || signal.adaptationStrength > 1) {
      return reject(
        "invalid_adaptation_strength",
        `Adaptation signal ${signal.signalId} strength must be between 0 and 1`
      );
    }
    if (signal.adaptationStrength > 0.92) {
      return reject(
        "false_certainty_language",
        `Adaptation signal ${signal.signalId} strength implies excessive certainty`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_adaptation_region",
          `Adaptation signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsFalseCertaintyText(label)) {
      return reject(
        "unsupported_adaptation_claim",
        `Adaptation signal ${signal.signalId} contains prohibited certainty language`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorAdaptationFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_adaptation_build",
      "Identical strategic adaptation evaluation was already executed"
    );
  }

  return { ok: true };
}

export function guardAdaptationExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): AdaptationGuardResult {
  if (containsFalseCertaintyText(input.headline)) {
    return reject(
      "unsupported_adaptation_claim",
      "Adaptation headline contains prohibited certainty language"
    );
  }
  if (containsFalseCertaintyText(input.summary)) {
    return reject(
      "unsupported_adaptation_claim",
      "Adaptation summary contains prohibited certainty language"
    );
  }
  return { ok: true };
}
