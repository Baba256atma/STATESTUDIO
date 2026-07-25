/** ASSISTANT-7:3 — Canonical Executive Action Planning Model aggregate. */
import { AssistantExecutiveActionPlanningRegistry } from "./assistantExecutiveActionPlanningRegistry.ts";
import { AssistantExecutiveActionPlanningModelConstants } from "./assistantExecutiveActionPlanningModel.constants.ts";
import { AssistantExecutiveActionPlanningModelIdentity } from "./assistantExecutiveActionPlanningModel.identity.ts";
import { AssistantExecutiveActionPlanningModelLifecycle } from "./assistantExecutiveActionPlanningModel.lifecycle.ts";
import {
  AssistantExecutiveActionPlanningDomainModels,
  AssistantExecutiveActionPlanningModelStructuralMetadata,
} from "./assistantExecutiveActionPlanningModel.metadata.ts";
import { AssistantExecutiveActionPlanningModelRelationships } from "./assistantExecutiveActionPlanningModel.relationships.ts";

export const AssistantExecutiveActionPlanningModel = Object.freeze({
  identity: AssistantExecutiveActionPlanningModelIdentity,
  registry: AssistantExecutiveActionPlanningRegistry,
  constants: AssistantExecutiveActionPlanningModelConstants,
  domainModels: AssistantExecutiveActionPlanningDomainModels,
  relationships: AssistantExecutiveActionPlanningModelRelationships,
  lifecycle: AssistantExecutiveActionPlanningModelLifecycle,
  structuralMetadata:
    AssistantExecutiveActionPlanningModelStructuralMetadata,
  statistics: Object.freeze({
    domainModelCount:
      AssistantExecutiveActionPlanningModelConstants.domainModelCount,
    relationshipCount:
      AssistantExecutiveActionPlanningModelConstants.relationshipCount,
    lifecycleCount:
      AssistantExecutiveActionPlanningModelConstants.lifecycleCount,
    metadataCount:
      AssistantExecutiveActionPlanningModelStructuralMetadata.statistics
        .metadataCount,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-7:2 Executive Action Planning Registry",
  ]),
  publicApiSurface: Object.freeze([
    "AssistantExecutiveActionPlanningModel",
  ]),
  status: "Model",
  readiness: "ReadyForValidation",
  nextPhase: "ASSISTANT-7:4 — Executive Action Planning Validation",
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
  objectMutation: false,
  objectPersistence: false,
  contextPersistence: false,
  llmIntegration: false,
  promptExecution: false,
  orchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
  executionLogic: false,
} as const);
