/**
 * DKL-4:4 — Knowledge Modeling Validation Rules.
 *
 * Immutable architectural validation rule catalog for DKL-4:1–4:3.
 * Metadata only — no operational payload validation.
 *
 * Ownership: owned exclusively by DKL-4:4.
 */

import type { KnowledgeModelingValidationRule } from "./knowledgeModelingValidationTypes.ts";

const rule = (
  ruleId: string,
  ruleName: string,
  category: KnowledgeModelingValidationRule["category"],
  description: string,
  sourcePhases: readonly string[],
  expected: string,
): KnowledgeModelingValidationRule =>
  Object.freeze({
    ruleId,
    ruleName,
    category,
    severity: "Critical" as const,
    description,
    sourcePhases: Object.freeze([...sourcePhases]),
    expected,
    blocking: true as const,
  });

/** Canonical immutable validation rule catalog. */
export const KnowledgeModelingValidationRules: readonly KnowledgeModelingValidationRule[] =
  Object.freeze([
    rule(
      "KM-VAL-FND-001",
      "FoundationIdentityStable",
      "FoundationIntegrity",
      "Foundation identity must declare FoundationComplete and ReadyForRegistry.",
      ["DKL-4:1"],
      "status=FoundationComplete; readiness=ReadyForRegistry",
    ),
    rule(
      "KM-VAL-FND-002",
      "FoundationLifecycleDeclared",
      "FoundationIntegrity",
      "Foundation must declare eleven lifecycle states.",
      ["DKL-4:1"],
      "lifecycle.stateCount=11",
    ),
    rule(
      "KM-VAL-FND-003",
      "FoundationOwnershipSeparated",
      "OwnershipBoundaries",
      "Foundation ownership owns and doesNotOwn must be non-empty and non-overlapping.",
      ["DKL-4:1"],
      "owns>=1; doesNotOwn>=1; intersection empty",
    ),
    rule(
      "KM-VAL-FND-004",
      "FoundationExtensionAndCompatibilityDeclared",
      "CompatibilityExtension",
      "Foundation must declare extension and compatibility policies.",
      ["DKL-4:1"],
      "extensionPolicies>=1; compatibilityPolicies>=1",
    ),
    rule(
      "KM-VAL-REG-001",
      "RegistryCompleteReadyForModel",
      "RegistryIntegrity",
      "Registry must report RegistryComplete and ReadyForModel.",
      ["DKL-4:2"],
      "status=RegistryComplete; readiness=ReadyForModel",
    ),
    rule(
      "KM-VAL-REG-002",
      "RegistryCategoryCount",
      "RegistryIntegrity",
      "Registry must expose exactly eighteen category collections.",
      ["DKL-4:2"],
      "registryCategoryCount=18",
    ),
    rule(
      "KM-VAL-REG-003",
      "BusinessObjectCategoryCount",
      "RegistryIntegrity",
      "Registry must register twenty-six business object categories.",
      ["DKL-4:2"],
      "businessObjectTypeCount=26",
    ),
    rule(
      "KM-VAL-REG-004",
      "RelationshipCategoryCount",
      "RegistryIntegrity",
      "Registry must register twenty relationship categories.",
      ["DKL-4:2"],
      "relationshipTypeCount=20",
    ),
    rule(
      "KM-VAL-REG-005",
      "RegistryUniqueIdentifiers",
      "RegistryIntegrity",
      "All registry entry identifiers must be unique across collections.",
      ["DKL-4:2"],
      "uniqueIdentifiersGuaranteed=true",
    ),
    rule(
      "KM-VAL-MDL-001",
      "ModelCompleteReadyForValidation",
      "ModelIntegrity",
      "Model phase must report ModelComplete and ReadyForValidation.",
      ["DKL-4:3"],
      "status=ModelComplete; readiness=ReadyForValidation",
    ),
    rule(
      "KM-VAL-MDL-002",
      "CanonicalModelCount",
      "ModelIntegrity",
      "Model catalog must contain exactly twenty canonical models.",
      ["DKL-4:3"],
      "modelCount=20",
    ),
    rule(
      "KM-VAL-MDL-003",
      "KnowledgeObjectFieldsReadonly",
      "ModelIntegrity",
      "Knowledge Object model fields must be readonly and non-executable.",
      ["DKL-4:3"],
      "all fields readonly; executableBehaviorImplied=false",
    ),
    rule(
      "KM-VAL-MDL-004",
      "BusinessObjectComposesKnowledgeObject",
      "ModelIntegrity",
      "Business Object model must declare composition of Knowledge Object.",
      ["DKL-4:3"],
      "knowledgeObject field present; composesKnowledgeObject",
    ),
    rule(
      "KM-VAL-DEP-001",
      "RegistryDependsOnFoundationOnly",
      "DependencySafety",
      "Registry dependencies must reference foundation public entry only.",
      ["DKL-4:2"],
      "approvedFoundationDependency.module=knowledgeModelingFoundation.ts",
    ),
    rule(
      "KM-VAL-DEP-002",
      "ModelDependsOnFoundationAndRegistryOnly",
      "DependencySafety",
      "Model dependencies must be foundation and registry public entries only.",
      ["DKL-4:3"],
      "approvedDependencyCount=2; noDirectDkl3Dependency=true",
    ),
    rule(
      "KM-VAL-DEP-003",
      "NoFuturePhaseImports",
      "DependencySafety",
      "Prior phases must not claim future DKL-4 phase dependencies.",
      ["DKL-4:1", "DKL-4:2", "DKL-4:3"],
      "noFutureDkl4Dependency / forbidden future phases",
    ),
    rule(
      "KM-VAL-OWN-001",
      "NoDuplicateArchitecturalOwnership",
      "OwnershipBoundaries",
      "Registry ownership must declare no duplicate architectural ownership.",
      ["DKL-4:2"],
      "noDuplicateArchitecturalOwnership=true",
    ),
    rule(
      "KM-VAL-API-001",
      "FoundationPublicApiCount",
      "PublicApiSurface",
      "Foundation must publish exactly eight public APIs.",
      ["DKL-4:1"],
      "publicFoundationApiCount=8",
    ),
    rule(
      "KM-VAL-API-002",
      "RegistryAndModelExportCounts",
      "PublicApiSurface",
      "Registry and Model must each publish exactly eight public APIs.",
      ["DKL-4:2", "DKL-4:3"],
      "exportCount=8 each",
    ),
    rule(
      "KM-VAL-IMM-001",
      "MetadataOnlyGuarantees",
      "ImmutabilityDeterminism",
      "Foundation, Registry, and Model must declare metadata-only and immutable.",
      ["DKL-4:1", "DKL-4:2", "DKL-4:3"],
      "metadataOnly=true; immutable=true",
    ),
    rule(
      "KM-VAL-IMM-002",
      "NoRuntimeConstructionOrGraphOps",
      "ImmutabilityDeterminism",
      "Model guarantees must forbid factories and graph operations.",
      ["DKL-4:3"],
      "noObjectFactories=true; noGraphOperations=true",
    ),
    rule(
      "KM-VAL-CMP-001",
      "CompatibilityPoliciesPresent",
      "CompatibilityExtension",
      "Foundation compatibility policies must include DKL-3 compatible and AI forbidden.",
      ["DKL-4:1"],
      "COMPAT-DKL3 Compatible; COMPAT-AI-FORBIDDEN Forbidden",
    ),
    rule(
      "KM-VAL-EXT-001",
      "ExtensionPoliciesPresent",
      "CompatibilityExtension",
      "Foundation extension policies must include additive and runtime-forbidden.",
      ["DKL-4:1"],
      "EXT-ADDITIVE AdditiveAllowed; EXT-RUNTIME-FORBIDDEN Forbidden",
    ),
    rule(
      "KM-VAL-BND-001",
      "FoundationBoundariesForbidPersistenceAndAi",
      "OwnershipBoundaries",
      "Foundation boundaries must forbid persistence and AI execution.",
      ["DKL-4:1"],
      "persistenceForbidden=true; aiExecutionForbidden=true",
    ),
  ]);

export const KNOWLEDGE_MODELING_VALIDATION_CATEGORIES = Object.freeze([
  "FoundationIntegrity",
  "RegistryIntegrity",
  "ModelIntegrity",
  "DependencySafety",
  "OwnershipBoundaries",
  "CompatibilityExtension",
  "PublicApiSurface",
  "ImmutabilityDeterminism",
] as const);
