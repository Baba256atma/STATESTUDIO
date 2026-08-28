/**
 * NEX-MVP-FINAL:6.2 — Conversation Context & Continuity.
 * Resolves what the current turn means in this conversation.
 * Does not own business truth, Stage history, or Decision/Execution.
 */

import {
  overlayConversationalIntentWithCanonicalMeaning,
} from "./nexoraMvpFinal61NaturalLanguageUnderstanding.ts";
import type { CanonicalManagerMeaning } from "./canonicalManagerMeaning.ts";
import type { NexoraConversationalIntentResolution } from "@/app/lib/conversational-control/conversationalIntent.ts";
import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import type { NexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import type { ManagerObjectSession } from "./managerObjectActive.ts";
import type {
  ContextualManagerMeaning,
  ConversationContinuitySnapshot,
  ConversationThreadFrame,
} from "./contextualManagerMeaning.ts";
import {
  createEmptyConversationContinuity,
  freezeConversationContinuity,
  isBusinessOperation,
  popThread,
  pushThread,
} from "./conversationContinuitySnapshot.ts";
import { resolveContextualManagerMeaning } from "./conversationContinuityResolver.ts";

export const nexoraMvpFinal62ContinuityIdentity =
  "NEX-MVP-FINAL:6.2/ConversationContextContinuity" as const;
export const nexoraMvpFinal62ContinuityVersion = "1.0.0" as const;
export const nexoraMvpFinal62ContinuityNamespace =
  "nexora.mvp.final62.conversation-context-continuity" as const;

export const NEXORA_MVP_FINAL62_CONTEXT_PRECEDENCE = Object.freeze([
  "EXPLICIT_CURRENT_TURN",
  "CONTEXT_TYPED_REFERENCE",
  "CONTEXT_CORRECTION",
  "EXISTING_STAGE_CONTEXT",
  "CONTEXT_ACTIVE_INVESTIGATION",
  "CONTEXT_ACTIVE_SUBJECT",
  "CONTEXT_RECENT_SUBJECT",
  "CONTEXT_PREVIOUS_SUBJECT",
  "CONTEXT_PRESENTED_SET",
  "UNRESOLVED",
] as const);

export const NEXORA_MVP_FINAL62_CONTINUITY_BOUNDARY = Object.freeze({
  identity: nexoraMvpFinal62ContinuityIdentity,
  createsSecondConversationEngine: false as const,
  createsSecondObjectRegistry: false as const,
  createsSecondStageHistory: false as const,
  createsDurableMemory: false as const,
  replacesCanonicalManagerMeaning: false as const,
  inventsBusinessTruth: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  startsFinal63: false as const,
});

export function getNexoraMvpFinal62ContinuityIdentity() {
  return Object.freeze({
    id: nexoraMvpFinal62ContinuityIdentity,
    version: nexoraMvpFinal62ContinuityVersion,
    namespace: nexoraMvpFinal62ContinuityNamespace,
  });
}

export function verifyNexoraMvpFinal62Continuity(): { readonly ok: true } {
  if (getNexoraMvpFinal62ContinuityIdentity().id !== nexoraMvpFinal62ContinuityIdentity) {
    throw new Error("FINAL:6.2 identity mismatch");
  }
  if (NEXORA_MVP_FINAL62_CONTINUITY_BOUNDARY.createsSecondConversationEngine) {
    throw new Error("FINAL:6.2 must not create a second conversation engine");
  }
  if (NEXORA_MVP_FINAL62_CONTINUITY_BOUNDARY.commitsDecision) {
    throw new Error("FINAL:6.2 must not commit decisions");
  }
  return Object.freeze({ ok: true as const });
}

const PROTECTED_INTENT_KINDS = new Set([
  "commit-decision",
  "confirm-decision-commitment",
  "cancel-decision-commitment",
  "prefer-option",
  "reject-decision",
  "defer-decision",
  "reconsider-decision",
  "explore-scenario",
  "define-scenario",
  "compare-scenarios",
  "explain-scenario",
  "modify-scenario",
  "select-scenario-reference",
  "greet",
  "navigate-back",
  "navigate-forward",
]);

function asOverlayMeaning(
  contextual: ContextualManagerMeaning,
): CanonicalManagerMeaning {
  return Object.freeze({
    ...contextual.turnMeaning,
    requestedOperation: contextual.requestedOperation,
    objectReference: contextual.objectReference,
    subject: contextual.objectReference,
    questionType: contextual.questionType,
    confidence: contextual.confidence,
    ambiguity: contextual.ambiguity,
    commitsDecision: false,
    startsExecution: false,
    inventsBusinessTruth: false,
  });
}

export function applyContextualMeaningToIntent(
  resolution: NexoraConversationalIntentResolution,
  contextual: ContextualManagerMeaning,
): NexoraConversationalIntentResolution {
  if (PROTECTED_INTENT_KINDS.has(resolution.intent.kind)) {
    return resolution;
  }
  // A rejected hypothetical grammar must remain unknown; contextual NLU may
  // enrich a recognized Scenario intent but cannot manufacture one.
  if (
    resolution.intent.kind === "unknown" &&
    /^(?:what if|what (?:would )?happen(?:s|ed)? if|simulate)\b/i.test(contextual.turnMeaning.rawUtterance)
  ) {
    return resolution;
  }
  if (contextual.commitsDecision || contextual.startsExecution) {
    return resolution;
  }
  let next = overlayConversationalIntentWithCanonicalMeaning(
    resolution,
    asOverlayMeaning(contextual),
  );
  if (
    next.intent.targetHints.length === 0 &&
    contextual.objectReference?.canonicalName &&
    next.intent.kind !== "unknown" &&
    next.intent.kind !== "help" &&
    next.intent.kind !== "overview" &&
    contextual.provenance !== "CONTEXT_ACTIVE_SUBJECT" &&
    contextual.provenance !== "EXISTING_STAGE_CONTEXT"
  ) {
    const hint = Object.freeze({
      raw: contextual.objectReference.canonicalName,
      role: "primary" as const,
    });
    next = Object.freeze({
      intent: Object.freeze({
        ...next.intent,
        targetHints: Object.freeze([hint]),
        requiresContext: false,
        requiresTarget: true,
      }),
      trace: Object.freeze({
        ...next.trace,
        targetHints: Object.freeze([hint]),
        requiresContext: false,
        requiresTarget: true,
      }),
    });
  }
  return next;
}

export function interpretContextualManagerTurn(input: {
  readonly turnMeaning: CanonicalManagerMeaning;
  readonly subjects: readonly NexoraConversationalSubjectRecord[];
  readonly previousContinuity?: ConversationContinuitySnapshot | null;
  readonly executiveContext?: NexoraExecutiveContextSnapshot | null;
  readonly managerSession?: ManagerObjectSession | null;
  readonly stageFocusedId?: string | null;
}): ContextualManagerMeaning {
  return resolveContextualManagerMeaning(input);
}

export function updateConversationContinuity(input: {
  readonly previous: ConversationContinuitySnapshot | null | undefined;
  readonly contextual: ContextualManagerMeaning;
  readonly resolvedSubjectId: string | null;
  readonly resolvedSubjectKind: string | null;
  readonly investigationSubjectId: string | null;
  readonly presentedIds?: readonly string[];
  readonly recommendedTargetId?: string | null;
  readonly recommendationId?: string | null;
}): ConversationContinuitySnapshot {
  const previous = input.previous ?? createEmptyConversationContinuity();
  const isMeta = input.contextual.requestedOperation === "HELP";
  const subjectId =
    input.resolvedSubjectId ??
    input.contextual.objectReference?.subjectId ??
    previous.activeSubjectId;
  const subjectKind =
    input.resolvedSubjectKind ??
    input.contextual.objectReference?.subjectKind ??
    previous.activeSubjectKind;
  const investigationId =
    input.investigationSubjectId ??
    input.recommendedTargetId ??
    previous.activeInvestigationId;

  if (isMeta) {
    return freezeConversationContinuity({
      ...previous,
      parkedThread: previous.parkedThread ?? previous.thread,
      parkedActiveSubjectId:
        previous.parkedActiveSubjectId ?? previous.activeSubjectId,
      turnIndex: previous.turnIndex + 1,
    });
  }

  if (input.contextual.continuityMove === "backtrack") {
    const popped = popThread(previous.thread);
    const backId =
      input.contextual.objectReference?.subjectId ??
      popped.previous?.subjectId ??
      previous.previousSubjectId ??
      subjectId;
    return freezeConversationContinuity({
      ...previous,
      activeSubjectId: backId,
      activeSubjectKind:
        input.contextual.objectReference?.subjectKind ??
        popped.previous?.subjectKind ??
        subjectKind,
      previousSubjectId: previous.activeSubjectId,
      thread: popped.remaining,
      turnIndex: previous.turnIndex + 1,
    });
  }

  if (input.contextual.continuityMove === "resume-parked" && previous.parkedThread) {
    const restored = previous.parkedThread[previous.parkedThread.length - 1];
    return freezeConversationContinuity({
      ...previous,
      activeSubjectId: restored?.subjectId ?? subjectId,
      activeSubjectKind: restored?.subjectKind ?? subjectKind,
      thread: previous.parkedThread,
      parkedThread: null,
      parkedActiveSubjectId: null,
      turnIndex: previous.turnIndex + 1,
    });
  }

  const frame: ConversationThreadFrame | null =
    subjectId && isBusinessOperation(input.contextual.requestedOperation)
      ? Object.freeze({
          subjectId,
          subjectKind: subjectKind ?? "object",
          operation: input.contextual.requestedOperation,
          turnIndex: previous.turnIndex + 1,
        })
      : null;

  return freezeConversationContinuity({
    identity: "NEX-MVP-FINAL:6.2/ConversationContextContinuity",
    activeSubjectId: subjectId,
    activeSubjectKind: subjectKind,
    activeInvestigationId: investigationId,
    activeOperation:
      input.contextual.requestedOperation !== "NONE"
        ? input.contextual.requestedOperation
        : previous.activeOperation,
    activeQuestionType:
      input.contextual.questionType !== "NONE"
        ? input.contextual.questionType
        : previous.activeQuestionType,
    previousSubjectId:
      subjectId && subjectId !== previous.activeSubjectId
        ? previous.activeSubjectId
        : previous.previousSubjectId,
    thread: frame ? pushThread(previous.thread, frame) : previous.thread,
    presentedIds: Object.freeze(
      input.presentedIds ?? previous.presentedIds,
    ),
    continuationIndex:
      input.contextual.continuityMove === "what-else"
        ? previous.continuationIndex + 1
        : previous.continuationIndex,
    lastRecommendedTargetId:
      input.recommendedTargetId ?? previous.lastRecommendedTargetId,
    lastRecommendationId:
      input.recommendationId ?? previous.lastRecommendationId,
    parkedThread:
      input.contextual.provenance === "EXPLICIT_CURRENT_TURN"
        ? null
        : previous.parkedThread,
    parkedActiveSubjectId:
      input.contextual.provenance === "EXPLICIT_CURRENT_TURN"
        ? null
        : previous.parkedActiveSubjectId,
    correctedSubjectId: previous.correctedSubjectId,
    turnIndex: previous.turnIndex + 1,
  });
}
