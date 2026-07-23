/**
 * EIL-6:7 — Integration Observability Certification.
 *
 * Canonical immutable certification of Integration Observability Platform.
 * Consumes only the EIL-6:6 Integration Observability Platform aggregate.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by EIL-6:7.
 */

import {
  IntegrationObservabilityPlatform,
  IntegrationObservabilityPlatformCanonicalId,
  IntegrationObservabilityPlatformIdentity,
} from "./integrationObservabilityPlatform.ts";
import { IntegrationObservabilityCertificationCriteria } from "./integrationObservabilityCertificationCriteria.ts";
import { IntegrationObservabilityCertificationDependencies } from "./integrationObservabilityCertificationDependencies.ts";
import { IntegrationObservabilityCertificationGates } from "./integrationObservabilityCertificationGates.ts";
import {
  IntegrationObservabilityCertificationCanonicalId,
  IntegrationObservabilityCertificationIdentity,
  IntegrationObservabilityCertificationName,
  IntegrationObservabilityCertificationNamespace,
  IntegrationObservabilityCertificationPhaseId,
  IntegrationObservabilityCertificationReadinessValue,
  IntegrationObservabilityCertificationStatusValue,
  IntegrationObservabilityCertificationVersion,
} from "./integrationObservabilityCertificationIdentity.ts";
import { IntegrationObservabilityCertificationReadiness } from "./integrationObservabilityCertificationReadiness.ts";
import {
  IntegrationObservabilityCertificationAggregateResult,
  IntegrationObservabilityCertificationResults,
  IntegrationObservabilityCertificationResultValues,
} from "./integrationObservabilityCertificationResults.ts";

export {
  IntegrationObservabilityCertificationCanonicalId,
  IntegrationObservabilityCertificationIdentity,
  IntegrationObservabilityCertificationName,
  IntegrationObservabilityCertificationNamespace,
  IntegrationObservabilityCertificationPhaseId,
  IntegrationObservabilityCertificationReadinessValue,
  IntegrationObservabilityCertificationStatusValue,
  IntegrationObservabilityCertificationVersion,
};

/**
 * Inventory references derived exclusively from Platform
 * (Manifest → Validation) — never redefined.
 */
const platformDerivedInventory = Object.freeze({
  inventoryId: "EIL-6:7/PlatformDerivedInventory" as const,
  sourcePlatformId: IntegrationObservabilityPlatformCanonicalId,
  manifestDerivedInventory:
    IntegrationObservabilityPlatform.manifestDerivedInventory,
  validationCategories:
    IntegrationObservabilityPlatform.manifestDerivedInventory
      .validationCategories,
  validationRules:
    IntegrationObservabilityPlatform.manifestDerivedInventory.validationRules,
  validationGates:
    IntegrationObservabilityPlatform.manifestDerivedInventory.validationGates,
  validationInventory:
    IntegrationObservabilityPlatform.manifestDerivedInventory
      .validationInventory,
  categoryCount:
    IntegrationObservabilityPlatform.manifestDerivedInventory.categoryCount,
  ruleCount:
    IntegrationObservabilityPlatform.manifestDerivedInventory.ruleCount,
  gateCount:
    IntegrationObservabilityPlatform.manifestDerivedInventory.gateCount,
  totalValidationInventory:
    IntegrationObservabilityPlatform.manifestDerivedInventory
      .totalValidationInventory,
  validationAggregateResult:
    IntegrationObservabilityPlatform.manifestDerivedInventory
      .validationAggregateResult,
  validationReadiness:
    IntegrationObservabilityPlatform.manifestDerivedInventory
      .validationReadiness,
  countsDerivedFromPlatform: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable Integration Observability Certification aggregate.
 */
export const IntegrationObservabilityCertification = Object.freeze({
  identity: IntegrationObservabilityCertificationIdentity,
  criteria: IntegrationObservabilityCertificationCriteria,
  gates: IntegrationObservabilityCertificationGates,
  results: IntegrationObservabilityCertificationResults,
  resultValues: IntegrationObservabilityCertificationResultValues,
  aggregateResult: IntegrationObservabilityCertificationAggregateResult,
  dependencies: IntegrationObservabilityCertificationDependencies,
  readiness: IntegrationObservabilityCertificationReadiness,
  readinessValue: IntegrationObservabilityCertificationReadinessValue,
  platformReference: Object.freeze({
    canonicalId: IntegrationObservabilityPlatformCanonicalId,
    identity: IntegrationObservabilityPlatformIdentity,
    aggregate: IntegrationObservabilityPlatform,
    entryPoint: "integrationObservabilityPlatform.ts" as const,
    exclusive: true as const,
  }),
  platformDerivedInventory,
  status: IntegrationObservabilityCertificationStatusValue,
  nextPhase: "EIL-6:8 — Integration Observability Freeze",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  certificationEngine: false as const,
  runtimeValidation: false as const,
  monitoringEngine: false as const,
  telemetryPipeline: false as const,
  openTelemetry: false as const,
  prometheus: false as const,
  grafana: false as const,
  loggingFramework: false as const,
  tracingRuntime: false as const,
  metricsCollector: false as const,
  alertEngine: false as const,
  healthEngine: false as const,
  dashboard: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  serviceBehavior: false as const,
  schedulingBehavior: false as const,
  queueBehavior: false as const,
  workerBehavior: false as const,
  apiBehavior: false as const,
  aiBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil6Phases: false as const,
  previousEilPlatformDependency: false as const,
  immutable: true as const,
  deterministic: true as const,
});
