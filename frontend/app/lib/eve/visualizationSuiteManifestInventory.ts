import { VisualizationSuiteManifestCompatibility } from "./visualizationSuiteManifestCompatibility.ts";
import { VisualizationSuiteManifestGuarantees } from "./visualizationSuiteManifestGuarantees.ts";
import {
  VisualizationSuiteManifestComposition,
  VisualizationSuiteManifestReadiness,
} from "./visualizationSuiteManifestReadiness.ts";
import { VisualizationSuiteValidationPlatform } from "./visualizationSuiteValidation.ts";

const validation = VisualizationSuiteValidationPlatform;
const PublicManifestSurface = Object.freeze([
  "Manifest object", "Manifest identity", "Manifest metadata",
  "Manifest inventory", "Manifest summary", "Manifest count accessor",
  "Manifest release metadata", "Manifest readiness metadata",
] as const);

export const VisualizationSuiteManifestInventory = Object.freeze({
  phaseComposition: VisualizationSuiteManifestComposition,
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
  guarantees: VisualizationSuiteManifestGuarantees,
  compatibility: VisualizationSuiteManifestCompatibility,
  readiness: VisualizationSuiteManifestReadiness,
  canonicalReferences: VisualizationSuiteManifestComposition,
  dependencyMetadata: validation.metadata.dependency,
  publicManifestSurface: PublicManifestSurface,
  counts: Object.freeze({
    phaseCount: VisualizationSuiteManifestComposition.length,
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
    guaranteeCount: VisualizationSuiteManifestGuarantees.length,
    compatibilityCount: VisualizationSuiteManifestCompatibility.length,
    readinessCount: VisualizationSuiteManifestReadiness.length,
    canonicalReferenceCount: VisualizationSuiteManifestComposition.length,
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
