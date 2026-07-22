import { DashboardExecutiveWorkspaceVisualizationManifestPlatform } from "./dashboardExecutiveWorkspaceVisualizationManifest.ts";
import { DashboardExecutiveWorkspaceVisualizationPlatformCapabilities } from "./dashboardExecutiveWorkspaceVisualizationPlatformCapabilities.ts";
import { DashboardExecutiveWorkspaceVisualizationPlatformCompatibility } from "./dashboardExecutiveWorkspaceVisualizationPlatformCompatibility.ts";
import { DashboardExecutiveWorkspaceVisualizationPlatformGuarantees } from "./dashboardExecutiveWorkspaceVisualizationPlatformGuarantees.ts";

const manifest = DashboardExecutiveWorkspaceVisualizationManifestPlatform;

export const DashboardExecutiveWorkspaceVisualizationPlatformComposition =
  Object.freeze([
    ...manifest.composition,
    Object.freeze({
      id: "EVE-6:6/Composition/Platform",
      phase: "Platform",
      canonicalReference:
        "EVE-6:6/DashboardExecutiveWorkspaceVisualizationPlatform",
      canonicalSource:
        "EVE-6:6/DashboardExecutiveWorkspaceVisualizationPlatform",
      preservedByReference: true,
      deterministicOrder: manifest.composition.length + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

const PublicPlatformSurface = Object.freeze([
  "Canonical Platform", "Platform identity metadata", "Platform inventory metadata",
  "Platform metadata", "Platform summary accessor", "Platform count accessor",
  "Platform release metadata accessor", "Platform readiness metadata",
] as const);

export const DashboardExecutiveWorkspaceVisualizationPlatformInventory =
  Object.freeze({
    phaseComposition: DashboardExecutiveWorkspaceVisualizationPlatformComposition,
    capabilities: DashboardExecutiveWorkspaceVisualizationPlatformCapabilities,
    guarantees: DashboardExecutiveWorkspaceVisualizationPlatformGuarantees,
    compatibility: DashboardExecutiveWorkspaceVisualizationPlatformCompatibility,
    manifestInventory: manifest.inventory,
    manifestComposition: manifest.composition,
    manifestGuarantees: manifest.guarantees,
    manifestCompatibility: manifest.compatibility,
    manifestReadiness: manifest.readiness,
    manifestReadinessDeclarations: manifest.readinessDeclarations,
    manifestMetadata: manifest.metadata,
    dependencyMetadata: manifest.metadata.dependency,
    publicPlatformSurface: PublicPlatformSurface,
    counts: Object.freeze({
      phaseCount:
        DashboardExecutiveWorkspaceVisualizationPlatformComposition.length,
      capabilityCount:
        DashboardExecutiveWorkspaceVisualizationPlatformCapabilities.length,
      guaranteeCount:
        DashboardExecutiveWorkspaceVisualizationPlatformGuarantees.length,
      compatibilityCount:
        DashboardExecutiveWorkspaceVisualizationPlatformCompatibility.length,
      publicSurfaceCount: PublicPlatformSurface.length,
    }),
    manifestCollectionsPreservedByReference: true,
    upstreamReachableExclusivelyThroughManifest: true,
    countsDerivedFromCanonicalCollections: true,
    hardcodedAggregateTotals: false,
    reconstructsUpstreamCollections: false,
    duplicatesManifestMetadata: false,
    maintainsParallelUpstreamInventory: false,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
