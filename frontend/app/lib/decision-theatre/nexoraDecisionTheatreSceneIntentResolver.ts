/**
 * DTH:5 — Scene Intent resolver.
 * Consumes structured canonical inputs. Does not re-parse manager text.
 */

import {
  nexoraDecisionTheatreSceneIntentIdentity,
  nexoraDecisionTheatreSceneIntentVersion,
  type NexoraDecisionTheatreSceneIntent,
  type NexoraDecisionTheatreSceneIntentKind,
} from "./nexoraDecisionTheatreSceneIntent.ts";
import { NEXORA_DECISION_THEATRE_SCENE_INTENT_REGISTRY } from "./nexoraDecisionTheatreSceneIntentRegistry.ts";
import {
  emptyNexoraDecisionTheatreSceneSemanticInput,
  type NexoraDecisionTheatreSceneSemanticInput,
} from "./nexoraDecisionTheatreSceneSemanticInput.ts";

export const nexoraDecisionTheatreSceneIntentResolverIdentity =
  "DTH:5/SceneIntentResolver" as const;

const COLLECTION_INTENTS = Object.freeze([
  "show-problems",
  "show-goals",
  "show-scenarios",
  "show-decisions",
  "show-execution",
]);

function freezeTree<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) freezeTree(item);
    return Object.freeze(value) as T;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    freezeTree(nested);
  }
  return Object.freeze(value);
}

function stableIntentId(parts: readonly (string | null | undefined)[]): string {
  return `dth5-intent:1.0.0:${parts.map((part) => (part && part.length > 0 ? part : "none")).join(":")}`;
}

function comparisonMembers(input: NexoraDecisionTheatreSceneSemanticInput): readonly string[] {
  const fromComparison = input.comparison?.memberIds ?? [];
  if (fromComparison.length > 0) return fromComparison;
  if (input.deixis.pronoun === "them" && input.deixis.resolvedIds.length >= 2) {
    return input.deixis.resolvedIds;
  }
  return Object.freeze([]);
}

function resolvedCriterion(input: NexoraDecisionTheatreSceneSemanticInput): string | null {
  if (input.comparison?.criterionResolution && input.comparison.criterionResolution !== "UNSPECIFIED") {
    return input.comparison.criterionResolution;
  }
  if (input.comparison?.criterion && input.comparison.criterion !== "UNSPECIFIED") {
    return input.comparison.criterion;
  }
  return null;
}

function collectionRef(input: NexoraDecisionTheatreSceneSemanticInput) {
  const requested = input.requestedCollection;
  if (requested && requested.memberIds.length > 0) {
    return Object.freeze({ kind: requested.kind, memberIds: requested.memberIds });
  }
  if (input.activeCollection && input.activeCollection.memberIds.length > 0) {
    return Object.freeze({
      kind: input.activeCollection.kind,
      memberIds: input.activeCollection.memberIds,
    });
  }
  return null;
}

function namedOverridesFocus(input: NexoraDecisionTheatreSceneSemanticInput): boolean {
  return (
    input.namedSubject != null &&
    input.namedSubject.id.length > 0 &&
    input.namedSubject.id !== input.focalExecutiveObject?.id
  );
}

function comparisonRequested(input: NexoraDecisionTheatreSceneSemanticInput): boolean {
  if (input.comparison?.active === true) return true;
  if (input.canonicalOperation === "COMPARE") return true;
  if (input.questionType === "COMPARISON") return true;
  if (input.communicativeIntent === "ASK_COMPARISON") return true;
  if (input.conversationIntentKind === "compare" || input.conversationIntentKind === "compare-scenarios") {
    return true;
  }
  return input.deixis.pronoun === "them";
}

function investigationRequested(input: NexoraDecisionTheatreSceneSemanticInput): boolean {
  return (
    input.canonicalOperation === "INVESTIGATE" ||
    input.canonicalOperation === "CAUSE" ||
    input.canonicalOperation === "EVIDENCE" ||
    input.questionType === "CAUSE" ||
    input.questionType === "EVIDENCE" ||
    input.communicativeIntent === "ASK_WHY" ||
    input.communicativeIntent === "ASK_EVIDENCE" ||
    input.communicativeIntent === "REQUEST_INVESTIGATION" ||
    input.conversationIntentKind === "explore" ||
    input.conversationIntentKind === "evidence"
  );
}

function consequenceRequested(input: NexoraDecisionTheatreSceneSemanticInput): boolean {
  if (input.observationNotScenario) return false;
  return (
    input.canonicalOperation === "CONSEQUENCE" ||
    input.questionType === "CONSEQUENCE" ||
    input.communicativeIntent === "ASK_CONSEQUENCE" ||
    input.conversationIntentKind === "explore-scenario"
  );
}

