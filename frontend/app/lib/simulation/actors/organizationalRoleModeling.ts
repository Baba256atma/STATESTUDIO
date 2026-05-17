/**
 * D7:3:1 — Organizational role modeling (operationally grounded).
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { StrategicHumanActor, StrategicHumanActorRole } from "./humanActorTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logActorDev } from "./actorDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

const ROLE_BASE_INFLUENCE: Record<StrategicHumanActorRole, number> = {
  executive: 0.75,
  manager: 0.6,
  coordinator: 0.55,
  operator: 0.45,
  stakeholder: 0.4,
};

function inferRoleForRegion(regionId: string, domainClass: string): StrategicHumanActorRole {
  if (regionId === "finance" || domainClass === "financial") return "executive";
  if (regionId === "customer_systems" || domainClass === "external_dependency") return "stakeholder";
  if (regionId === "logistics" || regionId === "manufacturing") return "manager";
  if (domainClass === "operational") return "operator";
  return "coordinator";
}

export function deriveDefaultActorsFromTopology(
  topology: OperationalUniverseTopology
): StrategicHumanActor[] {
  const actors: StrategicHumanActor[] = [];
  const roleCounters = new Map<StrategicHumanActorRole, number>();

  for (const region of topology.operationalRegions) {
    const role = inferRoleForRegion(region.regionId, region.domainClass);
    const count = (roleCounters.get(role) ?? 0) + 1;
    roleCounters.set(role, count);
    const actorId = `actor::${role}::${region.regionId}::${count}`;
    const base = ROLE_BASE_INFLUENCE[role];

    actors.push(
      Object.freeze({
        actorId,
        displayLabel: `${role.charAt(0).toUpperCase() + role.slice(1)} — ${regionLabel(region.regionId)}`,
        role,
        assignedRegionIds: Object.freeze([region.regionId]),
        influenceLevel: clamp01(
          base * 0.85 + (region.fragilityScore != null ? (1 - region.fragilityScore) * 0.15 : 0.1)
        ),
        coordinationContribution: clamp01(base * 0.7),
        operationalParticipation: clamp01(base * 0.65 + Math.min(0.1, (region.objectIds?.length ?? 1) * 0.02)),
      })
    );
  }

  if (topology.dependencyChannels.length > 0) {
    const coordCount = (roleCounters.get("coordinator") ?? 0) + 1;
    actors.push(
      Object.freeze({
        actorId: `actor::coordinator::cross-domain::${coordCount}`,
        displayLabel: "Cross-domain coordination lead",
        role: "coordinator",
        assignedRegionIds: Object.freeze(
          [...new Set(topology.dependencyChannels.flatMap((c) => [c.fromRegionId, c.toRegionId]))].sort()
        ),
        influenceLevel: 0.58,
        coordinationContribution: 0.72,
        operationalParticipation: 0.5,
      })
    );
  }

  logActorDev("HumanActor", { derivedCount: actors.length, topologyId: topology.topologyId });
  return actors.sort((a, b) => a.actorId.localeCompare(b.actorId));
}

export function applyRoleInfluenceAdjustments(
  actors: readonly StrategicHumanActor[],
  input: {
    coordinationLoadFactor?: number;
    momentumAlignment?: number;
    recoveryResilience?: number;
  }
): StrategicHumanActor[] {
  const load = clamp01(input.coordinationLoadFactor ?? 0);
  return actors.map((actor) => {
    let coordinationContribution = actor.coordinationContribution;
    let operationalParticipation = actor.operationalParticipation;

    if (actor.role === "executive") {
      coordinationContribution = clamp01(
        coordinationContribution * 0.6 + (input.momentumAlignment ?? 0.5) * 0.25
      );
    } else if (actor.role === "manager") {
      operationalParticipation = clamp01(operationalParticipation - load * 0.15);
    } else if (actor.role === "coordinator") {
      coordinationContribution = clamp01(coordinationContribution - load * 0.12);
    } else if (actor.role === "stakeholder") {
      coordinationContribution = clamp01(
        coordinationContribution * 0.5 + (input.recoveryResilience ?? 0.5) * 0.2
      );
    }

    return Object.freeze({
      ...actor,
      coordinationContribution,
      operationalParticipation,
    });
  });
}
