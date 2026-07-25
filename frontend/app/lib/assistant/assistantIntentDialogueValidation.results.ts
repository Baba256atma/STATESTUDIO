/** ASSISTANT-3:4 — Immutable declared Validation result metadata. */
import { AssistantIntentDialogueValidationConstants } from "./assistantIntentDialogueValidation.constants.ts";
import type { AssistantIntentDialogueValidationResultMetadata } from "./assistantIntentDialogueValidation.types.ts";

export const AssistantIntentDialogueValidationResults:
AssistantIntentDialogueValidationResultMetadata = Object.freeze({
  validationStatus: "Passed",
  ruleCount: AssistantIntentDialogueValidationConstants.ruleCount,
  gateCount: AssistantIntentDialogueValidationConstants.gateCount,
  passed: AssistantIntentDialogueValidationConstants.ruleCount,
  failed: 0,
  warnings: 0,
  readiness: "ReadyForManifest",
  manifestEligibility: "Eligible",
  metadataOnly: true,
  immutable: true,
});
