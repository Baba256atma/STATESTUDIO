/** ASSISTANT-5:2 — Canonical immutable Registry identity. */
import { AssistantWorkspaceOrchestrationRegistryConstants } from "./assistantWorkspaceOrchestrationRegistry.constants.ts";
import type { AssistantWorkspaceOrchestrationRegistryIdentityMetadata } from "./assistantWorkspaceOrchestrationRegistry.types.ts";

export const AssistantWorkspaceOrchestrationRegistryIdentity:
AssistantWorkspaceOrchestrationRegistryIdentityMetadata = Object.freeze({
  id: AssistantWorkspaceOrchestrationRegistryConstants.registryIdentifier,
  name: "Assistant Workspace Orchestration Registry",
  phaseId: "ASSISTANT-5:2",
  namespace: AssistantWorkspaceOrchestrationRegistryConstants.namespace,
  version: AssistantWorkspaceOrchestrationRegistryConstants.version,
  layer: "Nexora Assistant",
  status: AssistantWorkspaceOrchestrationRegistryConstants.status,
  readiness: AssistantWorkspaceOrchestrationRegistryConstants.readiness,
  sourceFoundation: "ASSISTANT-5:1/WorkspaceOrchestrationFoundation",
  metadataOnly: true,
  immutable: true,
});