function commitmentRequested(input: NexoraDecisionTheatreSceneSemanticInput): boolean {
  const kind = (input.namedSubject?.kind ?? input.focalExecutiveObject?.kind ?? "").toLowerCase();
  return (
    input.conversationIntentKind === "decision-status" ||
    kind === "decision" &&
      (input.canonicalOperation === "EXPLAIN" ||
        input.canonicalOperation === "STATUS" ||
        input.communicativeIntent === "ASK_STATUS" ||
        input.communicativeIntent === "ASK_EXPLANATION")
  );
}

function executionRequested(input: NexoraDecisionTheatreSceneSemanticInput): boolean {
  const kind = (input.namedSubject?.kind ?? input.focalExecutiveObject?.kind ?? "").toLowerCase();
  return (
    input.conversationIntentKind === "execution-status" ||
    kind === "execution" &&
      (input.canonicalOperation === "EXPLAIN" ||
        input.canonicalOperation === "STATUS" ||
        input.canonicalOperation === "ATTENTION" ||
        input.communicativeIntent === "ASK_STATUS" ||
        input.communicativeIntent === "ASK_EXPLANATION")
  );
}

function outcomeRequested(input: NexoraDecisionTheatreSceneSemanticInput): boolean {
  if (input.journeyPhase === "OUTCOME" || input.journeyState === "AWAITING_OUTCOME" || input.journeyState === "GOAL_ACHIEVED") {
    return (
      input.canonicalOperation === "STATUS" ||
      input.questionType === "STATUS" ||
      input.communicativeIntent === "ASK_STATUS" ||
      input.communicativeIntent === "ASK_EXPLANATION"
    );
  }
  return input.conversationIntentKind === "change" && input.canonicalOperation === "STATUS";
}

function focalReviewRequested(input: NexoraDecisionTheatreSceneSemanticInput): boolean {
  return (
    input.canonicalOperation === "EXPLAIN" ||
    input.canonicalOperation === "IMPACT" ||
    input.canonicalOperation === "STATUS" ||
    input.communicativeIntent === "ASK_EXPLANATION" ||
    input.communicativeIntent === "ASK_IMPACT" ||
    input.conversationIntentKind === "explain" ||
    input.conversationIntentKind === "show-related" ||
    input.conversationIntentKind === "focus"
  );
}

