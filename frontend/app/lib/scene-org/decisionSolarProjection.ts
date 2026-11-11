/**
 * NPA-T DECISION-SOLAR-FOUNDATION:1
 *
 * Read-only Decision Solar projection. Ring placement is presentation grouping.
 * It does not create records, relationships, outcomes, or execution evidence.
 */

import type { NexoraDecisionTheatreDataObject } from "../decision-theatre/nexoraDecisionTheatreDataObjectProjection.ts";
import { nexoraDecisionTheatreDataObjectProjectionIdentity } from "../decision-theatre/nexoraDecisionTheatreDataObjectProjection.ts";
import { SCENE_ORG_STAGE_PLANE_LIMIT } from "./sceneOrgSavedSceneSpatialState.ts";
import { getCanonicalObject } from "./canonicalObjectRegistry.ts";
import {
  canonicalDecisionDomainIdentity,
  listDecisionGoals,
  listDecisionRelationships,
  listDecisionScenarios,
  listExecutionPlans,
  listManagerDecisions,
  type DecisionDomainRelationship,
} from "./canonicalDecisionDomain.ts";

export const DECISION_SOLAR_RENDER_LIMIT = 100 as const;

export const DECISION_SOLAR_NOTICE =
  "Decision Solar shows explicit manager records. Ring position is presentation grouping, not priority, causality, or execution order." as const;

export type DecisionSolarNodeKind =
  | "GOAL"
  | "SCENARIO"
  | "DECISION"
  | "EXECUTION_PLAN"
  | "ORGANIZATIONAL_OBJECT";

export type DecisionSolarNode = Readonly<{
  id: string;
  kind: DecisionSolarNodeKind;
  name: string;
  lifecycleStatus: string;
  provenance: string;
  deckId: string;
  approvalStatus: string | null;
}>;

export type DecisionSolarEdge = Readonly<{
  relationshipId: string;
  relationshipType: DecisionDomainRelationship["relationshipType"];
  sourceId: string;
  targetId: string;
}>;

export type DecisionSolarMissingReference = Readonly<{
  relationshipId: string;
  sourceId: string;
  targetId: string;
  reason: "missing" | "inactive" | "unauthorized";
}>;

export type DecisionSolarPlacement = Readonly<{
  id: string;
  ringId: string;
  position: Readonly<{ x: number; y: number; z: 0 }>;
}>;

export type DecisionSolarLayout = Readonly<{
  viewType: "DECISION_SOLAR";
  notice: string;
  nodes: readonly DecisionSolarNode[];
  edges: readonly DecisionSolarEdge[];
  missingReferences: readonly DecisionSolarMissingReference[];
  rings: readonly { readonly ringId: string; readonly label: string; readonly radius: number; readonly nodeIds: readonly string[] }[];
  placements: readonly DecisionSolarPlacement[];
  limitation: string | null;
}>;

