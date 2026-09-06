/**
 * NEX-CONV:2-FIX2 — reconcile conversational working context after an
 * authoritative presented-action result. Does not execute ENT or Stage.
 */

import {
  emptyConversationCapabilities,
  resolveConversationalMove,
  type NexoraConversationAvailableCapabilities,
  type NexoraConversationKernelDecision,
} from "./nexoraConversationPolicy.ts";
import {
  availablePurposesForUnderstandSubject,
  projectConversationThread,
} from "./nexoraConversationThread.ts";
import { resolveThreadIntelligence } from "./nexoraConversationThreadApply.ts";
import type { NexoraConversationThreadDecision } from "./nexoraConversationThreadPolicy.ts";
import type { NexoraConversationActionResult } from "./nexoraConversationActionResult.ts";
import {
  emptyNexoraConversationWorkingContext,
  recordConversationKernelDecision,
  type NexoraConversationWorkingContext,
} from "./nexoraConversationWorkingContext.ts";
import type { NexoraConversationPurpose } from "./nexoraConversationalMove.ts";

export function reconcileConversationAfterAction(input: {
  readonly previous: NexoraConversationWorkingContext | null | undefined;
  readonly result: NexoraConversationActionResult;
  readonly capabilities?: NexoraConversationAvailableCapabilities;
  readonly availablePurposes?: readonly NexoraConversationPurpose[];
  readonly relatedSubjects?: readonly string[];
  readonly establishIdentifyCoverage?: boolean;
}): {
  readonly working: NexoraConversationWorkingContext;
  readonly turn: NexoraConversationKernelDecision | null;
  readonly threadDecision: NexoraConversationThreadDecision | null;
} {
  const previous = input.previous ?? emptyNexoraConversationWorkingContext();
  if (input.result.status !== "SUCCEEDED" || input.result.resultingSubjectId == null) {
    return Object.freeze({
      working: Object.freeze({
        ...previous,
        lastActionResult: input.result,
      }),
      turn: previous.lastDecision,
      threadDecision: previous.lastThreadDecision,
    });
  }

  const resultingSubjectId = input.result.resultingSubjectId;
  const capabilities = input.capabilities ??
    Object.freeze({
      ...emptyConversationCapabilities(),
      compare: true,
      offerNext: true,
      connect: true,
    });
  const availablePurposes =
    input.availablePurposes ??
    availablePurposesForUnderstandSubject({ compare: true, whyPresent: true });
  const cleared = Object.freeze({
    ...previous,
    pendingOffer: null,
    pendingClarification: null,
    lastActionResult: input.result,
    conversationThread: projectConversationThread({
      threads: previous.threads,
      primarySubject: resultingSubjectId,
      objective: "UNDERSTAND_SUBJECT",
      availablePurposes,
      relatedSubjects: input.relatedSubjects,
    }),
  });

  if (input.establishIdentifyCoverage !== true) {
    return Object.freeze({
      working: cleared,
      turn: cleared.lastDecision,
      threadDecision: cleared.lastThreadDecision,
    });
  }

  const turn = resolveConversationalMove({
    meaning: null,
    subjectId: resultingSubjectId,
    purpose: "IDENTIFY",
    coverage: "NONE",
    previousMove: null,
    lastCapabilityRequest: input.result.requestedCapability,
    lastCapabilityResult: "NONE",
    capabilities,
    explicitRepeat: false,
    materialContextChanged: true,
    pendingOfferAccepted: false,
  });
  const threadDecision = resolveThreadIntelligence({
    working: cleared,
    turn,
    capabilities,
    availablePurposes,
    relatedSubjects: input.relatedSubjects,
  });
  const working = recordConversationKernelDecision(cleared, turn, {
    lastCapabilityRequest: input.result.requestedCapability,
    lastCapabilityResult: "SUCCEEDED",
    pendingOffer: null,
    pendingClarification: null,
    lastActionResult: input.result,
    conversationThread: threadDecision.thread,
    lastThreadDecision: threadDecision,
  });
  return Object.freeze({
    working,
    turn,
    threadDecision,
  });
}