function resolveKind(input: NexoraDecisionTheatreSceneSemanticInput): {
  readonly kind: NexoraDecisionTheatreSceneIntentKind;
  readonly clarificationQuestion: string | null;
  readonly clarificationReason: string | null;
  readonly limitation: string | null;
} {
  const members = comparisonMembers(input);
  const criterion = resolvedCriterion(input);
  const pending = input.pendingClarification?.present === true;
  const collectionIntent =
    input.explicitCollectionRequest ||
    COLLECTION_INTENTS.includes(input.conversationIntentKind ?? "") ||
    input.primaryResponseOwner === "COLLECTION_QUERY" ||
    input.requestedCollection != null;

  if (input.unsupportedRequest || input.reservedCapability != null) {
    return {
      kind: "PRESERVE_SCENE",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: "Unsupported request preserves the current Stage.",
    };
  }

  if (input.unknownEntityNamed && input.namedSubject == null) {
    return {
      kind: "PRESERVE_SCENE",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: "Unknown entity did not become an anchor.",
    };
  }

  if (input.observationNotScenario || input.communicativeIntent === "OBSERVE") {
    if (!comparisonRequested(input) && !collectionIntent && !input.stageOrientationRequest) {
      return {
        kind: "PRESERVE_SCENE",
        clarificationQuestion: null,
        clarificationReason: null,
        limitation: "Manager observation does not create a Scenario or consequence scene.",
      };
    }
  }

  if (input.knowledgeDefinitionRequest || input.primaryResponseOwner === "PRODUCT_KNOWLEDGE") {
    return {
      kind: "PRESERVE_SCENE",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: "Knowledge definition does not recompose the Stage.",
    };
  }

  const correctionOverridesPending = input.explicitCorrection === true;
  if (pending && !correctionOverridesPending && !input.explicitNamedEntityAndAction && !collectionIntent) {
    if (input.comparison?.criterionResolution) {
      if (members.length >= 2) {
        return {
          kind: "COMPARE_CANDIDATES",
          clarificationQuestion: null,
          clarificationReason: null,
          limitation: null,
        };
      }
    }
    if (comparisonRequested(input) && (input.comparison?.criterionAmbiguous === true) && members.length >= 2) {
      return {
        kind: "CLARIFY_SCENE",
        clarificationQuestion:
          "Important in which sense—urgency, financial impact, risk, evidence strength, or Goal fit?",
        clarificationReason: "ambiguous-criterion",
        limitation: "Comparison criterion is unresolved.",
      };
    }
    return {
      kind: "CLARIFY_SCENE",
      clarificationQuestion: input.pendingClarification?.awaiting ?? "Which object did you mean?",
      clarificationReason: input.pendingClarification?.reason ?? "pending-clarification",
      limitation: "Pending clarification preserves the current Stage.",
    };
  }

  if (comparisonRequested(input)) {
    if (input.deixis.pronoun === "them" && members.length < 2) {
      return {
        kind: "CLARIFY_SCENE",
        clarificationQuestion: "Which two Scenarios do you want to compare?",
        clarificationReason: "plural-anchor-required",
        limitation: "Compare them requires a valid plural anchor.",
      };
    }
    if (members.length < 2) {
      return {
        kind: "CLARIFY_SCENE",
        clarificationQuestion: "Which two Scenarios do you want to compare?",
        clarificationReason: "insufficient-comparison-members",
        limitation: "A singleton cannot produce comparison.",
      };
    }
    if ((input.comparison?.criterionAmbiguous === true || criterion == null) && !input.comparison?.criterionResolution) {
      return {
        kind: "CLARIFY_SCENE",
        clarificationQuestion:
          "Important in which sense—urgency, financial impact, risk, evidence strength, or Goal fit?",
        clarificationReason: "ambiguous-criterion",
        limitation: "Important is not a resolved comparison criterion.",
      };
    }
    return {
      kind: "COMPARE_CANDIDATES",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  if (input.deixis.pronoun === "it" && input.deixis.resolvedIds.length !== 1 && !input.namedSubject && !input.focalExecutiveObject) {
    return {
      kind: "CLARIFY_SCENE",
      clarificationQuestion: "Do you mean the focused Problem or the active Goal?",
      clarificationReason: "unresolved-deixis",
      limitation: "Deictic it requires one valid resolved anchor.",
    };
  }

  if (collectionIntent) {
    const membersOfCollection = input.requestedCollection?.memberIds ?? input.activeCollection?.memberIds ?? [];
    if (membersOfCollection.length === 0 && input.contextSufficient === false) {
      return {
        kind: "CLARIFY_SCENE",
        clarificationQuestion: "Which collection should I show?",
        clarificationReason: "unresolved-collection",
        limitation: "Collection members were not resolved.",
      };
    }
    return {
      kind: "REVIEW_COLLECTION",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  if (input.stageOrientationRequest || input.primaryResponseOwner === "WORKSPACE_STATE") {
    return {
      kind: "ORIENT_TO_STAGE",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  if (consequenceRequested(input)) {
    return {
      kind: "REVIEW_CONSEQUENCE",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  if (investigationRequested(input)) {
    return {
      kind: "INVESTIGATE_CONDITION",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  if (outcomeRequested(input)) {
    return {
      kind: "REVIEW_OUTCOME",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  if (commitmentRequested(input)) {
    return {
      kind: "REVIEW_COMMITMENT",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  if (executionRequested(input)) {
    return {
      kind: "REVIEW_EXECUTION",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  if (input.explicitNamedEntityAndAction || namedOverridesFocus(input) || (focalReviewRequested(input) && (input.namedSubject != null || input.focalExecutiveObject != null || input.deixis.resolvedIds.length === 1))) {
    const subjectKind = (input.namedSubject?.kind ?? input.focalExecutiveObject?.kind ?? "").toLowerCase();
    if (subjectKind === "decision") {
      return { kind: "REVIEW_COMMITMENT", clarificationQuestion: null, clarificationReason: null, limitation: null };
    }
    if (subjectKind === "execution") {
      return { kind: "REVIEW_EXECUTION", clarificationQuestion: null, clarificationReason: null, limitation: null };
    }
    if (subjectKind === "outcome") {
      return { kind: "REVIEW_OUTCOME", clarificationQuestion: null, clarificationReason: null, limitation: null };
    }
    return {
      kind: "REVIEW_FOCAL_OBJECT",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  if (input.focalExecutiveObject != null && input.canonicalOperation == null && input.conversationIntentKind == null) {
    return {
      kind: "REVIEW_FOCAL_OBJECT",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  if (input.activeCollection != null && input.canonicalOperation == null && input.conversationIntentKind == null) {
    return {
      kind: "REVIEW_COLLECTION",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  if (input.journeyState === "AWAITING_DECISION" && input.canonicalOperation == null) {
    return { kind: "REVIEW_COMMITMENT", clarificationQuestion: null, clarificationReason: null, limitation: null };
  }
  if (input.journeyState === "EXECUTING" && input.canonicalOperation == null) {
    return { kind: "REVIEW_EXECUTION", clarificationQuestion: null, clarificationReason: null, limitation: null };
  }
  if ((input.journeyState === "AWAITING_OUTCOME" || input.journeyState === "GOAL_ACHIEVED") && input.canonicalOperation == null) {
    return { kind: "REVIEW_OUTCOME", clarificationQuestion: null, clarificationReason: null, limitation: null };
  }
  if (input.journeyState === "INVESTIGATING" && input.canonicalOperation == null) {
    return { kind: "INVESTIGATE_CONDITION", clarificationQuestion: null, clarificationReason: null, limitation: null };
  }

  if (input.stageOrientationRequest === false && input.focalExecutiveObject == null && input.activeCollection == null) {
    return {
      kind: "ORIENT_TO_STAGE",
      clarificationQuestion: null,
      clarificationReason: null,
      limitation: null,
    };
  }

  return {
    kind: "PRESERVE_SCENE",
    clarificationQuestion: null,
    clarificationReason: null,
    limitation: "Safe preservation.",
  };
}

export function resolveNexoraDecisionTheatreSceneIntent(
  input?: NexoraDecisionTheatreSceneSemanticInput | null,
): NexoraDecisionTheatreSceneIntent {
  const semantic = input ?? emptyNexoraDecisionTheatreSceneSemanticInput();
  const resolved = resolveKind(semantic);
  const definition = NEXORA_DECISION_THEATRE_SCENE_INTENT_REGISTRY[resolved.kind];
  const members = comparisonMembers(semantic);
  const collection = collectionRef(semantic);
  const focal =
    namedOverridesFocus(semantic)
      ? semantic.namedSubject?.id ?? null
      : semantic.namedSubject?.id ??
        (semantic.deixis.pronoun === "it" && semantic.deixis.resolvedIds.length === 1
          ? semantic.deixis.resolvedIds[0]
          : semantic.focalExecutiveObject?.id ?? null);
  const sufficiency =
    resolved.kind === "CLARIFY_SCENE"
      ? "INSUFFICIENT"
      : semantic.contextSufficient === false
        ? "PARTIAL"
        : "SUFFICIENT";
  const limitations = Object.freeze(
    [
      resolved.limitation,
      semantic.unknownEntityNamed ? "Unknown entity was not used as an anchor." : null,
      semantic.observationNotScenario ? "Observation is not a Scenario request." : null,
    ].filter((item): item is string => Boolean(item)),
  );
  const sceneIntentId = stableIntentId([
    resolved.kind,
    semantic.canonicalSemanticResultRef,
    semantic.managerQuestionRef,
    focal,
    collection ? `${collection.kind}:${collection.memberIds.join(",")}` : null,
    members.join(","),
    resolvedCriterion(semantic),
    resolved.clarificationReason,
    semantic.journeyState,
  ]);
  return freezeTree({
    identity: nexoraDecisionTheatreSceneIntentIdentity,
    version: nexoraDecisionTheatreSceneIntentVersion,
    sceneIntentId,
    intentKind: resolved.kind,
    managerQuestionRef: semantic.managerQuestionRef,
    canonicalSemanticResultRef: semantic.canonicalSemanticResultRef,
    activeExecutiveContextRef: semantic.activeExecutiveContextRef,
    journeyStateRef: semantic.journeyState,
    activeCollectionRef: collection,
    focalExecutiveObjectRef: resolved.kind === "PRESERVE_SCENE" && semantic.unknownEntityNamed ? semantic.focalExecutiveObject?.id ?? null : focal,
    comparisonMembers: resolved.kind === "COMPARE_CANDIDATES" || (resolved.kind === "CLARIFY_SCENE" && members.length > 0)
      ? Object.freeze(members.slice())
      : Object.freeze([] as string[]),
    comparisonCriterion: resolved.kind === "COMPARE_CANDIDATES" ? resolvedCriterion(semantic) : resolved.kind === "CLARIFY_SCENE" ? resolvedCriterion(semantic) : null,
    contextSufficiency: sufficiency,
    clarification: Object.freeze({
      required: resolved.kind === "CLARIFY_SCENE",
      reason: resolved.clarificationReason,
      question: resolved.clarificationQuestion,
      missing: resolved.clarificationReason,
    }),
    stageMutationPermission: definition.mutationPermission,
    preservationRequirement: definition.preservationRequirement,
    managerQuestionPurpose: definition.managerQuestionPurpose,
    provenance: Object.freeze([
      "DTH:5/SceneIntentResolver",
      semantic.canonicalSemanticResultRef,
      semantic.conversationIntentKind ?? "none",
    ]),
    limitations,
    safeFallback: "PRESERVE_SCENE",
    derivationMetadata: Object.freeze({
      resolver: "DTH:5/SceneIntentResolver" as const,
      parsedRawManagerText: false as const,
      duplicateNlu: false as const,
      atmosphereSelected: false as const,
      createdExecutiveObject: false as const,
      createdIconicValue: false as const,
      approvedDecision: false as const,
      startedExecution: false as const,
      wroteOutcome: false as const,
      createdLearning: false as const,
    }),
  });
}
