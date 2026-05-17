/**
 * D7:3:6 — Ethical strategic leadership load governance guard rails.
 */

import type { LeadershipLoadSignal } from "./leadershipLoadTypes.ts";
import { logLeadershipDev } from "./leadershipDevLog.ts";

export type LeadershipGuardCode =
  | "empty_leadership_context"
  | "too_many_leadership_signals"
  | "invalid_leadership_intensity"
  | "invalid_leadership_actor"
  | "duplicate_leadership_build"
  | "prohibited_behavioral_inference"
  | "invasive_leadership_analysis"
  | "corrupted_leadership_state";

export type LeadershipGuardResult =
  | { ok: true }
  | { ok: false; code: LeadershipGuardCode; message: string };

export const DEFAULT_MAX_LEADERSHIP_SIGNALS = 96;
export const PROHIBITED_LEADERSHIP_TEXT = [
  "personality",
  "emotion",
  "emotional",
  "psychological",
  "psychology",
  "burnout",
  "mental",
  "health",
  "fatigue",
  "depression",
  "anxiety",
  "manipulation",
  "surveillance",
] as const;

function reject(code: LeadershipGuardCode, message: string): LeadershipGuardResult {
  const result = { ok: false as const, code, message };
  logLeadershipDev("LeadershipGuard", { code, message });
  return result;
}

export function buildLeadershipContentFingerprint(input: {
  topologyFingerprint: string;
  coordinationFingerprint?: string;
  frictionFingerprint?: string;
  influenceFingerprint?: string;
  trustFingerprint?: string;
  actorFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    coordination: input.coordinationFingerprint ?? null,
    friction: input.frictionFingerprint ?? null,
    influence: input.influenceFingerprint ?? null,
    trust: input.trustFingerprint ?? null,
    actors: input.actorFingerprint ?? null,
    tick: input.tick,
  });
}

export function containsProhibitedLeadershipText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_LEADERSHIP_TEXT.some((term) => lower.includes(term));
}

export function guardEvaluateLeadershipDynamics(input: {
  topologyId: string;
  actorIds: readonly string[];
  signals: readonly LeadershipLoadSignal[];
  priorLeadershipFingerprints?: readonly string[];
  pendingFingerprint?: string;
}): LeadershipGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_leadership_context",
      "Topology context is required to evaluate leadership dynamics"
    );
  }

  const actorSet = new Set(input.actorIds);

  if (input.signals.length > DEFAULT_MAX_LEADERSHIP_SIGNALS) {
    return reject(
      "too_many_leadership_signals",
      `Leadership signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_LEADERSHIP_SIGNALS}`
    );
  }

  for (const signal of input.signals) {
    if (signal.intensity < 0 || signal.intensity > 1) {
      return reject(
        "invalid_leadership_intensity",
        `Leadership signal ${signal.signalId} intensity must be between 0 and 1`
      );
    }
    for (const actorId of signal.affectedActorIds) {
      if (!actorSet.has(actorId)) {
        return reject(
          "invalid_leadership_actor",
          `Leadership signal ${signal.signalId} references unknown actor ${actorId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsProhibitedLeadershipText(label)) {
      return reject(
        "invasive_leadership_analysis",
        `Leadership signal ${signal.signalId} contains prohibited behavioral inference text`
      );
    }
    for (const driver of signal.dominantLoadDrivers ?? []) {
      if (containsProhibitedLeadershipText(driver)) {
        return reject(
          "prohibited_behavioral_inference",
          `Leadership signal ${signal.signalId} contains prohibited driver text`
        );
      }
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorLeadershipFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_leadership_build",
      "Identical leadership dynamics evaluation was already executed"
    );
  }

  return { ok: true };
}
