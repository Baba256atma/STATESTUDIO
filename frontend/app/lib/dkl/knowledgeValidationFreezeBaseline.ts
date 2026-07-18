/**
 * DKL-5:8 — Knowledge Validation Freeze Baseline.
 *
 * Immutable certified baseline inventory derived from Certification references.
 * Identity lists are published explicitly and frozen for regression protection.
 *
 * Ownership: owned exclusively by DKL-5:8.
 */

import { KnowledgeValidationCertification } from "./knowledgeValidationCertification.ts";

const CERT = KnowledgeValidationCertification;
const PLATFORM = CERT.certifiedPlatform;

/** Canonical immutable Freeze baseline inventory. */
export const KnowledgeValidationFreezeBaseline = Object.freeze({
  baselineId: "DKL-5:8/FreezeBaseline",
  sourcePhase: "DKL-5:8" as const,
  owner: "DKL-5 Knowledge Validation Freeze",
  counts: Object.freeze({
    frozenComponentCount: 7 as const,
    totalPublicApiCountThroughCertification: 56 as const,
    foundationContractCount: PLATFORM.inventory.foundationContractCount,
    validationTargetCount: PLATFORM.inventory.validationTargetCount,
    validationDimensionCount: PLATFORM.inventory.validationDimensionCount,
    qualitySignalCount: PLATFORM.inventory.qualitySignalCount,
    outcomeCount: PLATFORM.inventory.outcomeCount,
    severityCount: PLATFORM.inventory.severityCount,
    registryCollectionCount: PLATFORM.inventory.registryCollectionCount,
    registryEntryCount: PLATFORM.inventory.registryEntryCount,
    canonicalModelCount: PLATFORM.inventory.canonicalModelCount,
    modelRelationshipCount: PLATFORM.inventory.modelRelationshipCount,
    validationCategoryCount: PLATFORM.inventory.validationCategoryCount,
    validationRuleCount: PLATFORM.inventory.validationRuleCount,
    validationResultCount: PLATFORM.inventory.validationResultCount,
    validationEvidenceCount: PLATFORM.inventory.validationEvidenceCount,
    manifestSectionCount: PLATFORM.manifest.sections.length,
    manifestReadinessGateCount: PLATFORM.manifest.manifestReadiness.gateCount,
    platformSectionCount: PLATFORM.sectionOrder.length,
    platformComponentCount: PLATFORM.components.componentCount,
    platformReadinessGateCount: PLATFORM.readiness.gateCount,
    certificationCategoryCount: CERT.categories.length,
    certificationGateCount: CERT.gates.length,
    certificationEvidenceCount: CERT.evidence.recordCount,
    regressionDeclarationCount: CERT.regression.declarationCount,
    certificationCompatibilityCount: CERT.compatibility.entryCount,
    platformExtensionCount: PLATFORM.extensions.entryCount,
    lifecycleStateCount: PLATFORM.inventory.lifecycleStateCount,
    ownershipDeclarationCount: PLATFORM.inventory.ownershipDeclarationCount,
    dependencyDeclarationCount: PLATFORM.inventory.dependencyDeclarationCount,
  }),
  identities: Object.freeze({
    foundationContractIdentities: Object.freeze([
      ...PLATFORM.foundation.contracts.contractKinds,
    ]),
    validationTargetIdentities: Object.freeze([
      ...PLATFORM.foundation.contracts.targetCategories,
    ]),
    validationDimensionIdentities: Object.freeze([
      ...PLATFORM.foundation.contracts.dimensions,
    ]),
    qualitySignalIdentities: Object.freeze(
      PLATFORM.foundation.contracts.qualitySignals.map((signal) => signal.id),
    ),
    outcomeIdentities: Object.freeze([
      ...PLATFORM.foundation.contracts.outcomeStatuses,
    ]),
    severityIdentities: Object.freeze(
      PLATFORM.foundation.contracts.severities.map((severity) => severity.severity),
    ),
    registryCollectionIdentities: Object.freeze(
      Object.keys(PLATFORM.registry.collections),
    ),
    canonicalModelIdentities: Object.freeze([
      ...PLATFORM.model.catalog.modelKinds,
    ]),
    modelRelationshipIdentities: Object.freeze(
      PLATFORM.model.relationships.declarations.map(
        (declaration) => declaration.id,
      ),
    ),
    validationCategoryIdentities: Object.freeze([
      ...PLATFORM.validation.categories,
    ]),
    validationRuleIdentities: Object.freeze(
      PLATFORM.validation.rules.map((rule) => rule.id),
    ),
    validationEvidenceIdentities: Object.freeze(
      PLATFORM.validation.result.ruleResults.map(
        (result) => result.evidence.ruleId,
      ),
    ),
    manifestSectionIdentities: Object.freeze([...PLATFORM.manifest.sections]),
    platformSectionIdentities: Object.freeze([...PLATFORM.sectionOrder]),
    platformComponentIdentities: Object.freeze(
      PLATFORM.components.components.map((entry) => entry.componentId),
    ),
    certificationCategoryIdentities: Object.freeze([...CERT.categories]),
    certificationGateIdentities: Object.freeze(CERT.gates.map((gate) => gate.id)),
    certificationEvidenceIdentities: Object.freeze(
      CERT.evidence.records.map((record) => record.evidenceId),
    ),
    regressionDeclarationIdentities: Object.freeze(
      CERT.regression.declarations.map(
        (declaration) => declaration.regressionId,
      ),
    ),
    consumerReadinessIdentities: Object.freeze([
      ...PLATFORM.model.catalog.consumerSuitabilityStates.states,
    ]),
    executiveUsabilityIdentities: Object.freeze([
      ...PLATFORM.model.catalog.executiveUsabilityCapabilities.capabilities,
    ]),
    lifecycleStateIdentities: Object.freeze([
      ...PLATFORM.foundation.lifecycle.states,
    ]),
  }),
  derivedFromCertification: true,
  includedByReference: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
