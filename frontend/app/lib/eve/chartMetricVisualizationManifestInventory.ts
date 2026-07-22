import { ChartMetricVisualizationManifestCompatibility } from "./chartMetricVisualizationManifestCompatibility.ts";
import { ChartMetricVisualizationManifestGuarantees } from "./chartMetricVisualizationManifestGuarantees.ts";
import {
  ChartMetricVisualizationManifestComposition,
  ChartMetricVisualizationManifestReadiness,
} from "./chartMetricVisualizationManifestReadiness.ts";
import { ChartMetricVisualizationValidationPlatform } from "./chartMetricVisualizationValidation.ts";

const PublicManifestSurface = Object.freeze([
  "Manifest platform", "Manifest identity metadata", "Manifest inventory metadata",
  "Manifest metadata", "Manifest summary accessor", "Manifest count accessor",
  "Manifest release metadata accessor", "Manifest readiness metadata",
] as const);

export const ChartMetricVisualizationManifestInventory = Object.freeze({
  phaseComposition: ChartMetricVisualizationManifestComposition,
  validationInventory: ChartMetricVisualizationValidationPlatform.inventory,
  validationCategories: ChartMetricVisualizationValidationPlatform.categories,
  validationRules: ChartMetricVisualizationValidationPlatform.rules,
  validationGates: ChartMetricVisualizationValidationPlatform.gates,
  validationDiagnostics: ChartMetricVisualizationValidationPlatform.diagnostics,
  validationSeverityLevels: ChartMetricVisualizationValidationPlatform.severityLevels,
  validationOutcomes: ChartMetricVisualizationValidationPlatform.outcomes,
  validationPolicies: ChartMetricVisualizationValidationPlatform.policies,
  validationReadinessDeclarations:
    ChartMetricVisualizationValidationPlatform.readinessDeclarations,
  guarantees: ChartMetricVisualizationManifestGuarantees,
  compatibility: ChartMetricVisualizationManifestCompatibility,
  readiness: ChartMetricVisualizationManifestReadiness,
  dependencyMetadata: ChartMetricVisualizationValidationPlatform.metadata.dependency,
  publicManifestSurface: PublicManifestSurface,
  counts: Object.freeze({
    phaseCount: ChartMetricVisualizationManifestComposition.length,
    validationCategoryCount: ChartMetricVisualizationValidationPlatform.categories.length,
    validationRuleCount: ChartMetricVisualizationValidationPlatform.rules.length,
    validationGateCount: ChartMetricVisualizationValidationPlatform.gates.length,
    validationDiagnosticCount: ChartMetricVisualizationValidationPlatform.diagnostics.length,
    validationSeverityLevelCount:
      ChartMetricVisualizationValidationPlatform.severityLevels.length,
    validationOutcomeCount: ChartMetricVisualizationValidationPlatform.outcomes.length,
    validationPolicyCount: ChartMetricVisualizationValidationPlatform.policies.length,
    validationReadinessCount:
      ChartMetricVisualizationValidationPlatform.readinessDeclarations.length,
    guaranteeCount: ChartMetricVisualizationManifestGuarantees.length,
    compatibilityCount: ChartMetricVisualizationManifestCompatibility.length,
    readinessCount: ChartMetricVisualizationManifestReadiness.length,
    publicSurfaceCount: PublicManifestSurface.length,
  }),
  validationCollectionsPreservedByReference: true,
  upstreamReachableExclusivelyThroughValidation: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  reconstructsUpstreamCollections: false,
  duplicatesValidationMetadata: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
