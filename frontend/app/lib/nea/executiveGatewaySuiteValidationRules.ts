/**
 * NEA-8:4 — Executive Gateway Suite Validation Rules.
 *
 * Immutable declarative validation rules for NEA-8:3 domain models.
 * Metadata only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-8:4.
 */

import {
  ExecutiveGatewaySuiteModelId,
  ExecutiveGatewaySuiteModelPlatform,
} from "./executiveGatewaySuiteModel.ts";
import type {
  ExecutiveGatewaySuiteValidationCategory,
  ExecutiveGatewaySuiteValidationCategoryId,
  ExecutiveGatewaySuiteValidationRule,
  ExecutiveGatewaySuiteValidationSeverity,
  ExecutiveGatewaySuiteValidationTarget,
} from "./executiveGatewaySuiteValidationTypes.ts";

const model = ExecutiveGatewaySuiteModelPlatform;

const category = (
  categoryId: ExecutiveGatewaySuiteValidationCategoryId,
  categoryName: string,
  description: string,
  targetModelKind: ExecutiveGatewaySuiteValidationTarget,
  order: number,
): ExecutiveGatewaySuiteValidationCategory =>
  Object.freeze({
    categoryId,
    categoryName,
    description,
    targetModelKind,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Validation categories: exactly 20 matching Model kinds, plus CrossModel and
 * PlatformIntegrity. Domain category count remains 20.
 */
export const ExecutiveGatewaySuiteValidationCategories: readonly ExecutiveGatewaySuiteValidationCategory[] =
  Object.freeze([
    category("SuiteIdentity", "Suite Identity Validation", "Validate suite identity completeness and uniqueness.", "SuiteIdentity", 1),
    category("SuiteComponent", "Suite Component Validation", "Validate suite component integrity and canonical references.", "SuiteComponent", 2),
    category("SuiteComponentIdentity", "Suite Component Identity Validation", "Validate component identity fields derived from Model.", "SuiteComponentIdentity", 3),
    category("SuiteComposition", "Suite Composition Validation", "Validate seven-component suite composition completeness.", "SuiteComposition", 4),
    category("SuiteDependency", "Suite Dependency Validation", "Validate declarative dependency ordering — no runtime resolution.", "SuiteDependency", 5),
    category("SuiteCapability", "Suite Capability Validation", "Validate suite capability references from Model.", "SuiteCapability", 6),
    category("SuiteContract", "Suite Contract Validation", "Validate suite contract references from Model.", "SuiteContract", 7),
    category("SuiteLifecycle", "Suite Lifecycle Validation", "Validate suite lifecycle integrity from Model.", "SuiteLifecycle", 8),
    category("SuitePolicy", "Suite Policy Validation", "Validate suite policy references from Model.", "SuitePolicy", 9),
    category("SuiteInventory", "Suite Inventory Validation", "Validate suite inventory consistency and derivation.", "SuiteInventory", 10),
    category("SuiteMetadata", "Suite Metadata Validation", "Validate suite metadata integrity.", "SuiteMetadata", 11),
    category("SuiteStatus", "Suite Status Validation", "Validate suite status vocabulary consistency.", "SuiteStatus", 12),
    category("SuiteVersion", "Suite Version Validation", "Validate suite version consistency.", "SuiteVersion", 13),
    category("SuiteReadiness", "Suite Readiness Validation", "Validate suite readiness consistency without runtime claims.", "SuiteReadiness", 14),
    category("SuiteRelationship", "Suite Relationship Validation", "Validate declarative suite relationship integrity.", "SuiteRelationship", 15),
    category("SuiteValidationTarget", "Suite Validation Target Validation", "Validate declarative validation target structure for Manifest.", "SuiteValidationTarget", 16),
    category("SuitePlatformReference", "Suite Platform Reference Validation", "Validate Public Index platform reference preservation.", "SuitePlatformReference", 17),
    category("SuitePublicApiInventory", "Suite Public API Inventory Validation", "Validate public API inventory consistency from Model.", "SuitePublicApiInventory", 18),
    category("SuiteSummary", "Suite Summary Validation", "Validate suite summary composition and inventory references.", "SuiteSummary", 19),
    category("ExecutiveGatewaySuite", "Executive Gateway Suite Validation", "Validate suite aggregate composition and ownership integrity.", "ExecutiveGatewaySuite", 20),
    category("CrossModel", "Cross-Model Validation", "Declarative relationship validation across suite domain models.", "CrossModel", 21),
    category("PlatformIntegrity", "Platform Integrity Validation", "Validate canonical references, ownership, and immutable composition.", "Platform", 22),
  ]);

const rule = (
  key: string,
  ruleName: string,
  categoryId: ExecutiveGatewaySuiteValidationCategoryId,
  targetModelKind: ExecutiveGatewaySuiteValidationTarget,
  description: string,
  severity: ExecutiveGatewaySuiteValidationSeverity,
  order: number,
): ExecutiveGatewaySuiteValidationRule =>
  Object.freeze({
    ruleId: `NEA-8:4/Rule/${key}`,
    ruleName,
    categoryId,
    targetModelKind,
    description,
    severity,
    modelReference: `${ExecutiveGatewaySuiteModelId}/domainModels/${targetModelKind}`,
    validationIntent: "DeclarativeStructureOnly" as const,
    executionStatus: "None" as const,
    ownership: "NEA-8:4" as const,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly fifty-six declarative validation rules.
 * 40 domain + 10 cross-model + 6 platform integrity.
 * All reference Model kinds. No rule executes validation.
 */
export const ExecutiveGatewaySuiteValidationRules: readonly ExecutiveGatewaySuiteValidationRule[] =
  Object.freeze([
    // SuiteIdentity — 3
    rule("SuiteIdentity-Completeness", "Identity Completeness", "SuiteIdentity", "SuiteIdentity", "Suite identity fields must be declared completely.", "Error", 1),
    rule("SuiteIdentity-Uniqueness", "Identity Uniqueness", "SuiteIdentity", "SuiteIdentity", "Suite identity ids must be unique.", "Error", 2),
    rule("SuiteIdentity-Namespace", "Identity Namespace Consistency", "SuiteIdentity", "SuiteIdentity", "Suite identity namespace must remain consistent with Model.", "Error", 3),

    // SuiteComponent — 4
    rule("SuiteComponent-Integrity", "Component Integrity", "SuiteComponent", "SuiteComponent", "Suite component structure must remain intact.", "Error", 4),
    rule("SuiteComponent-Uniqueness", "Component Uniqueness", "SuiteComponent", "SuiteComponent", "Suite component ids must be unique across the composition.", "Error", 5),
    rule("SuiteComponent-CanonicalReference", "Component Canonical Reference", "SuiteComponent", "SuiteComponent", "Suite component must preserve canonical Model/Registry references.", "Error", 6),
    rule("SuiteComponent-Count", "Component Count Integrity", "SuiteComponent", "SuiteComponent", "Suite must declare exactly seven component model instances.", "Error", 7),

    // SuiteComponentIdentity — 3
    rule("SuiteComponentIdentity-Completeness", "Component Identity Completeness", "SuiteComponentIdentity", "SuiteComponentIdentity", "Component identity fields must be declared completely.", "Error", 8),
    rule("SuiteComponentIdentity-StatusFields", "Component Identity Status Fields", "SuiteComponentIdentity", "SuiteComponentIdentity", "Component identity must declare release, certification, freeze, and readiness statuses.", "Error", 9),
    rule("SuiteComponentIdentity-RegistryRef", "Component Identity Registry Reference", "SuiteComponentIdentity", "SuiteComponentIdentity", "Component identity must preserve Registry identity references through Model.", "Error", 10),

    // SuiteComposition — 3
    rule("SuiteComposition-Completeness", "Composition Completeness", "SuiteComposition", "SuiteComposition", "Suite composition must declare all seven released platforms.", "Error", 11),
    rule("SuiteComposition-Order", "Composition Ordering", "SuiteComposition", "SuiteComposition", "Suite composition order must remain deterministic (NEA-1 through NEA-7).", "Error", 12),
    rule("SuiteComposition-NoReconstruction", "Composition No Reconstruction", "SuiteComposition", "SuiteComposition", "Suite composition must not reconstruct upstream inventories.", "Error", 13),

    // SuiteDependency — 3
    rule("SuiteDependency-Ordering", "Dependency Ordering", "SuiteDependency", "SuiteDependency", "Suite dependency order must remain declarative and deterministic.", "Error", 14),
    rule("SuiteDependency-DeclarativeOnly", "Dependency Declarative Only", "SuiteDependency", "SuiteDependency", "Suite dependencies must not resolve at runtime.", "Error", 15),
    rule("SuiteDependency-Direction", "Dependency Direction", "SuiteDependency", "SuiteDependency", "Suite dependency direction must preserve prior-component chain integrity.", "Error", 16),

    // SuiteCapability — 2
    rule("SuiteCapability-References", "Capability References", "SuiteCapability", "SuiteCapability", "Suite capabilities must reference Model capability declarations.", "Error", 17),
    rule("SuiteCapability-Completeness", "Capability Completeness", "SuiteCapability", "SuiteCapability", "Suite capability catalog completeness must be preserved.", "Error", 18),

    // SuiteContract — 2
    rule("SuiteContract-References", "Contract References", "SuiteContract", "SuiteContract", "Suite contracts must reference Model contract declarations.", "Error", 19),
    rule("SuiteContract-Completeness", "Contract Completeness", "SuiteContract", "SuiteContract", "Suite contract catalog completeness must be preserved.", "Error", 20),

    // SuiteLifecycle — 2
    rule("SuiteLifecycle-Integrity", "Lifecycle Integrity", "SuiteLifecycle", "SuiteLifecycle", "Suite lifecycle structure must remain intact.", "Error", 21),
    rule("SuiteLifecycle-States", "Lifecycle States", "SuiteLifecycle", "SuiteLifecycle", "Suite lifecycle states must remain consistent with Model references.", "Error", 22),

    // SuitePolicy — 2
    rule("SuitePolicy-References", "Policy References", "SuitePolicy", "SuitePolicy", "Suite policies must reference Model policy declarations.", "Error", 23),
    rule("SuitePolicy-Completeness", "Policy Completeness", "SuitePolicy", "SuitePolicy", "Suite policy catalog completeness must be preserved.", "Error", 24),

    // SuiteInventory — 2
    rule("SuiteInventory-Consistency", "Inventory Consistency", "SuiteInventory", "SuiteInventory", "Suite inventory counts must remain consistent with Model anchors.", "Error", 25),
    rule("SuiteInventory-Derivation", "Inventory Derivation", "SuiteInventory", "SuiteInventory", "Suite inventory must be derived from canonical collections without hardcoding.", "Error", 26),

    // SuiteMetadata — 2
    rule("SuiteMetadata-Integrity", "Metadata Integrity", "SuiteMetadata", "SuiteMetadata", "Suite metadata structure must remain intact.", "Error", 27),
    rule("SuiteMetadata-NoDuplication", "Metadata No Duplication", "SuiteMetadata", "SuiteMetadata", "Suite metadata must not duplicate Model metadata values.", "Error", 28),

    // SuiteStatus — 1
    rule("SuiteStatus-Vocabulary", "Status Vocabulary Consistency", "SuiteStatus", "SuiteStatus", "Suite status vocabulary must remain consistent with Model.", "Error", 29),

    // SuiteVersion — 1
    rule("SuiteVersion-Consistency", "Version Consistency", "SuiteVersion", "SuiteVersion", "Suite version declarations must remain consistent across Model references.", "Error", 30),

    // SuiteReadiness — 2
    rule("SuiteReadiness-Consistency", "Readiness Consistency", "SuiteReadiness", "SuiteReadiness", "Suite readiness declarations must remain consistent.", "Error", 31),
    rule("SuiteReadiness-NoRuntimeClaims", "Readiness No Runtime Claims", "SuiteReadiness", "SuiteReadiness", "Suite readiness must not claim runtime gateway readiness.", "Error", 32),

    // SuiteRelationship — 2
    rule("SuiteRelationship-Integrity", "Relationship Integrity", "SuiteRelationship", "SuiteRelationship", "Suite relationships must remain declaratively intact.", "Error", 33),
    rule("SuiteRelationship-NoTraversal", "Relationship No Traversal", "SuiteRelationship", "SuiteRelationship", "Suite relationships must not execute runtime graph traversal.", "Error", 34),

    // SuiteValidationTarget — 1
    rule("SuiteValidationTarget-Structure", "Validation Target Structure", "SuiteValidationTarget", "SuiteValidationTarget", "Suite validation target structure must remain declarative for Manifest.", "Error", 35),

    // SuitePlatformReference — 2
    rule("SuitePlatformReference-Canonical", "Platform Reference Canonical", "SuitePlatformReference", "SuitePlatformReference", "Platform references must preserve canonical Public Index identity through Model.", "Error", 36),
    rule("SuitePlatformReference-Preservation", "Platform Reference Preservation", "SuitePlatformReference", "SuitePlatformReference", "Platform reference object identity must be preserved without reconstruction.", "Error", 37),

    // SuitePublicApiInventory — 2
    rule("SuitePublicApiInventory-Consistency", "Public API Inventory Consistency", "SuitePublicApiInventory", "SuitePublicApiInventory", "Public API inventory total must match Model-derived inventory.", "Error", 38),
    rule("SuitePublicApiInventory-Derivation", "Public API Inventory Derivation", "SuitePublicApiInventory", "SuitePublicApiInventory", "Public API inventory must be derived from Model anchors without hardcoding.", "Error", 39),

    // SuiteSummary — 1
    rule("SuiteSummary-Composition", "Summary Composition", "SuiteSummary", "SuiteSummary", "Suite summary must compose inventory and metadata references.", "Error", 40),

    // Cross-model — 10
    rule("CrossModel-SuiteComponents", "Cross-Model Suite Components", "CrossModel", "CrossModel", "ExecutiveGatewaySuite ↔ SuiteComposition/SuiteComponent relationships must remain consistent.", "Error", 41),
    rule("CrossModel-ComponentIdentity", "Cross-Model Component Identity", "CrossModel", "CrossModel", "SuiteComponent ↔ SuiteComponentIdentity relationship must remain consistent.", "Error", 42),
    rule("CrossModel-ComponentPlatformReference", "Cross-Model Component Platform Reference", "CrossModel", "CrossModel", "SuiteComponent ↔ SuitePlatformReference relationship must remain consistent.", "Error", 43),
    rule("CrossModel-ComponentDependency", "Cross-Model Component Dependency", "CrossModel", "CrossModel", "SuiteComponent ↔ SuiteDependency relationship must remain consistent.", "Error", 44),
    rule("CrossModel-InventoryComponents", "Cross-Model Inventory Components", "CrossModel", "CrossModel", "SuiteInventory ↔ SuiteComponent relationship must remain consistent.", "Error", 45),
    rule("CrossModel-InventoryPublicApi", "Cross-Model Inventory Public API", "CrossModel", "CrossModel", "SuiteInventory ↔ SuitePublicApiInventory relationship must remain consistent.", "Error", 46),
    rule("CrossModel-SummaryInventory", "Cross-Model Summary Inventory", "CrossModel", "CrossModel", "SuiteSummary ↔ SuiteInventory relationship must remain consistent.", "Error", 47),
    rule("CrossModel-SummaryMetadata", "Cross-Model Summary Metadata", "CrossModel", "CrossModel", "SuiteSummary ↔ SuiteMetadata relationship must remain consistent.", "Error", 48),
    rule("CrossModel-ReadinessStatus", "Cross-Model Readiness Status", "CrossModel", "CrossModel", "SuiteReadiness ↔ SuiteStatus relationship must remain consistent.", "Error", 49),
    rule("CrossModel-SummarySuite", "Cross-Model Summary Suite", "CrossModel", "CrossModel", "SuiteSummary ↔ ExecutiveGatewaySuite relationship must remain consistent.", "Error", 50),

    // Platform integrity — 6
    rule("Platform-CanonicalModelReferences", "Canonical Model Reference Integrity", "PlatformIntegrity", "Platform", "Canonical Model references must be preserved.", "Error", 51),
    rule("Platform-Ownership", "Ownership Integrity", "PlatformIntegrity", "Platform", "Ownership declarations must remain unique and immutable.", "Error", 52),
    rule("Platform-Immutability", "Immutability Integrity", "PlatformIntegrity", "Platform", "Validation and Model composition must remain immutable.", "Error", 53),
    rule("Platform-DuplicatePrevention", "Duplicate Prevention", "PlatformIntegrity", "Platform", "Duplicate validation rules and Model values are forbidden.", "Error", 54),
    rule("Platform-RelationshipIntegrity", "Relationship Integrity", "PlatformIntegrity", "Platform", "Relationship integrity must be preserved across validation categories.", "Error", 55),
    rule("Platform-PlatformConsistency", "Platform Consistency", "PlatformIntegrity", "Platform", "Seven-component suite platform consistency must be preserved without reconstructing upstream architecture.", "Error", 56),
  ]);

const DOMAIN_CATEGORIES = ExecutiveGatewaySuiteValidationCategories.filter(
  (item) =>
    item.categoryId !== "CrossModel" &&
    item.categoryId !== "PlatformIntegrity",
);

const CROSS_MODEL_RULES = ExecutiveGatewaySuiteValidationRules.filter(
  (item) => item.categoryId === "CrossModel",
);

const PLATFORM_INTEGRITY_RULES = ExecutiveGatewaySuiteValidationRules.filter(
  (item) => item.categoryId === "PlatformIntegrity",
);

/** Model anchors proving rules target NEA-8:3 domain models. */
export const ExecutiveGatewaySuiteValidationModelAnchors = Object.freeze({
  modelId: ExecutiveGatewaySuiteModelId,
  sourcePhase: "NEA-8:4" as const,
  domainModelCount: model.domainModels.modelCount,
  suiteComponentModelCount: model.domainModels.suiteComponentModelCount,
  suiteComponentIdentityModelCount:
    model.domainModels.suiteComponentIdentityModelCount,
  suitePlatformReferenceModelCount:
    model.domainModels.suitePlatformReferenceModelCount,
  relationshipCount: model.relationships.relationshipCount,
  publicApiInventoryTotal:
    model.domainModels.registryAnchors.publicApiInventoryTotal,
  domainModelKinds: Object.freeze(
    model.domainModels.models.map((item) => item.modelKind),
  ),
  preservesCanonicalModelReferences: true as const,
  duplicatesModelValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable rules catalog. */
export const ExecutiveGatewaySuiteValidationRuleCatalog = Object.freeze({
  catalogId: "NEA-8:4/ValidationRuleCatalog",
  sourcePhase: "NEA-8:4" as const,
  categories: ExecutiveGatewaySuiteValidationCategories,
  rules: ExecutiveGatewaySuiteValidationRules,
  categoryCount: ExecutiveGatewaySuiteValidationCategories.length,
  domainCategoryCount: DOMAIN_CATEGORIES.length,
  ruleCount: ExecutiveGatewaySuiteValidationRules.length,
  crossModelRuleCount: CROSS_MODEL_RULES.length,
  platformIntegrityRuleCount: PLATFORM_INTEGRITY_RULES.length,
  modelAnchors: ExecutiveGatewaySuiteValidationModelAnchors,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
