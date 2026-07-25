/** ASSISTANT-2:3 — Canonical Assistant Executive Memory Model aggregate. */
import { AssistantExecutiveMemoryRegistry } from "./assistantExecutiveMemoryRegistry.ts";
import { AssistantExecutiveMemoryModelConstants } from "./assistantExecutiveMemoryModel.constants.ts";
import { AssistantExecutiveMemoryModelIdentity } from "./assistantExecutiveMemoryModel.identity.ts";
import { AssistantExecutiveMemoryModelLifecycle } from "./assistantExecutiveMemoryModel.lifecycle.ts";
import {
  AssistantExecutiveMemoryDomainModels,
  AssistantExecutiveMemoryModelStructuralMetadata,
} from "./assistantExecutiveMemoryModel.metadata.ts";
import { AssistantExecutiveMemoryModelRelationships } from "./assistantExecutiveMemoryModel.relationships.ts";

export const AssistantExecutiveMemoryModel = Object.freeze({
  identity: AssistantExecutiveMemoryModelIdentity,
  registry: AssistantExecutiveMemoryRegistry,
  constants: AssistantExecutiveMemoryModelConstants,
  domainModels: AssistantExecutiveMemoryDomainModels,
  relationships: AssistantExecutiveMemoryModelRelationships,
  lifecycle: AssistantExecutiveMemoryModelLifecycle,
  structuralMetadata: AssistantExecutiveMemoryModelStructuralMetadata,
  statistics: Object.freeze({
    domainModelCount: AssistantExecutiveMemoryModelConstants.domainModelCount,
    relationshipCount: AssistantExecutiveMemoryModelConstants.relationshipCount,
    lifecycleCount: AssistantExecutiveMemoryModelConstants.lifecycleCount,
    metadataCount:
      AssistantExecutiveMemoryModelStructuralMetadata.statistics.metadataCount,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-2:2 Executive Memory Registry",
  ]),
  publicApiSurface: Object.freeze(["AssistantExecutiveMemoryModel"]),
  status: "Model",
  readiness: "ReadyForValidation",
  nextPhase: "ASSISTANT-2:4 — Executive Memory Validation",
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
  orchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
  executionLogic: false,
} as const);
