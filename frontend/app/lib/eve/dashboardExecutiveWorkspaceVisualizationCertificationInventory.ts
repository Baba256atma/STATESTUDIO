import { DashboardExecutiveWorkspaceVisualizationCertificationCompatibility } from "./dashboardExecutiveWorkspaceVisualizationCertificationCompatibility.ts";
import { DashboardExecutiveWorkspaceVisualizationCertificationCriteria } from "./dashboardExecutiveWorkspaceVisualizationCertificationCriteria.ts";
import { DashboardExecutiveWorkspaceVisualizationCertificationGates } from "./dashboardExecutiveWorkspaceVisualizationCertificationReadiness.ts";
import { DashboardExecutiveWorkspaceVisualizationPlatform } from "./dashboardExecutiveWorkspaceVisualizationPlatform.ts";

const platform = DashboardExecutiveWorkspaceVisualizationPlatform;
const PublicCertificationSurface = Object.freeze([
  "Certification platform", "Certification identity metadata",
  "Certification inventory metadata", "Certification metadata",
  "Certification summary accessor", "Certification count accessor",
  "Certification release metadata accessor", "Certification readiness metadata",
] as const);

export const DashboardExecutiveWorkspaceVisualizationCertificationInventory =
  Object.freeze({
    criteria: DashboardExecutiveWorkspaceVisualizationCertificationCriteria,
    gates: DashboardExecutiveWorkspaceVisualizationCertificationGates,
    compatibilityVerification:
      DashboardExecutiveWorkspaceVisualizationCertificationCompatibility,
    platformInventory: platform.inventory,
    platformCapabilities: platform.capabilities,
    platformGuarantees: platform.guarantees,
    platformCompatibility: platform.compatibility,
    platformComposition: platform.composition,
    platformMetadata: platform.metadata,
    platformReadiness: platform.readiness,
    dependencyMetadata: platform.metadata.dependency,
    publicCertificationSurface: PublicCertificationSurface,
    counts: Object.freeze({
      criteriaCount:
        DashboardExecutiveWorkspaceVisualizationCertificationCriteria.length,
      gateCount:
        DashboardExecutiveWorkspaceVisualizationCertificationGates.length,
      compatibilityVerificationCount:
        DashboardExecutiveWorkspaceVisualizationCertificationCompatibility.length,
      publicSurfaceCount: PublicCertificationSurface.length,
    }),
    platformCollectionsPreservedByReference: true,
    upstreamReachableExclusivelyThroughPlatform: true,
    countsDerivedFromCanonicalCollections: true,
    hardcodedAggregateTotals: false,
    duplicatesPlatformMetadata: false,
    reconstructsUpstreamCollections: false,
    maintainsParallelUpstreamInventory: false,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
