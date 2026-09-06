/**
 * NEX-CONV:2 — Conversation Thread Intelligence contract.
 *
 * Owns thread/objective progression. Consumes NEX-CONV:1 purpose coverage.
 * Does not own meaning, turn coverage, Advisor, Stage, or business truth.
 */

export const nexoraConversationThreadIdentity =
  "NEX-CONV:2/ConversationThreadIntelligence" as const;
export const nexoraConversationThreadVersion = "1.0.0" as const;
export const nexoraConversationThreadNamespace =
  "nexora.conversation.thread" as const;

export const NEXORA_CONVERSATION_THREAD_BOUNDARY = Object.freeze({
  identity: nexoraConversationThreadIdentity,
  ownsThreadProgression: true as const,
  ownsConversationObjective: true as const,
  ownsTurnProgression: false as const,
  secondNlu: false as const,
  secondAdvisor: false as const,
  secondSuggestedActionEngine: false as const,
  secondDialogueEngine: false as const,
  secondProgressionEngine: false as const,
  transcriptDatabase: false as const,
  durableConversationMemory: false as const,
  autoAdvancesLessons: false as const,
  autoPerformsBusinessActions: false as const,
  writesBusinessTruth: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  usesLlmForThreadPolicy: false as const,
  scoresUnderstanding: false as const,
});

export function getNexoraConversationThreadIdentity() {
  return Object.freeze({
    id: nexoraConversationThreadIdentity,
    version: nexoraConversationThreadVersion,
    namespace: nexoraConversationThreadNamespace,
  });
}

export function verifyNexoraConversationThread(): { readonly ok: true } {
  if (getNexoraConversationThreadIdentity().id !== nexoraConversationThreadIdentity) {
    throw new Error("NEX-CONV:2 identity mismatch");
  }
  if (NEXORA_CONVERSATION_THREAD_BOUNDARY.ownsTurnProgression) {
    throw new Error("NEX-CONV:2 must not own turn/purpose progression");
  }
  if (NEXORA_CONVERSATION_THREAD_BOUNDARY.secondProgressionEngine) {
    throw new Error("NEX-CONV:2 must not duplicate CONV:1 progression");
  }
  if (NEXORA_CONVERSATION_THREAD_BOUNDARY.autoAdvancesLessons) {
    throw new Error("NEX-CONV:2 must not auto-advance lessons");
  }
  if (NEXORA_CONVERSATION_THREAD_BOUNDARY.usesLlmForThreadPolicy) {
    throw new Error("NEX-CONV:2 thread policy must remain local");
  }
  return Object.freeze({ ok: true as const });
}
