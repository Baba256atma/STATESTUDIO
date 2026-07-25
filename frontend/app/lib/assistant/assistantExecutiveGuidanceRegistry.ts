/** ASSISTANT-4:2 — Canonical Executive Guidance Registry. */
import { AssistantExecutiveGuidanceRegistryCollections } from "./assistantExecutiveGuidanceRegistry.collections.ts";
import { AssistantExecutiveGuidanceRegistryConstants } from "./assistantExecutiveGuidanceRegistry.constants.ts";
import { AssistantExecutiveGuidanceRegistryEntries } from "./assistantExecutiveGuidanceRegistry.entries.ts";
import { AssistantExecutiveGuidanceRegistryIdentity } from "./assistantExecutiveGuidanceRegistry.identity.ts";
import { AssistantExecutiveGuidanceRegistryMetadata } from "./assistantExecutiveGuidanceRegistry.metadata.ts";

export const AssistantExecutiveGuidanceRegistry = Object.freeze({
  identity: AssistantExecutiveGuidanceRegistryIdentity,
  constants: AssistantExecutiveGuidanceRegistryConstants,
  collections: AssistantExecutiveGuidanceRegistryCollections,
  entries: AssistantExecutiveGuidanceRegistryEntries,
  metadata: AssistantExecutiveGuidanceRegistryMetadata,
  statistics: AssistantExecutiveGuidanceRegistryMetadata.statistics,
  upstreamDependencies:
    AssistantExecutiveGuidanceRegistryMetadata.upstreamDependencies,
  publicApiSurface: Object.freeze(["AssistantExecutiveGuidanceRegistry"]),
  status: "Registry",
  readiness: "ReadyForModel",
  nextPhase: "ASSISTANT-4:3 — Executive Guidance Model",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  recommendationGeneration: false,
  coachingGeneration: false,
  decisionGeneration: false,
  llmIntegration: false,
  promptExecution: false,
  actionPlanning: false,
  workflowOrchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
  executionLogic: false,
} as const);
