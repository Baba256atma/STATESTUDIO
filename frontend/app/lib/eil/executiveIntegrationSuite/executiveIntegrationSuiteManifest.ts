/**
 * EIL-8:5 — Executive Integration Suite Manifest.
 *
 * Canonical immutable architectural publication for Executive Integration Suite.
 * Consumes only the EIL-8:4 Executive Integration Suite Validation aggregate.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by EIL-8:5.
 */

import {
  ExecutiveIntegrationSuiteValidation,
  ExecutiveIntegrationSuiteValidationCanonicalId,
  ExecutiveIntegrationSuiteValidationIdentity,
} from "./executiveIntegrationSuiteValidation.ts";
import { ExecutiveIntegrationSuiteManifestCompatibility } from "./executiveIntegrationSuiteManifestCompatibility.ts";
import { ExecutiveIntegrationSuiteManifestDependencies } from "./executiveIntegrationSuiteManifestDependencies.ts";
import { ExecutiveIntegrationSuiteManifestExports } from "./executiveIntegrationSuiteManifestExports.ts";
import { ExecutiveIntegrationSuiteManifestGuarantees } from "./executiveIntegrationSuiteManifestGuarantees.ts";
import {
  ExecutiveIntegrationSuiteManifestCanonicalId,
  ExecutiveIntegrationSuiteManifestIdentity,
  ExecutiveIntegrationSuiteManifestName,
  ExecutiveIntegrationSuiteManifestNamespace,
  ExecutiveIntegrationSuiteManifestPhaseId,
  ExecutiveIntegrationSuiteManifestReadinessValue,
  ExecutiveIntegrationSuiteManifestStatusValue,
  ExecutiveIntegrationSuiteManifestVersion,
} from "./executiveIntegrationSuiteManifestIdentity.ts";
import { ExecutiveIntegrationSuiteManifestReadiness } from "./executiveIntegrationSuiteManifestReadiness.ts";

export {
  ExecutiveIntegrationSuiteManifestCanonicalId,
  ExecutiveIntegrationSuiteManifestIdentity,
  ExecutiveIntegrationSuiteManifestName,
  ExecutiveIntegrationSuiteManifestNamespace,
  ExecutiveIntegrationSuiteManifestPhaseId,
  ExecutiveIntegrationSuiteManifestReadinessValue,
  ExecutiveIntegrationSuiteManifestStatusValue,
  ExecutiveIntegrationSuiteManifestVersion,
};

/**
 * Inventory references derived exclusively from Validation — never redefined.
 */
const validationDerivedInventory = Object.freeze({
  inventoryId: "EIL-8:5/ValidationDerivedInventory" as const,
  sourceValidationId: ExecutiveIntegrationSuiteValidationCanonicalId,
  validationCategories: ExecutiveIntegrationSuiteValidation.categories,
  validationRules: ExecutiveIntegrationSuiteValidation.rules,
  validationGates: ExecutiveIntegrationSuiteValidation.gates,
  validationInventory: ExecutiveIntegrationSuiteValidation.inventory,
  categoryCount: ExecutiveIntegrationSuiteValidation.categories.length,
  ruleCount: ExecutiveIntegrationSuiteValidation.rules.length,
  gateCount: ExecutiveIntegrationSuiteValidation.gates.length,
  totalValidationInventory:
    ExecutiveIntegrationSuiteValidation.inventory.totalValidationInventory,
  validationAggregateResult: ExecutiveIntegrationSuiteValidation.aggregateResult,
  validationReadiness: ExecutiveIntegrationSuiteValidation.readiness,
  countsDerivedFromValidation: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable Executive Integration Suite Manifest aggregate.
 */
export const ExecutiveIntegrationSuiteManifest = Object.freeze({
  identity: ExecutiveIntegrationSuiteManifestIdentity,
  guarantees: ExecutiveIntegrationSuiteManifestGuarantees,
  compatibility: ExecutiveIntegrationSuiteManifestCompatibility,
  dependencies: ExecutiveIntegrationSuiteManifestDependencies,
  exports: ExecutiveIntegrationSuiteManifestExports,
  readiness: ExecutiveIntegrationSuiteManifestReadiness,
  readinessValue: ExecutiveIntegrationSuiteManifestReadinessValue,
  validationReference: Object.freeze({
    canonicalId: ExecutiveIntegrationSuiteValidationCanonicalId,
    identity: ExecutiveIntegrationSuiteValidationIdentity,
    aggregate: ExecutiveIntegrationSuiteValidation,
    entryPoint: "executiveIntegrationSuiteValidation.ts" as const,
    exclusive: true as const,
  }),
  validationDerivedInventory,
  status: ExecutiveIntegrationSuiteManifestStatusValue,
  nextPhase: "EIL-8:6 — Executive Integration Suite Platform",
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
  importsLaterEil8Phases: false as const,
  previousEilPlatformDependency: false as const,
  immutable: true as const,
  deterministic: true as const,
});
