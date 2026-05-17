/**
 * D7:3:1 — Strategic human actor foundation engine (immutable, non-mutating).
 */

import type {
  ActorPanelContract,
  EvaluateHumanActorParticipationInput,
  EvaluateHumanActorParticipationResult,
  HumanActorParticipationSnapshot,
  HumanActorSimulationState,
} from "./humanActorTypes.ts";
import {
  applyRoleInfluenceAdjustments,
  deriveDefaultActorsFromTopology,
} from "./organizationalRoleModeling.ts";
import {
  buildActorRoleParticipations,
  buildActorSystemRelationships,
} from "./actorSystemRelationshipModel.ts";
import {
  calculateActorParticipationIntensity,
  calculateCoordinationPressure,
  calculateOrganizationalAlignmentScore,
  classifyCoordinationQuality,
} from "./coordinationInfluenceModel.ts";
import { buildActorContentFingerprint, guardEvaluateHumanActorParticipation } from "./actorGuards.ts";
import { buildExecutiveActorSemantics } from "./executiveActorSemantics.ts";
import { logActorDev } from "./actorDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function actorBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildActorPanelContract(input: {
  snapshot: HumanActorParticipationSnapshot;
}): ActorPanelContract {
  const viewHint =
    input.snapshot.state.coordinationQualityLabel === "fragmented"
      ? "coordination_heatmap"
      : input.snapshot.state.coordinationQualityLabel === "aligned"
        ? "executive_participation_panel"
        : input.snapshot.state.activeActors.length > 6
          ? "interaction_map"
          : "actor_coordination_overlay";

  return Object.freeze({
    actorStateId: input.snapshot.actorStateId,
    topologyId: input.snapshot.topologyId,
    coordinationPressure: input.snapshot.state.coordinationPressure,
    organizationalAlignmentScore: input.snapshot.state.organizationalAlignmentScore,
    coordinationQualityLabel: input.snapshot.state.coordinationQualityLabel,
    actors: Object.freeze(
      input.snapshot.state.activeActors.map((actor) =>
        Object.freeze({
          actorId: actor.actorId,
          label: actor.displayLabel,
          role: actor.role,
          influenceLevel: actor.influenceLevel,
          regionCount: actor.assignedRegionIds.length,
        })
      )
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate human actor participation (read-only; never infers sensitive private traits).
 */
export function evaluateHumanActorParticipation(
  input: EvaluateHumanActorParticipationInput
): EvaluateHumanActorParticipationResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.participationContext?.tick) || 0);
  const actorStateId = String(
    input.actorStateId ?? `actors::${topology.topologyId}::${tick}`
  ).trim();

  logActorDev("ActorParticipation", {
    actorStateId,
    topologyId: topology.topologyId,
    tick,
    providedActors: input.actors?.length ?? 0,
  });

  let actors = input.actors?.length
    ? [...input.actors]
    : deriveDefaultActorsFromTopology(topology);

  const coordinationLoadFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.025 +
      (input.participationContext?.coordinationLoadFactor ?? 0)
  );

  actors = applyRoleInfluenceAdjustments(actors, {
    coordinationLoadFactor,
    momentumAlignment: input.momentumState?.organizationalMomentumScore,
    recoveryResilience: input.recoveryState?.resilienceScore,
  });

  const roleParticipations = buildActorRoleParticipations(actors);
  const actorSystemRelationships = buildActorSystemRelationships({ topology, actors });

  const coordinationPressure = calculateCoordinationPressure({
    actors,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    coordinationLoadFactor,
  });
  const organizationalAlignmentScore = calculateOrganizationalAlignmentScore({
    actors,
    recoveryState: input.recoveryState,
    equilibriumState: input.equilibriumState,
  });
  const actorParticipationIntensity = calculateActorParticipationIntensity(actors);
  const coordinationQualityLabel = classifyCoordinationQuality({
    coordinationPressure,
    organizationalAlignmentScore,
  });

  const momentumFingerprint = input.momentumState
    ? stableStringify({ trend: input.momentumState.momentumTrendLabel })
    : undefined;

  const pendingFingerprint = buildActorContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    momentumFingerprint,
    tick,
    actorIds: actors.map((a) => a.actorId),
  });

  const guard = guardEvaluateHumanActorParticipation({
    topologyId: topology.topologyId,
    topologyRegionIds: topology.operationalRegions.map((r) => r.regionId),
    actors,
    priorActorFingerprints: input.priorActorFingerprints,
    pendingFingerprint,
  });
  if (!guard.ok) return { ok: false, guard };

  const state: HumanActorSimulationState = Object.freeze({
    activeActors: Object.freeze(actors),
    roleParticipations,
    actorSystemRelationships,
    coordinationPressure,
    organizationalAlignmentScore,
    actorParticipationIntensity,
    coordinationQualityLabel,
  });

  const semantics = buildExecutiveActorSemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    actorStateId,
    coordinationQualityLabel,
    coordinationPressure,
    organizationalAlignmentScore,
  });

  const snapshot: HumanActorParticipationSnapshot = Object.freeze({
    actorStateId,
    topologyId: topology.topologyId,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      participationSummaries: Object.freeze([...semantics.participationSummaries]),
      coordinationSummaries: Object.freeze([...semantics.coordinationSummaries]),
      relationshipSummaries: Object.freeze([...semantics.relationshipSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: actorBuiltAt(tick),
  });

  logActorDev("HumanActor", {
    actorCount: actors.length,
    coordinationQualityLabel,
  });

  const panelContract = buildActorPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeHumanActorParticipationSnapshot(
  snapshot: HumanActorParticipationSnapshot
): HumanActorParticipationSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeActors: Object.freeze(snapshot.state.activeActors.map((a) => Object.freeze({ ...a }))),
      roleParticipations: Object.freeze(
        snapshot.state.roleParticipations.map((p) => Object.freeze({ ...p }))
      ),
      actorSystemRelationships: Object.freeze(
        snapshot.state.actorSystemRelationships.map((r) => Object.freeze({ ...r }))
      ),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
