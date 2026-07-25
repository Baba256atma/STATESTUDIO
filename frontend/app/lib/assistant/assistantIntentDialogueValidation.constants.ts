/** ASSISTANT-3:4 — Immutable Validation constants. */
import { AssistantIntentDialogueValidationGates } from "./assistantIntentDialogueValidation.gates.ts";
import { AssistantIntentDialogueValidationRules } from "./assistantIntentDialogueValidation.rules.ts";

export const AssistantIntentDialogueValidationConstants = Object.freeze({
  validationIdentifier: "ASSISTANT-3:4/IntentDialogueUnderstandingValidation",
  namespace: "nexora.assistant.intent-dialogue.validation",
  version: "1.0.0",
  status: "Validation",
  readiness: "ReadyForManifest",
  ruleCount: AssistantIntentDialogueValidationRules.length,
  gateCount: AssistantIntentDialogueValidationGates.length,
} as const);
