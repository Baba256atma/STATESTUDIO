/**
 * NPA-T DECISION-IMPACT-FOUNDATION:1
 *
 * Read-only trace from one Decision through validated references.
 * A recorded connection is not a predicted consequence.
 */

import {
  canonicalDecisionAuthorityStatus,
  getManagerDecision,
  listDecisionGoals,
  listDecisionRelationships,
  listDecisionScenarios,
  listExecutionPlans,
} from "./canonicalDecisionDomain.ts";
import { canonicalObjectAuthorityStatus, getCanonicalObject, listDeckCanonicalObjects } from "./canonicalObjectRegistry.ts";
import {
  CANONICAL_RELATIONSHIP_SEMANTICS,
  canonicalRelationshipAuthorityStatus,
  listCanonicalRelationships,
  type CanonicalRelationshipType,
} from "./canonicalRelationshipGraph.ts";
import { readCommittedDatasetSnapshot } from "./canonicalDatasetEntityPipeline.ts";

export const decisionImpactPreviewIdentity =
  "NPA-T DECISION-IMPACT-FOUNDATION:1/DecisionImpactPreview" as const;

export const DECISION_IMPACT_NODE_LIMIT = 100 as const;
export const DECISION_IMPACT_EDGE_LIMIT = 100 as const;
export const DECISION_IMPACT_DEFAULT_DEPTH = 1 as const;

export const IMPACT_CONSEQUENCE_STATEMENT =
  "Insufficient evidence. A recorded connection does not establish that a change to one object changes another." as const;

export const IMPACT_RELATIONSHIP_SEMANTICS: Readonly<Record<CanonicalRelationshipType, string>> = Object.freeze({
  DEPENDS_ON: "Declared dependency in the stored direction. This does not establish that changing one endpoint changes the other.",
  REPORTS_TO: "Declared reporting line in the stored direction. This does not establish an operational consequence.",
  SUPPLIES_TO: "Declared supply relationship in the stored direction. This does not establish a change in output.",
  MONITORS: "Declared monitoring relationship in the stored direction. This does not establish an effect on the monitored object.",
  CONTAINS: "Recorded containment. Membership does not establish a productivity or financial effect.",
  ASSOCIATED_WITH: "Recorded association without a stored direction. Association does not establish a consequence.",
});

export type ImpactPathStep = Readonly<{
  relationshipId: string;
  relationshipType: CanonicalRelationshipType;
  traversal: "outgoing" | "incoming" | "undirected";
  fromId: string;
  toId: string;
  depth: number;
}>;

export type ImpactObjectReference = Readonly<{
  classification: "DIRECT_TARGET" | "CONNECTED_OBJECT";
  objectId: string;
  name: string;
  objectType: string;
  depth: number;
  path: readonly ImpactPathStep[];
  explanation: string;
  consequence: "INSUFFICIENT_EVIDENCE";
}>;

export type DecisionContextReference = Readonly<{
  classification: "DECISION_CONTEXT";
  kind: "GOAL" | "SCENARIO" | "DECISION" | "EXECUTION_PLAN";
  id: string;
  name: string;
  lifecycleStatus: string;
}>;

export type ImpactEvidenceReference = Readonly<{
  classification: "EVIDENCE_SOURCE";
  objectId: string;
  datasetId: string;
  sourceKey: string;
  importId: string | null;
  fingerprint: string | null;
  attributes: Readonly<Record<string, string>>;
  conflicts: readonly Readonly<{ attribute: string; canonicalValue: string; sourceValue: string }>[];
  availability: "current" | "missing" | "deleted";
}>;

export type MissingImpactReference = Readonly<{
  classification: "MISSING_REFERENCE";
  reason: "missing" | "inactive" | "deleted" | "unauthorized";
  relationshipId: string | null;
  objectId: string | null;
  detail: string;
}>;

