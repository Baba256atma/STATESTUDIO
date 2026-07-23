/**
 * EIL-6:5 — Integration Observability Manifest.
 *
 * Canonical immutable architectural publication for Integration Observability.
 * Consumes only the EIL-6:4 Integration Observability Validation aggregate.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by EIL-6:5.
 */

import {
  IntegrationObservabilityValidation,
  IntegrationObservabilityValidationCanonicalId,
  IntegrationObservabilityValidationIdentity,
} from "./integrationObservabilityValidation.ts";
import { IntegrationObservabilityManifestCompatibility } from "./integrationObservabilityManifestCompatibility.ts";
import { IntegrationObservabilityManifestDependencies } from "./integrationObservabilityManifestDependencies.ts";
import { IntegrationObservabilityManifestExports } from "./integrationObservabilityManifestExports.ts";
import { IntegrationObservabilityManifestGuarantees } from "./integrationObservabilityManifestGuarantees.ts";
import {
  IntegrationObservabilityManifestCanonicalId,
  IntegrationObservabilityManifestIdentity,
  IntegrationObservabilityManifestName,
  IntegrationObservabilityManifestNamespace,
  IntegrationObservabilityManifestPhaseId,
  IntegrationObservabilityManifestReadinessValue,
  IntegrationObservabilityManifestStatusValue,
  IntegrationObservabilityManifestVersion,
} from "./integrationObservabilityManifestIdentity.ts";
import { IntegrationObservabilityManifestReadiness } from "./integrationObservabilityManifestReadiness.ts";

export {
  IntegrationObservabilityManifestCanonicalId,
  IntegrationObservabilityManifestIdentity,
  IntegrationObservabilityManifestName,
  IntegrationObservabilityManifestNamespace,
  IntegrationObservabilityManifestPhaseId,
  IntegrationObservabilityManifestReadinessValue,
  IntegrationObservabilityManifestStatusValue,
  IntegrationObservabilityManifestVersion,
};

/**
 * Inventory references derived exclusively from Validation — never redefined.
 */
const validationDerivedInventory = Object.freeze({
  inventoryId: "EIL-6:5/ValidationDerivedInventory" as const,
  sourceValidationId: IntegrationObservabilityValidationCanonicalId,
  validationCategories: IntegrationObservabilityValidation.categories,
  validationRules: IntegrationObservabilityValidation.rules,
  validationGates: IntegrationObservabilityValidation.gates,
  validationInventory: IntegrationObservabilityValidation.inventory,
  categoryCount: IntegrationObservabilityValidation.categories.length,
  ruleCount: IntegrationObservabilityValidation.rules.length,
  gateCount: IntegrationObservabilityValidation.gates.length,
  totalValidationInventory:
    IntegrationObservabilityValidation.inventory.totalValidationInventory,
  validationAggregateResult: IntegrationObservabilityValidation.aggregateResult,
  validationReadiness: IntegrationObservabilityValidation.readiness,
  countsDerivedFromValidation: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable Integration Observability Manifest aggregate.
 */
export const IntegrationObservabilityManifest = Object.freeze({
  identity: IntegrationObservabilityManifestIdentity,
  guarantees: IntegrationObservabilityManifestGuarantees,
  compatibility: IntegrationObservabilityManifestCompatibility,
  dependencies: IntegrationObservabilityManifestDependencies,
  exports: IntegrationObservabilityManifestExports,
  readiness: IntegrationObservabilityManifestReadiness,
  readinessValue: IntegrationObservabilityManifestReadinessValue,
  validationReference: Object.freeze({
    canonicalId: IntegrationObservabilityValidationCanonicalId,
    identity: IntegrationObservabilityValidationIdentity,
    aggregate: IntegrationObservabilityValidation,
    entryPoint: "integrationObservabilityValidation.ts" as const,
    exclusive: true as const,
  }),
  validationDerivedInventory,
  status: IntegrationObservabilityManifestStatusValue,
  nextPhase: "EIL-6:6 — Integration Observability Platform",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
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
  runtimeValidation: false as const,
  aiBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil6Phases: false as const,
  previousEilPlatformDependency: false as const,
  immutable: true as const,
  deterministic: true as const,
});
