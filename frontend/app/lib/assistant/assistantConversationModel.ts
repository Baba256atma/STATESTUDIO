/** ASSISTANT-1:3 — Canonical Assistant Conversation Model aggregate. */
import { AssistantConversationRegistry } from "./assistantConversationRegistry.ts";
import { AssistantConversationModelConstants } from "./assistantConversationModel.constants.ts";
import { AssistantConversationModelIdentity } from "./assistantConversationModel.identity.ts";
import { AssistantConversationModelLifecycle } from "./assistantConversationModel.lifecycle.ts";
import {
  AssistantConversationDomainModels,
  AssistantConversationModelStructuralMetadata,
} from "./assistantConversationModel.metadata.ts";
import { AssistantConversationModelRelationships } from "./assistantConversationModel.relationships.ts";

export const AssistantConversationModel = Object.freeze({
  identity: AssistantConversationModelIdentity,
  registry: AssistantConversationRegistry,
  constants: AssistantConversationModelConstants,
  domainModels: AssistantConversationDomainModels,
  relationships: AssistantConversationModelRelationships,
  lifecycle: AssistantConversationModelLifecycle,
  structuralMetadata: AssistantConversationModelStructuralMetadata,
  upstreamDependencies: Object.freeze([
    "ASSISTANT-1:2 Conversation Registry",
  ]),
  publicApiSurface: Object.freeze(["AssistantConversationModel"]),
  status: "Model",
  readiness: "ReadyForValidation",
  nextPhase: "ASSISTANT-1:4 — Conversation Validation",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  dialogueExecution: false,
  llmIntegration: false,
  promptExecution: false,
  workflowOrchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
  executionLogic: false,
} as const);
