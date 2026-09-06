import type {
  CanonicalManagerCommunicativeIntent,
  CanonicalManagerOperation,
  CanonicalManagerQuestionType,
} from "@/app/lib/manager-object/canonicalManagerMeaning.ts";
import {
  NEXORA_CONVERSATION_KERNEL_BOUNDARY,
  verifyNexoraConversationKernel,
} from "./nexoraConversationKernelContract.ts";
import type {
  NexoraConversationCapabilityKind,
  NexoraConversationMoveReason,
  NexoraConversationPurpose,
  NexoraConversationalMove,
} from "./nexoraConversationalMove.ts";
import {
  advanceConversationCoverage,
  type NexoraConversationCoverage,
} from "./nexoraConversationProgression.ts";
import type { NexoraConversationCapabilityResult } from "./nexoraConversationWorkingContext.ts";

export type NexoraConversationMeaningProjection = {
  readonly communicativeIntent: CanonicalManagerCommunicativeIntent | null;
  readonly requestedOperation: CanonicalManagerOperation | null;
  readonly questionType: CanonicalManagerQuestionType | null;
};

export type NexoraConversationAvailableCapabilities = {
  readonly show: boolean;
  readonly compare: boolean;
  readonly investigate: boolean;
  readonly offerNext: boolean;
  readonly connect: boolean;
};

export type NexoraConversationKernelInput = {
  readonly meaning: NexoraConversationMeaningProjection | null;
  readonly subjectId: string;
  readonly purpose: NexoraConversationPurpose;
  readonly coverage: NexoraConversationCoverage;
  readonly previousMove: NexoraConversationalMove | null;
  readonly lastCapabilityRequest: NexoraConversationCapabilityKind | null;
  readonly lastCapabilityResult: NexoraConversationCapabilityResult;
  readonly capabilities: NexoraConversationAvailableCapabilities;
  readonly explicitRepeat: boolean;
  readonly materialContextChanged: boolean;
  readonly pendingOfferAccepted: boolean;
};

export type NexoraConversationKernelDecision = {
  readonly move: NexoraConversationalMove;
  readonly subjectId: string;
  readonly purpose: NexoraConversationPurpose;
  readonly progression: NexoraConversationCoverage;
  readonly requestedCapability: NexoraConversationCapabilityKind | null;
  readonly reason: NexoraConversationMoveReason;
};

export function conversationPurposeFromMeaning(
  meaning: NexoraConversationMeaningProjection | null,
): NexoraConversationPurpose {
  if (meaning == null) return "IDENTIFY";
  if (
    meaning.communicativeIntent === "ASK_CAPABILITY" ||
    meaning.requestedOperation === "HELP"
  ) {
    return "CAPABILITY";
  }
  if (
    meaning.communicativeIntent === "ASK_COMPARISON" ||
    meaning.requestedOperation === "COMPARE" ||
    meaning.questionType === "COMPARISON"
  ) {
    return "COMPARE";
  }
  if (
    meaning.requestedOperation === "INVESTIGATE" ||
    meaning.communicativeIntent === "REQUEST_INVESTIGATION"
  ) {
    return "INVESTIGATE";
  }
  if (meaning.questionType === "CAUSE") {
    return "CAUSE";
  }
  if (meaning.questionType === "GOAL_RELEVANCE") {
    return "WHY_RELEVANT";
  }
  if (meaning.communicativeIntent === "ASK_WHY") {
    return "WHY_PRESENT";
  }
  return "IDENTIFY";
}

export function emptyConversationCapabilities(): NexoraConversationAvailableCapabilities {
  return Object.freeze({
    show: false,
    compare: false,
    investigate: false,
    offerNext: false,
    connect: false,
  });
}

