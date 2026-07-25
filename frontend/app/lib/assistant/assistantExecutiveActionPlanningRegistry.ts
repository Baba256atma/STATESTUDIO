/** ASSISTANT-7:2 — Canonical Executive Action Planning Registry. */
import { AssistantExecutiveActionPlanningRegistryCollections } from "./assistantExecutiveActionPlanningRegistry.collections.ts";
import { AssistantExecutiveActionPlanningRegistryConstants } from "./assistantExecutiveActionPlanningRegistry.constants.ts";
import { AssistantExecutiveActionPlanningRegistryEntries } from "./assistantExecutiveActionPlanningRegistry.entries.ts";
import { AssistantExecutiveActionPlanningRegistryIdentity } from "./assistantExecutiveActionPlanningRegistry.identity.ts";
import { AssistantExecutiveActionPlanningRegistryMetadata } from "./assistantExecutiveActionPlanningRegistry.metadata.ts";

export const AssistantExecutiveActionPlanningRegistry = Object.freeze({
  identity: AssistantExecutiveActionPlanningRegistryIdentity,
  constants: AssistantExecutiveActionPlanningRegistryConstants,
  collections: AssistantExecutiveActionPlanningRegistryCollections,
  entries: AssistantExecutiveActionPlanningRegistryEntries,
  metadata: AssistantExecutiveActionPlanningRegistryMetadata,
  statistics: AssistantExecutiveActionPlanningRegistryMetadata.statistics,
  upstreamDependencies:
    AssistantExecutiveActionPlanningRegistryMetadata.upstreamDependencies,
  publicApiSurface: Object.freeze([
    "AssistantExecutiveActionPlanningRegistry",
  ]),
  status: "Registry",
  readiness: "ReadyForModel",
  nextPhase: "ASSISTANT-7:3 — Executive Action Planning Model",
  canonicalInventoryRuleSatisfied: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  planningEngine: false,
  actionGeneration: false,
  taskExecution: false,
  scheduling: false,
  assignment: false,
  workflowExecution: false,
  automation: false,
  objectCreation: false,
  objectMutation: false,
  objectPersistence: false,
  contextPersistence: false,
  llmIntegration: false,
  promptExecution: false,
  aiReasoning: false,
  persistence: false,
  networking: false,
  rendering: false,
  executionLogic: false,
} as const);
