/**
 * DKL-5:7 — Knowledge Validation Certification Regression.
 *
 * Immutable regression protection declarations derived from Platform metadata.
 * Architecture metadata only. No git history or build inspection.
 *
 * Ownership: owned exclusively by DKL-5:7.
 */

import { KnowledgeValidationPlatform } from "./knowledgeValidationPlatform.ts";
import type { RegressionCheckResult } from "./knowledgeValidationCertificationTypes.ts";

const OWNER = "DKL-5 Knowledge Validation Certification";

const decl = (
  regressionId: string,
  name: string,
  protectedValue: string | number | boolean,
  sourcePhase: string,
  sourceReference: string,
) =>
  Object.freeze({
    regressionId,
    name,
    protectedValue,
    sourcePhase,
    sourceReference,
    metadataOnly: true as const,
    immutable: true as const,
  });

const PLATFORM = KnowledgeValidationPlatform;

/** Canonical immutable regression protection declarations. */
export const KnowledgeValidationCertificationRegression = Object.freeze({
  regressionId: "DKL-5:7/CertificationRegression",
  sourcePhase: "DKL-5:7" as const,
  owner: OWNER,
  declarations: Object.freeze([
    decl("REG-FND-IDENTITY", "Foundation identity", PLATFORM.foundation.identity.foundationId, "DKL-5:1", "platform.foundation.identity.foundationId"),
    decl("REG-FND-CONTRACTS", "20 Foundation contract identities", PLATFORM.inventory.foundationContractCount, "DKL-5:1", "platform.inventory.foundationContractCount"),
    decl("REG-FND-TARGETS", "19 validation target identities", PLATFORM.inventory.validationTargetCount, "DKL-5:1", "platform.inventory.validationTargetCount"),
    decl("REG-FND-DIMENSIONS", "20 validation dimension identities", PLATFORM.inventory.validationDimensionCount, "DKL-5:1", "platform.inventory.validationDimensionCount"),
    decl("REG-FND-SIGNALS", "20 quality-signal identities", PLATFORM.inventory.qualitySignalCount, "DKL-5:1", "platform.inventory.qualitySignalCount"),
    decl("REG-FND-OUTCOMES", "11 outcome identities", PLATFORM.inventory.outcomeCount, "DKL-5:1", "platform.inventory.outcomeCount"),
    decl("REG-FND-SEVERITIES", "6 severity identities", PLATFORM.inventory.severityCount, "DKL-5:1", "platform.inventory.severityCount"),
    decl("REG-REG-COLLECTIONS", "24 Registry collection identities", PLATFORM.inventory.registryCollectionCount, "DKL-5:2", "platform.inventory.registryCollectionCount"),
    decl("REG-REG-ENTRIES", "266 Registry entry identities", PLATFORM.inventory.registryEntryCount, "DKL-5:2", "platform.inventory.registryEntryCount"),
    decl("REG-MDL-MODELS", "30 canonical model identities", PLATFORM.inventory.canonicalModelCount, "DKL-5:3", "platform.inventory.canonicalModelCount"),
    decl("REG-MDL-RELATIONSHIPS", "14 structural model relationship identities", PLATFORM.inventory.modelRelationshipCount, "DKL-5:3", "platform.inventory.modelRelationshipCount"),
    decl("REG-VAL-CATEGORIES", "27 validation category identities", PLATFORM.inventory.validationCategoryCount, "DKL-5:4", "platform.inventory.validationCategoryCount"),
    decl("REG-VAL-RULES", "63 validation rule identities", PLATFORM.inventory.validationRuleCount, "DKL-5:4", "platform.inventory.validationRuleCount"),
    decl("REG-VAL-EVIDENCE", "63 validation evidence identities", PLATFORM.inventory.validationEvidenceCount, "DKL-5:4", "platform.inventory.validationEvidenceCount"),
    decl("REG-MNF-SECTIONS", "Manifest section identities and ordering", PLATFORM.manifest.sections.join("→"), "DKL-5:5", "platform.manifest.sections"),
    decl("REG-PLT-SECTIONS", "Platform section identities and ordering", PLATFORM.sectionOrder.join("→"), "DKL-5:6", "platform.sectionOrder"),
    decl("REG-PLT-COMPONENTS", "Five Platform component identities", PLATFORM.components.componentCount, "DKL-5:6", "platform.components.componentCount"),
    decl("REG-PUBLIC-APIS", "Public API counts", PLATFORM.inventory.totalPublicApiCount, "DKL-5:6", "platform.inventory.totalPublicApiCount"),
    decl("REG-OWNERSHIP", "Ownership boundaries", PLATFORM.metadata.ownership.noOwnershipTransfer, "DKL-5:6", "platform.metadata.ownership.noOwnershipTransfer"),
    decl("REG-DEPENDENCIES", "Dependency boundaries", PLATFORM.dependencies.publicEntryPointOnly, "DKL-5:6", "platform.dependencies.publicEntryPointOnly"),
    decl("REG-COMPATIBILITY", "Compatibility meanings", PLATFORM.compatibility.entryCount, "DKL-5:6", "platform.compatibility.entryCount"),
    decl("REG-EXTENSION", "Extension restrictions", PLATFORM.extensions.policy.mutableRuntimeRegistrationForbidden, "DKL-5:6", "platform.extensions.policy.mutableRuntimeRegistrationForbidden"),
    decl("REG-EVIDENCE", "Evidence-oriented guarantees", PLATFORM.manifest.guarantees.accurateCounts, "DKL-5:5", "platform.manifest.guarantees.accurateCounts"),
    decl("REG-PARTIAL-USABILITY", "Partial-usability guarantees", PLATFORM.foundation.contracts.outcomeStatuses.includes("ValidWithLimitations"), "DKL-5:1", "platform.foundation.contracts.outcomeStatuses"),
    decl("REG-RUNTIME", "Runtime validation prohibition", PLATFORM.metadata.guarantees.noRuntimeOrganizationalValidation, "DKL-5:6", "platform.metadata.guarantees.noRuntimeOrganizationalValidation"),
    decl("REG-SCORING", "Numeric-scoring prohibition", PLATFORM.metadata.guarantees.noNumericScoring, "DKL-5:6", "platform.metadata.guarantees.noNumericScoring"),
    decl("REG-TRUST", "Trust-calculation prohibition", PLATFORM.metadata.guarantees.noTrustCalculation, "DKL-5:6", "platform.metadata.guarantees.noTrustCalculation"),
    decl("REG-CLEANSING", "Cleansing prohibition", PLATFORM.metadata.guarantees.noCleansing, "DKL-5:6", "platform.metadata.guarantees.noCleansing"),
    decl("REG-REMEDIATION", "Remediation prohibition", PLATFORM.metadata.guarantees.noRemediation, "DKL-5:6", "platform.metadata.guarantees.noRemediation"),
    decl("REG-METADATA", "Metadata-only guarantees", PLATFORM.metadataOnly, "DKL-5:6", "platform.metadataOnly"),
  ]),
  declarationCount: 30,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Evaluate regression checks against current Platform metadata. Pure and deterministic. */
export const evaluateRegressionChecks = (): readonly RegressionCheckResult[] => {
  const p = KnowledgeValidationPlatform;
  const checks = [
    { regressionId: "REG-FND-IDENTITY", pass: p.foundation.identity.foundationId === "DKL-5:1/KnowledgeValidationFoundation", expected: "DKL-5:1/KnowledgeValidationFoundation", observed: p.foundation.identity.foundationId },
    { regressionId: "REG-FND-CONTRACTS", pass: p.inventory.foundationContractCount === 20, expected: "20", observed: String(p.inventory.foundationContractCount) },
    { regressionId: "REG-FND-TARGETS", pass: p.inventory.validationTargetCount === 19, expected: "19", observed: String(p.inventory.validationTargetCount) },
    { regressionId: "REG-FND-DIMENSIONS", pass: p.inventory.validationDimensionCount === 20, expected: "20", observed: String(p.inventory.validationDimensionCount) },
    { regressionId: "REG-FND-SIGNALS", pass: p.inventory.qualitySignalCount === 20, expected: "20", observed: String(p.inventory.qualitySignalCount) },
    { regressionId: "REG-FND-OUTCOMES", pass: p.inventory.outcomeCount === 11, expected: "11", observed: String(p.inventory.outcomeCount) },
    { regressionId: "REG-FND-SEVERITIES", pass: p.inventory.severityCount === 6, expected: "6", observed: String(p.inventory.severityCount) },
    { regressionId: "REG-REG-COLLECTIONS", pass: p.inventory.registryCollectionCount === 24, expected: "24", observed: String(p.inventory.registryCollectionCount) },
    { regressionId: "REG-REG-ENTRIES", pass: p.inventory.registryEntryCount === 266, expected: "266", observed: String(p.inventory.registryEntryCount) },
    { regressionId: "REG-MDL-MODELS", pass: p.inventory.canonicalModelCount === 30, expected: "30", observed: String(p.inventory.canonicalModelCount) },
    { regressionId: "REG-MDL-RELATIONSHIPS", pass: p.inventory.modelRelationshipCount === 14, expected: "14", observed: String(p.inventory.modelRelationshipCount) },
    { regressionId: "REG-VAL-CATEGORIES", pass: p.inventory.validationCategoryCount === 27, expected: "27", observed: String(p.inventory.validationCategoryCount) },
    { regressionId: "REG-VAL-RULES", pass: p.inventory.validationRuleCount === 63, expected: "63", observed: String(p.inventory.validationRuleCount) },
    { regressionId: "REG-VAL-EVIDENCE", pass: p.inventory.validationEvidenceCount === 63, expected: "63", observed: String(p.inventory.validationEvidenceCount) },
    { regressionId: "REG-MNF-SECTIONS", pass: p.manifest.sections.length === 12 && p.manifest.sections[0] === "metadata", expected: "12 ordered sections", observed: `${p.manifest.sections.length}:${p.manifest.sections[0]}` },
    { regressionId: "REG-PLT-SECTIONS", pass: p.sectionOrder.join("→") === "metadata→foundation→registry→model→validation→manifest", expected: "metadata→foundation→registry→model→validation→manifest", observed: p.sectionOrder.join("→") },
    { regressionId: "REG-PLT-COMPONENTS", pass: p.components.componentCount === 5, expected: "5", observed: String(p.components.componentCount) },
    { regressionId: "REG-PUBLIC-APIS", pass: p.inventory.totalPublicApiCount === 48, expected: "48", observed: String(p.inventory.totalPublicApiCount) },
    { regressionId: "REG-OWNERSHIP", pass: p.metadata.ownership.noOwnershipTransfer === true, expected: "true", observed: String(p.metadata.ownership.noOwnershipTransfer) },
    { regressionId: "REG-DEPENDENCIES", pass: p.dependencies.publicEntryPointOnly === true, expected: "true", observed: String(p.dependencies.publicEntryPointOnly) },
    { regressionId: "REG-COMPATIBILITY", pass: p.compatibility.entryCount >= 20, expected: ">=20", observed: String(p.compatibility.entryCount) },
    { regressionId: "REG-EXTENSION", pass: p.extensions.policy.mutableRuntimeRegistrationForbidden === true, expected: "true", observed: String(p.extensions.policy.mutableRuntimeRegistrationForbidden) },
    { regressionId: "REG-EVIDENCE", pass: p.manifest.guarantees.accurateCounts === true, expected: "true", observed: String(p.manifest.guarantees.accurateCounts) },
    { regressionId: "REG-PARTIAL-USABILITY", pass: p.foundation.contracts.outcomeStatuses.includes("ValidWithLimitations"), expected: "true", observed: String(p.foundation.contracts.outcomeStatuses.includes("ValidWithLimitations")) },
    { regressionId: "REG-RUNTIME", pass: p.metadata.guarantees.noRuntimeOrganizationalValidation === true, expected: "true", observed: String(p.metadata.guarantees.noRuntimeOrganizationalValidation) },
    { regressionId: "REG-SCORING", pass: p.metadata.guarantees.noNumericScoring === true, expected: "true", observed: String(p.metadata.guarantees.noNumericScoring) },
    { regressionId: "REG-TRUST", pass: p.metadata.guarantees.noTrustCalculation === true, expected: "true", observed: String(p.metadata.guarantees.noTrustCalculation) },
    { regressionId: "REG-CLEANSING", pass: p.metadata.guarantees.noCleansing === true, expected: "true", observed: String(p.metadata.guarantees.noCleansing) },
    { regressionId: "REG-REMEDIATION", pass: p.metadata.guarantees.noRemediation === true, expected: "true", observed: String(p.metadata.guarantees.noRemediation) },
    { regressionId: "REG-METADATA", pass: p.metadataOnly === true, expected: "true", observed: String(p.metadataOnly) },
  ];
  return Object.freeze(
    checks.map((check) =>
      Object.freeze({
        regressionId: check.regressionId,
        result: (check.pass ? "Pass" : "Fail") as "Pass" | "Fail",
        expected: check.expected,
        observed: check.observed,
      }),
    ),
  );
};
