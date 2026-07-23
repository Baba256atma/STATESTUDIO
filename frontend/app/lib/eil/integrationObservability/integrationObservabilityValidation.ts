/**
 * EIL-6:4 — Integration Observability Validation.
 *
 * Canonical immutable validation architecture for Integration Observability.
 * Consumes only the EIL-6:3 Integration Observability Model aggregate.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by EIL-6:4.
 */

import {
  IntegrationObservabilityModel,
  IntegrationObservabilityModelCanonicalId,
  IntegrationObservabilityModelIdentity,
} from "./integrationObservabilityModel.ts";
import { IntegrationObservabilityValidationCategories } from "./integrationObservabilityValidationCategories.ts";
import { IntegrationObservabilityValidationGates } from "./integrationObservabilityValidationGates.ts";
import { IntegrationObservabilityValidationInventory } from "./integrationObservabilityValidationInventory.ts";
import {
  IntegrationObservabilityValidationCanonicalId,
  IntegrationObservabilityValidationIdentity,
  IntegrationObservabilityValidationName,
  IntegrationObservabilityValidationNamespace,
  IntegrationObservabilityValidationPhaseId,
  IntegrationObservabilityValidationReadiness,
  IntegrationObservabilityValidationReport,
  IntegrationObservabilityValidationStatusValue,
  IntegrationObservabilityValidationVersion,
} from "./integrationObservabilityValidationReport.ts";
import {
  IntegrationObservabilityValidationAggregateResult,
  IntegrationObservabilityValidationResults,
  IntegrationObservabilityValidationResultValues,
} from "./integrationObservabilityValidationResults.ts";
import { IntegrationObservabilityValidationRules } from "./integrationObservabilityValidationRules.ts";

export {
  IntegrationObservabilityValidationCanonicalId,
  IntegrationObservabilityValidationIdentity,
  IntegrationObservabilityValidationName,
  IntegrationObservabilityValidationNamespace,
  IntegrationObservabilityValidationPhaseId,
  IntegrationObservabilityValidationReadiness,
  IntegrationObservabilityValidationReport,
  IntegrationObservabilityValidationStatusValue,
  IntegrationObservabilityValidationVersion,
};

const dependency = Object.freeze({
  dependencyId: "EIL-6:4/Dependency/EIL63Model",
  upstreamPhase: "EIL-6:3" as const,
  upstreamCanonicalId: IntegrationObservabilityModelCanonicalId,
  modelOnly: true as const,
  modelPublicSurfaceOnly: true as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil6PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  directPreviousPhaseModule: "integrationObservabilityModel.ts" as const,
  canonicalPath:
    "EIL-6:4 → EIL-6:3 IntegrationObservabilityModel (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Integration Observability Validation aggregate.
 */
export const IntegrationObservabilityValidation = Object.freeze({
  identity: IntegrationObservabilityValidationIdentity,
  categories: IntegrationObservabilityValidationCategories,
  rules: IntegrationObservabilityValidationRules,
  gates: IntegrationObservabilityValidationGates,
  results: IntegrationObservabilityValidationResults,
  resultValues: IntegrationObservabilityValidationResultValues,
  inventory: IntegrationObservabilityValidationInventory,
  report: IntegrationObservabilityValidationReport,
  aggregateResult: IntegrationObservabilityValidationAggregateResult,
  readiness: IntegrationObservabilityValidationReadiness,
  dependency,
  modelIdentity: IntegrationObservabilityModelIdentity,
  model: IntegrationObservabilityModel,
  status: IntegrationObservabilityValidationStatusValue,
  nextPhase: "EIL-6:5 — Integration Observability Manifest",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeValidation: false as const,
  validationEngine: false as const,
  monitoringEngine: false as const,
  telemetryPipeline: false as const,
  openTelemetry: false as const,
  prometheus: false as const,
  grafana: false as const,
  loggingFramework: false as const,
  tracingRuntime: false as const,
  metricsCollector: false as const,
  metricEvaluation: false as const,
  alertEngine: false as const,
  healthCheckRuntime: false as const,
  dashboard: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  serviceBehavior: false as const,
  schedulingBehavior: false as const,
  queueBehavior: false as const,
  aiBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil6Phases: false as const,
  previousEilPlatformDependency: false as const,
  immutable: true as const,
  deterministic: true as const,
});
