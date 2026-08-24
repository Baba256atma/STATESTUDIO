/**
 * MO:1 — Active Object contract.
 * Click and conversation converge on activeObjectId without a second Stage writer.
 */

import type { ManagerObjectIntent } from "./managerObjectInteractionFoundation.ts";
import type { NexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  MANAGER_OBJECT_ACTIVATION_SOURCES,
  type ManagerObjectActivationSource,
} from "./managerObjectInteractionFoundation.ts";
import type { ExecutiveGoalContext } from "./managerObjectGoalTypes.ts";
import type {
  ExecutiveJourneySnapshot,
  JourneyBlockerKind,
} from "./managerObjectJourneyTypes.ts";
import type { AttentionLevel } from "./managerObjectAttentionTypes.ts";

export type ManagerObjectSession = {
  readonly activeObjectId: string | null;
  readonly previousActiveObjectId: string | null;
  readonly activationSource: ManagerObjectActivationSource;
  readonly lastIntent?: ManagerObjectIntent | null;
  readonly investigationQuestion?: string | null;
  readonly investigationSubjectId?: string | null;
  readonly investigationCandidateIds?: readonly string[];
  readonly managerObservations?: readonly {
    readonly text: string;
    readonly provenance: "manager-reported";
    readonly matchedLabel: string | null;
  }[];
  readonly explorationPrompted?: boolean;
  readonly explorationAnchor?: import("./managerObjectExplorationTypes.ts").ManagerObjectExplorationAnchor | null;
  readonly goalContext?: ExecutiveGoalContext | null;
  readonly secondaryGoals?: readonly ExecutiveGoalContext[];
  readonly visitedSubjectIds?: readonly string[];
  readonly journeySnapshots?: readonly ExecutiveJourneySnapshot[];
  readonly lastJourneyBlockerKind?: JourneyBlockerKind | null;
  readonly journeyPrompted?: boolean;
  readonly lastAttentionPrimaryId?: string | null;
  readonly lastAttentionLevel?: AttentionLevel | null;
  readonly attentionPrompted?: boolean;
  readonly conversationContinuity?: import("./contextualManagerMeaning.ts").ConversationContinuitySnapshot | null;
  readonly pendingClarification?: import("./nexoraMvpFinal63ClarificationTypes.ts").PendingClarification | null;
  readonly lastGuidanceText?: string | null;
  readonly ncaConversationState?: import("./nexoraNca2ConversationStateTypes.ts").NexoraConversationState | null;
};

export function createEmptyManagerObjectSession(): ManagerObjectSession {
  return Object.freeze({
    activeObjectId: null,
    previousActiveObjectId: null,
    activationSource: "none",
    lastIntent: null,
    investigationQuestion: null,
    investigationSubjectId: null,
    investigationCandidateIds: Object.freeze([]),
    managerObservations: Object.freeze([]),
    explorationPrompted: false,
    explorationAnchor: null,
    goalContext: null,
    secondaryGoals: Object.freeze([]),
    visitedSubjectIds: Object.freeze([]),
    journeySnapshots: Object.freeze([]),
    lastJourneyBlockerKind: null,
    journeyPrompted: false,
    lastAttentionPrimaryId: null,
    lastAttentionLevel: null,
    attentionPrompted: false,
    conversationContinuity: null,
    pendingClarification: null,
    lastGuidanceText: null,
    ncaConversationState: null,
  });
}

export function freezeManagerObjectSession(
  session: ManagerObjectSession,
): ManagerObjectSession {
  return Object.freeze({
    activeObjectId: session.activeObjectId,
    previousActiveObjectId: session.previousActiveObjectId,
    activationSource: session.activationSource,
    lastIntent: session.lastIntent ?? null,
    investigationQuestion: session.investigationQuestion ?? null,
    investigationSubjectId: session.investigationSubjectId ?? null,
    investigationCandidateIds: Object.freeze(
      session.investigationCandidateIds ?? [],
    ),
    managerObservations: Object.freeze(session.managerObservations ?? []),
    explorationPrompted: session.explorationPrompted === true,
    explorationAnchor: session.explorationAnchor ?? null,
    goalContext: session.goalContext ?? null,
    secondaryGoals: Object.freeze(session.secondaryGoals ?? []),
    visitedSubjectIds: Object.freeze(session.visitedSubjectIds ?? []),
    journeySnapshots: Object.freeze(session.journeySnapshots ?? []),
    lastJourneyBlockerKind: session.lastJourneyBlockerKind ?? null,
    journeyPrompted: session.journeyPrompted === true,
    lastAttentionPrimaryId: session.lastAttentionPrimaryId ?? null,
    lastAttentionLevel: session.lastAttentionLevel ?? null,
    attentionPrompted: session.attentionPrompted === true,
    conversationContinuity: session.conversationContinuity ?? null,
    pendingClarification: session.pendingClarification ?? null,
    lastGuidanceText: session.lastGuidanceText ?? null,
    ncaConversationState: session.ncaConversationState ?? null,
  });
}

