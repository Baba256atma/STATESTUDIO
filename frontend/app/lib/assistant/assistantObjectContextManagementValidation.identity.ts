/** ASSISTANT-6:4 — Canonical immutable Validation identity. */
import { AssistantObjectContextManagementValidationConstants } from "./assistantObjectContextManagementValidation.constants.ts";
import type { AssistantObjectContextManagementValidationIdentityMetadata } from "./assistantObjectContextManagementValidation.types.ts";

export const AssistantObjectContextManagementValidationIdentity:
AssistantObjectContextManagementValidationIdentityMetadata = Object.freeze({
  id: AssistantObjectContextManagementValidationConstants
    .validationIdentifier,
  name: "Assistant Object & Context Management Validation",
  phaseId: "ASSISTANT-6:4",
  namespace: AssistantObjectContextManagementValidationConstants.namespace,
  version: AssistantObjectContextManagementValidationConstants.version,
  layer: "Nexora Assistant",
  status: AssistantObjectContextManagementValidationConstants.status,
  readiness: AssistantObjectContextManagementValidationConstants.readiness,
  sourceModel: "ASSISTANT-6:3/ObjectContextManagementModel",
  metadataOnly: true,
  immutable: true,
});
