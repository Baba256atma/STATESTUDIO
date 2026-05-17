/**
 * D7:3:1 — Actor-system relationship intelligence (organizationally grounded).
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  ActorRoleParticipation,
  ActorSystemRelationship,
  StrategicHumanActor,
} from "./humanActorTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

function influenceTypeForRole(
  role: StrategicHumanActor["role"]
): ActorSystemRelationship["influenceType"] {
  switch (role) {
    case "executive":
      return "strategic_oversight";
    case "stakeholder":
      return "stakeholder_alignment";
    case "coordinator":
      return "flow_coordination";
    case "manager":
      return "recovery_support";
    default:
      return "operational_coordination";
  }
}

export function buildActorRoleParticipations(
  actors: readonly StrategicHumanActor[]
): readonly ActorRoleParticipation[] {
  const participations: ActorRoleParticipation[] = [];

  for (const actor of actors) {
    for (const regionId of actor.assignedRegionIds) {
      participations.push(
        Object.freeze({
          participationId: `participation::${actor.actorId}::${regionId}`,
          actorId: actor.actorId,
          role: actor.role,
          regionId,
          participationIntensity: clamp01(actor.operationalParticipation),
          coordinationEffect: clamp01(actor.coordinationContribution),
          explanation: `${actor.displayLabel} participates in ${regionLabel(regionId)} operations.`,
        })
      );
    }
  }

  return Object.freeze(participations.sort((a, b) => a.participationId.localeCompare(b.participationId)));
}

export function buildActorSystemRelationships(input: {
  topology: OperationalUniverseTopology;
  actors: readonly StrategicHumanActor[];
}): readonly ActorSystemRelationship[] {
  const relationships: ActorSystemRelationship[] = [];
  const regionDomain = new Map(
    input.topology.operationalRegions.map((r) => [r.regionId, r.domainClass])
  );

  for (const actor of input.actors) {
    for (const regionId of actor.assignedRegionIds) {
      const influenceType = influenceTypeForRole(actor.role);
      const influenceStrength = clamp01(
        actor.influenceLevel * 0.5 + actor.coordinationContribution * 0.35 + actor.operationalParticipation * 0.15
      );

      relationships.push(
        Object.freeze({
          relationshipId: `relationship::${actor.actorId}::${regionId}`,
          actorId: actor.actorId,
          regionId,
          influenceType,
          influenceStrength,
          explanation: `${actor.displayLabel} exerts ${influenceType.replace(/_/g, " ")} influence on ${regionLabel(regionId)} (${regionDomain.get(regionId) ?? "operational"} domain).`,
        })
      );
    }
  }

  return Object.freeze(
    relationships.sort((a, b) => a.relationshipId.localeCompare(b.relationshipId))
  );
}
