/**
 * EIL-6:6 — Integration Observability Platform.
 *
 * Canonical immutable Platform metadata package for Integration Observability.
 * Consumes only the EIL-6:5 Integration Observability Manifest aggregate.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by EIL-6:6.
 */

import {
  IntegrationObservabilityManifest,
  IntegrationObservabilityManifestCanonicalId,
  IntegrationObservabilityManifestIdentity,
} from "./integrationObservabilityManifest.ts";
import { IntegrationObservabilityPlatformCapabilities } from "./integrationObservabilityPlatformCapabilities.ts";
import { IntegrationObservabilityPlatformCompatibility } from "./integrationObservabilityPlatformCompatibility.ts";
import { IntegrationObservabilityPlatformComposition } from "./integrationObservabilityPlatformComposition.ts";
import { IntegrationObservabilityPlatformDependencies } from "./integrationObservabilityPlatformDependencies.ts";
import {
  IntegrationObservabilityPlatformCanonicalId,
  IntegrationObservabilityPlatformIdentity,
  IntegrationObservabilityPlatformName,
  IntegrationObservabilityPlatformNamespace,
  IntegrationObservabilityPlatformPhaseId,
  IntegrationObservabilityPlatformReadinessValue,
  IntegrationObservabilityPlatformStatusValue,
  IntegrationObservabilityPlatformVersion,
} from "./integrationObservabilityPlatformIdentity.ts";
import { IntegrationObservabilityPlatformReadiness } from "./integrationObservabilityPlatformReadiness.ts";

export {
  IntegrationObservabilityPlatformCanonicalId,
  IntegrationObservabilityPlatformIdentity,
  IntegrationObservabilityPlatformName,
  IntegrationObservabilityPlatformNamespace,
  IntegrationObservabilityPlatformPhaseId,
  IntegrationObservabilityPlatformReadinessValue,
  IntegrationObservabilityPlatformStatusValue,
  IntegrationObservabilityPlatformVersion,
};

/**
 * Inventory references derived exclusively from Manifest
 * (which itself derives them from Validation) — never redefined.
 */
const manifestDerivedInventory = Object.freeze({
  inventoryId: "EIL-6:6/ManifestDerivedInventory" as const,
  sourceManifestId: IntegrationObservabilityManifestCanonicalId,
  validationDerivedInventory:
    IntegrationObservabilityManifest.validationDerivedInventory,
  validationCategories:
    IntegrationObservabilityManifest.validationDerivedInventory
      .validationCategories,
  validationRules:
    IntegrationObservabilityManifest.validationDerivedInventory.validationRules,
  validationGates:
    IntegrationObservabilityManifest.validationDerivedInventory.validationGates,
  validationInventory:
    IntegrationObservabilityManifest.validationDerivedInventory
      .validationInventory,
  categoryCount:
    IntegrationObservabilityManifest.validationDerivedInventory.categoryCount,
  ruleCount:
    IntegrationObservabilityManifest.validationDerivedInventory.ruleCount,
  gateCount:
    IntegrationObservabilityManifest.validationDerivedInventory.gateCount,
  totalValidationInventory:
    IntegrationObservabilityManifest.validationDerivedInventory
      .totalValidationInventory,
  validationAggregateResult:
    IntegrationObservabilityManifest.validationDerivedInventory
      .validationAggregateResult,
  validationReadiness:
    IntegrationObservabilityManifest.validationDerivedInventory
      .validationReadiness,
  countsDerivedFromManifest: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable Integration Observability Platform aggregate.
 */
export const IntegrationObservabilityPlatform = Object.freeze({
  identity: IntegrationObservabilityPlatformIdentity,
  composition: IntegrationObservabilityPlatformComposition,
  capabilities: IntegrationObservabilityPlatformCapabilities,
  compatibility: IntegrationObservabilityPlatformCompatibility,
  dependencies: IntegrationObservabilityPlatformDependencies,
  readiness: IntegrationObservabilityPlatformReadiness,
  readinessValue: IntegrationObservabilityPlatformReadinessValue,
  manifestReference: Object.freeze({
    canonicalId: IntegrationObservabilityManifestCanonicalId,
    identity: IntegrationObservabilityManifestIdentity,
    aggregate: IntegrationObservabilityManifest,
    entryPoint: "integrationObservabilityManifest.ts" as const,
    exclusive: true as const,
  }),
  manifestDerivedInventory,
  status: IntegrationObservabilityPlatformStatusValue,
  nextPhase: "EIL-6:7 — Integration Observability Certification",
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
