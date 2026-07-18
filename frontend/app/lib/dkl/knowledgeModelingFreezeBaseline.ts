/**
 * DKL-4:8 — Knowledge Modeling Freeze Baseline.
 *
 * Immutable certified baseline inventory derived from Certification references.
 * Identity lists are published explicitly and frozen for regression protection.
 *
 * Ownership: owned exclusively by DKL-4:8.
 */

import { KnowledgeModelingCertification } from "./knowledgeModelingCertification.ts";

const CERT = KnowledgeModelingCertification;
const PLATFORM = CERT.certifiedPlatform;

const BUSINESS_OBJECT_IDENTITIES = Object.freeze(
  PLATFORM.registry.collections.businessObjectTypes.map((e) => e.name),
);

const RELATIONSHIP_IDENTITIES = Object.freeze(
  PLATFORM.registry.collections.relationshipTypes.map((e) => e.name),
);

const CANONICAL_MODEL_IDENTITIES = Object.freeze([
  ...PLATFORM.model.catalog.modelKinds,
]);

const VALIDATION_RULE_IDENTITIES = Object.freeze(
  PLATFORM.validation.rules.map((r) => r.ruleId),
);

const PLATFORM_SECTION_IDENTITIES = Object.freeze([
  ...PLATFORM.sectionOrder,
]);

const CERTIFICATION_GATE_IDENTITIES = Object.freeze(
  CERT.gates.map((g) => g.id),
);

const REGRESSION_DECLARATION_IDENTITIES = Object.freeze(
  CERT.regression.declarations.map((d) => d.regressionId),
);

/** Canonical immutable Freeze baseline inventory. */
export const KnowledgeModelingFreezeBaseline = Object.freeze({
  baselineId: "DKL-4:8/FreezeBaseline",
  sourcePhase: "DKL-4:8" as const,
  owner: "DKL-4 Knowledge Modeling Freeze",
  counts: Object.freeze({
    frozenComponentCount: 7 as const,
    foundationPublicApiCount: 8 as const,
    registryCategoryCount: PLATFORM.registry.summary.registryCategoryCount,
    registryEntryCount: PLATFORM.registry.summary.totalEntryCount,
    businessObjectCategoryCount: PLATFORM.registry.summary.businessObjectTypeCount,
    relationshipCategoryCount: PLATFORM.registry.summary.relationshipTypeCount,
    canonicalModelCount: PLATFORM.model.catalog.modelCount,
    modelRelationshipDeclarationCount:
      PLATFORM.model.relationships.declarationCount,
    validationCategoryCount: PLATFORM.validation.report.categoryCount,
    validationRuleCount: PLATFORM.validation.report.ruleCount,
    manifestInventoryComponentCount: PLATFORM.manifest.inventory.componentCount,
    platformSectionCount: PLATFORM.sectionOrder.length,
    platformReadinessGateCount: PLATFORM.readiness.gateCount,
    certificationCategoryCount: CERT.categories.length,
    certificationGateCount: CERT.gates.length,
    certificationEvidenceCount: CERT.evidence.recordCount,
    compatibilityCertificationCount: CERT.compatibility.entryCount,
    regressionDeclarationCount: CERT.regression.declarationCount,
    publicApiTotalThroughCertification: 56 as const,
  }),
  identities: Object.freeze({
    businessObjectIdentities: BUSINESS_OBJECT_IDENTITIES,
    relationshipIdentities: RELATIONSHIP_IDENTITIES,
    canonicalModelIdentities: CANONICAL_MODEL_IDENTITIES,
    validationRuleIdentities: VALIDATION_RULE_IDENTITIES,
    platformSectionIdentities: PLATFORM_SECTION_IDENTITIES,
    certificationGateIdentities: CERTIFICATION_GATE_IDENTITIES,
    regressionDeclarationIdentities: REGRESSION_DECLARATION_IDENTITIES,
  }),
  derivedFromCertification: true,
  includedByReference: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
