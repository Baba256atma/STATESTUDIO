/**
 * EIL-8:6 — Executive Integration Suite Platform.
 *
 * Canonical immutable Platform metadata package for Executive Integration Suite.
 * Consumes only the EIL-8:5 Executive Integration Suite Manifest aggregate.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by EIL-8:6.
 */

import {
  ExecutiveIntegrationSuiteManifest,
  ExecutiveIntegrationSuiteManifestCanonicalId,
  ExecutiveIntegrationSuiteManifestIdentity,
} from "./executiveIntegrationSuiteManifest.ts";
import { ExecutiveIntegrationSuitePlatformCapabilities } from "./executiveIntegrationSuitePlatformCapabilities.ts";
import { ExecutiveIntegrationSuitePlatformCompatibility } from "./executiveIntegrationSuitePlatformCompatibility.ts";
import { ExecutiveIntegrationSuitePlatformComposition } from "./executiveIntegrationSuitePlatformComposition.ts";
import { ExecutiveIntegrationSuitePlatformDependencies } from "./executiveIntegrationSuitePlatformDependencies.ts";
import {
  ExecutiveIntegrationSuitePlatformCanonicalId,
  ExecutiveIntegrationSuitePlatformIdentity,
  ExecutiveIntegrationSuitePlatformName,
  ExecutiveIntegrationSuitePlatformNamespace,
  ExecutiveIntegrationSuitePlatformPhaseId,
  ExecutiveIntegrationSuitePlatformReadinessValue,
  ExecutiveIntegrationSuitePlatformStatusValue,
  ExecutiveIntegrationSuitePlatformVersion,
} from "./executiveIntegrationSuitePlatformIdentity.ts";
import { ExecutiveIntegrationSuitePlatformReadiness } from "./executiveIntegrationSuitePlatformReadiness.ts";

export {
  ExecutiveIntegrationSuitePlatformCanonicalId,
  ExecutiveIntegrationSuitePlatformIdentity,
  ExecutiveIntegrationSuitePlatformName,
  ExecutiveIntegrationSuitePlatformNamespace,
  ExecutiveIntegrationSuitePlatformPhaseId,
  ExecutiveIntegrationSuitePlatformReadinessValue,
  ExecutiveIntegrationSuitePlatformStatusValue,
  ExecutiveIntegrationSuitePlatformVersion,
};

/**
 * Inventory references derived exclusively from Manifest
 * (which itself derives them from Validation) — never redefined.
 */
const manifestDerivedInventory = Object.freeze({
  inventoryId: "EIL-8:6/ManifestDerivedInventory" as const,
  sourceManifestId: ExecutiveIntegrationSuiteManifestCanonicalId,
  validationDerivedInventory:
    ExecutiveIntegrationSuiteManifest.validationDerivedInventory,
  validationCategories:
    ExecutiveIntegrationSuiteManifest.validationDerivedInventory
      .validationCategories,
  validationRules:
    ExecutiveIntegrationSuiteManifest.validationDerivedInventory
      .validationRules,
  validationGates:
    ExecutiveIntegrationSuiteManifest.validationDerivedInventory
      .validationGates,
  validationInventory:
    ExecutiveIntegrationSuiteManifest.validationDerivedInventory
      .validationInventory,
  categoryCount:
    ExecutiveIntegrationSuiteManifest.validationDerivedInventory.categoryCount,
  ruleCount:
    ExecutiveIntegrationSuiteManifest.validationDerivedInventory.ruleCount,
  gateCount:
    ExecutiveIntegrationSuiteManifest.validationDerivedInventory.gateCount,
  totalValidationInventory:
    ExecutiveIntegrationSuiteManifest.validationDerivedInventory
      .totalValidationInventory,
  validationAggregateResult:
    ExecutiveIntegrationSuiteManifest.validationDerivedInventory
      .validationAggregateResult,
  validationReadiness:
    ExecutiveIntegrationSuiteManifest.validationDerivedInventory
      .validationReadiness,
  countsDerivedFromManifest: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable Executive Integration Suite Platform aggregate.
 */
export const ExecutiveIntegrationSuitePlatform = Object.freeze({
  identity: ExecutiveIntegrationSuitePlatformIdentity,
  composition: ExecutiveIntegrationSuitePlatformComposition,
  capabilities: ExecutiveIntegrationSuitePlatformCapabilities,
  compatibility: ExecutiveIntegrationSuitePlatformCompatibility,
  dependencies: ExecutiveIntegrationSuitePlatformDependencies,
  readiness: ExecutiveIntegrationSuitePlatformReadiness,
  readinessValue: ExecutiveIntegrationSuitePlatformReadinessValue,
  manifestReference: Object.freeze({
    canonicalId: ExecutiveIntegrationSuiteManifestCanonicalId,
    identity: ExecutiveIntegrationSuiteManifestIdentity,
    aggregate: ExecutiveIntegrationSuiteManifest,
    entryPoint: "executiveIntegrationSuiteManifest.ts" as const,
    exclusive: true as const,
  }),
  manifestDerivedInventory,
  status: ExecutiveIntegrationSuitePlatformStatusValue,
  nextPhase: "EIL-8:7 — Executive Integration Suite Certification",
  compositionOnly: true as const,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  integrationRuntime: false as const,
  orchestration: false as const,
  routing: false as const,
  governance: false as const,
  observability: false as const,
  validationEngine: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  apiBehavior: false as const,
  serviceBehavior: false as const,
  workerBehavior: false as const,
  schedulingBehavior: false as const,
  dashboard: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil8Phases: false as const,
  previousEilPlatformDependency: false as const,
  immutable: true as const,
  deterministic: true as const,
});
