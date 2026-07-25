/** ASSISTANT-9:4 — Canonical Executive Action Monitoring & Control Validation. */
import { AssistantActionMonitoringControlModel } from "./assistantActionMonitoringControlModel.ts";
import {
  AssistantActionMonitoringControlValidationCategories,
  AssistantActionMonitoringControlValidationIdentity,
  AssistantActionMonitoringControlValidationOutcomeStates,
  AssistantActionMonitoringControlValidationStructuralMetadata,
} from "./assistantActionMonitoringControlValidationMetadata.ts";
import { AssistantActionMonitoringControlValidationPlatform } from "./assistantActionMonitoringControlValidationPlatform.ts";
import { AssistantActionMonitoringControlValidationPublic } from "./assistantActionMonitoringControlValidationPublic.ts";
import { AssistantActionMonitoringControlValidationReport } from "./assistantActionMonitoringControlValidationReport.ts";
import { AssistantActionMonitoringControlValidationResults } from "./assistantActionMonitoringControlValidationResults.ts";
import { AssistantActionMonitoringControlValidationRules } from "./assistantActionMonitoringControlValidationRules.ts";

export const AssistantActionMonitoringControlValidation = Object.freeze({
  identity: AssistantActionMonitoringControlValidationIdentity,
  model: AssistantActionMonitoringControlModel,
  metadata: AssistantActionMonitoringControlValidationStructuralMetadata,
  categories: AssistantActionMonitoringControlValidationCategories,
  rules: AssistantActionMonitoringControlValidationRules,
  results: AssistantActionMonitoringControlValidationResults,
  outcomeStates: AssistantActionMonitoringControlValidationOutcomeStates,
  platform: AssistantActionMonitoringControlValidationPlatform,
  report: AssistantActionMonitoringControlValidationReport,
  publicSurface: AssistantActionMonitoringControlValidationPublic,
  statistics: Object.freeze({
    validationCategoryCount:
      AssistantActionMonitoringControlValidationCategories.length,
    validationRuleCount:
      AssistantActionMonitoringControlValidationRules.length,
    validatedModelKindCount:
      AssistantActionMonitoringControlModel.statistics.domainModelCount,
    validatedRelationshipKindCount:
      AssistantActionMonitoringControlModel.statistics.relationshipCount,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-9:3 Executive Action Monitoring & Control Model",
  ]),
  publicApiSurface: Object.freeze([
    "AssistantActionMonitoringControlValidation",
  ]),
  status: "Validation",
  stage: "ReadyForManifest",
  readiness: "ReadyForManifest",
  nextPhase:
    "ASSISTANT-9:5 — Executive Action Monitoring & Control Manifest",
  canonical: true,
  mutable: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableValidation: false,
  runtime: false,
  monitoringRuntime: false,
  controlRuntime: false,
  kpiCalculations: false,
  alertExecution: false,
  dashboards: false,
  notifications: false,
  retryLogic: false,
  workflowEngines: false,
  automation: false,
  aiReasoning: false,
  services: false,
  factories: false,
  apis: false,
  persistence: false,
  eventProcessing: false,
  rendering: false,
  ui: false,
  backgroundWorkers: false,
} as const);
