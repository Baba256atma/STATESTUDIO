/** ASSISTANT-5:3 — Canonical Workspace Orchestration Model aggregate. */
import { AssistantWorkspaceOrchestrationRegistry } from "./assistantWorkspaceOrchestrationRegistry.ts";
import { AssistantWorkspaceOrchestrationModelConstants } from "./assistantWorkspaceOrchestrationModel.constants.ts";
import { AssistantWorkspaceOrchestrationModelIdentity } from "./assistantWorkspaceOrchestrationModel.identity.ts";
import { AssistantWorkspaceOrchestrationModelLifecycle } from "./assistantWorkspaceOrchestrationModel.lifecycle.ts";
import {
  AssistantWorkspaceOrchestrationDomainModels,
  AssistantWorkspaceOrchestrationModelStructuralMetadata,
} from "./assistantWorkspaceOrchestrationModel.metadata.ts";
import { AssistantWorkspaceOrchestrationModelRelationships } from "./assistantWorkspaceOrchestrationModel.relationships.ts";

export const AssistantWorkspaceOrchestrationModel = Object.freeze({
  identity: AssistantWorkspaceOrchestrationModelIdentity,
  registry: AssistantWorkspaceOrchestrationRegistry,
  constants: AssistantWorkspaceOrchestrationModelConstants,
  domainModels: AssistantWorkspaceOrchestrationDomainModels,
  relationships: AssistantWorkspaceOrchestrationModelRelationships,
  lifecycle: AssistantWorkspaceOrchestrationModelLifecycle,
  structuralMetadata: AssistantWorkspaceOrchestrationModelStructuralMetadata,
  statistics: Object.freeze({
    domainModelCount:
      AssistantWorkspaceOrchestrationModelConstants.domainModelCount,
    relationshipCount:
      AssistantWorkspaceOrchestrationModelConstants.relationshipCount,
    lifecycleCount:
      AssistantWorkspaceOrchestrationModelConstants.lifecycleCount,
    metadataCount:
      AssistantWorkspaceOrchestrationModelStructuralMetadata.statistics
        .metadataCount,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-5:2 Workspace Orchestration Registry",
  ]),
  publicApiSurface: Object.freeze(["AssistantWorkspaceOrchestrationModel"]),
  status: "Model",
  readiness: "ReadyForValidation",
  nextPhase: "ASSISTANT-5:4 — Workspace Orchestration Validation",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  workspaceExecution: false,
  workspaceRouting: false,
  workspaceSwitching: false,
  orchestrationEngine: false,
  scheduling: false,
  llmIntegration: false,
  promptExecution: false,
  orchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
  executionLogic: false,
} as const);
