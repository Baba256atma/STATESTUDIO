/**
 * Executive Stage action routing.
 *
 * Availability is resolved against the active Workspace and Deck.
 * Presentation fixture ids are never canonical Problem, Scenario, or Decision ids.
 * Dispatch plans navigation only. It does not approve, reject, or confirm a handoff.
 */

import { NEXORA_EXECUTIVE_DECK_ID } from "../deck/nexoraDeckIdentityContract.ts";
import {
  listCausalHypotheses,
  listCausalInvestigations,
  listCausalObservations,
  type CausalInvestigation,
} from "../scene-org/canonicalCausalInvestigationDomain.ts";
import {
  getManagerDecision,
  listDecisionRelationships,
  listDecisionScenarios,
  listManagerDecisions,
  type DecisionScenario,
  type ManagerDecision,
} from "../scene-org/canonicalDecisionDomain.ts";
import { getCanonicalObject } from "../scene-org/canonicalObjectRegistry.ts";
import {
  CAUSAL_INVESTIGATION_DEMO_NOTICE,
  CAUSAL_INVESTIGATION_EXECUTIVE_NOTICE,
} from "../scene-org/causalInvestigationStageContract.ts";
import { isProtectedDemoWorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type {
  ExecutiveDomainActionAttachment,
  ExecutiveDomainActionIdentity,
  NexoraMVPPresentationAvailableAction,
} from "./nexoraMVPPresentationState.ts";

export type ExecutiveActionUnavailableReason =
  | "target-missing"
  | "source-stale"
  | "other-workspace"
  | "deck-unavailable"
  | "demo-unavailable";

export type ExecutiveActionResolutionContext = {
  readonly workspaceId: string;
  readonly deckId: string | null;
  readonly demoProfileId: string | null;
  readonly sourceObjectId: string | null;
  readonly sourceInActiveCatalog: boolean;
  readonly sourceWorkspaceId: string | null;
  /** Changes when canonical investigation or decision records change. Not a target id. */
  readonly recordGeneration?: number;
};

export type ExecutiveActionResolution =
  | {
      readonly status: "available";
      readonly identity: ExecutiveDomainActionIdentity;
      readonly workspaceId: string;
      readonly deckId: string;
      readonly demoProfileId: string | null;
      readonly sourceObjectId: string;
      readonly canonicalObjectId: string;
      readonly targetId: string;
      readonly targetLabel: string;
      readonly navigation: NonNullable<ExecutiveDomainActionAttachment["navigation"]>;
    }
  | {
      readonly status: "unavailable";
      readonly identity: ExecutiveDomainActionIdentity;
      readonly reason: ExecutiveActionUnavailableReason;
      readonly message: string;
    };

export type ExecutiveActionDispatchPlan =
  | { readonly kind: "not-domain" }
  | { readonly kind: "rejected"; readonly message: string }
  | {
      readonly kind: "open-investigation";
      readonly workspaceId: string;
      readonly deckId: string;
      readonly investigationId: string;
      readonly canonicalObjectId: string;
      readonly sourceObjectId: string;
    }
  | {
      readonly kind: "open-decision";
      readonly workspaceId: string;
      readonly deckId: string;
      readonly decisionId: string;
      readonly sourceObjectId: string;
    }
  | {
      readonly kind: "open-scenario";
      readonly workspaceId: string;
      readonly deckId: string;
      readonly scenarioId: string;
      readonly sourceObjectId: string;
    };

const STALE_MESSAGE = "The selected object is no longer available in this Deck.";
const OTHER_WORKSPACE_MESSAGE = "This target belongs to another Workspace.";

const MISSING_MESSAGE: Readonly<Record<ExecutiveDomainActionIdentity, string>> = Object.freeze({
  "investigate-problem": "No Problem is linked to this object.",
  "review-decision": "No Decision is available for review.",
  "open-scenario": "No Scenario is associated with this object.",
});

const DEMO_MESSAGE: Readonly<Record<ExecutiveDomainActionIdentity, string>> = Object.freeze({
  "investigate-problem": CAUSAL_INVESTIGATION_DEMO_NOTICE,
  "review-decision": "No Decision is available for review in this Demo.",
  "open-scenario": "No Scenario is associated with this object in this Demo.",
});

const ACTION_LABEL: Readonly<Record<ExecutiveDomainActionIdentity, string>> = Object.freeze({
  "investigate-problem": "Investigate Problem",
  "review-decision": "Review Decision",
  "open-scenario": "Open Scenario",
});

export function classifyExecutiveDomainAction(
  action: Pick<NexoraMVPPresentationAvailableAction, "kind" | "label">,
): ExecutiveDomainActionIdentity | null {
  if (action.kind !== "select-subject") return null;
  if (action.label === "Investigate Problem") return "investigate-problem";
  if (action.label === "Review Decision") return "review-decision";
  if (action.label === "Open Scenario") return "open-scenario";
  return null;
}

function unavailable(
  identity: ExecutiveDomainActionIdentity,
  reason: ExecutiveActionUnavailableReason,
  message: string,
): ExecutiveActionResolution {
  return Object.freeze({ status: "unavailable", identity, reason, message });
}

function canonicalObjectIdFor(
  workspaceId: string,
  deckId: string,
  sourceObjectId: string,
): string | null {
  const prefix = `org:${encodeURIComponent(workspaceId)}:`;
  if (!sourceObjectId.startsWith(prefix)) return null;
  const object = getCanonicalObject(workspaceId, sourceObjectId);
  if (!object || object.workspaceId !== workspaceId || object.lifecycleStatus !== "ACTIVE") return null;
  if (!object.deckIds.includes(deckId)) return null;
  return object.canonicalObjectId;
}

function activeInvestigationsForObject(
  workspaceId: string,
  deckId: string,
  canonicalObjectId: string,
): readonly CausalInvestigation[] {
  return listCausalInvestigations(workspaceId, deckId).filter((investigation) => {
    if (investigation.workspaceId !== workspaceId || investigation.deckId !== deckId) return false;
    if (investigation.lifecycleStatus === "ARCHIVED" || investigation.lifecycleStatus === "DELETED") return false;
    const observations = listCausalObservations(workspaceId, investigation.investigationId);
    if (observations.some((observation) =>
      observation.lifecycleStatus === "ACTIVE" &&
      observation.canonicalObjectId === canonicalObjectId &&
      observation.workspaceId === workspaceId &&
      observation.deckId === deckId)) {
      return true;
    }
    return listCausalHypotheses(workspaceId, investigation.investigationId).some((hypothesis) =>
      hypothesis.status !== "ARCHIVED" &&
      hypothesis.workspaceId === workspaceId &&
      hypothesis.deckId === deckId &&
      hypothesis.canonicalObjectIds.includes(canonicalObjectId));
  });
}

function activeRelationships(workspaceId: string) {
  return listDecisionRelationships(workspaceId).filter((relationship) =>
    relationship.status === "ACTIVE" && relationship.workspaceId === workspaceId);
}

function decisionIdsForObject(
  workspaceId: string,
  deckId: string,
  canonicalObjectId: string,
  investigations: readonly CausalInvestigation[],
): ReadonlySet<string> {
  const relationships = activeRelationships(workspaceId);
  const planIds = new Set(
    relationships
      .filter((relationship) => relationship.relationshipType === "TARGETS" && relationship.targetId === canonicalObjectId)
      .map((relationship) => relationship.sourceId),
  );
  const ids = new Set(
    relationships
      .filter((relationship) => relationship.relationshipType === "AUTHORIZES" && planIds.has(relationship.targetId))
      .map((relationship) => relationship.sourceId),
  );
  const investigationIds = new Set(investigations.map((investigation) => investigation.investigationId));
  const scenarioIds = new Set(
    listDecisionScenarios(workspaceId, deckId)
      .filter((scenario) =>
        scenario.causalOrigin != null &&
        scenario.causalOrigin.workspaceId === workspaceId &&
        scenario.causalOrigin.deckId === deckId &&
        investigationIds.has(scenario.causalOrigin.investigationId))
      .map((scenario) => scenario.scenarioId),
  );
  for (const relationship of relationships) {
    if (relationship.relationshipType === "SUPPORTS" && scenarioIds.has(relationship.sourceId)) {
      ids.add(relationship.targetId);
    }
  }
  return ids;
}

function reviewableDecisions(
  workspaceId: string,
  deckId: string,
  ids: ReadonlySet<string>,
): readonly ManagerDecision[] {
  return listManagerDecisions(workspaceId, deckId).filter((decision) =>
    ids.has(decision.decisionId) &&
    decision.workspaceId === workspaceId &&
    decision.deckId === deckId &&
    decision.lifecycleStatus !== "DELETED" &&
    decision.lifecycleStatus !== "ARCHIVED");
}

function relatedScenarios(
  workspaceId: string,
  deckId: string,
  investigations: readonly CausalInvestigation[],
  decisions: readonly ManagerDecision[],
): readonly DecisionScenario[] {
  const investigationIds = new Set(investigations.map((investigation) => investigation.investigationId));
  const decisionIds = new Set(decisions.map((decision) => decision.decisionId));
  const supporting = new Set(
    activeRelationships(workspaceId)
      .filter((relationship) => relationship.relationshipType === "SUPPORTS" && decisionIds.has(relationship.targetId))
      .map((relationship) => relationship.sourceId),
  );
  return listDecisionScenarios(workspaceId, deckId).filter((scenario) => {
    if (scenario.workspaceId !== workspaceId || scenario.deckId !== deckId) return false;
    if (scenario.lifecycleStatus === "DELETED" || scenario.lifecycleStatus === "ARCHIVED") return false;
    if (supporting.has(scenario.scenarioId)) return true;
    return scenario.causalOrigin != null &&
      scenario.causalOrigin.workspaceId === workspaceId &&
      scenario.causalOrigin.deckId === deckId &&
      investigationIds.has(scenario.causalOrigin.investigationId);
  });
}

function pickByRank<T extends { readonly updatedAt: string }>(
  records: readonly T[],
  idOf: (record: T) => string,
  rank: (record: T) => number,
): T | null {
  const sorted = [...records].sort((left, right) =>
    rank(left) - rank(right) ||
    right.updatedAt.localeCompare(left.updatedAt) ||
    idOf(left).localeCompare(idOf(right)));
  return sorted[0] ?? null;
}

export function resolveExecutiveDomainAction(
  identity: ExecutiveDomainActionIdentity,
  context: ExecutiveActionResolutionContext,
): ExecutiveActionResolution {
  const workspaceId = context.workspaceId.trim();
  const sourceObjectId = context.sourceObjectId?.trim() ?? "";
  if (sourceObjectId.length === 0 || !context.sourceInActiveCatalog) {
    return unavailable(identity, "source-stale", STALE_MESSAGE);
  }
  if (context.sourceWorkspaceId != null && context.sourceWorkspaceId !== workspaceId) {
    return unavailable(identity, "other-workspace", OTHER_WORKSPACE_MESSAGE);
  }
  const foreignCanonical = sourceObjectId.startsWith("org:") &&
    !sourceObjectId.startsWith(`org:${encodeURIComponent(workspaceId)}:`);
  if (foreignCanonical) return unavailable(identity, "other-workspace", OTHER_WORKSPACE_MESSAGE);
  if (isProtectedDemoWorkspaceId(workspaceId)) {
    return unavailable(identity, "demo-unavailable", DEMO_MESSAGE[identity]);
  }
  const deckId = context.deckId?.trim() ?? "";
  if (deckId.length === 0) return unavailable(identity, "deck-unavailable", STALE_MESSAGE);
  const ownedPrefix = `org:${encodeURIComponent(workspaceId)}:`;
  if (sourceObjectId.startsWith(ownedPrefix)) {
    const owned = getCanonicalObject(workspaceId, sourceObjectId);
    if (owned && owned.lifecycleStatus !== "DELETED" && !owned.deckIds.includes(deckId)) {
      return unavailable(identity, "deck-unavailable", STALE_MESSAGE);
    }
  }
  if (identity === "investigate-problem" && deckId === NEXORA_EXECUTIVE_DECK_ID) {
    return unavailable(identity, "deck-unavailable", CAUSAL_INVESTIGATION_EXECUTIVE_NOTICE);
  }
  const canonicalObjectId = canonicalObjectIdFor(workspaceId, deckId, sourceObjectId);
  if (canonicalObjectId == null) return unavailable(identity, "target-missing", MISSING_MESSAGE[identity]);

  const investigations = activeInvestigationsForObject(workspaceId, deckId, canonicalObjectId);
  if (identity === "investigate-problem") {
    const investigation = pickByRank(investigations, (record) => record.investigationId, (record) =>
      record.lifecycleStatus === "UNDER_REVIEW" ? 0 : record.lifecycleStatus === "DRAFT" ? 1 : 2);
    if (investigation == null) return unavailable(identity, "target-missing", MISSING_MESSAGE[identity]);
    return Object.freeze({
      status: "available",
      identity,
      workspaceId,
      deckId,
      demoProfileId: context.demoProfileId,
      sourceObjectId,
      canonicalObjectId,
      targetId: investigation.investigationId,
      targetLabel: investigation.title,
      navigation: "nexocause",
    });
  }

  const decisionIds = decisionIdsForObject(workspaceId, deckId, canonicalObjectId, investigations);
  const decisions = reviewableDecisions(workspaceId, deckId, decisionIds);
  if (identity === "review-decision") {
    const decision = pickByRank(decisions, (record) => record.decisionId, (record) => {
      if (record.lifecycleStatus === "PROPOSED" || record.lifecycleStatus === "DRAFT") return 0;
      if (record.lifecycleStatus === "REJECTED") return 1;
      return 2;
    });
    if (decision == null) return unavailable(identity, "target-missing", MISSING_MESSAGE[identity]);
    return Object.freeze({
      status: "available",
      identity,
      workspaceId,
      deckId,
      demoProfileId: context.demoProfileId,
      sourceObjectId,
      canonicalObjectId,
      targetId: decision.decisionId,
      targetLabel: decision.name,
      navigation: "decision-review",
    });
  }

  const scenarios = relatedScenarios(workspaceId, deckId, investigations, decisions);
  const scenario = pickByRank(scenarios, (record) => record.scenarioId, (record) =>
    record.lifecycleStatus === "PROPOSED" ? 0 : 1);
  if (scenario == null) return unavailable(identity, "target-missing", MISSING_MESSAGE[identity]);
  return Object.freeze({
    status: "available",
    identity,
    workspaceId,
    deckId,
    demoProfileId: context.demoProfileId,
    sourceObjectId,
    canonicalObjectId,
    targetId: scenario.scenarioId,
    targetLabel: scenario.name,
    navigation: "scenario",
  });
}

function attachmentFor(resolution: ExecutiveActionResolution): ExecutiveDomainActionAttachment {
  if (resolution.status === "available") {
    return Object.freeze({
      identity: resolution.identity,
      status: "available",
      targetId: resolution.targetId,
      navigation: resolution.navigation,
    });
  }
  return Object.freeze({ identity: resolution.identity, status: "unavailable" });
}

function presentResolvedAction(
  action: NexoraMVPPresentationAvailableAction,
  resolution: ExecutiveActionResolution,
): NexoraMVPPresentationAvailableAction {
  return Object.freeze({
    id: action.id,
    label: action.label,
    kind: action.kind,
    available: resolution.status === "available",
    ...(resolution.status === "available" ? {} : { disabledReason: resolution.message }),
    ...(action.panelKind != null ? { panelKind: action.panelKind } : {}),
    domainAction: attachmentFor(resolution),
  });
}

const DOMAIN_IDENTITIES: readonly ExecutiveDomainActionIdentity[] = Object.freeze([
  "investigate-problem",
  "review-decision",
  "open-scenario",
]);

/**
 * Rewrite advertised domain actions for the active authority boundary.
 * Canonical objects without a presentation fixture still receive the three
 * domain actions, each available only when a real target resolves.
 */
export function routeExecutivePresentationActions(
  actions: readonly NexoraMVPPresentationAvailableAction[],
  context: ExecutiveActionResolutionContext,
): readonly NexoraMVPPresentationAvailableAction[] {
  const routed = actions.map((action) => {
    const identity = classifyExecutiveDomainAction(action);
    if (identity == null) return action;
    return presentResolvedAction(action, resolveExecutiveDomainAction(identity, context));
  });
  const present = new Set(
    routed.flatMap((action) => action.domainAction ? [action.domainAction.identity] : []),
  );
  const sourceObjectId = context.sourceObjectId ?? "";
  const canonicalSource = sourceObjectId.startsWith("org:");
  if (!canonicalSource) return Object.freeze(routed);
  const added = DOMAIN_IDENTITIES.filter((identity) => !present.has(identity)).map((identity) => {
    const resolution = resolveExecutiveDomainAction(identity, context);
    return presentResolvedAction(Object.freeze({
      id: `executive-action:${identity}`,
      label: ACTION_LABEL[identity],
      kind: "select-subject" as const,
      available: false,
    }), resolution);
  });
  return Object.freeze([...routed, ...added]);
}

/**
 * Revalidate at execution time. A rendered target that no longer resolves is rejected.
 * This function does not write Decision, Scenario, or hypothesis state.
 */
export function planExecutivePresentationAction(
  action: NexoraMVPPresentationAvailableAction,
  context: ExecutiveActionResolutionContext,
): ExecutiveActionDispatchPlan {
  const identity = action.domainAction?.identity ?? classifyExecutiveDomainAction(action);
  if (identity == null) return Object.freeze({ kind: "not-domain" });
  const resolution = resolveExecutiveDomainAction(identity, context);
  if (resolution.status !== "available") {
    return Object.freeze({ kind: "rejected", message: resolution.message });
  }
  if (action.domainAction?.targetId != null && action.domainAction.targetId !== resolution.targetId) {
    return Object.freeze({ kind: "rejected", message: STALE_MESSAGE });
  }
  if (resolution.navigation === "nexocause") {
    return Object.freeze({
      kind: "open-investigation",
      workspaceId: resolution.workspaceId,
      deckId: resolution.deckId,
      investigationId: resolution.targetId,
      canonicalObjectId: resolution.canonicalObjectId,
      sourceObjectId: resolution.sourceObjectId,
    });
  }
  if (resolution.navigation === "decision-review") {
    const decision = getManagerDecision(resolution.workspaceId, resolution.targetId);
    if (decision == null || decision.workspaceId !== resolution.workspaceId || decision.deckId !== resolution.deckId) {
      return Object.freeze({ kind: "rejected", message: MISSING_MESSAGE["review-decision"] });
    }
    return Object.freeze({
      kind: "open-decision",
      workspaceId: resolution.workspaceId,
      deckId: resolution.deckId,
      decisionId: decision.decisionId,
      sourceObjectId: resolution.sourceObjectId,
    });
  }
  return Object.freeze({
    kind: "open-scenario",
    workspaceId: resolution.workspaceId,
    deckId: resolution.deckId,
    scenarioId: resolution.targetId,
    sourceObjectId: resolution.sourceObjectId,
  });
}
