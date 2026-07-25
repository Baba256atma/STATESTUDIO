/** ASSISTANT-3:4 — Canonical immutable Validation identity. */
import { AssistantIntentDialogueValidationConstants } from "./assistantIntentDialogueValidation.constants.ts";
import type { AssistantIntentDialogueValidationIdentityMetadata } from "./assistantIntentDialogueValidation.types.ts";

export const AssistantIntentDialogueValidationIdentity:
AssistantIntentDialogueValidationIdentityMetadata = Object.freeze({
  id: AssistantIntentDialogueValidationConstants.validationIdentifier,
  name: "Assistant Intent & Dialogue Understanding Validation",
  phaseId: "ASSISTANT-3:4",
  namespace: AssistantIntentDialogueValidationConstants.namespace,
  version: AssistantIntentDialogueValidationConstants.version,
  layer: "Nexora Assistant",
  status: AssistantIntentDialogueValidationConstants.status,
  readiness: AssistantIntentDialogueValidationConstants.readiness,
  sourceModel: "ASSISTANT-3:3/IntentDialogueUnderstandingModel",
  metadataOnly: true,
  immutable: true,
});
