/** ASSISTANT-3:7 — Immutable Certification constants. */
import { AssistantIntentDialogueCertificationCriteria } from "./assistantIntentDialogueCertification.criteria.ts";
import { AssistantIntentDialogueCertificationGates } from "./assistantIntentDialogueCertification.gates.ts";

export const AssistantIntentDialogueCertificationConstants = Object.freeze({
  certificationIdentifier:
    "ASSISTANT-3:7/IntentDialogueUnderstandingCertification",
  namespace: "nexora.assistant.intent-dialogue.certification",
  version: "1.0.0",
  status: "Certification",
  readiness: "ReadyForFreeze",
  criteriaCount: AssistantIntentDialogueCertificationCriteria.length,
  gateCount: AssistantIntentDialogueCertificationGates.length,
} as const);
