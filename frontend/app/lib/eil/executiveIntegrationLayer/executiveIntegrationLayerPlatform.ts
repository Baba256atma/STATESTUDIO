/**
 * EIL-9:6 — Executive Integration Layer Platform.
 *
 * Canonical immutable Platform metadata package for Executive Integration Layer.
 * Consumes only the EIL-9:5 Executive Integration Layer Manifest aggregate.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by EIL-9:6.
 */

import {
  ExecutiveIntegrationLayerManifest,
  ExecutiveIntegrationLayerManifestCanonicalId,
  ExecutiveIntegrationLayerManifestIdentity,
  ExecutiveIntegrationLayerManifestReadinessValue,
} from "./executiveIntegrationLayerManifest.ts";
import { ExecutiveIntegrationLayerPlatformCapabilities } from "./executiveIntegrationLayerPlatformCapabilities.ts";
import { ExecutiveIntegrationLayerPlatformCompatibility } from "./executiveIntegrationLayerPlatformCompatibility.ts";
import { ExecutiveIntegrationLayerPlatformComposition } from "./executiveIntegrationLayerPlatformComposition.ts";
import { ExecutiveIntegrationLayerPlatformDependencies } from "./executiveIntegrationLayerPlatformDependencies.ts";
import {
  ExecutiveIntegrationLayerPlatformCanonicalId,
  ExecutiveIntegrationLayerPlatformIdentity,
  ExecutiveIntegrationLayerPlatformName,
  ExecutiveIntegrationLayerPlatformNamespace,
  ExecutiveIntegrationLayerPlatformPhaseId,
  ExecutiveIntegrationLayerPlatformReadinessValue,
  ExecutiveIntegrationLayerPlatformStatusValue,
  ExecutiveIntegrationLayerPlatformVersion,
} from "./executiveIntegrationLayerPlatformIdentity.ts";
import { ExecutiveIntegrationLayerPlatformReadiness } from "./executiveIntegrationLayerPlatformReadiness.ts";

export {
  ExecutiveIntegrationLayerPlatformCanonicalId,
  ExecutiveIntegrationLayerPlatformIdentity,
  ExecutiveIntegrationLayerPlatformName,
  ExecutiveIntegrationLayerPlatformNamespace,
  ExecutiveIntegrationLayerPlatformPhaseId,
  ExecutiveIntegrationLayerPlatformReadinessValue,
  ExecutiveIntegrationLayerPlatformStatusValue,
  ExecutiveIntegrationLayerPlatformVersion,
};

/**
 * Inventory references derived exclusively from Manifest
 * (which itself derives them from Validation) — never redefined.
 */
const manifestDerivedInventory = Object.freeze({
  inventoryId: "EIL-9:6/ManifestDerivedInventory" as const,
  sourceManifestId: ExecutiveIntegrationLayerManifestCanonicalId,
  validationDerivedInventory:
    ExecutiveIntegrationLayerManifest.validationDerivedInventory,
  validationCategories:
    ExecutiveIntegrationLayerManifest.validationDerivedInventory
      .validationCategories,
  validationRules:
    ExecutiveIntegrationLayerManifest.validationDerivedInventory
      .validationRules,
  validationGates:
    ExecutiveIntegrationLayerManifest.validationDerivedInventory
      .validationGates,
  validationInventory:
    ExecutiveIntegrationLayerManifest.validationDerivedInventory
      .validationInventory,
  categoryCount:
    ExecutiveIntegrationLayerManifest.validationDerivedInventory.categoryCount,
  ruleCount:
    ExecutiveIntegrationLayerManifest.validationDerivedInventory.ruleCount,
  gateCount:
    ExecutiveIntegrationLayerManifest.validationDerivedInventory.gateCount,
  totalValidationInventory:
    ExecutiveIntegrationLayerManifest.validationDerivedInventory
      .totalValidationInventory,
  validationAggregateResult:
    ExecutiveIntegrationLayerManifest.validationDerivedInventory
      .validationAggregateResult,
  validationReadiness:
    ExecutiveIntegrationLayerManifest.validationDerivedInventory
      .validationReadiness,
  manifestReadiness: ExecutiveIntegrationLayerManifestReadinessValue,
  countsDerivedFromManifest: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable Executive Integration Layer Platform aggregate.
 */
export const ExecutiveIntegrationLayerPlatform = Object.freeze({
  identity: ExecutiveIntegrationLayerPlatformIdentity,
  composition: ExecutiveIntegrationLayerPlatformComposition,
  capabilities: ExecutiveIntegrationLayerPlatformCapabilities,
  compatibility: ExecutiveIntegrationLayerPlatformCompatibility,
  dependencies: ExecutiveIntegrationLayerPlatformDependencies,
  readiness: ExecutiveIntegrationLayerPlatformReadiness,
  readinessValue: ExecutiveIntegrationLayerPlatformReadinessValue,
  manifestReference: Object.freeze({
    canonicalId: ExecutiveIntegrationLayerManifestCanonicalId,
    identity: ExecutiveIntegrationLayerManifestIdentity,
    aggregate: ExecutiveIntegrationLayerManifest,
    entryPoint: "executiveIntegrationLayerManifest.ts" as const,
    exclusive: true as const,
  }),
  manifestDerivedInventory,
  status: ExecutiveIntegrationLayerPlatformStatusValue,
  nextPhase: "EIL-9:7 — Executive Integration Layer Certification",
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
  importsLaterEil9Phases: false as const,
  previousEilPlatformDependency: false as const,
  immutable: true as const,
  deterministic: true as const,
});
