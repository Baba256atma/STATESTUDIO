/** ASSISTANT-1:4 — Immutable declared Validation result metadata. */
import { AssistantConversationValidationConstants } from "./assistantConversationValidation.constants.ts";
import type { AssistantConversationValidationResultMetadata } from "./assistantConversationValidation.types.ts";

export const AssistantConversationValidationResults:
AssistantConversationValidationResultMetadata = Object.freeze({
  validationStatus: "Passed",
  ruleCount: AssistantConversationValidationConstants.ruleCount,
  gateCount: AssistantConversationValidationConstants.gateCount,
  passed: AssistantConversationValidationConstants.ruleCount,
  failed: 0,
  warnings: 0,
  readiness: "ReadyForManifest",
  certificationEligibility: "Eligible",
  metadataOnly: true,
  immutable: true,
});
