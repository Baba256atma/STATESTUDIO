/**
 * EIL-9:5 — Executive Integration Layer Manifest.
 *
 * Canonical immutable architectural publication for Executive Integration Layer.
 * Consumes only the EIL-9:4 Executive Integration Layer Validation aggregate.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by EIL-9:5.
 */

import {
  ExecutiveIntegrationLayerValidation,
  ExecutiveIntegrationLayerValidationCanonicalId,
  ExecutiveIntegrationLayerValidationIdentity,
} from "./executiveIntegrationLayerValidation.ts";
import { ExecutiveIntegrationLayerManifestCompatibility } from "./executiveIntegrationLayerManifestCompatibility.ts";
import { ExecutiveIntegrationLayerManifestDependencies } from "./executiveIntegrationLayerManifestDependencies.ts";
import { ExecutiveIntegrationLayerManifestExports } from "./executiveIntegrationLayerManifestExports.ts";
import { ExecutiveIntegrationLayerManifestGuarantees } from "./executiveIntegrationLayerManifestGuarantees.ts";
import {
  ExecutiveIntegrationLayerManifestCanonicalId,
  ExecutiveIntegrationLayerManifestIdentity,
  ExecutiveIntegrationLayerManifestName,
  ExecutiveIntegrationLayerManifestNamespace,
  ExecutiveIntegrationLayerManifestPhaseId,
  ExecutiveIntegrationLayerManifestReadinessValue,
  ExecutiveIntegrationLayerManifestStatusValue,
  ExecutiveIntegrationLayerManifestVersion,
} from "./executiveIntegrationLayerManifestIdentity.ts";
import { ExecutiveIntegrationLayerManifestReadiness } from "./executiveIntegrationLayerManifestReadiness.ts";

export {
  ExecutiveIntegrationLayerManifestCanonicalId,
  ExecutiveIntegrationLayerManifestIdentity,
  ExecutiveIntegrationLayerManifestName,
  ExecutiveIntegrationLayerManifestNamespace,
  ExecutiveIntegrationLayerManifestPhaseId,
  ExecutiveIntegrationLayerManifestReadinessValue,
  ExecutiveIntegrationLayerManifestStatusValue,
  ExecutiveIntegrationLayerManifestVersion,
};

/**
 * Inventory references derived exclusively from Validation — never redefined.
 */
const validationDerivedInventory = Object.freeze({
  inventoryId: "EIL-9:5/ValidationDerivedInventory" as const,
  sourceValidationId: ExecutiveIntegrationLayerValidationCanonicalId,
  validationCategories: ExecutiveIntegrationLayerValidation.categories,
  validationRules: ExecutiveIntegrationLayerValidation.rules,
  validationGates: ExecutiveIntegrationLayerValidation.gates,
  validationInventory: ExecutiveIntegrationLayerValidation.inventory,
  categoryCount: ExecutiveIntegrationLayerValidation.categories.length,
  ruleCount: ExecutiveIntegrationLayerValidation.rules.length,
  gateCount: ExecutiveIntegrationLayerValidation.gates.length,
  totalValidationInventory:
    ExecutiveIntegrationLayerValidation.inventory.totalValidationInventory,
  validationAggregateResult: ExecutiveIntegrationLayerValidation.aggregateResult,
  validationReadiness: ExecutiveIntegrationLayerValidation.readiness,
  countsDerivedFromValidation: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable Executive Integration Layer Manifest aggregate.
 */
export const ExecutiveIntegrationLayerManifest = Object.freeze({
  identity: ExecutiveIntegrationLayerManifestIdentity,
  guarantees: ExecutiveIntegrationLayerManifestGuarantees,
  compatibility: ExecutiveIntegrationLayerManifestCompatibility,
  dependencies: ExecutiveIntegrationLayerManifestDependencies,
  exports: ExecutiveIntegrationLayerManifestExports,
  readiness: ExecutiveIntegrationLayerManifestReadiness,
  readinessValue: ExecutiveIntegrationLayerManifestReadinessValue,
  validationReference: Object.freeze({
    canonicalId: ExecutiveIntegrationLayerValidationCanonicalId,
    identity: ExecutiveIntegrationLayerValidationIdentity,
    aggregate: ExecutiveIntegrationLayerValidation,
    entryPoint: "executiveIntegrationLayerValidation.ts" as const,
    exclusive: true as const,
  }),
  validationDerivedInventory,
  status: ExecutiveIntegrationLayerManifestStatusValue,
  nextPhase: "EIL-9:6 — Executive Integration Layer Platform",
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
  runtimeValidation: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil9Phases: false as const,
  previousEilPlatformDependency: false as const,
  immutable: true as const,
  deterministic: true as const,
});
