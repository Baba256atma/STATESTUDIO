/**
 * NEX-MVP-FINAL:6.3 — Smart Clarification & Correction.
 * Trust gate over Canonical + Contextual meaning. Does not own business truth.
 */

import { overlayConversationalIntentWithCanonicalMeaning } from "./nexoraMvpFinal61NaturalLanguageUnderstanding.ts";
import type { CanonicalManagerMeaning } from "./canonicalManagerMeaning.ts";
import type { ContextualManagerMeaning } from "./contextualManagerMeaning.ts";
import type { NexoraConversationalIntentResolution } from "@/app/lib/conversational-control/conversationalIntent.ts";
import { interpretClarificationTurn } from "./nexoraMvpFinal63ClarificationResolver.ts";
import type { ClarificationTurnResult } from "./nexoraMvpFinal63ClarificationTypes.ts";
import { repairConversationSubject } from "./conversationContinuitySnapshot.ts";
import type { ConversationContinuitySnapshot } from "./contextualManagerMeaning.ts";

export const nexoraMvpFinal63ClarificationIdentity =
  "NEX-MVP-FINAL:6.3/SmartClarificationCorrection" as const;
export const nexoraMvpFinal63ClarificationVersion = "1.0.0" as const;
export const nexoraMvpFinal63ClarificationNamespace =
  "nexora.mvp.final63.smart-clarification-correction" as const;

export const NEXORA_MVP_FINAL63_CLARIFICATION_BOUNDARY = Object.freeze({
  identity: nexoraMvpFinal63ClarificationIdentity,
  createsSecondNluEngine: false as const,
  createsSecondContinuityEngine: false as const,
  createsSecondConversationEngine: false as const,
  createsSecondObjectRegistry: false as const,
  createsSecondConfirmationFramework: false as const,
  createsDurableMemory: false as const,
  replacesCanonicalManagerMeaning: false as const,
  replacesContextualManagerMeaning: false as const,
  inventsBusinessTruth: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  startsFinal64: false as const,
});

export const NEXORA_MVP_FINAL63_PRECEDENCE = Object.freeze([
  "EXPLICIT_NEW_COMPLETE_REQUEST",
  "EXPLICIT_CORRECTION",
  "PENDING_CLARIFICATION_ANSWER",
  "FINAL_6_2_CONTEXTUAL_MEANING",
  "CLARIFICATION_GATE",
  "EXISTING_AUTHORITY",
] as const);

export function getNexoraMvpFinal63ClarificationIdentity() {
  return Object.freeze({
    id: nexoraMvpFinal63ClarificationIdentity,
    version: nexoraMvpFinal63ClarificationVersion,
    namespace: nexoraMvpFinal63ClarificationNamespace,
  });
}

export function verifyNexoraMvpFinal63Clarification(): { readonly ok: true } {
  if (
    getNexoraMvpFinal63ClarificationIdentity().id !==
    nexoraMvpFinal63ClarificationIdentity
  ) {
    throw new Error("FINAL:6.3 identity mismatch");
  }
  if (NEXORA_MVP_FINAL63_CLARIFICATION_BOUNDARY.createsSecondConversationEngine) {
    throw new Error("FINAL:6.3 must not create a second conversation engine");
  }
  if (NEXORA_MVP_FINAL63_CLARIFICATION_BOUNDARY.commitsDecision) {
    throw new Error("FINAL:6.3 must not commit decisions");
  }
  return Object.freeze({ ok: true as const });
}

export { interpretClarificationTurn };

export function applyResumedMeaningToIntent(
  resolution: NexoraConversationalIntentResolution,
  contextual: ContextualManagerMeaning,
  clarification: ClarificationTurnResult,
): NexoraConversationalIntentResolution {
  if (clarification.action !== "resume" || !clarification.resumeReference) {
    return resolution;
  }
  if (
    clarification.resumeIntentKind &&
    /commit|execution/.test(clarification.resumeIntentKind)
  ) {
    const hint = Object.freeze({
      raw: clarification.resumeReference.canonicalName ?? "",
      role: "primary" as const,
    });
    return Object.freeze({
      intent: Object.freeze({
        ...resolution.intent,
        kind: clarification.resumeIntentKind as typeof resolution.intent.kind,
        targetHints: Object.freeze([hint]),
      }),
      trace: resolution.trace,
    });
  }
  const resumed: CanonicalManagerMeaning = Object.freeze({
    ...contextual.turnMeaning,
    requestedOperation:
      clarification.resumeOperation ?? contextual.requestedOperation,
    objectReference: clarification.resumeReference,
    subject: clarification.resumeReference,
    confidence: "HIGH",
    ambiguity: Object.freeze({
      unresolved: false,
      reason: "none",
      candidates: Object.freeze([]),
    }),
    commitsDecision: false,
    startsExecution: false,
    inventsBusinessTruth: false,
  });
  const forcedUnknown: NexoraConversationalIntentResolution = Object.freeze({
    intent: Object.freeze({
      ...resolution.intent,
      kind: "unknown",
    }),
    trace: resolution.trace,
  });
  return overlayConversationalIntentWithCanonicalMeaning(forcedUnknown, resumed);
}

export function applyClarificationRepair(
  continuity: ConversationContinuitySnapshot | null | undefined,
  clarification: ClarificationTurnResult,
): ConversationContinuitySnapshot | null {
  if (!continuity) return null;
  if (!clarification.correctionDetected || !clarification.correctionAfterId) {
    return continuity;
  }
  return repairConversationSubject(
    continuity,
    clarification.correctionAfterId,
    clarification.resumeReference?.subjectKind ?? "object",
  );
}
