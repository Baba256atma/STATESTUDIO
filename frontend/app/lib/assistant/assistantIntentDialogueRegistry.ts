/** ASSISTANT-3:2 — Canonical Intent & Dialogue Understanding Registry. */
import { AssistantIntentDialogueRegistryCollections } from "./assistantIntentDialogueRegistry.collections.ts";
import { AssistantIntentDialogueRegistryConstants } from "./assistantIntentDialogueRegistry.constants.ts";
import { AssistantIntentDialogueRegistryEntries } from "./assistantIntentDialogueRegistry.entries.ts";
import { AssistantIntentDialogueRegistryIdentity } from "./assistantIntentDialogueRegistry.identity.ts";
import { AssistantIntentDialogueRegistryMetadata } from "./assistantIntentDialogueRegistry.metadata.ts";

export const AssistantIntentDialogueRegistry = Object.freeze({
  identity: AssistantIntentDialogueRegistryIdentity,
  constants: AssistantIntentDialogueRegistryConstants,
  collections: AssistantIntentDialogueRegistryCollections,
  entries: AssistantIntentDialogueRegistryEntries,
  metadata: AssistantIntentDialogueRegistryMetadata,
  statistics: AssistantIntentDialogueRegistryMetadata.statistics,
  upstreamDependencies:
    AssistantIntentDialogueRegistryMetadata.upstreamDependencies,
  publicApiSurface: Object.freeze(["AssistantIntentDialogueRegistry"]),
  status: "Registry",
  readiness: "ReadyForModel",
  nextPhase: "ASSISTANT-3:3 — Intent & Dialogue Understanding Model",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  intentClassification: false,
  nlp: false,
  naturalLanguageParsing: false,
  llmIntegration: false,
  promptExecution: false,
  dialogueExecution: false,
  workflowOrchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
  executionLogic: false,
} as const);