export type DecisionImpactPreview = Readonly<{
  identity: typeof decisionImpactPreviewIdentity;
  fingerprint: string;
  workspaceId: string;
  deckId: string;
  decisionId: string;
  decisionStatus: string;
  directTargets: readonly ImpactObjectReference[];
  connectedObjects: readonly ImpactObjectReference[];
  decisionContext: readonly DecisionContextReference[];
  evidenceSources: readonly ImpactEvidenceReference[];
  missingReferences: readonly MissingImpactReference[];
  limitations: readonly string[];
  truncated: boolean;
  evaluatedNodes: number;
  omittedNodes: number;
  maxDepth: number;
  consequence: "INSUFFICIENT_EVIDENCE";
}>;

export type DecisionImpactAnalysis =
  | Readonly<{ status: "ready"; preview: DecisionImpactPreview }>
  | Readonly<{ status: "blocked"; reason: "corrupt" | "unsupported-version" | "missing-decision" | "wrong-deck" }>;

function fingerprint(value: string): string {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) hash = ((hash << 5) + hash) ^ value.charCodeAt(index);
  return `impact:${(hash >>> 0).toString(16)}`;
}

function blockedAuthority(): "corrupt" | "unsupported-version" | null {
  const statuses = [canonicalDecisionAuthorityStatus(), canonicalObjectAuthorityStatus(), canonicalRelationshipAuthorityStatus()];
  if (statuses.includes("corrupt")) return "corrupt";
  if (statuses.includes("unsupported-version")) return "unsupported-version";
  return null;
}

function evidenceFor(workspaceId: string, objectId: string): ImpactEvidenceReference[] {
  const object = getCanonicalObject(workspaceId, objectId);
  if (!object) return [];
  return object.sourceLinks.map((link) => {
    const snapshot = readCommittedDatasetSnapshot(workspaceId, link.datasetId);
    if (!snapshot.ok) {
      return Object.freeze({
        classification: "EVIDENCE_SOURCE" as const,
        objectId,
        datasetId: link.datasetId,
        sourceKey: link.sourceKey,
        importId: null,
        fingerprint: null,
        attributes: Object.freeze({}),
        conflicts: Object.freeze([]),
        availability: snapshot.reason === "dataset-deleted" ? "deleted" as const : "missing" as const,
      });
    }
    const row = snapshot.value.rows.find((candidate) => Object.values(candidate).includes(link.sourceKey)) ?? null;
    const attributes: Record<string, string> = {};
    const conflicts: { attribute: string; canonicalValue: string; sourceValue: string }[] = [];
    if (row) {
      for (const [column, sourceValue] of Object.entries(row)) {
        const attribute = column === "capacity" ? "capacityPerHour" : column;
        const canonical = object.attributes[attribute];
        if (canonical !== undefined && String(canonical) !== sourceValue && sourceValue.length > 0) {
          conflicts.push({ attribute, canonicalValue: String(canonical), sourceValue });
        } else if (sourceValue.length > 0 && column !== "name" && column !== "id") {
          attributes[attribute] = sourceValue;
        }
      }
    }
    return Object.freeze({
      classification: "EVIDENCE_SOURCE" as const,
      objectId,
      datasetId: link.datasetId,
      sourceKey: link.sourceKey,
      importId: snapshot.value.importId,
      fingerprint: snapshot.value.contentFingerprint,
      attributes: Object.freeze(attributes),
      conflicts: Object.freeze(conflicts),
      availability: "current" as const,
    });
  });
}

