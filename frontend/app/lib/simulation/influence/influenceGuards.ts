/**
 * D7:3:4 — Ethical stakeholder influence governance guard rails.
 */

import type { StakeholderInfluenceSignal } from "./stakeholderInfluenceTypes.ts";
import { logInfluenceDev } from "./influenceDevLog.ts";

export type InfluenceGuardCode =
  | "empty_influence_context"
  | "too_many_influence_signals"
  | "invalid_influence_intensity"
  | "invalid_influence_actor"
  | "invalid_influence_region"
  | "duplicate_influence_build"
  | "prohibited_behavioral_inference"
  | "invasive_influence_analysis"
  | "corrupted_influence_state";

export type InfluenceGuardResult =
  | { ok: true }
  | { ok: false; code: InfluenceGuardCode; message: string };

export const DEFAULT_MAX_INFLUENCE_SIGNALS = 96;
export const PROHIBITED_INFLUENCE_TEXT = [
  "personality",
  "emotion",
  "psychological",
  "psychology",
  "manipulation",
  "persuasion",
  "political",
  "coercion",
  "surveillance",
  "belief",
] as const;

function reject(code: InfluenceGuardCode, message: string): InfluenceGuardResult {
  const result = { ok: false as const, code, message };
  logInfluenceDev("InfluenceGuard", { code, message });
  return result;
}

export function buildInfluenceContentFingerprint(input: {
  topologyFingerprint: string;
  coordinationFingerprint?: string;
  frictionFingerprint?: string;
  actorFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    coordination: input.coordinationFingerprint ?? null,
    friction: input.frictionFingerprint ?? null,
    actors: input.actorFingerprint ?? null,
    tick: input.tick,
  });
}

export function containsProhibitedInfluenceText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_INFLUENCE_TEXT.some((term) => lower.includes(term));
}

export function guardEvaluateStakeholderInfluence(input: {
  topologyId: string;
  actorIds: readonly string[];
  regionIds: readonly string[];
  signals: readonly StakeholderInfluenceSignal[];
  priorInfluenceFingerprints?: readonly string[];
  pendingFingerprint?: string;
}): InfluenceGuardResult {
  if (!input.topologyId) {
    return reject("empty_influence_context", "Topology context is required to evaluate stakeholder influence");
  }

  const actorSet = new Set(input.actorIds);
  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_INFLUENCE_SIGNALS) {
    return reject(
      "too_many_influence_signals",
      `Influence signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_INFLUENCE_SIGNALS}`
    );
  }

  for (const signal of input.signals) {
    if (signal.intensity < 0 || signal.intensity > 1) {
      return reject(
        "invalid_influence_intensity",
        `Influence signal ${signal.signalId} intensity must be between 0 and 1`
      );
    }
    for (const actorId of signal.sourceActorIds) {
      if (!actorSet.has(actorId)) {
        return reject(
          "invalid_influence_actor",
          `Influence signal ${signal.signalId} references unknown actor ${actorId}`
        );
      }
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_influence_region",
          `Influence signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsProhibitedInfluenceText(label)) {
      return reject(
        "invasive_influence_analysis",
        `Influence signal ${signal.signalId} contains prohibited behavioral inference text`
      );
    }
    for (const driver of signal.propagationDrivers ?? []) {
      if (containsProhibitedInfluenceText(driver)) {
        return reject(
          "prohibited_behavioral_inference",
          `Influence signal ${signal.signalId} contains prohibited driver text`
        );
      }
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorInfluenceFingerprints ?? []).includes(pending)) {
    return reject("duplicate_influence_build", "Identical stakeholder influence evaluation was already executed");
  }

  return { ok: true };
}
