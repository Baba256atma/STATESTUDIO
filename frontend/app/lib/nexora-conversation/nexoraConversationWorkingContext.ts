import type { NexoraConversationalMove, NexoraConversationCapabilityKind, NexoraConversationPurpose } from "./nexoraConversationalMove.ts";
import type { NexoraConversationCoverage } from "./nexoraConversationProgression.ts";
import type { NexoraConversationKernelDecision } from "./nexoraConversationPolicy.ts";
import type { NexoraConversationThread } from "./nexoraConversationThread.ts";
import type { NexoraConversationThreadDecision } from "./nexoraConversationThreadPolicy.ts";
import type { NexoraConversationActionResult } from "./nexoraConversationActionResult.ts";

export const NEXORA_CONVERSATION_WORKING_THREAD_BOUND = 16 as const;

export type NexoraConversationCapabilityResult =
  | "SUCCEEDED"
  | "FAILED"
  | "NONE";

export type NexoraConversationCoverageThread = {
  readonly subjectId: string;
  readonly purpose: NexoraConversationPurpose;
  readonly coverage: NexoraConversationCoverage;
  readonly lastMove: NexoraConversationalMove | null;
  readonly lastCapabilityRequest: NexoraConversationCapabilityKind | null;
  readonly lastCapabilityResult: NexoraConversationCapabilityResult;
};

export type NexoraConversationPendingOffer = {
  readonly capability: NexoraConversationCapabilityKind;
  readonly subjectId: string;
  readonly purpose: NexoraConversationPurpose;
};

export type NexoraConversationPendingClarification = {
  readonly subjectId: string;
  readonly purpose: NexoraConversationPurpose;
};

export type NexoraConversationWorkingContext = {
  readonly threads: readonly NexoraConversationCoverageThread[];
  readonly lastDecision: NexoraConversationKernelDecision | null;
  readonly lastThreadDecision: NexoraConversationThreadDecision | null;
  readonly conversationThread: NexoraConversationThread | null;
  readonly pendingOffer: NexoraConversationPendingOffer | null;
  readonly pendingClarification: NexoraConversationPendingClarification | null;
  readonly lastActionResult: NexoraConversationActionResult | null;
};

export function emptyNexoraConversationWorkingContext(): NexoraConversationWorkingContext {
  return Object.freeze({
    threads: Object.freeze([]),
    lastDecision: null,
    lastThreadDecision: null,
    conversationThread: null,
    pendingOffer: null,
    pendingClarification: null,
    lastActionResult: null,
  });
}

export function conversationThreadKey(
  subjectId: string,
  purpose: NexoraConversationPurpose,
): string {
  return `${subjectId}::${purpose}`;
}

export function coverageThreadOf(
  working: NexoraConversationWorkingContext | null | undefined,
  subjectId: string,
  purpose: NexoraConversationPurpose,
): NexoraConversationCoverageThread | null {
  const threads = working?.threads ?? [];
  return (
    threads.find(
      (thread) => thread.subjectId === subjectId && thread.purpose === purpose,
    ) ?? null
  );
}

export function coverageOf(
  working: NexoraConversationWorkingContext | null | undefined,
  subjectId: string,
  purpose: NexoraConversationPurpose,
): NexoraConversationCoverage {
  return coverageThreadOf(working, subjectId, purpose)?.coverage ?? "NONE";
}

export function upsertCoverageThread(
  working: NexoraConversationWorkingContext | null | undefined,
  thread: NexoraConversationCoverageThread,
  extras: Partial<
    Pick<
      NexoraConversationWorkingContext,
      | "lastDecision"
      | "lastThreadDecision"
      | "conversationThread"
      | "pendingOffer"
      | "pendingClarification"
      | "lastActionResult"
    >
  > = {},
): NexoraConversationWorkingContext {
  const previous = working ?? emptyNexoraConversationWorkingContext();
  const without = previous.threads.filter(
    (item) =>
      !(item.subjectId === thread.subjectId && item.purpose === thread.purpose),
  );
  const nextThreads = Object.freeze([...without, thread]).slice(
    -NEXORA_CONVERSATION_WORKING_THREAD_BOUND,
  );
  return Object.freeze({
    threads: Object.freeze([...nextThreads]),
    lastDecision: extras.lastDecision !== undefined
      ? extras.lastDecision
      : previous.lastDecision,
    lastThreadDecision:
      extras.lastThreadDecision !== undefined
        ? extras.lastThreadDecision
        : previous.lastThreadDecision,
    conversationThread:
      extras.conversationThread !== undefined
        ? extras.conversationThread
        : previous.conversationThread,
    pendingOffer:
      extras.pendingOffer !== undefined ? extras.pendingOffer : previous.pendingOffer,
    pendingClarification:
      extras.pendingClarification !== undefined
        ? extras.pendingClarification
        : previous.pendingClarification,
    lastActionResult:
      extras.lastActionResult !== undefined
        ? extras.lastActionResult
        : previous.lastActionResult,
  });
}

export function recordConversationKernelDecision(
  working: NexoraConversationWorkingContext | null | undefined,
  decision: NexoraConversationKernelDecision,
  extras: {
    readonly lastCapabilityRequest?: NexoraConversationCapabilityKind | null;
    readonly lastCapabilityResult?: NexoraConversationCapabilityResult;
    readonly pendingOffer?: NexoraConversationPendingOffer | null;
    readonly pendingClarification?: NexoraConversationPendingClarification | null;
    readonly conversationThread?: NexoraConversationThread | null;
    readonly lastThreadDecision?: NexoraConversationThreadDecision | null;
    readonly lastActionResult?: NexoraConversationActionResult | null;
  } = {},
): NexoraConversationWorkingContext {
  const previous = coverageThreadOf(working, decision.subjectId, decision.purpose);
  return upsertCoverageThread(
    working,
    Object.freeze({
      subjectId: decision.subjectId,
      purpose: decision.purpose,
      coverage: decision.progression,
      lastMove: decision.move,
      lastCapabilityRequest:
        extras.lastCapabilityRequest !== undefined
          ? extras.lastCapabilityRequest
          : previous?.lastCapabilityRequest ?? null,
      lastCapabilityResult:
        extras.lastCapabilityResult ?? previous?.lastCapabilityResult ?? "NONE",
    }),
    {
      lastDecision: decision,
      lastThreadDecision:
        extras.lastThreadDecision !== undefined
          ? extras.lastThreadDecision
          : working?.lastThreadDecision ?? null,
      conversationThread:
        extras.conversationThread !== undefined
          ? extras.conversationThread
          : working?.conversationThread ?? null,
      pendingOffer:
        extras.pendingOffer !== undefined
          ? extras.pendingOffer
          : working?.pendingOffer ?? null,
      pendingClarification:
        extras.pendingClarification !== undefined
          ? extras.pendingClarification
          : working?.pendingClarification ?? null,
      lastActionResult:
        extras.lastActionResult !== undefined
          ? extras.lastActionResult
          : working?.lastActionResult ?? null,
    },
  );
}
