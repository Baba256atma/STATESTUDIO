/** ASSISTANT-4:4 — Canonical immutable Validation identity. */
import { AssistantExecutiveGuidanceValidationConstants } from "./assistantExecutiveGuidanceValidation.constants.ts";
import type { AssistantExecutiveGuidanceValidationIdentityMetadata } from "./assistantExecutiveGuidanceValidation.types.ts";

export const AssistantExecutiveGuidanceValidationIdentity:
AssistantExecutiveGuidanceValidationIdentityMetadata = Object.freeze({
  id: AssistantExecutiveGuidanceValidationConstants.validationIdentifier,
  name: "Assistant Executive Guidance Validation",
  phaseId: "ASSISTANT-4:4",
  namespace: AssistantExecutiveGuidanceValidationConstants.namespace,
  version: AssistantExecutiveGuidanceValidationConstants.version,
  layer: "Nexora Assistant",
  status: AssistantExecutiveGuidanceValidationConstants.status,
  readiness: AssistantExecutiveGuidanceValidationConstants.readiness,
  sourceModel: "ASSISTANT-4:3/ExecutiveGuidanceModel",
  metadataOnly: true,
  immutable: true,
});
