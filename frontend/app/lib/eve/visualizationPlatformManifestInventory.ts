import { VisualizationPlatformManifestCompatibility } from "./visualizationPlatformManifestCompatibility.ts";
import { VisualizationPlatformManifestGuarantees } from "./visualizationPlatformManifestGuarantees.ts";
import {
  VisualizationPlatformManifestComposition,
  VisualizationPlatformManifestReadiness,
} from "./visualizationPlatformManifestReadiness.ts";
import { VisualizationPlatformValidationPlatform } from "./visualizationPlatformValidation.ts";

const validation = VisualizationPlatformValidationPlatform;
const PublicManifestSurface = Object.freeze([
  "Manifest platform", "Manifest identity", "Manifest metadata",
  "Manifest inventory", "Manifest summary", "Manifest count accessor",
  "Manifest release metadata", "Manifest readiness metadata",
] as const);

export const VisualizationPlatformManifestInventory = Object.freeze({
  phaseComposition: VisualizationPlatformManifestComposition,
  validationInventory: validation.inventory,
  validationCategories: validation.categories,
  validationRules: validation.rules,
  validationGates: validation.gates,
  validationDiagnostics: validation.diagnostics,
  validationSeverityLevels: validation.severityLevels,
  validationOutcomes: validation.outcomes,
  validationFailureCategories: validation.failureCategories,
  validationRecommendationCategories: validation.recommendationCategories,
  validationPolicies: validation.policies,
  validationReadinessDeclarations: validation.readinessDeclarations,
  guarantees: VisualizationPlatformManifestGuarantees,
  compatibility: VisualizationPlatformManifestCompatibility,
  readiness: VisualizationPlatformManifestReadiness,
  canonicalReferences: VisualizationPlatformManifestComposition,
  dependencyMetadata: validation.metadata.dependency,
  publicManifestSurface: PublicManifestSurface,
  counts: Object.freeze({
    phaseCount: VisualizationPlatformManifestComposition.length,
    validationCategoryCount: validation.categories.length,
    validationRuleCount: validation.rules.length,
    validationGateCount: validation.gates.length,
    validationDiagnosticCount: validation.diagnostics.length,
    validationSeverityLevelCount: validation.severityLevels.length,
    validationOutcomeCount: validation.outcomes.length,
    validationFailureCategoryCount: validation.failureCategories.length,
    validationRecommendationCategoryCount:
      validation.recommendationCategories.length,
    validationPolicyCount: validation.policies.length,
    validationReadinessCount: validation.readinessDeclarations.length,
    guaranteeCount: VisualizationPlatformManifestGuarantees.length,
    compatibilityCount: VisualizationPlatformManifestCompatibility.length,
    readinessCount: VisualizationPlatformManifestReadiness.length,
    canonicalReferenceCount: VisualizationPlatformManifestComposition.length,
    publicSurfaceCount: PublicManifestSurface.length,
  }),
  validationCollectionsPreservedByReference: true,
  upstreamReachableExclusivelyThroughValidation: true,
  inventoriesDerivedExclusivelyFromValidationCollections: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  recalculatesUpstreamInventories: false,
  reconstructsUpstreamCollections: false,
  duplicatesValidationMetadata: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
