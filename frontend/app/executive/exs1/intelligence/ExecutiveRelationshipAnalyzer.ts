/**
 * Phase B — Traverse metadata relationships (no graph reasoning).
 */

import type { Exs1ObjectId } from "../exs1Types";
import { getDomain } from "../metadata/ExecutiveDomainRegistry";
import type { ExecutiveMetadataCatalog } from "../metadata/ExecutiveMetadataRegistry";
import { getObjectMetadata } from "../metadata/ExecutiveMetadataRegistry";
import { METADATA_STATIC } from "../metadata/ExecutiveMetadataRegistry";
import type { ExecutiveRuntimeState } from "../runtime/ExecutiveRuntimeStore";
import type { ExecutiveChangeRecord } from "./ExecutiveSignalTypes";
import type { ExecutiveRelationshipAnalysis } from "./ExecutiveSignalTypes";

function seedObjects(
  change: ExecutiveChangeRecord,
  state: ExecutiveRuntimeState,
): Exs1ObjectId[] {
  if (change.eventType === "ObjectSelected" && change.toValue) {
    return [change.toValue as Exs1ObjectId];
  }
  if (state.selection.selectedObjectId) {
    return [state.selection.selectedObjectId];
  }
  if (change.eventType === "DecisionApproved") {
    return ["decision", "inventory"];
  }
  if (change.eventType === "ExecutionStarted") {
    return ["factory", "inventory"];
  }
  if (change.eventType === "SnapshotCreated" || change.eventType === "MonitoringUpdated") {
    return ["inventory", "revenue", "factory"];
  }
  if (change.eventType === "DataSourceSelected" || change.eventType === "DataUpdated") {
    return ["inventory", "revenue"];
  }
  if (change.eventType === "SimulationCompleted") {
    return ["inventory", "revenue", "customer", "factory"];
  }
  return state.selection.selectedObjectId
    ? [state.selection.selectedObjectId]
    : ["inventory"];
}

export function analyzeExecutiveRelationships(
  change: ExecutiveChangeRecord,
  state: ExecutiveRuntimeState,
  catalog: ExecutiveMetadataCatalog,
): ExecutiveRelationshipAnalysis {
  const affected = seedObjects(change, state);
  const related = new Set<Exs1ObjectId>();
  const domains = new Set<string>();
  const kpis = new Set<string>();

  for (const objectId of affected) {
    related.add(objectId);
    const meta = getObjectMetadata(catalog, objectId);
    meta?.relatedObjectIds.forEach((id) => related.add(id));
    meta?.domainIds.forEach((id) => {
      const name = getDomain(id)?.name;
      if (name) domains.add(name);
    });
    for (const relation of METADATA_STATIC.relations) {
      if (relation.fromObjectId === objectId) related.add(relation.toObjectId);
      if (relation.toObjectId === objectId) related.add(relation.fromObjectId);
    }
    for (const kpi of METADATA_STATIC.kpis) {
      if (kpi.relatedObjectIds.includes(objectId)) kpis.add(kpi.name);
    }
  }

  const relatedDecisionIds = state.decision.decisions
    .filter((d) => d.status !== "Archived")
    .slice(0, 2)
    .map((d) => d.id);

  return {
    affectedObjectIds: affected,
    relatedObjectIds: Array.from(related),
    relatedDomainNames: Array.from(domains),
    relatedKpiNames: Array.from(kpis),
    relatedDecisionIds,
  };
}
