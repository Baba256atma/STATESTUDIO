/** ASSISTANT-3:3 — Canonical Intent & Dialogue Understanding Model aggregate. */
import { AssistantIntentDialogueRegistry } from "./assistantIntentDialogueRegistry.ts";
import { AssistantIntentDialogueModelConstants } from "./assistantIntentDialogueModel.constants.ts";
import { AssistantIntentDialogueModelIdentity } from "./assistantIntentDialogueModel.identity.ts";
import { AssistantIntentDialogueModelLifecycle } from "./assistantIntentDialogueModel.lifecycle.ts";
import {
  AssistantIntentDialogueDomainModels,
  AssistantIntentDialogueModelStructuralMetadata,
} from "./assistantIntentDialogueModel.metadata.ts";
import { AssistantIntentDialogueModelRelationships } from "./assistantIntentDialogueModel.relationships.ts";

export const AssistantIntentDialogueModel = Object.freeze({
  identity: AssistantIntentDialogueModelIdentity,
  registry: AssistantIntentDialogueRegistry,
  constants: AssistantIntentDialogueModelConstants,
  domainModels: AssistantIntentDialogueDomainModels,
  relationships: AssistantIntentDialogueModelRelationships,
  lifecycle: AssistantIntentDialogueModelLifecycle,
  structuralMetadata: AssistantIntentDialogueModelStructuralMetadata,
  statistics: Object.freeze({
    domainModelCount: AssistantIntentDialogueModelConstants.domainModelCount,
    relationshipCount: AssistantIntentDialogueModelConstants.relationshipCount,
    lifecycleCount: AssistantIntentDialogueModelConstants.lifecycleCount,
    metadataCount:
      AssistantIntentDialogueModelStructuralMetadata.statistics.metadataCount,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-3:2 Intent & Dialogue Understanding Registry",
  ]),
  publicApiSurface: Object.freeze(["AssistantIntentDialogueModel"]),
  status: "Model",
  readiness: "ReadyForValidation",
  nextPhase: "ASSISTANT-3:4 — Intent & Dialogue Understanding Validation",
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
  orchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
  executionLogic: false,
} as const);