export function previewDecisionImpact(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly decisionId: string;
  readonly maxDepth?: number;
}): DecisionImpactAnalysis {
  const blocked = blockedAuthority();
  if (blocked) return Object.freeze({ status: "blocked", reason: blocked });
  const workspaceId = input.workspaceId.trim();
  const deckId = input.deckId.trim();
  const decision = getManagerDecision(workspaceId, input.decisionId);
  if (!decision) return Object.freeze({ status: "blocked", reason: "missing-decision" });
  if (decision.workspaceId !== workspaceId || decision.deckId !== deckId) {
    return Object.freeze({ status: "blocked", reason: "wrong-deck" });
  }

  const maxDepth = Math.max(0, Math.min(input.maxDepth ?? DECISION_IMPACT_DEFAULT_DEPTH, 3));
  const links = listDecisionRelationships(workspaceId).filter((relationship) => relationship.status === "ACTIVE");
  const scenarioIds = links.filter((relationship) => relationship.relationshipType === "SUPPORTS" && relationship.targetId === decision.decisionId).map((relationship) => relationship.sourceId);
  const goalIds = links.filter((relationship) => relationship.relationshipType === "EVALUATED_BY" && scenarioIds.includes(relationship.targetId)).map((relationship) => relationship.sourceId);
  const planIds = links.filter((relationship) => relationship.relationshipType === "AUTHORIZES" && relationship.sourceId === decision.decisionId).map((relationship) => relationship.targetId);
  const goals = listDecisionGoals(workspaceId, deckId).filter((goal) => goalIds.includes(goal.goalId) && goal.lifecycleStatus === "ACTIVE");
  const scenarios = listDecisionScenarios(workspaceId, deckId).filter((scenario) => scenarioIds.includes(scenario.scenarioId) && (scenario.lifecycleStatus === "PROPOSED" || scenario.lifecycleStatus === "APPROVED"));
  const plans = listExecutionPlans(workspaceId, deckId).filter((plan) => planIds.includes(plan.planId) && plan.lifecycleStatus === "PLANNED");
  const context: DecisionContextReference[] = [
    Object.freeze({ classification: "DECISION_CONTEXT" as const, kind: "DECISION" as const, id: decision.decisionId, name: decision.name, lifecycleStatus: decision.lifecycleStatus }),
    ...goals.map((goal) => Object.freeze({ classification: "DECISION_CONTEXT" as const, kind: "GOAL" as const, id: goal.goalId, name: goal.name, lifecycleStatus: goal.lifecycleStatus })),
    ...scenarios.map((scenario) => Object.freeze({ classification: "DECISION_CONTEXT" as const, kind: "SCENARIO" as const, id: scenario.scenarioId, name: scenario.name, lifecycleStatus: scenario.lifecycleStatus })),
    ...plans.map((plan) => Object.freeze({ classification: "DECISION_CONTEXT" as const, kind: "EXECUTION_PLAN" as const, id: plan.planId, name: plan.name, lifecycleStatus: plan.lifecycleStatus })),
  ];

  const authorized = new Set(listDeckCanonicalObjects(workspaceId, deckId).map((object) => object.canonicalObjectId));
  const missing: MissingImpactReference[] = [];
  const limitations: string[] = [IMPACT_CONSEQUENCE_STATEMENT];
  const direct: ImpactObjectReference[] = [];
  if (plans.length === 0) limitations.push("No current execution plan is recorded. No organizational target was inferred.");
  const activePlanIds = new Set(plans.map((plan) => plan.planId));
  for (const relationship of links) {
    if (relationship.relationshipType !== "TARGETS" || !activePlanIds.has(relationship.sourceId)) continue;
    const object = getCanonicalObject(workspaceId, relationship.targetId);
    if (!object || object.workspaceId !== workspaceId) {
      missing.push(Object.freeze({ classification: "MISSING_REFERENCE", reason: "missing", relationshipId: relationship.relationshipId, objectId: relationship.targetId, detail: "The recorded target cannot be resolved." }));
      continue;
    }
    if (object.lifecycleStatus === "DELETED") {
      missing.push(Object.freeze({ classification: "MISSING_REFERENCE", reason: "deleted", relationshipId: relationship.relationshipId, objectId: object.canonicalObjectId, detail: "The recorded target is deleted." }));
      continue;
    }
    if (object.lifecycleStatus !== "ACTIVE") {
      missing.push(Object.freeze({ classification: "MISSING_REFERENCE", reason: "inactive", relationshipId: relationship.relationshipId, objectId: object.canonicalObjectId, detail: "The recorded target is not active." }));
      continue;
    }
    if (!object.deckIds.includes(deckId)) {
      missing.push(Object.freeze({ classification: "MISSING_REFERENCE", reason: "unauthorized", relationshipId: relationship.relationshipId, objectId: null, detail: "The recorded target is outside the active deck." }));
      continue;
    }
    if (direct.some((item) => item.objectId === object.canonicalObjectId)) continue;
    direct.push(Object.freeze({
      classification: "DIRECT_TARGET",
      objectId: object.canonicalObjectId,
      name: object.displayName,
      objectType: object.objectType,
      depth: 0,
      path: Object.freeze([]),
      explanation: "Explicitly targeted by the execution plan.",
      consequence: "INSUFFICIENT_EVIDENCE",
    }));
  }

  const orgEdges = listCanonicalRelationships(workspaceId)
    .filter((relationship) => relationship.status === "ACTIVE")
    .slice()
    .sort((left, right) => left.relationshipId < right.relationshipId ? -1 : 1);
  const connected: ImpactObjectReference[] = [];
  const seen = new Set(direct.map((target) => target.objectId));
  let omitted = 0;
  let truncated = false;
  let evaluatedEdges = 0;
  const queue: { id: string; depth: number; path: ImpactPathStep[] }[] = direct.map((target) => ({ id: target.objectId, depth: 0, path: [] }));
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.depth >= maxDepth) continue;
    for (const edge of orgEdges) {
      const outgoing = edge.sourceObjectId === current.id;
      const incoming = edge.targetObjectId === current.id;
      if (!outgoing && !incoming) continue;
      const semantics = CANONICAL_RELATIONSHIP_SEMANTICS[edge.relationshipType];
      const traversal = semantics.direction === "UNDIRECTED" ? "undirected" as const : outgoing ? "outgoing" as const : "incoming" as const;
      const otherId = outgoing ? edge.targetObjectId : edge.sourceObjectId;
      if (seen.has(otherId)) continue;
      evaluatedEdges += 1;
      if (evaluatedEdges > DECISION_IMPACT_EDGE_LIMIT || seen.size >= DECISION_IMPACT_NODE_LIMIT) {
        truncated = true;
        omitted += 1;
        continue;
      }
      const object = getCanonicalObject(workspaceId, otherId);
      if (!object || object.workspaceId !== workspaceId) {
        missing.push(Object.freeze({ classification: "MISSING_REFERENCE", reason: "missing", relationshipId: edge.relationshipId, objectId: otherId, detail: "The connected record is not available." }));
        seen.add(otherId);
        continue;
      }
      if (object.lifecycleStatus === "DELETED") {
        missing.push(Object.freeze({ classification: "MISSING_REFERENCE", reason: "deleted", relationshipId: edge.relationshipId, objectId: object.canonicalObjectId, detail: "The connected record is deleted." }));
        seen.add(otherId);
        continue;
      }
      if (object.lifecycleStatus !== "ACTIVE") {
        missing.push(Object.freeze({ classification: "MISSING_REFERENCE", reason: "inactive", relationshipId: edge.relationshipId, objectId: object.canonicalObjectId, detail: "The connected record is not active." }));
        seen.add(otherId);
        continue;
      }
      if (!authorized.has(otherId)) {
        missing.push(Object.freeze({
          classification: "MISSING_REFERENCE",
          reason: "unauthorized",
          relationshipId: edge.relationshipId,
          objectId: null,
          detail: "An organizational relationship leaves the active deck. The other endpoint is not shown.",
        }));
        seen.add(`redacted:${edge.relationshipId}`);
        continue;
      }
      const step: ImpactPathStep = Object.freeze({
        relationshipId: edge.relationshipId,
        relationshipType: edge.relationshipType,
        traversal,
        fromId: current.id,
        toId: otherId,
        depth: current.depth + 1,
      });
      const path = Object.freeze([...current.path, step]);
      connected.push(Object.freeze({
        classification: "CONNECTED_OBJECT",
        objectId: object.canonicalObjectId,
        name: object.displayName,
        objectType: object.objectType,
        depth: current.depth + 1,
        path,
        explanation: `${IMPACT_RELATIONSHIP_SEMANTICS[edge.relationshipType]} Traversal is ${traversal}.`,
        consequence: "INSUFFICIENT_EVIDENCE",
      }));
      seen.add(otherId);
      queue.push({ id: otherId, depth: current.depth + 1, path: [...path] });
    }
  }

  const included = new Set([...direct, ...connected].map((item) => item.objectId));
  for (const edge of listCanonicalRelationships(workspaceId).filter((relationship) => relationship.status === "ARCHIVED")) {
    const anchor = included.has(edge.sourceObjectId) ? edge.targetObjectId : included.has(edge.targetObjectId) ? edge.sourceObjectId : null;
    if (!anchor || missing.some((item) => item.relationshipId === edge.relationshipId)) continue;
    const object = getCanonicalObject(workspaceId, anchor);
    const reason = object?.lifecycleStatus === "DELETED" ? "deleted" as const : object?.lifecycleStatus === "ACTIVE" ? "inactive" as const : object ? "inactive" as const : "missing" as const;
    missing.push(Object.freeze({
      classification: "MISSING_REFERENCE",
      reason,
      relationshipId: edge.relationshipId,
      objectId: object && object.lifecycleStatus !== "ACTIVE" ? object.canonicalObjectId : null,
      detail: "The recorded relationship is not active.",
    }));
  }

  const evidence = [...direct, ...connected].flatMap((item) => evidenceFor(workspaceId, item.objectId));
  if (evidence.some((item) => item.availability !== "current")) limitations.push("Some Dataset evidence is missing or deleted and is not treated as current.");
  if (evidence.some((item) => item.conflicts.length > 0)) limitations.push("Dataset values disagree with the stored canonical attribute. Neither value was overwritten.");
  if (evidence.length === 0) limitations.push("No current Dataset evidence is associated with the identified objects.");
  if (truncated) limitations.push("The relationship trace reached its limit. This result is incomplete.");

  const orderedDirect = direct.slice().sort((left, right) => left.objectId < right.objectId ? -1 : 1);
  const orderedConnected = connected.slice().sort((left, right) => left.objectId < right.objectId ? -1 : 1);
  const preview: DecisionImpactPreview = Object.freeze({
    identity: decisionImpactPreviewIdentity,
    fingerprint: fingerprint(JSON.stringify({
      decision: `${decision.decisionId}:${decision.lifecycleStatus}:${decision.updatedAt}`,
      context: context.map((item) => `${item.id}:${item.lifecycleStatus}`),
      direct: orderedDirect.map((item) => item.objectId),
      connected: orderedConnected.map((item) => `${item.objectId}:${item.path.map((step) => `${step.relationshipId}:${step.traversal}`).join(".")}`),
      evidence: evidence.map((item) => `${item.datasetId}:${item.fingerprint ?? item.availability}:${item.conflicts.map((conflict) => conflict.sourceValue).join(",")}`),
      missing: missing.map((item) => `${item.reason}:${item.relationshipId}`),
      depth: maxDepth,
      truncated,
    })),
    workspaceId,
    deckId,
    decisionId: decision.decisionId,
    decisionStatus: decision.lifecycleStatus,
    directTargets: Object.freeze(orderedDirect),
    connectedObjects: Object.freeze(orderedConnected),
    decisionContext: Object.freeze(context),
    evidenceSources: Object.freeze(evidence),
    missingReferences: Object.freeze(missing),
    limitations: Object.freeze(limitations),
    truncated,
    evaluatedNodes: orderedDirect.length + orderedConnected.length,
    omittedNodes: omitted,
    maxDepth,
    consequence: "INSUFFICIENT_EVIDENCE",
  });
  return Object.freeze({ status: "ready", preview });
}
