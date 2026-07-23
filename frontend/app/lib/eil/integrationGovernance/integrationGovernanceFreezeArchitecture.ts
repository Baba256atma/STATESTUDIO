/**
 * EIL-7:8 — Integration Governance Freeze Architecture.
 *
 * Immutable frozen architecture aggregate for Integration Governance.
 * Consumes only the EIL-7:7 Certification aggregate.
 * Metadata-only. Deeply immutable. Ready for Public Index.
 *
 * Ownership: owned exclusively by EIL-7:8.
 */

import {
  IntegrationGovernanceCertification,
  IntegrationGovernanceCertificationCanonicalId,
  IntegrationGovernanceCertificationIdentity,
} from "./integrationGovernanceCertification.ts";
import { IntegrationGovernanceFreezeBaselines } from "./integrationGovernanceFreezeBaselines.ts";
import { IntegrationGovernanceFreezeCompatibility } from "./integrationGovernanceFreezeCompatibility.ts";
import { IntegrationGovernanceFreezeExtensions } from "./integrationGovernanceFreezeExtensions.ts";
import {
  IntegrationGovernanceFreezeCanonicalId,
  IntegrationGovernanceFreezeIdentity,
  IntegrationGovernanceFreezeLockId,
  IntegrationGovernanceFreezeReadinessValue,
  IntegrationGovernanceFreezeStatusValue,
} from "./integrationGovernanceFreezeIdentity.ts";
import { IntegrationGovernanceFreezeLocks } from "./integrationGovernanceFreezeLocks.ts";

/**
 * Inventory references derived exclusively from Certification — never redefined.
 */
const certificationDerivedInventory = Object.freeze({
  inventoryId: "EIL-7:8/CertificationDerivedInventory" as const,
  sourceCertificationId: IntegrationGovernanceCertificationCanonicalId,
  platformDerivedInventory:
    IntegrationGovernanceCertification.platformDerivedInventory,
  validationCategories:
    IntegrationGovernanceCertification.platformDerivedInventory
      .validationCategories,
  validationRules:
    IntegrationGovernanceCertification.platformDerivedInventory
      .validationRules,
  validationGates:
    IntegrationGovernanceCertification.platformDerivedInventory
      .validationGates,
  validationInventory:
    IntegrationGovernanceCertification.platformDerivedInventory
      .validationInventory,
  categoryCount:
    IntegrationGovernanceCertification.platformDerivedInventory
      .categoryCount,
  ruleCount:
    IntegrationGovernanceCertification.platformDerivedInventory.ruleCount,
  gateCount:
    IntegrationGovernanceCertification.platformDerivedInventory.gateCount,
  totalValidationInventory:
    IntegrationGovernanceCertification.platformDerivedInventory
      .totalValidationInventory,
  validationAggregateResult:
    IntegrationGovernanceCertification.platformDerivedInventory
      .validationAggregateResult,
  validationReadiness:
    IntegrationGovernanceCertification.platformDerivedInventory
      .validationReadiness,
  certificationAggregateResult:
    IntegrationGovernanceCertification.aggregateResult,
  countsDerivedFromCertification: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable frozen architecture aggregate.
 */
export const IntegrationGovernanceFreezeArchitecture = Object.freeze({
  architectureId: "EIL-7:8/Architecture" as const,
  identity: IntegrationGovernanceFreezeIdentity,
  lockId: IntegrationGovernanceFreezeLockId,
  architecturalLocks: IntegrationGovernanceFreezeLocks,
  frozenBaselines: IntegrationGovernanceFreezeBaselines,
  compatibility: IntegrationGovernanceFreezeCompatibility,
  extensions: IntegrationGovernanceFreezeExtensions,
  certificationReference: Object.freeze({
    canonicalId: IntegrationGovernanceCertificationCanonicalId,
    identity: IntegrationGovernanceCertificationIdentity,
    aggregate: IntegrationGovernanceCertification,
    entryPoint: "integrationGovernanceCertification.ts" as const,
    exclusive: true as const,
  }),
  certificationDerivedInventory,
  readiness: IntegrationGovernanceFreezeReadinessValue,
  status: IntegrationGovernanceFreezeStatusValue,
  freezeCanonicalId: IntegrationGovernanceFreezeCanonicalId,
  nextPhase: "EIL-7:9 — Integration Governance Public Index" as const,
  metadataOnly: true as const,
  deeplyImmutable: true as const,
  immutable: true as const,
  deterministic: true as const,
});
