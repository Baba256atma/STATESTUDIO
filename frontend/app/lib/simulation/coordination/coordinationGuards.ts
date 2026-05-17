/**
 * D7:3:2 — Ethical executive coordination governance guard rails.
 */

import type { ExecutiveCoordinationSignal } from "./coordinationDynamicsTypes.ts";
import { logCoordinationDev } from "./coordinationDevLog.ts";

export type CoordinationGuardCode =
  | "empty_actor_context"
  | "too_many_coordination_signals"
  | "invalid_coordination_intensity"
  | "invalid_coordination_actor"
  | "duplicate_coordination_build"
  | "prohibited_behavioral_inference"
  | "invasive_coordination_analysis"
  | "corrupted_coordination_state";

export type CoordinationGuardResult =
  | { ok: true }
  | { ok: false; code: CoordinationGuardCode; message: string };

export const DEFAULT_MAX_COORDINATION_SIGNALS = 96;
export const PROHIBITED_COORDINATION_TEXT = [
  "personality",
  "emotion",
  "psychological",
  "psychology",
  "manipulation",
  "surveillance",
] as const;

function reject(code: CoordinationGuardCode, message: string): CoordinationGuardResult {
  const result = { ok: false as const, code, message };
  logCoordinationDev("CoordinationGuard", { code, message });
  return result;
}

export function buildCoordinationContentFingerprint(input: {
  topologyFingerprint: string;
  actorFingerprint?: string;
  momentumFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    actors: input.actorFingerprint ?? null,
    momentum: input.momentumFingerprint ?? null,
    tick: input.tick,
  });
}

export function containsProhibitedCoordinationText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_COORDINATION_TEXT.some((term) => lower.includes(term));
}

export function guardEvaluateExecutiveCoordination(input: {
  topologyId: string;
  actorIds: readonly string[];
  signals: readonly ExecutiveCoordinationSignal[];
  priorCoordinationFingerprints?: readonly string[];
  pendingFingerprint?: string;
}): CoordinationGuardResult {
  if (!input.topologyId) {
    return reject("empty_actor_context", "Actor context is required to evaluate executive coordination");
  }

  const actorSet = new Set(input.actorIds);

  if (input.signals.length > DEFAULT_MAX_COORDINATION_SIGNALS) {
    return reject(
      "too_many_coordination_signals",
      `Coordination signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_COORDINATION_SIGNALS}`
    );
  }

  for (const signal of input.signals) {
    if (signal.intensity < 0 || signal.intensity > 1) {
      return reject(
        "invalid_coordination_intensity",
        `Coordination signal ${signal.signalId} intensity must be between 0 and 1`
      );
    }
    for (const actorId of signal.participatingActorIds) {
      if (!actorSet.has(actorId)) {
        return reject(
          "invalid_coordination_actor",
          `Coordination signal ${signal.signalId} references unknown actor ${actorId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsProhibitedCoordinationText(label)) {
      return reject(
        "invasive_coordination_analysis",
        `Coordination signal ${signal.signalId} contains prohibited behavioral inference text`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorCoordinationFingerprints ?? []).includes(pending)) {
    return reject("duplicate_coordination_build", "Identical coordination evaluation was already executed");
  }

  return { ok: true };
}
