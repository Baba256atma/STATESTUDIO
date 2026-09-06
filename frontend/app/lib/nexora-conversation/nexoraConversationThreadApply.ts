import {
  availablePurposesForUnderstandSubject,
  objectiveFromPurpose,
  projectConversationThread,
} from "./nexoraConversationThread.ts";
import {
  resolveConversationThreadMove,
  type NexoraConversationThreadDecision,
} from "./nexoraConversationThreadPolicy.ts";
import type { NexoraConversationKernelDecision } from "./nexoraConversationPolicy.ts";
import type { NexoraConversationAvailableCapabilities } from "./nexoraConversationPolicy.ts";
import type { NexoraConversationWorkingContext } from "./nexoraConversationWorkingContext.ts";
import type { NexoraConversationPurpose } from "./nexoraConversationalMove.ts";

export function threadsIncludingTurn(
  working: NexoraConversationWorkingContext | null | undefined,
  turn: NexoraConversationKernelDecision,
): NexoraConversationWorkingContext["threads"] {
  const previous = working?.threads ?? [];
  const without = previous.filter(
    (item) => !(item.subjectId === turn.subjectId && item.purpose === turn.purpose),
  );
  return Object.freeze([
    ...without,
    Object.freeze({
      subjectId: turn.subjectId,
      purpose: turn.purpose,
      coverage: turn.progression,
      lastMove: turn.move,
      lastCapabilityRequest: turn.requestedCapability,
      lastCapabilityResult:
        previous.find(
          (item) => item.subjectId === turn.subjectId && item.purpose === turn.purpose,
        )?.lastCapabilityResult ?? "NONE",
    }),
  ]);
}

export function resolveThreadIntelligence(input: {
  readonly working: NexoraConversationWorkingContext | null | undefined;
  readonly turn: NexoraConversationKernelDecision;
  readonly capabilities: NexoraConversationAvailableCapabilities;
  readonly availablePurposes?: readonly NexoraConversationPurpose[];
  readonly relatedSubjects?: readonly string[];
  readonly explicitRepeat?: boolean;
  readonly explicitAmbiguity?: boolean;
  readonly explicitRevisit?: boolean;
  readonly needsDifferentStrategy?: boolean;
  readonly pendingOfferAccepted?: boolean;
  readonly superseded?: boolean;
  readonly objective?: import("./nexoraConversationObjective.ts").NexoraConversationObjective;
}): NexoraConversationThreadDecision {
  const threads = threadsIncludingTurn(input.working, input.turn);
  const previousObjective = input.working?.conversationThread?.objective ?? null;
  const thread = projectConversationThread({
    threads,
    primarySubject: input.turn.subjectId,
    objective:
      input.objective ??
      objectiveFromPurpose(input.turn.purpose, previousObjective),
    availablePurposes:
      input.availablePurposes ??
      availablePurposesForUnderstandSubject({
        compare: input.capabilities.compare,
        whyPresent: true,
      }),
    relatedSubjects: input.relatedSubjects,
    superseded: input.superseded,
  });
  return resolveConversationThreadMove({
    turn: input.turn,
    thread,
    capabilities: input.capabilities,
    explicitRepeat: input.explicitRepeat === true,
    explicitAmbiguity: input.explicitAmbiguity === true,
    explicitRevisit: input.explicitRevisit === true,
    needsDifferentStrategy: input.needsDifferentStrategy === true,
    pendingOfferAccepted: input.pendingOfferAccepted === true,
  });
}

export function normalizeConversationUtterance(utterance: string): string {
  return utterance
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function utteranceIsGenuineAmbiguity(utterance: string): boolean {
  const normalized = normalizeConversationUtterance(utterance);
  return (
    /not what i mean/.test(normalized) ||
    normalized === "that's not it" ||
    normalized === "that is not it" ||
    normalized === "no that's not what i mean"
  );
}

export function utteranceNeedsDifferentStrategy(utterance: string): boolean {
  const normalized = normalizeConversationUtterance(utterance);
  return (
    /still don'?t understand/.test(normalized) ||
    /still don't get it/.test(normalized) ||
    /still not clear/.test(normalized)
  );
}

export function utteranceIsExplicitRevisit(utterance: string): boolean {
  const normalized = normalizeConversationUtterance(utterance);
  return (
    /again$/.test(normalized) ||
    /explain .+ again/.test(normalized) ||
    /relates? to/.test(normalized) ||
    /important for/.test(normalized) ||
    /how does .+ guide/.test(normalized)
  );
}
