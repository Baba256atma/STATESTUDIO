import {
  NEXORA_CONVERSATION_THREAD_BOUNDARY,
  verifyNexoraConversationThread,
} from "./nexoraConversationThreadContract.ts";
import type { NexoraConversationThreadReason } from "./nexoraConversationObjective.ts";
import type { NexoraConversationThread } from "./nexoraConversationThread.ts";
import type { NexoraConversationalMove } from "./nexoraConversationalMove.ts";
import type { NexoraConversationKernelDecision } from "./nexoraConversationPolicy.ts";
import type { NexoraConversationAvailableCapabilities } from "./nexoraConversationPolicy.ts";

export type NexoraConversationThreadPolicyInput = {
  readonly turn: NexoraConversationKernelDecision;
  readonly thread: NexoraConversationThread;
  readonly capabilities: NexoraConversationAvailableCapabilities;
  readonly explicitRepeat: boolean;
  readonly explicitAmbiguity: boolean;
  readonly explicitRevisit: boolean;
  readonly needsDifferentStrategy: boolean;
  readonly pendingOfferAccepted: boolean;
};

export type NexoraConversationThreadDecision = {
  readonly turnMove: NexoraConversationalMove;
  readonly resolvedMove: NexoraConversationalMove;
  readonly thread: NexoraConversationThread;
  readonly reason: NexoraConversationThreadReason;
};

export function resolveConversationThreadMove(
  input: NexoraConversationThreadPolicyInput,
): NexoraConversationThreadDecision {
  verifyNexoraConversationThread();
  if (NEXORA_CONVERSATION_THREAD_BOUNDARY.usesLlmForThreadPolicy) {
    throw new Error("NEX-CONV:2 must not use an LLM to choose thread progression");
  }

  if (input.explicitRepeat) {
    return freezeThreadDecision(input.turn.move, input, "EXPLICIT_REPEAT_REQUESTED");
  }
  if (input.explicitAmbiguity) {
    return freezeThreadDecision("CLARIFY", input, "GENUINE_AMBIGUITY");
  }
  if (input.pendingOfferAccepted) {
    return freezeThreadDecision(input.turn.move, input, "PENDING_OFFER_STILL_VALID");
  }
  if (input.explicitRevisit) {
    return freezeThreadDecision(input.turn.move, input, "EXPLICIT_MANAGER_INTENT");
  }
  if (input.needsDifferentStrategy) {
    return freezeThreadDecision(
      productiveMove(input),
      input,
      "NEED_DIFFERENT_STRATEGY",
    );
  }

  const currentCovered = input.thread.coveredPurposes.some(
    (item) => item.purpose === input.turn.purpose,
  );
  if (!currentCovered && input.turn.move !== "CLARIFY") {
    return freezeThreadDecision(input.turn.move, input, "EXPLICIT_MANAGER_INTENT");
  }

  if (
    input.turn.move === "CLARIFY" &&
    (input.thread.status === "SUFFICIENTLY_COVERED" ||
      input.thread.coveredPurposes.length >= 2)
  ) {
    return freezeThreadDecision(
      input.thread.coveredPurposes.length >= 3 ? "SUMMARIZE" : productiveMove(input),
      input,
      input.thread.coveredPurposes.length >= 3
        ? "MULTIPLE_RELEVANT_PURPOSES_ALREADY_COVERED"
        : "THREAD_SUFFICIENTLY_COVERED",
    );
  }

  return freezeThreadDecision(input.turn.move, input, "TURN_POLICY_STANDS");
}

function productiveMove(
  input: NexoraConversationThreadPolicyInput,
): NexoraConversationalMove {
  if (input.capabilities.offerNext) return "OFFER_NEXT";
  if (input.capabilities.compare) return "CONNECT";
  if (input.capabilities.show) return "SHOW";
  if (input.capabilities.connect) return "CONNECT";
  return "SUMMARIZE";
}

function freezeThreadDecision(
  resolvedMove: NexoraConversationalMove,
  input: NexoraConversationThreadPolicyInput,
  reason: NexoraConversationThreadReason,
): NexoraConversationThreadDecision {
  return Object.freeze({
    turnMove: input.turn.move,
    resolvedMove,
    thread: input.thread,
    reason,
  });
}
