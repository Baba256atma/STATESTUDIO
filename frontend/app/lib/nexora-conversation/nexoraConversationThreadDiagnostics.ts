import type { NexoraConversationThreadDecision } from "./nexoraConversationThreadPolicy.ts";
import type { NexoraConversationKernelDecision } from "./nexoraConversationPolicy.ts";

export type NexoraConversationThreadDiagnostics = {
  readonly identity: "NEX-CONV:2/ConversationThreadIntelligence";
  readonly threadId: string;
  readonly objective: NexoraConversationThreadDecision["thread"]["objective"];
  readonly primarySubject: string;
  readonly relatedSubjects: readonly string[];
  readonly coveredPurposes: readonly string[];
  readonly openPurposes: readonly string[];
  readonly threadStatus: NexoraConversationThreadDecision["thread"]["status"];
  readonly turnMove: NexoraConversationKernelDecision["move"];
  readonly resolvedMove: NexoraConversationThreadDecision["resolvedMove"];
  readonly reason: NexoraConversationThreadDecision["reason"];
  readonly readOnly: true;
};

export function conversationThreadDiagnosticsOf(
  turn: NexoraConversationKernelDecision,
  threadDecision: NexoraConversationThreadDecision,
): NexoraConversationThreadDiagnostics {
  return Object.freeze({
    identity: "NEX-CONV:2/ConversationThreadIntelligence" as const,
    threadId: threadDecision.thread.threadId,
    objective: threadDecision.thread.objective,
    primarySubject: threadDecision.thread.primarySubject,
    relatedSubjects: threadDecision.thread.relatedSubjects,
    coveredPurposes: Object.freeze(
      threadDecision.thread.coveredPurposes.map(
        (item) => `${item.purpose}:${item.coverage}`,
      ),
    ),
    openPurposes: threadDecision.thread.openPurposes,
    threadStatus: threadDecision.thread.status,
    turnMove: turn.move,
    resolvedMove: threadDecision.resolvedMove,
    reason: threadDecision.reason,
    readOnly: true as const,
  });
}
