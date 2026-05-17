/**
 * D7:3:3 — Ethical organizational decision friction governance guard rails.
 */

import type { DecisionFrictionSignal } from "./decisionFrictionTypes.ts";
import { logDecisionFrictionDev } from "./decisionFrictionDevLog.ts";

export type FrictionGuardCode =
  | "empty_friction_context"
  | "too_many_friction_signals"
  | "invalid_friction_intensity"
  | "invalid_friction_region"
  | "duplicate_friction_build"
  | "prohibited_behavioral_inference"
  | "invasive_friction_analysis"
  | "corrupted_friction_state";

export type FrictionGuardResult =
  | { ok: true }
  | { ok: false; code: FrictionGuardCode; message: string };

export const DEFAULT_MAX_FRICTION_SIGNALS = 96;
export const PROHIBITED_FRICTION_TEXT = [
  "personality",
  "emotion",
  "psychological",
  "psychology",
  "manipulation",
  "surveillance",
  "belief",
  "coercion",
] as const;

function reject(code: FrictionGuardCode, message: string): FrictionGuardResult {
  const result = { ok: false as const, code, message };
  logDecisionFrictionDev("FrictionGuard", { code, message });
  return result;
}

export function buildFrictionContentFingerprint(input: {
  topologyFingerprint: string;
  coordinationFingerprint?: string;
  actorFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    coordination: input.coordinationFingerprint ?? null,
    actors: input.actorFingerprint ?? null,
    tick: input.tick,
  });
}

export function containsProhibitedFrictionText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_FRICTION_TEXT.some((term) => lower.includes(term));
}

export function guardEvaluateDecisionFriction(input: {
  topologyId: string;
  regionIds: readonly string[];
  signals: readonly DecisionFrictionSignal[];
  priorFrictionFingerprints?: readonly string[];
  pendingFingerprint?: string;
}): FrictionGuardResult {
  if (!input.topologyId) {
    return reject("empty_friction_context", "Topology context is required to evaluate decision friction");
  }

  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_FRICTION_SIGNALS) {
    return reject(
      "too_many_friction_signals",
      `Friction signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_FRICTION_SIGNALS}`
    );
  }

  for (const signal of input.signals) {
    if (signal.intensity < 0 || signal.intensity > 1) {
      return reject(
        "invalid_friction_intensity",
        `Friction signal ${signal.signalId} intensity must be between 0 and 1`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_friction_region",
          `Friction signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsProhibitedFrictionText(label)) {
      return reject(
        "invasive_friction_analysis",
        `Friction signal ${signal.signalId} contains prohibited behavioral inference text`
      );
    }
    const drivers = signal.dominantFrictionDrivers ?? [];
    for (const driver of drivers) {
      if (containsProhibitedFrictionText(driver)) {
        return reject(
          "prohibited_behavioral_inference",
          `Friction signal ${signal.signalId} contains prohibited driver text`
        );
      }
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorFrictionFingerprints ?? []).includes(pending)) {
    return reject("duplicate_friction_build", "Identical decision friction evaluation was already executed");
  }

  return { ok: true };
}
