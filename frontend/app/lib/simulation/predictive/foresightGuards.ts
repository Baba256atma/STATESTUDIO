/**
 * D7:4:8 — Predictive executive foresight governance guard rails.
 */

import type { ExecutiveForesightSignal } from "./executiveForesightTypes.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { logForesightDev } from "./foresightDevLog.ts";

export type ForesightGuardCode =
  | "empty_foresight_context"
  | "too_many_foresight_signals"
  | "invalid_foresight_strength"
  | "invalid_foresight_region"
  | "duplicate_foresight_build"
  | "false_certainty_language"
  | "unsupported_foresight_claim"
  | "runaway_foresight_amplification"
  | "corrupted_foresight_state";

export type ForesightGuardResult =
  | { ok: true }
  | { ok: false; code: ForesightGuardCode; message: string };

export const DEFAULT_MAX_FORESIGHT_SIGNALS = 96;
export const FORESIGHT_UNCERTAINTY_DISCLAIMER =
  "Executive foresight reflects emerging patterns under current conditions and is indicative, not definitive.";

function reject(code: ForesightGuardCode, message: string): ForesightGuardResult {
  const result = { ok: false as const, code, message };
  logForesightDev("ForesightGuard", { code, message });
  return result;
}

export function buildForesightContentFingerprint(input: {
  topologyFingerprint: string;
  adaptationFingerprint?: string;
  preventionFingerprint?: string;
  divergenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    adaptation: input.adaptationFingerprint ?? null,
    prevention: input.preventionFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateExecutiveForesight(input: {
  topologyId: string;
  regionIds: readonly string[];
  signals: readonly ExecutiveForesightSignal[];
  priorForesightFingerprints?: readonly string[];
  pendingFingerprint?: string;
  strategicPreparednessScore?: number;
  futureReadinessScore?: number;
}): ForesightGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_foresight_context",
      "Topology context is required to evaluate executive foresight"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_FORESIGHT_SIGNALS) {
    return reject(
      "too_many_foresight_signals",
      `Foresight signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_FORESIGHT_SIGNALS}`
    );
  }

  if ((input.strategicPreparednessScore ?? 0) > 0.95) {
    return reject(
      "runaway_foresight_amplification",
      "Strategic preparedness score implies uncontrolled foresight amplification"
    );
  }

  if ((input.futureReadinessScore ?? 0) > 0.95) {
    return reject(
      "runaway_foresight_amplification",
      "Future readiness score implies uncontrolled foresight amplification"
    );
  }

  for (const signal of input.signals) {
    if (signal.foresightStrength < 0 || signal.foresightStrength > 1) {
      return reject(
        "invalid_foresight_strength",
        `Foresight signal ${signal.signalId} strength must be between 0 and 1`
      );
    }
    if (signal.foresightStrength > 0.92) {
      return reject(
        "false_certainty_language",
        `Foresight signal ${signal.signalId} strength implies excessive certainty`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_foresight_region",
          `Foresight signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsFalseCertaintyText(label)) {
      return reject(
        "unsupported_foresight_claim",
        `Foresight signal ${signal.signalId} contains prohibited certainty language`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorForesightFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_foresight_build",
      "Identical executive foresight evaluation was already executed"
    );
  }

  return { ok: true };
}

export function guardForesightExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): ForesightGuardResult {
  if (containsFalseCertaintyText(input.headline)) {
    return reject(
      "unsupported_foresight_claim",
      "Foresight headline contains prohibited certainty language"
    );
  }
  if (containsFalseCertaintyText(input.summary)) {
    return reject(
      "unsupported_foresight_claim",
      "Foresight summary contains prohibited certainty language"
    );
  }
  return { ok: true };
}
