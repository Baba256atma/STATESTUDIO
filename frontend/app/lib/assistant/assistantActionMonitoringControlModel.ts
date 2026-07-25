/** ASSISTANT-9:3 — Canonical Executive Action Monitoring & Control Model. */
import {
  AssistantActionMonitoringControlModelIdentity,
  AssistantActionMonitoringControlModelStructuralMetadata,
} from "./assistantActionMonitoringControlModelMetadata.ts";
import { AssistantActionMonitoringControlModelPublic } from "./assistantActionMonitoringControlModelPublic.ts";
import { AssistantActionMonitoringControlDomainModels } from "./assistantActionMonitoringControlModels.ts";
import { AssistantActionMonitoringControlRelationships } from "./assistantActionMonitoringControlRelationships.ts";
import { AssistantActionMonitoringControlStateModels } from "./assistantActionMonitoringControlStateModels.ts";
import { AssistantActionMonitoringControlRegistry } from "./assistantActionMonitoringControlRegistry.ts";

export const AssistantActionMonitoringControlModel = Object.freeze({
  identity: AssistantActionMonitoringControlModelIdentity,
  registry: AssistantActionMonitoringControlRegistry,
  metadata: AssistantActionMonitoringControlModelStructuralMetadata,
  domainModels: AssistantActionMonitoringControlDomainModels,
  relationships: AssistantActionMonitoringControlRelationships,
  stateModels: AssistantActionMonitoringControlStateModels,
  publicSurface: AssistantActionMonitoringControlModelPublic,
  statistics: Object.freeze({
    domainModelCount: AssistantActionMonitoringControlDomainModels.length,
    relationshipCount: AssistantActionMonitoringControlRelationships.length,
    stateModelCount: AssistantActionMonitoringControlStateModels.length,
    responsibilityCount:
      AssistantActionMonitoringControlModelStructuralMetadata
        .responsibilities.length,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-9:2 Executive Action Monitoring & Control Registry",
  ]),
  publicApiSurface: Object.freeze([
    "AssistantActionMonitoringControlModel",
  ]),
  status: "Model",
  stage: "ReadyForValidation",
  readiness: "ReadyForValidation",
  nextPhase:
    "ASSISTANT-9:4 — Executive Action Monitoring & Control Validation",
  canonical: true,
  mutable: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  monitoringRuntime: false,
  controlRuntime: false,
  kpiEvaluation: false,
  kpiCalculations: false,
  alertExecution: false,
  dashboards: false,
  notifications: false,
  scheduler: false,
  retryLogic: false,
  workflowExecution: false,
  automation: false,
  aiReasoning: false,
  services: false,
  factories: false,
  apis: false,
  databases: false,
  eventBus: false,
  persistence: false,
  rendering: false,
  ui: false,
  backgroundWorkers: false,
} as const);
