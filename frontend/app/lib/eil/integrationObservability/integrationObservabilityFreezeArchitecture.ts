/**
 * EIL-6:8 — Integration Observability Freeze Architecture.
 *
 * Immutable frozen architecture aggregate for Integration Observability.
 * Consumes only the EIL-6:7 Certification aggregate.
 * Metadata-only. Deeply immutable. Ready for Public Index.
 *
 * Ownership: owned exclusively by EIL-6:8.
 */

import {
  IntegrationObservabilityCertification,
  IntegrationObservabilityCertificationCanonicalId,
  IntegrationObservabilityCertificationIdentity,
} from "./integrationObservabilityCertification.ts";
import { IntegrationObservabilityFreezeBaselines } from "./integrationObservabilityFreezeBaselines.ts";
import { IntegrationObservabilityFreezeCompatibility } from "./integrationObservabilityFreezeCompatibility.ts";
import { IntegrationObservabilityFreezeExtensions } from "./integrationObservabilityFreezeExtensions.ts";
import {
  IntegrationObservabilityFreezeCanonicalId,
  IntegrationObservabilityFreezeIdentity,
  IntegrationObservabilityFreezeLockId,
  IntegrationObservabilityFreezeReadinessValue,
  IntegrationObservabilityFreezeStatusValue,
} from "./integrationObservabilityFreezeIdentity.ts";
import { IntegrationObservabilityFreezeLocks } from "./integrationObservabilityFreezeLocks.ts";

/**
 * Inventory references derived exclusively from Certification — never redefined.
 */
const certificationDerivedInventory = Object.freeze({
  inventoryId: "EIL-6:8/CertificationDerivedInventory" as const,
  sourceCertificationId: IntegrationObservabilityCertificationCanonicalId,
  platformDerivedInventory:
    IntegrationObservabilityCertification.platformDerivedInventory,
  validationCategories:
    IntegrationObservabilityCertification.platformDerivedInventory
      .validationCategories,
  validationRules:
    IntegrationObservabilityCertification.platformDerivedInventory
      .validationRules,
  validationGates:
    IntegrationObservabilityCertification.platformDerivedInventory
      .validationGates,
  validationInventory:
    IntegrationObservabilityCertification.platformDerivedInventory
      .validationInventory,
  categoryCount:
    IntegrationObservabilityCertification.platformDerivedInventory
      .categoryCount,
  ruleCount:
    IntegrationObservabilityCertification.platformDerivedInventory.ruleCount,
  gateCount:
    IntegrationObservabilityCertification.platformDerivedInventory.gateCount,
  totalValidationInventory:
    IntegrationObservabilityCertification.platformDerivedInventory
      .totalValidationInventory,
  validationAggregateResult:
    IntegrationObservabilityCertification.platformDerivedInventory
      .validationAggregateResult,
  validationReadiness:
    IntegrationObservabilityCertification.platformDerivedInventory
      .validationReadiness,
  certificationAggregateResult:
    IntegrationObservabilityCertification.aggregateResult,
  countsDerivedFromCertification: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable frozen architecture aggregate.
 */
export const IntegrationObservabilityFreezeArchitecture = Object.freeze({
  architectureId: "EIL-6:8/Architecture" as const,
  identity: IntegrationObservabilityFreezeIdentity,
  lockId: IntegrationObservabilityFreezeLockId,
  architecturalLocks: IntegrationObservabilityFreezeLocks,
  frozenBaselines: IntegrationObservabilityFreezeBaselines,
  compatibility: IntegrationObservabilityFreezeCompatibility,
  extensions: IntegrationObservabilityFreezeExtensions,
  certificationReference: Object.freeze({
    canonicalId: IntegrationObservabilityCertificationCanonicalId,
    identity: IntegrationObservabilityCertificationIdentity,
    aggregate: IntegrationObservabilityCertification,
    entryPoint: "integrationObservabilityCertification.ts" as const,
    exclusive: true as const,
  }),
  certificationDerivedInventory,
  readiness: IntegrationObservabilityFreezeReadinessValue,
  status: IntegrationObservabilityFreezeStatusValue,
  freezeCanonicalId: IntegrationObservabilityFreezeCanonicalId,
  nextPhase: "EIL-6:9 — Integration Observability Public Index" as const,
  metadataOnly: true as const,
  deeplyImmutable: true as const,
  immutable: true as const,
  deterministic: true as const,
});
