/** DIR:1 — semantic presentation decision and existing-Stage application. */

import type { CanonicalCollectionMember, ManagerReference, PrimaryResponseOwner } from "@/app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import {
  presentNexoraMVPExecutiveQueueCollection,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { ExecutiveQueueCategory } from "@/app/lib/spatial-presentation/executiveStageProductivityContract.ts";

export const nexoraSemanticPresentationDirectorIdentity =
  "DIR:1/SemanticPresentationDirectorStageIntentFoundation" as const;
export const nexoraSemanticPresentationDirectorVersion = "1.0.0" as const;
export const nexoraSemanticPresentationDirectorNamespace =
  "nexora.director.semantic-presentation-stage-intent" as const;

export type NexoraPresentationIntent =
  | "NO_CHANGE"
  | "FOCUS_OBJECT"
  | "SHOW_COLLECTION"
  | "SHOW_RELATIONSHIP"
  | "SHOW_CONTEXT"
  | "RESTORE_VIEW";

export type NexoraExecutiveReference = Readonly<{
  id: string;
  label: string;
  kind: string | null;
}>;

export type NexoraDirectorPlan = Readonly<{
  intent: NexoraPresentationIntent;
  primaryTarget: NexoraExecutiveReference | null;
  targets: readonly NexoraExecutiveReference[];
  collection: Readonly<{
    kind: ExecutiveQueueCategory;
    scope: string;
    members: readonly NexoraExecutiveReference[];
  }> | null;
  relationship: Readonly<{
    source: NexoraExecutiveReference;
    target: NexoraExecutiveReference;
    relationshipId: string | null;
  }> | null;
  framing: "PRESERVE" | "OBJECT" | "COLLECTION" | "RELATIONSHIP" | "CONTEXT";
  stageEffect: "NONE" | "FOCUS" | "COLLECTION" | "RELATIONSHIP" | "CONTEXT";
  currentStageMode: "OVERVIEW" | "FOCUS" | "COLLECTION" | "RELATIONSHIP";
  desiredStageMode: "OVERVIEW" | "FOCUS" | "COLLECTION" | "RELATIONSHIP";
  alreadySatisfied: boolean;
  mutationRequired: boolean;
  presentationRelevant: boolean;
  businessMutationAllowed: false;
  reason: string;
  authority: typeof nexoraSemanticPresentationDirectorIdentity;
  preservesConversationTruth: true;
}>;

export type NexoraDirectorSemanticInput = Readonly<{
  owner: PrimaryResponseOwner;
  presentationRequest: "NONE" | "FOCUS" | "COLLECTION" | "RELATIONSHIP";
  primaryReference: ManagerReference | null;
  references: readonly ManagerReference[];
  collectionKind: ExecutiveQueueCategory | null;
  collectionScope: string | null;
  collectionMembers: readonly CanonicalCollectionMember[];
  relationshipId?: string | null;
  currentStage: NexoraMVPObjectInteractionState;
}>;

function reference(value: ManagerReference | CanonicalCollectionMember): NexoraExecutiveReference {
  return Object.freeze({
    id: value.id,
    label: "name" in value ? value.name : value.label,
    kind: "kind" in value ? value.kind : null,
  });
}

function stageMode(state: NexoraMVPObjectInteractionState): NexoraDirectorPlan["currentStageMode"] {
  if (state.collectionContext) return "COLLECTION";
  if (state.focusedSubject) return "FOCUS";
  return "OVERVIEW";
}

