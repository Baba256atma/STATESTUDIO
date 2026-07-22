import { DashboardExecutiveWorkspaceVisualizationManifestCompatibility } from "./dashboardExecutiveWorkspaceVisualizationManifestCompatibility.ts";
import { DashboardExecutiveWorkspaceVisualizationManifestGuarantees } from "./dashboardExecutiveWorkspaceVisualizationManifestGuarantees.ts";
import {
  DashboardExecutiveWorkspaceVisualizationManifestComposition,
  DashboardExecutiveWorkspaceVisualizationManifestReadiness,
} from "./dashboardExecutiveWorkspaceVisualizationManifestReadiness.ts";
import { DashboardExecutiveWorkspaceVisualizationValidationPlatform } from "./dashboardExecutiveWorkspaceVisualizationValidation.ts";

const validation = DashboardExecutiveWorkspaceVisualizationValidationPlatform;
const PublicManifestSurface = Object.freeze([
  "Manifest platform", "Manifest identity metadata", "Manifest inventory metadata",
  "Manifest metadata", "Manifest summary accessor", "Manifest count accessor",
  "Manifest release metadata accessor", "Manifest readiness metadata",
] as const);

export const DashboardExecutiveWorkspaceVisualizationManifestInventory =
  Object.freeze({
    phaseComposition: DashboardExecutiveWorkspaceVisualizationManifestComposition,
    validationInventory: validation.inventory,
    validationCategories: validation.categories,
    validationRules: validation.rules,
    validationGates: validation.gates,
    validationDiagnostics: validation.diagnostics,
    validationSeverityLevels: validation.severityLevels,
    validationOutcomes: validation.outcomes,
    validationPolicies: validation.policies,
    validationReadinessDeclarations: validation.readinessDeclarations,
    guarantees: DashboardExecutiveWorkspaceVisualizationManifestGuarantees,
    compatibility: DashboardExecutiveWorkspaceVisualizationManifestCompatibility,
    readiness: DashboardExecutiveWorkspaceVisualizationManifestReadiness,
    dependencyMetadata: validation.metadata.dependency,
    publicManifestSurface: PublicManifestSurface,
    counts: Object.freeze({
      phaseCount:
        DashboardExecutiveWorkspaceVisualizationManifestComposition.length,
      validationCategoryCount: validation.categories.length,
      validationRuleCount: validation.rules.length,
      validationGateCount: validation.gates.length,
      validationDiagnosticCount: validation.diagnostics.length,
      validationSeverityLevelCount: validation.severityLevels.length,
      validationOutcomeCount: validation.outcomes.length,
      validationPolicyCount: validation.policies.length,
      validationReadinessCount: validation.readinessDeclarations.length,
      guaranteeCount:
        DashboardExecutiveWorkspaceVisualizationManifestGuarantees.length,
      compatibilityCount:
        DashboardExecutiveWorkspaceVisualizationManifestCompatibility.length,
      readinessCount:
        DashboardExecutiveWorkspaceVisualizationManifestReadiness.length,
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
