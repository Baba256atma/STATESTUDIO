/**
 * NEX-CONV:1 — Conversation Kernel contract.
 *
 * Owns conversational progression and Conversational Move selection.
 * Does not own manager meaning, business semantics, Stage, Decision,
 * Execution, Advisor composition, or durable manager memory.
 */

export const nexoraConversationKernelIdentity =
  "NEX-CONV:1/ConversationKernel" as const;
export const nexoraConversationKernelVersion = "1.0.0" as const;
export const nexoraConversationKernelNamespace =
  "nexora.conversation.kernel" as const;

export const NEXORA_CONVERSATION_KERNEL_BOUNDARY = Object.freeze({
  identity: nexoraConversationKernelIdentity,
  ownsProgression: true as const,
  ownsConversationalMove: true as const,
  secondNlu: false as const,
  secondAdvisor: false as const,
  secondStage: false as const,
  secondDirector: false as const,
  secondDialogueEngine: false as const,
  transcriptDatabase: false as const,
  durableConversationMemory: false as const,
  globalNexoraMode: false as const,
  bcaPersistence: false as const,
  writesBusinessTruth: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesDataSemantics: false as const,
  writesEvidenceCausality: false as const,
  autoAdvancesLessons: false as const,
  autoPerformsBusinessActions: false as const,
  usesLlmForMoveSelection: false as const,
  repeatCountLadder: false as const,
});

export function getNexoraConversationKernelIdentity() {
  return Object.freeze({
    id: nexoraConversationKernelIdentity,
    version: nexoraConversationKernelVersion,
    namespace: nexoraConversationKernelNamespace,
  });
}

export function verifyNexoraConversationKernel(): { readonly ok: true } {
  if (getNexoraConversationKernelIdentity().id !== nexoraConversationKernelIdentity) {
    throw new Error("NEX-CONV:1 identity mismatch");
  }
  if (NEXORA_CONVERSATION_KERNEL_BOUNDARY.secondNlu) {
    throw new Error("NEX-CONV:1 must not create a second NLU");
  }
  if (NEXORA_CONVERSATION_KERNEL_BOUNDARY.secondAdvisor) {
    throw new Error("NEX-CONV:1 must not create a second Advisor");
  }
  if (NEXORA_CONVERSATION_KERNEL_BOUNDARY.writesBusinessTruth) {
    throw new Error("NEX-CONV:1 must not write business truth");
  }
  if (NEXORA_CONVERSATION_KERNEL_BOUNDARY.repeatCountLadder) {
    throw new Error("NEX-CONV:1 must not use a repeat-count ladder");
  }
  if (NEXORA_CONVERSATION_KERNEL_BOUNDARY.autoAdvancesLessons) {
    throw new Error("NEX-CONV:1 must not auto-advance lessons");
  }
  return Object.freeze({ ok: true as const });
}