function replaceActive(
  previous: ManagerObjectSession,
  nextId: string | null,
  source: ManagerObjectActivationSource,
): ManagerObjectSession {
  if (nextId == null) {
    return freezeManagerObjectSession({
      activeObjectId: null,
      previousActiveObjectId: previous.activeObjectId,
      activationSource: "none",
      lastIntent: previous.lastIntent ?? null,
      investigationQuestion: previous.investigationQuestion ?? null,
      investigationSubjectId: previous.investigationSubjectId ?? null,
      investigationCandidateIds: previous.investigationCandidateIds ?? Object.freeze([]),
      managerObservations: previous.managerObservations ?? Object.freeze([]),
      explorationPrompted: false,
      explorationAnchor: null,
      goalContext: previous.goalContext ?? null,
      secondaryGoals: previous.secondaryGoals ?? Object.freeze([]),
      visitedSubjectIds: previous.visitedSubjectIds ?? Object.freeze([]),
      journeySnapshots: previous.journeySnapshots ?? Object.freeze([]),
      lastJourneyBlockerKind: previous.lastJourneyBlockerKind ?? null,
      journeyPrompted: false,
      lastAttentionPrimaryId: previous.lastAttentionPrimaryId ?? null,
      lastAttentionLevel: previous.lastAttentionLevel ?? null,
      attentionPrompted: false,
      conversationContinuity: previous.conversationContinuity ?? null,
      lastGuidanceText: previous.lastGuidanceText ?? null,
      ncaConversationState: previous.ncaConversationState ?? null,
    });
  }
  return freezeManagerObjectSession({
    activeObjectId: nextId,
    previousActiveObjectId:
      previous.activeObjectId === nextId
        ? previous.previousActiveObjectId
        : previous.activeObjectId,
    activationSource: source,
    lastIntent: previous.lastIntent ?? null,
    investigationQuestion: previous.investigationQuestion ?? null,
    investigationSubjectId: previous.investigationSubjectId ?? null,
    investigationCandidateIds: previous.investigationCandidateIds ?? Object.freeze([]),
    managerObservations: previous.managerObservations ?? Object.freeze([]),
    explorationPrompted:
      previous.activeObjectId === nextId
        ? previous.explorationPrompted === true
        : false,
    explorationAnchor:
      previous.activeObjectId === nextId
        ? previous.explorationAnchor ?? null
        : null,
    goalContext: previous.goalContext ?? null,
    secondaryGoals: previous.secondaryGoals ?? Object.freeze([]),
    visitedSubjectIds: appendVisit(previous.visitedSubjectIds, nextId),
    journeySnapshots: previous.journeySnapshots ?? Object.freeze([]),
    lastJourneyBlockerKind: previous.lastJourneyBlockerKind ?? null,
    journeyPrompted: false,
    lastAttentionPrimaryId: previous.lastAttentionPrimaryId ?? null,
    lastAttentionLevel: previous.lastAttentionLevel ?? null,
    attentionPrompted: false,
    conversationContinuity: previous.conversationContinuity ?? null,
    lastGuidanceText: previous.lastGuidanceText ?? null,
    ncaConversationState: previous.ncaConversationState ?? null,
  });
}

function appendVisit(
  previous: readonly string[] | undefined,
  objectId: string,
): readonly string[] {
  const next = [...(previous ?? [])];
  if (next[next.length - 1] !== objectId) next.push(objectId);
  return Object.freeze(next.slice(-24));
}

export function activateManagerObjectFromClick(
  previous: ManagerObjectSession,
  objectId: string | null,
): ManagerObjectSession {
  if (objectId == null) {
    return createEmptyManagerObjectSession();
  }
  return replaceActive(previous, objectId, "click");
}

export function resolveManagerObjectActivation(input: {
  readonly previous: ManagerObjectSession;
  readonly namedSubjectId: string | null;
  readonly deictic: boolean;
  readonly stageFocusedId: string | null;
  readonly conversationSubjectId: string | null;
}): ManagerObjectSession {
  if (input.namedSubjectId) {
    return replaceActive(
      input.previous,
      input.namedSubjectId,
      "conversation-named",
    );
  }
  if (input.deictic) {
    const preserved =
      input.previous.activeObjectId ??
      input.stageFocusedId ??
      input.conversationSubjectId;
    return replaceActive(
      input.previous,
      preserved,
      preserved ? "conversation-deictic" : "none",
    );
  }
  const fallback =
    input.stageFocusedId ??
    input.conversationSubjectId ??
    input.previous.activeObjectId;
  if (fallback && fallback === input.previous.activeObjectId) {
    return freezeManagerObjectSession({
      ...input.previous,
      activationSource:
        input.previous.activationSource === "none"
          ? "preserved"
          : input.previous.activationSource,
    });
  }
  if (fallback) {
    return replaceActive(input.previous, fallback, "preserved");
  }
  return input.previous;
}

export function projectActiveObjectIdFromStage(
  state: NexoraMVPObjectInteractionState,
): string | null {
  return state.focusedSubject?.id ?? state.selectedSubject?.id ?? null;
}

export function isManagerObjectActivationSource(
  value: string,
): value is ManagerObjectActivationSource {
  return (MANAGER_OBJECT_ACTIVATION_SOURCES as readonly string[]).includes(
    value,
  );
}