function roundPlane(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function ringRadius(level: number, count: number): number {
  let radius = Math.min(SCENE_ORG_STAGE_PLANE_LIMIT - 0.25, 0.9 + level * 0.7);
  if (count > 1) {
    const needed = 0.85 / (2 * Math.sin(Math.PI / count));
    radius = Math.max(radius, needed);
  }
  return roundPlane(Math.min(SCENE_ORG_STAGE_PLANE_LIMIT - 0.25, radius));
}

const EMPTY: DecisionSolarLayout = Object.freeze({
  viewType: "DECISION_SOLAR" as const,
  notice: DECISION_SOLAR_NOTICE,
  nodes: Object.freeze([]),
  edges: Object.freeze([]),
  missingReferences: Object.freeze([]),
  rings: Object.freeze([]),
  placements: Object.freeze([]),
  limitation: null,
});

export function emptyDecisionSolarLayout(): DecisionSolarLayout {
  return EMPTY;
}

function visible(status: string, kind: DecisionSolarNodeKind): boolean {
  if (kind === "GOAL") return status === "ACTIVE";
  if (kind === "SCENARIO") return status === "PROPOSED" || status === "APPROVED";
  if (kind === "DECISION") return status === "PROPOSED" || status === "APPROVED" || status === "REJECTED";
  if (kind === "EXECUTION_PLAN") return status === "PLANNED";
  return status === "ACTIVE";
}

export function projectDecisionSolar(input: {
  readonly workspaceId: string;
  readonly deckId: string;
}): DecisionSolarLayout {
  const workspaceId = input.workspaceId.trim();
  const deckId = input.deckId.trim();
  if (workspaceId.length === 0 || deckId.length === 0) return EMPTY;
  const nodes: DecisionSolarNode[] = [];
  for (const goal of listDecisionGoals(workspaceId, deckId)) {
    if (!visible(goal.lifecycleStatus, "GOAL")) continue;
    nodes.push(Object.freeze({
      id: goal.goalId,
      kind: "GOAL",
      name: goal.name,
      lifecycleStatus: goal.lifecycleStatus,
      provenance: goal.provenance,
      deckId: goal.deckId,
      approvalStatus: null,
    }));
  }
  for (const scenario of listDecisionScenarios(workspaceId, deckId)) {
    if (!visible(scenario.lifecycleStatus, "SCENARIO")) continue;
    nodes.push(Object.freeze({
      id: scenario.scenarioId,
      kind: "SCENARIO",
      name: scenario.name,
      lifecycleStatus: scenario.lifecycleStatus,
      provenance: scenario.provenance,
      deckId: scenario.deckId,
      approvalStatus: scenario.lifecycleStatus,
    }));
  }
  for (const decision of listManagerDecisions(workspaceId, deckId)) {
    if (!visible(decision.lifecycleStatus, "DECISION")) continue;
    nodes.push(Object.freeze({
      id: decision.decisionId,
      kind: "DECISION",
      name: decision.name,
      lifecycleStatus: decision.lifecycleStatus,
      provenance: decision.provenance,
      deckId: decision.deckId,
      approvalStatus: decision.lifecycleStatus,
    }));
  }
  for (const plan of listExecutionPlans(workspaceId, deckId)) {
    if (!visible(plan.lifecycleStatus, "EXECUTION_PLAN")) continue;
    nodes.push(Object.freeze({
      id: plan.planId,
      kind: "EXECUTION_PLAN",
      name: plan.name,
      lifecycleStatus: plan.lifecycleStatus,
      provenance: plan.provenance,
      deckId: plan.deckId,
      approvalStatus: null,
    }));
  }
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const edges: DecisionSolarEdge[] = [];
  const missing: DecisionSolarMissingReference[] = [];
  for (const relationship of listDecisionRelationships(workspaceId)) {
    if (relationship.status !== "ACTIVE") continue;
    const source = byId.get(relationship.sourceId);
    if (!source) {
      missing.push(Object.freeze({
        relationshipId: relationship.relationshipId,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
        reason: "inactive",
      }));
      continue;
    }
    if (relationship.relationshipType === "TARGETS") {
      const object = getCanonicalObject(workspaceId, relationship.targetId);
      if (!object || object.lifecycleStatus === "DELETED") {
        missing.push(Object.freeze({
          relationshipId: relationship.relationshipId,
          sourceId: relationship.sourceId,
          targetId: relationship.targetId,
          reason: "missing",
        }));
        continue;
      }
      if (object.lifecycleStatus !== "ACTIVE" || !object.deckIds.includes(deckId)) {
        missing.push(Object.freeze({
          relationshipId: relationship.relationshipId,
          sourceId: relationship.sourceId,
          targetId: relationship.targetId,
          reason: object.lifecycleStatus !== "ACTIVE" ? "inactive" : "unauthorized",
        }));
        continue;
      }
      if (!byId.has(object.canonicalObjectId)) {
        byId.set(object.canonicalObjectId, Object.freeze({
          id: object.canonicalObjectId,
          kind: "ORGANIZATIONAL_OBJECT",
          name: object.displayName,
          lifecycleStatus: object.lifecycleStatus,
          provenance: object.provenance,
          deckId,
          approvalStatus: null,
        }));
        nodes.push(byId.get(object.canonicalObjectId)!);
      }
    } else if (!byId.has(relationship.targetId)) {
      missing.push(Object.freeze({
        relationshipId: relationship.relationshipId,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
        reason: "inactive",
      }));
      continue;
    }
    edges.push(Object.freeze({
      relationshipId: relationship.relationshipId,
      relationshipType: relationship.relationshipType,
      sourceId: relationship.sourceId,
      targetId: relationship.targetId,
    }));
  }
  nodes.sort((left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
  const limitation = nodes.length > DECISION_SOLAR_RENDER_LIMIT
    ? `Decision Solar renders ${DECISION_SOLAR_RENDER_LIMIT} of ${nodes.length} nodes.`
    : null;
  const visibleNodes = nodes.slice(0, DECISION_SOLAR_RENDER_LIMIT);
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = edges.filter((edge) => visibleIds.has(edge.sourceId) && visibleIds.has(edge.targetId));
  const groups: Array<{ kind: DecisionSolarNodeKind; label: string }> = [
    { kind: "DECISION", label: "Decisions" },
    { kind: "SCENARIO", label: "Scenarios" },
    { kind: "GOAL", label: "Goals" },
    { kind: "EXECUTION_PLAN", label: "Execution plans" },
    { kind: "ORGANIZATIONAL_OBJECT", label: "Organizational objects" },
  ];
  const rings: DecisionSolarLayout["rings"][number][] = [];
  const placements: DecisionSolarPlacement[] = [];
  for (const group of groups) {
    const members = visibleNodes.filter((node) => node.kind === group.kind).map((node) => node.id);
    if (members.length === 0) continue;
    const radius = ringRadius(rings.length, members.length);
    const ringId = `decision-ring-${group.kind.toLowerCase()}`;
    rings.push(Object.freeze({ ringId, label: group.label, radius, nodeIds: Object.freeze(members) }));
    members.forEach((id, index) => {
      const angle = members.length === 1 ? -Math.PI / 2 : -Math.PI / 2 + (index * 2 * Math.PI) / members.length;
      placements.push(Object.freeze({
        id,
        ringId,
        position: Object.freeze({
          x: roundPlane(radius * Math.cos(angle)),
          y: roundPlane(radius * Math.sin(angle)),
          z: 0 as const,
        }),
      }));
    });
  }
  return Object.freeze({
    viewType: "DECISION_SOLAR" as const,
    notice: DECISION_SOLAR_NOTICE,
    nodes: Object.freeze(visibleNodes),
    edges: Object.freeze(visibleEdges),
    missingReferences: Object.freeze(missing),
    rings: Object.freeze(rings),
    placements: Object.freeze(placements),
    limitation,
  });
}

export function presentDecisionNodeForStage(input: {
  readonly workspaceId: string;
  readonly node: DecisionSolarNode;
  readonly related: readonly string[];
}): NexoraDecisionTheatreDataObject {
  const stamp = "1970-01-01T00:00:00.000Z";
  return Object.freeze({
    visualFamily: "DATA_OBJECT" as const,
    id: input.node.id,
    label: input.node.name,
    sourceType: "decision-domain" as const,
    workspaceId: input.workspaceId,
    sourceId: input.node.id,
    sourceSnapshotRef: canonicalDecisionDomainIdentity,
    dataRealityRef: "decision-domain",
    provenanceRef: input.node.provenance,
    validationState: "valid" as const,
    understandingState: "validated-mapping" as const,
    recordCount: 0,
    columnCount: 0,
    confirmedFieldCount: 0,
    unresolvedFieldCount: 0,
    updatedAt: stamp,
    authoritativeSource: canonicalDecisionDomainIdentity,
    projectionAuthority: nexoraDecisionTheatreDataObjectProjectionIdentity,
    stageCompatibility: Object.freeze({
      participantId: input.node.id,
      visualFamily: "DATA_OBJECT" as const,
      rendererRequired: true as const,
      navigationEligible: false as const,
      inspectionEligible: true as const,
    }),
    directorCompatibility: Object.freeze({
      id: input.node.id,
      label: input.node.name,
      kind: input.node.kind,
    }),
    relationships: Object.freeze([]),
    semanticSafety: Object.freeze({
      isEvidence: false as const,
      impliesCausality: false as const,
      createsBusinessTruth: false as const,
      ambiguityRequiresClarification: false as const,
    }),
    writes: Object.freeze({
      dataReality: false as const,
      sourceSnapshot: false as const,
      evidence: false as const,
      stage: false as const,
      director: false as const,
      advisor: false as const,
    }),
    decisionDomain: Object.freeze({
      kind: input.node.kind as "GOAL" | "SCENARIO" | "DECISION" | "EXECUTION_PLAN",
      lifecycleStatus: input.node.lifecycleStatus,
      provenance: input.node.provenance,
      deckId: input.node.deckId,
      related: Object.freeze([...input.related]),
      approvalStatus: input.node.approvalStatus,
    }),
  });
}