export function resolveConversationalMove(
  input: NexoraConversationKernelInput,
): NexoraConversationKernelDecision {
  verifyNexoraConversationKernel();
  if (NEXORA_CONVERSATION_KERNEL_BOUNDARY.usesLlmForMoveSelection) {
    throw new Error("NEX-CONV:1 move selection must remain local and deterministic");
  }

  const subjectId = input.subjectId;
  const purpose = input.purpose;

  if (input.explicitRepeat) {
    return freezeDecision({
      move: "REPEAT",
      subjectId,
      purpose,
      progression: input.coverage,
      requestedCapability: null,
      reason: "EXPLICIT_REPEAT_REQUESTED",
    });
  }

  if (input.pendingOfferAccepted) {
    const capability = offerCapability(input.capabilities);
    const move = moveForAcceptedOffer(capability);
    return freezeDecision({
      move,
      subjectId,
      purpose,
      progression: input.coverage,
      requestedCapability: capability,
      reason: "PENDING_OFFER_ACCEPTED",
    });
  }

  const coverage = input.materialContextChanged ? "NONE" : input.coverage;

  if (coverage === "NONE") {
    return freezeDecision({
      move: initialMoveForPurpose(purpose),
      subjectId,
      purpose,
      progression: advanceConversationCoverage(coverage),
      requestedCapability: null,
      reason: input.materialContextChanged
        ? "NEW_MATERIAL_CONTEXT"
        : "UNANSWERED_SUBJECT_PURPOSE",
    });
  }

  if (coverage === "INTRODUCTORY") {
    return freezeDecision({
      move: "DEEPEN",
      subjectId,
      purpose,
      progression: advanceConversationCoverage(coverage),
      requestedCapability: null,
      reason:
        purpose === "WHY_PRESENT"
          ? "PRIOR_WHY_EXPLANATION_EXISTS"
          : "PRIOR_IDENTITY_EXPLANATION_EXISTS",
    });
  }

  if (coverage === "DEEPENED") {
    const offered = saturatedOffer(input.capabilities, purpose);
    return freezeDecision({
      move: offered.move,
      subjectId,
      purpose,
      progression: advanceConversationCoverage(coverage),
      requestedCapability: offered.capability,
      reason: "CONNECTED_COVERAGE_EXISTS",
    });
  }

  return freezeDecision({
    move: "CLARIFY",
    subjectId,
    purpose,
    progression: "SATURATED",
    requestedCapability: null,
    reason: "SUBJECT_PURPOSE_SATURATED",
  });
}

function initialMoveForPurpose(purpose: NexoraConversationPurpose): NexoraConversationalMove {
  if (purpose === "WHY_PRESENT" || purpose === "WHY_RELEVANT") return "EXPLAIN_WHY";
  if (purpose === "COMPARE") return "COMPARE";
  if (purpose === "INVESTIGATE") return "INVESTIGATE";
  if (purpose === "FOCUS") return "ANSWER";
  return "ANSWER";
}

function saturatedOffer(
  capabilities: NexoraConversationAvailableCapabilities,
  purpose: NexoraConversationPurpose,
): {
  readonly move: NexoraConversationalMove;
  readonly capability: NexoraConversationCapabilityKind | null;
} {
  if (purpose === "COMPARE" && capabilities.compare) {
    return { move: "COMPARE", capability: "COMPARE" };
  }
  if (purpose === "INVESTIGATE" && capabilities.investigate) {
    return { move: "INVESTIGATE", capability: "INVESTIGATE" };
  }
  if (capabilities.compare) {
    return { move: "CONNECT", capability: "COMPARE" };
  }
  if (capabilities.offerNext) {
    return { move: "OFFER_NEXT", capability: "NEXT" };
  }
  if (capabilities.show) {
    return { move: "CONNECT", capability: "SHOW" };
  }
  if (capabilities.connect) {
    return { move: "CONNECT", capability: null };
  }
  return { move: "CLARIFY", capability: null };
}

function offerCapability(
  capabilities: NexoraConversationAvailableCapabilities,
): NexoraConversationCapabilityKind | null {
  if (capabilities.compare) return "COMPARE";
  if (capabilities.offerNext) return "NEXT";
  if (capabilities.show) return "SHOW";
  if (capabilities.investigate) return "INVESTIGATE";
  return null;
}

function moveForAcceptedOffer(
  capability: NexoraConversationCapabilityKind | null,
): NexoraConversationalMove {
  if (capability === "COMPARE") return "COMPARE";
  if (capability === "SHOW" || capability === "FOCUS") return "SHOW";
  if (capability === "INVESTIGATE") return "INVESTIGATE";
  if (capability === "NEXT") return "CONTINUE";
  return "CLARIFY";
}

function freezeDecision(
  decision: NexoraConversationKernelDecision,
): NexoraConversationKernelDecision {
  return Object.freeze({ ...decision });
}
