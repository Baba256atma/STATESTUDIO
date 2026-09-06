/**
 * NEX-CONV:2-FIX2 — presented conversational action result.
 * Observes ENT/Director/Stage outcome. Does not execute lesson or Stage itself.
 */

import type { NexoraConversationCapabilityKind } from "./nexoraConversationalMove.ts";

export const nexoraConversationActionResultIdentity =
  "NEX-CONV:2-FIX2/PresentedActionResult" as const;

export const NEXORA_CONVERSATION_ACTION_RESULT_STATUSES = Object.freeze([
  "SUCCEEDED",
  "FAILED",
  "UNAVAILABLE",
] as const);

export type NexoraConversationActionResultStatus =
  (typeof NEXORA_CONVERSATION_ACTION_RESULT_STATUSES)[number];

export type NexoraConversationActionResult = {
  readonly identity: typeof nexoraConversationActionResultIdentity;
  readonly requestedCapability: NexoraConversationCapabilityKind;
  readonly status: NexoraConversationActionResultStatus;
  readonly previousSubjectId: string | null;
  readonly resultingSubjectId: string | null;
  readonly owner: string;
  readonly lessonBefore: string | null;
  readonly lessonAfter: string | null;
};

export const NEXORA_CONVERSATION_ACTION_RESULT_BOUNDARY = Object.freeze({
  identity: nexoraConversationActionResultIdentity,
  executesLesson: false as const,
  writesStage: false as const,
  writesBusinessTruth: false as const,
  secondResultEngine: false as const,
  usesLlm: false as const,
  usesDom: false as const,
});

export function freezeConversationActionResult(
  input: Omit<NexoraConversationActionResult, "identity">,
): NexoraConversationActionResult {
  return Object.freeze({
    identity: nexoraConversationActionResultIdentity,
    ...input,
  });
}

export function conversationSubjectParityOf(input: {
  readonly resultingSubjectId: string | null;
  readonly conversationSubjectId: string | null;
  readonly stageSubjectId: string | null;
}): "PASS" | "MISMATCH" {
  if (input.resultingSubjectId == null) return "MISMATCH";
  if (input.resultingSubjectId !== input.conversationSubjectId) return "MISMATCH";
  if (input.resultingSubjectId !== input.stageSubjectId) return "MISMATCH";
  return "PASS";
}
