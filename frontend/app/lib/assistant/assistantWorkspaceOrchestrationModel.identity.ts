/** ASSISTANT-5:3 — Canonical immutable Workspace Orchestration Model identity. */
import { AssistantWorkspaceOrchestrationModelConstants } from "./assistantWorkspaceOrchestrationModel.constants.ts";
import type { AssistantWorkspaceOrchestrationModelIdentityMetadata } from "./assistantWorkspaceOrchestrationModel.types.ts";

export const AssistantWorkspaceOrchestrationModelIdentity:
AssistantWorkspaceOrchestrationModelIdentityMetadata = Object.freeze({
  id: AssistantWorkspaceOrchestrationModelConstants.modelIdentifier,
  name: "Assistant Workspace Orchestration Model",
  phaseId: "ASSISTANT-5:3",
  namespace: AssistantWorkspaceOrchestrationModelConstants.namespace,
  version: AssistantWorkspaceOrchestrationModelConstants.version,
  layer: "Nexora Assistant",
  status: AssistantWorkspaceOrchestrationModelConstants.status,
  readiness: AssistantWorkspaceOrchestrationModelConstants.readiness,
  sourceRegistry: "ASSISTANT-5:2/WorkspaceOrchestrationRegistry",
  metadataOnly: true,
  immutable: true,
});
