/** ASSISTANT-8:3 — Canonical Executive Action Execution Model aggregate. */
import { ExecutionDomainModels } from "./executionDomainModels.ts";
import { ExecutionModelCatalog } from "./executionModelCatalog.ts";
import {
  ExecutionModelStructuralMetadata,
  ExecutiveActionExecutionModelIdentity,
} from "./executionModelMetadata.ts";
import { ExecutionRelationships } from "./executionRelationships.ts";
import { ExecutiveActionExecutionRegistry } from "./executiveActionExecutionRegistry.ts";

export const ExecutiveActionExecutionModel = Object.freeze({
  identity: ExecutiveActionExecutionModelIdentity,
  registry: ExecutiveActionExecutionRegistry,
  metadata: ExecutionModelStructuralMetadata,
  domainModels: ExecutionDomainModels,
  relationships: ExecutionRelationships,
  catalog: ExecutionModelCatalog,
  lifecycle: ExecutiveActionExecutionRegistry.lifecycle,
  executionStates: ExecutiveActionExecutionRegistry.executionStates,
  attributes: ExecutionModelStructuralMetadata.attributes,
  categories: ExecutionModelStructuralMetadata.categories,
  statistics: Object.freeze({
    domainModelCount: ExecutionDomainModels.length,
    relationshipCount: ExecutionRelationships.length,
    attributeCount: ExecutionModelStructuralMetadata.attributes.length,
    categoryCount: ExecutionModelStructuralMetadata.categories.length,
    progressMeasurementCount: ExecutionModelCatalog.progress.length,
    healthLevelCount: ExecutionModelCatalog.health.length,
    exceptionClassificationCount: ExecutionModelCatalog.exceptions.length,
    feedbackOriginCount: ExecutionModelCatalog.feedback.length,
    priorityCount: ExecutionModelCatalog.priorities.length,
    timelineEventCount: ExecutionModelCatalog.timeline.length,
    lifecycleCount: ExecutiveActionExecutionRegistry.lifecycle.length,
    metadataFieldCount:
      ExecutionModelStructuralMetadata.metadataFields.length,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-8:2 Executive Action Execution Registry",
  ]),
  publicApiSurface: Object.freeze([
    "ExecutiveActionExecutionModel",
  ]),
  status: "Model",
  stage: "ReadyForValidation",
  readiness: "ReadyForValidation",
  nextPhase: "ASSISTANT-8:4 — Executive Action Execution Validation",
  canonical: true,
  mutable: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  executionEngine: false,
  workflowRuntime: false,
  scheduler: false,
  monitoringServices: false,
  automation: false,
  persistence: false,
  orchestration: false,
  apis: false,
  aiReasoning: false,
  ui: false,
} as const);