function sameIds(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

function noChange(input: NexoraDirectorSemanticInput, reason: string): NexoraDirectorPlan {
  const current = stageMode(input.currentStage);
  return Object.freeze({
    intent: "NO_CHANGE", primaryTarget: null, targets: Object.freeze([]), collection: null,
    relationship: null, framing: "PRESERVE", stageEffect: "NONE", currentStageMode: current,
    desiredStageMode: current, alreadySatisfied: true, mutationRequired: false,
    presentationRelevant: false, businessMutationAllowed: false, reason,
    authority: nexoraSemanticPresentationDirectorIdentity, preservesConversationTruth: true,
  });
}

/** Consumes resolved semantic structures only; it never receives manager text. */
export function directNexoraPresentation(input: NexoraDirectorSemanticInput): NexoraDirectorPlan {
  const current = stageMode(input.currentStage);
  if (input.owner === "COLLECTION_QUERY" && input.collectionKind && input.presentationRequest === "COLLECTION") {
    const targets = Object.freeze(input.collectionMembers.map(reference));
    if (targets.length === 0) return noChange(input, "canonical-collection-empty");
    const currentIds = input.currentStage.collectionContext?.objectIds ?? [];
    const satisfied =
      stageMode(input.currentStage) === "COLLECTION" &&
      input.currentStage.collectionContext?.category === input.collectionKind &&
      sameIds(currentIds, targets.map((item) => item.id));
    // Restored or current-subject focus is not a presented collection.
    return Object.freeze({
      intent: "SHOW_COLLECTION", primaryTarget: null, targets,
      collection: Object.freeze({ kind: input.collectionKind, scope: input.collectionScope ?? "CONTEXTUAL", members: targets }),
      relationship: null, framing: "COLLECTION", stageEffect: "COLLECTION",
      currentStageMode: current, desiredStageMode: "COLLECTION", alreadySatisfied: satisfied,
      mutationRequired: !satisfied, presentationRelevant: true, businessMutationAllowed: false,
      reason: satisfied ? "canonical-collection-already-presented" : "explicit-canonical-collection-request",
      authority: nexoraSemanticPresentationDirectorIdentity, preservesConversationTruth: true,
    });
  }
  if (input.presentationRequest === "FOCUS" && input.primaryReference) {
    const target = reference(input.primaryReference);
    const satisfied = input.currentStage.focusedSubject?.id === target.id && !input.currentStage.collectionContext;
    return Object.freeze({
      intent: "FOCUS_OBJECT", primaryTarget: target, targets: Object.freeze([target]), collection: null,
      relationship: null, framing: "OBJECT", stageEffect: "FOCUS", currentStageMode: current,
      desiredStageMode: "FOCUS", alreadySatisfied: satisfied, mutationRequired: !satisfied,
      presentationRelevant: true, businessMutationAllowed: false,
      reason: satisfied ? "resolved-object-already-focused" : "explicit-resolved-object-request",
      authority: nexoraSemanticPresentationDirectorIdentity, preservesConversationTruth: true,
    });
  }
  if (input.owner === "RELATIONSHIP_EXPLANATION" && input.presentationRequest === "RELATIONSHIP") {
    const targets = Object.freeze(input.references.slice(0, 2).map(reference));
    if (targets.length === 2) return Object.freeze({
      intent: "SHOW_RELATIONSHIP", primaryTarget: targets[0]!, targets, collection: null,
      relationship: Object.freeze({ source: targets[0]!, target: targets[1]!, relationshipId: input.relationshipId ?? null }),
      framing: "RELATIONSHIP", stageEffect: "RELATIONSHIP", currentStageMode: current,
      desiredStageMode: "RELATIONSHIP", alreadySatisfied: false, mutationRequired: false,
      presentationRelevant: true, businessMutationAllowed: false,
      reason: "relationship-foundation-stage-mutation-deferred", authority: nexoraSemanticPresentationDirectorIdentity,
      preservesConversationTruth: true,
    });
  }
  return noChange(input, "turn-has-no-presentation-effect");
}

/** One controlled conversation-driven Stage application path. */
export function applyDirectorPlanToStage(input: {
  plan: NexoraDirectorPlan;
  state: NexoraMVPObjectInteractionState;
  catalog?: NexoraMVPObjectInteractionCatalog;
}): NexoraMVPObjectInteractionState {
  if (!input.plan.mutationRequired) return input.state;
  if (input.plan.intent === "FOCUS_OBJECT" && input.plan.primaryTarget) {
    return selectNexoraMVPInteractionSubject(input.state, input.plan.primaryTarget.id, input.catalog);
  }
  if (input.plan.intent === "SHOW_COLLECTION" && input.plan.collection) {
    return presentNexoraMVPExecutiveQueueCollection(
      input.state,
      Object.freeze({
        category: input.plan.collection.kind,
        objectIds: Object.freeze(input.plan.targets.map((item) => item.id)),
      }),
      input.catalog,
    );
  }
  return input.state;
}
