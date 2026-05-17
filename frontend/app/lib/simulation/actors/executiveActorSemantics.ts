/**
 * D7:3:1 — Executive-readable human actor semantics.
 */

import type {
  ExecutiveActorSemantics,
  HumanActorSimulationState,
} from "./humanActorTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveActorSemantics(input: {
  state: HumanActorSimulationState;
}): ExecutiveActorSemantics {
  const executives = input.state.activeActors.filter((a) => a.role === "executive");
  const managers = input.state.activeActors.filter((a) => a.role === "manager");
  const lowCoordination = input.state.activeActors
    .filter((a) => a.coordinationContribution < 0.4)
    .sort((a, b) => a.coordinationContribution - b.coordinationContribution)[0];

  const execRegions = executives.flatMap((a) => [...a.assignedRegionIds]);
  const managerRegions = managers.flatMap((a) => [...a.assignedRegionIds]);
  const sharedRegions = execRegions.filter((r) => managerRegions.includes(r));

  const headline =
    input.state.coordinationQualityLabel === "aligned"
      ? "Organizational actor participation supports stable coordination across operational regions."
      : input.state.coordinationQualityLabel === "fragmented"
        ? sharedRegions.length > 0
          ? `Operational recovery is slowing due to coordination overload between executive and ${regionLabel(sharedRegions[0])} management regions.`
          : "Human coordination across operational regions is fragmented, increasing dependency pressure."
        : lowCoordination
          ? `${lowCoordination.displayLabel} shows strained coordination capacity affecting operational participation.`
          : "Actor participation remains active with moderate coordination strain across the enterprise.";

  const summaryParts: string[] = [];
  if (input.state.coordinationQualityLabel === "aligned") {
    summaryParts.push("Executive oversight and operational teams remain aligned with recovery and flow coordination.");
  } else if (input.state.coordinationQualityLabel === "fragmented") {
    summaryParts.push("Cross-team coordination gaps are amplifying operational imbalance and recovery delays.");
  } else {
    summaryParts.push("Management and operational participation is active but coordination pressure is elevated.");
  }
  summaryParts.push(
    `Organizational alignment is ${(input.state.organizationalAlignmentScore * 100).toFixed(0)}% with coordination pressure at ${(input.state.coordinationPressure * 100).toFixed(0)}%.`
  );

  const participationSummaries = input.state.roleParticipations.slice(0, 6).map((p) => p.explanation);

  const coordinationSummaries: string[] = [];
  if (input.state.coordinationPressure > 0.55) {
    coordinationSummaries.push("Coordination load is elevated across assigned management regions.");
  }
  if (executives.length > 0 && managers.length > 0) {
    coordinationSummaries.push(
      `Executive and management actors are active across ${executives.length + managers.length} operational participation paths.`
    );
  }

  const relationshipSummaries = input.state.actorSystemRelationships
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.coordinationQualityLabel === "fragmented") {
    bullets.push("Cross-domain coordination requires executive attention to reduce recovery bottlenecks.");
  }
  for (const actor of input.state.activeActors.filter((a) => a.role === "coordinator").slice(0, 1)) {
    bullets.push(`${actor.displayLabel} supports flow coordination across assigned regions.`);
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    participationSummaries,
    coordinationSummaries,
    relationshipSummaries,
    bullets,
  };
}
