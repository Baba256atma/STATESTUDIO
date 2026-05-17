/**
 * D7:4:4 — Predictive cascading consequence governance guard rails.
 */

import type { PredictiveCascadeSignal } from "./cascadingConsequenceTypes.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { logCascadeDev } from "./cascadeDevLog.ts";

export type CascadeGuardCode =
  | "empty_cascade_context"
  | "too_many_cascade_signals"
  | "excessive_propagation_depth"
  | "invalid_propagation_intensity"
  | "invalid_cascade_region"
  | "duplicate_cascade_build"
  | "false_certainty_language"
  | "unsupported_cascade_claim"
  | "runaway_cascade_amplification"
  | "corrupted_cascade_state";

export type CascadeGuardResult =
  | { ok: true }
  | { ok: false; code: CascadeGuardCode; message: string };

export const DEFAULT_MAX_CASCADE_SIGNALS = 96;
export const DEFAULT_MAX_PROPAGATION_HOP_DEPTH = 4;
export const CASCADE_UNCERTAINTY_DISCLAIMER =
  "Predictive cascade consequences reflect propagation patterns under current conditions and are indicative, not definitive.";

function reject(code: CascadeGuardCode, message: string): CascadeGuardResult {
  const result = { ok: false as const, code, message };
  logCascadeDev("CascadeGuard", { code, message });
  return result;
}

export function buildCascadeContentFingerprint(input: {
  topologyFingerprint: string;
  trajectoryFingerprint?: string;
  divergenceFingerprint?: string;
  inflectionFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    trajectory: input.trajectoryFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    inflection: input.inflectionFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluatePredictiveCascades(input: {
  topologyId: string;
  regionIds: readonly string[];
  signals: readonly PredictiveCascadeSignal[];
  priorCascadeFingerprints?: readonly string[];
  pendingFingerprint?: string;
  cascadeAmplificationScore?: number;
}): CascadeGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_cascade_context",
      "Topology context is required to evaluate predictive cascades"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_CASCADE_SIGNALS) {
    return reject(
      "too_many_cascade_signals",
      `Cascade signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_CASCADE_SIGNALS}`
    );
  }

  if ((input.cascadeAmplificationScore ?? 0) > 0.95) {
    return reject(
      "runaway_cascade_amplification",
      "Cascade amplification score implies uncontrolled predictive amplification"
    );
  }

  for (const signal of input.signals) {
    if (signal.hopDepth > DEFAULT_MAX_PROPAGATION_HOP_DEPTH) {
      return reject(
        "excessive_propagation_depth",
        `Cascade signal ${signal.signalId} exceeds max propagation depth ${DEFAULT_MAX_PROPAGATION_HOP_DEPTH}`
      );
    }
    if (signal.propagationIntensity < 0 || signal.propagationIntensity > 1) {
      return reject(
        "invalid_propagation_intensity",
        `Cascade signal ${signal.signalId} propagation intensity must be between 0 and 1`
      );
    }
    if (signal.propagationIntensity > 0.92) {
      return reject(
        "false_certainty_language",
        `Cascade signal ${signal.signalId} propagation intensity implies excessive certainty`
      );
    }
    for (const regionId of [...signal.originatingRegionIds, ...signal.affectedRegionIds]) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_cascade_region",
          `Cascade signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsFalseCertaintyText(label)) {
      return reject(
        "unsupported_cascade_claim",
        `Cascade signal ${signal.signalId} contains prohibited certainty language`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorCascadeFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_cascade_build",
      "Identical predictive cascade evaluation was already executed"
    );
  }

  return { ok: true };
}

export function guardCascadeExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): CascadeGuardResult {
  if (containsFalseCertaintyText(input.headline)) {
    return reject(
      "unsupported_cascade_claim",
      "Cascade headline contains prohibited certainty language"
    );
  }
  if (containsFalseCertaintyText(input.summary)) {
    return reject(
      "unsupported_cascade_claim",
      "Cascade summary contains prohibited certainty language"
    );
  }
  return { ok: true };
}
