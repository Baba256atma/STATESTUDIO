/** ASSISTANT-5:2 — Canonical Workspace Orchestration Registry. */
import { AssistantWorkspaceOrchestrationRegistryCollections } from "./assistantWorkspaceOrchestrationRegistry.collections.ts";
import { AssistantWorkspaceOrchestrationRegistryConstants } from "./assistantWorkspaceOrchestrationRegistry.constants.ts";
import { AssistantWorkspaceOrchestrationRegistryEntries } from "./assistantWorkspaceOrchestrationRegistry.entries.ts";
import { AssistantWorkspaceOrchestrationRegistryIdentity } from "./assistantWorkspaceOrchestrationRegistry.identity.ts";
import { AssistantWorkspaceOrchestrationRegistryMetadata } from "./assistantWorkspaceOrchestrationRegistry.metadata.ts";

export const AssistantWorkspaceOrchestrationRegistry = Object.freeze({
  identity: AssistantWorkspaceOrchestrationRegistryIdentity,
  constants: AssistantWorkspaceOrchestrationRegistryConstants,
  collections: AssistantWorkspaceOrchestrationRegistryCollections,
  entries: AssistantWorkspaceOrchestrationRegistryEntries,
  metadata: AssistantWorkspaceOrchestrationRegistryMetadata,
  statistics: AssistantWorkspaceOrchestrationRegistryMetadata.statistics,
  upstreamDependencies:
    AssistantWorkspaceOrchestrationRegistryMetadata.upstreamDependencies,
  publicApiSurface: Object.freeze([
    "AssistantWorkspaceOrchestrationRegistry",
  ]),
  status: "Registry",
  readiness: "ReadyForModel",
  nextPhase: "ASSISTANT-5:3 — Workspace Orchestration Model",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  workspaceExecution: false,
  workspaceRouting: false,
  scheduling: false,
  orchestrationEngine: false,
  llmIntegration: false,
  promptExecution: false,
  workflowOrchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
  executionLogic: false,
} as const);
