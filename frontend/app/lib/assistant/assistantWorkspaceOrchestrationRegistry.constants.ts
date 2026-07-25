/** ASSISTANT-5:2 — Immutable Registry constants. */
import { AssistantWorkspaceOrchestrationRegistryCollections } from "./assistantWorkspaceOrchestrationRegistry.collections.ts";
import { AssistantWorkspaceOrchestrationRegistryEntries } from "./assistantWorkspaceOrchestrationRegistry.entries.ts";

export const AssistantWorkspaceOrchestrationRegistryConstants = Object.freeze({
  registryIdentifier: "ASSISTANT-5:2/WorkspaceOrchestrationRegistry",
  namespace: "nexora.assistant.workspace-orchestration.registry",
  version: "1.0.0",
  status: "Registry",
  readiness: "ReadyForModel",
  collectionCount:
    Object.keys(AssistantWorkspaceOrchestrationRegistryCollections).length,
  entryCount: AssistantWorkspaceOrchestrationRegistryEntries.length,
} as const);
