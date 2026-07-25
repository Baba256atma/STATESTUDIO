/** ASSISTANT-6:2 — Canonical Object & Context Management Registry. */
import { AssistantObjectContextManagementRegistryCollections } from "./assistantObjectContextManagementRegistry.collections.ts";
import { AssistantObjectContextManagementRegistryConstants } from "./assistantObjectContextManagementRegistry.constants.ts";
import { AssistantObjectContextManagementRegistryEntries } from "./assistantObjectContextManagementRegistry.entries.ts";
import { AssistantObjectContextManagementRegistryIdentity } from "./assistantObjectContextManagementRegistry.identity.ts";
import { AssistantObjectContextManagementRegistryMetadata } from "./assistantObjectContextManagementRegistry.metadata.ts";

export const AssistantObjectContextManagementRegistry = Object.freeze({
  identity: AssistantObjectContextManagementRegistryIdentity,
  constants: AssistantObjectContextManagementRegistryConstants,
  collections: AssistantObjectContextManagementRegistryCollections,
  entries: AssistantObjectContextManagementRegistryEntries,
  metadata: AssistantObjectContextManagementRegistryMetadata,
  statistics: AssistantObjectContextManagementRegistryMetadata.statistics,
  upstreamDependencies:
    AssistantObjectContextManagementRegistryMetadata.upstreamDependencies,
  publicApiSurface: Object.freeze([
    "AssistantObjectContextManagementRegistry",
  ]),
  status: "Registry",
  readiness: "ReadyForModel",
  nextPhase: "ASSISTANT-6:3 — Object & Context Management Model",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  objectCreation: false,
  objectPersistence: false,
  contextPersistence: false,
  contextSynchronization: false,
  workflowExecution: false,
  llmIntegration: false,
  promptExecution: false,
  aiReasoning: false,
  persistence: false,
  networking: false,
  rendering: false,
  executionLogic: false,
} as const);
