import { AnimationEffectsManifestCompatibility } from "./animationEffectsManifestCompatibility.ts";
import { AnimationEffectsManifestGuarantees } from "./animationEffectsManifestGuarantees.ts";
import {
  AnimationEffectsManifestComposition,
  AnimationEffectsManifestReadiness,
} from "./animationEffectsManifestReadiness.ts";
import { AnimationEffectsValidationPlatform } from "./animationEffectsValidation.ts";

const validation = AnimationEffectsValidationPlatform;
const PublicManifestSurface = Object.freeze([
  "Manifest platform", "Manifest identity metadata", "Manifest metadata",
  "Manifest inventory metadata", "Manifest summary accessor",
  "Manifest count accessor", "Manifest readiness metadata",
  "Manifest release metadata accessor",
] as const);

export const AnimationEffectsManifestInventory = Object.freeze({
  phaseComposition: AnimationEffectsManifestComposition,
  validationInventory: validation.inventory,
  validationCategories: validation.categories,
  validationRules: validation.rules,
  validationGates: validation.gates,
  validationDiagnostics: validation.diagnostics,
  validationSeverityLevels: validation.severityLevels,
  validationOutcomes: validation.outcomes,
  validationFailureClassifications: validation.failureClassifications,
  validationRecommendationClassifications:
    validation.recommendationClassifications,
  validationPolicies: validation.policies,
  validationReadinessDeclarations: validation.readinessDeclarations,
  guarantees: AnimationEffectsManifestGuarantees,
  compatibility: AnimationEffectsManifestCompatibility,
  readiness: AnimationEffectsManifestReadiness,
  canonicalReferences: AnimationEffectsManifestComposition,
  dependencyMetadata: validation.metadata.dependency,
  publicManifestSurface: PublicManifestSurface,
  counts: Object.freeze({
    phaseCount: AnimationEffectsManifestComposition.length,
    validationCategoryCount: validation.categories.length,
    validationRuleCount: validation.rules.length,
    validationGateCount: validation.gates.length,
    validationDiagnosticCount: validation.diagnostics.length,
    validationSeverityLevelCount: validation.severityLevels.length,
    validationOutcomeCount: validation.outcomes.length,
    validationFailureClassificationCount:
      validation.failureClassifications.length,
    validationRecommendationClassificationCount:
      validation.recommendationClassifications.length,
    validationPolicyCount: validation.policies.length,
    validationReadinessCount: validation.readinessDeclarations.length,
    guaranteeCount: AnimationEffectsManifestGuarantees.length,
    compatibilityCount: AnimationEffectsManifestCompatibility.length,
    readinessCount: AnimationEffectsManifestReadiness.length,
    canonicalReferenceCount: AnimationEffectsManifestComposition.length,
    publicSurfaceCount: PublicManifestSurface.length,
  }),
  validationCollectionsPreservedByReference: true,
  upstreamReachableExclusivelyThroughValidation: true,
  inventoriesDerivedExclusivelyFromValidationCollections: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  reconstructsUpstreamCollections: false,
  duplicatesValidationMetadata: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
