/**
 * D7:3:1 — Ethical human actor governance guard rails.
 */

import type { StrategicHumanActor } from "./humanActorTypes.ts";
import { logActorDev } from "./actorDevLog.ts";

export type ActorGuardCode =
  | "empty_topology"
  | "too_many_actors"
  | "invalid_actor_influence"
  | "invalid_actor_region"
  | "duplicate_actor_build"
  | "prohibited_sensitive_attribute"
  | "invasive_behavioral_inference"
  | "corrupted_actor_state";

export type ActorGuardResult =
  | { ok: true }
  | { ok: false; code: ActorGuardCode; message: string };

export const DEFAULT_MAX_STRATEGIC_ACTORS = 64;

/** Keys that must never appear on actor payloads (ethical constraint). */
export const PROHIBITED_ACTOR_ATTRIBUTE_KEYS = [
  "personality",
  "emotion",
  "emotional",
  "psychology",
  "psychological",
  "mentalHealth",
  "political",
  "religion",
  "ethnicity",
  "gender",
  "age",
  "biometric",
  "surveillance",
  "manipulation",
] as const;

function reject(code: ActorGuardCode, message: string): ActorGuardResult {
  const result = { ok: false as const, code, message };
  logActorDev("ActorGuard", { code, message });
  return result;
}

export function buildActorContentFingerprint(input: {
  topologyFingerprint: string;
  momentumFingerprint?: string;
  tick: number;
  actorIds: readonly string[];
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    momentum: input.momentumFingerprint ?? null,
    tick: input.tick,
    actors: [...input.actorIds].sort(),
  });
}

export function detectProhibitedActorAttributes(
  actor: StrategicHumanActor & Record<string, unknown>
): string | null {
  for (const key of Object.keys(actor)) {
    const lower = key.toLowerCase();
    for (const prohibited of PROHIBITED_ACTOR_ATTRIBUTE_KEYS) {
      if (lower.includes(prohibited.toLowerCase())) {
        return key;
      }
    }
  }
  return null;
}

export function guardEvaluateHumanActorParticipation(input: {
  topologyId: string;
  topologyRegionIds: readonly string[];
  actors: readonly StrategicHumanActor[];
  priorActorFingerprints?: readonly string[];
  pendingFingerprint?: string;
}): ActorGuardResult {
  if (!input.topologyId) {
    return reject("empty_topology", "Topology is required to evaluate human actor participation");
  }

  const regionSet = new Set(input.topologyRegionIds);
  const actorIds = new Set<string>();

  if (input.actors.length > DEFAULT_MAX_STRATEGIC_ACTORS) {
    return reject(
      "too_many_actors",
      `Actor count ${input.actors.length} exceeds max ${DEFAULT_MAX_STRATEGIC_ACTORS}`
    );
  }

  for (const actor of input.actors) {
    if (actorIds.has(actor.actorId)) {
      return reject("corrupted_actor_state", `Duplicate actor id ${actor.actorId}`);
    }
    actorIds.add(actor.actorId);

    const prohibited = detectProhibitedActorAttributes(actor as StrategicHumanActor & Record<string, unknown>);
    if (prohibited) {
      return reject(
        "prohibited_sensitive_attribute",
        `Actor ${actor.actorId} contains prohibited attribute: ${prohibited}`
      );
    }

    if (actor.influenceLevel < 0 || actor.influenceLevel > 1) {
      return reject(
        "invalid_actor_influence",
        `Actor ${actor.actorId} influenceLevel must be between 0 and 1`
      );
    }

    for (const regionId of actor.assignedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_actor_region",
          `Actor ${actor.actorId} references unknown region ${regionId}`
        );
      }
    }

    if (
      actor.displayLabel.toLowerCase().includes("personality") ||
      actor.displayLabel.toLowerCase().includes("psychological")
    ) {
      return reject(
        "invasive_behavioral_inference",
        `Actor ${actor.actorId} display label implies prohibited behavioral inference`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorActorFingerprints ?? []).includes(pending)) {
    return reject("duplicate_actor_build", "Identical actor participation evaluation was already executed");
  }

  return { ok: true };
}
