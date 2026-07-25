/** ASSISTANT-2:2 — Canonical Assistant Executive Memory Registry aggregate. */
import { AssistantExecutiveMemoryRegistryCollections } from "./assistantExecutiveMemoryRegistry.collections.ts";
import { AssistantExecutiveMemoryRegistryConstants } from "./assistantExecutiveMemoryRegistry.constants.ts";
import { AssistantExecutiveMemoryRegistryEntries } from "./assistantExecutiveMemoryRegistry.entries.ts";
import { AssistantExecutiveMemoryRegistryIdentity } from "./assistantExecutiveMemoryRegistry.identity.ts";
import { AssistantExecutiveMemoryRegistryMetadata } from "./assistantExecutiveMemoryRegistry.metadata.ts";

export const AssistantExecutiveMemoryRegistry = Object.freeze({
  identity: AssistantExecutiveMemoryRegistryIdentity,
  constants: AssistantExecutiveMemoryRegistryConstants,
  collections: AssistantExecutiveMemoryRegistryCollections,
  entries: AssistantExecutiveMemoryRegistryEntries,
  metadata: AssistantExecutiveMemoryRegistryMetadata,
  statistics: AssistantExecutiveMemoryRegistryMetadata.statistics,
  upstreamDependencies:
    AssistantExecutiveMemoryRegistryMetadata.upstreamDependencies,
  publicApiSurface: Object.freeze(["AssistantExecutiveMemoryRegistry"]),
  status: "Registry",
  readiness: "ReadyForModel",
  nextPhase: "ASSISTANT-2:3 — Executive Memory Model",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  memoryPersistence: false,
  vectorDatabase: false,
  embeddings: false,
  retrieval: false,
  semanticSearch: false,
  llmIntegration: false,
  promptExecution: false,
  workflowOrchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
  executionLogic: false,
} as const);
