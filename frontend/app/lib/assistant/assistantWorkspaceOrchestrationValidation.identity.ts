/** ASSISTANT-5:4 — Canonical immutable Validation identity. */
import { AssistantWorkspaceOrchestrationValidationConstants } from "./assistantWorkspaceOrchestrationValidation.constants.ts";
import type { AssistantWorkspaceOrchestrationValidationIdentityMetadata } from "./assistantWorkspaceOrchestrationValidation.types.ts";

export const AssistantWorkspaceOrchestrationValidationIdentity:
AssistantWorkspaceOrchestrationValidationIdentityMetadata = Object.freeze({
  id: AssistantWorkspaceOrchestrationValidationConstants.validationIdentifier,
  name: "Assistant Workspace Orchestration Validation",
  phaseId: "ASSISTANT-5:4",
  namespace: AssistantWorkspaceOrchestrationValidationConstants.namespace,
  version: AssistantWorkspaceOrchestrationValidationConstants.version,
  layer: "Nexora Assistant",
  status: AssistantWorkspaceOrchestrationValidationConstants.status,
  readiness: AssistantWorkspaceOrchestrationValidationConstants.readiness,
  sourceModel: "ASSISTANT-5:3/WorkspaceOrchestrationModel",
  metadataOnly: true,
  immutable: true,
});
