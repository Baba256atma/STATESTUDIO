import { VisualizationPlatform } from "./visualizationPlatform.ts";
import type { VisualizationCertificationGate } from "./visualizationCertificationTypes.ts";

const names = Object.freeze([
  "ArchitectureVerified", "DependenciesVerified", "InventoriesVerified",
  "CapabilitiesVerified", "GuaranteesVerified", "CompatibilityVerified",
  "PublicSurfaceVerified", "BoundariesVerified", "CanonicalReferencesVerified",
  "MetadataVerified", "NpaComplianceVerified", "ReadyForFreeze",
] as const);

export const VisualizationCertificationGates: readonly VisualizationCertificationGate[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-1:7/Gate/${name}`,
    name,
    result: "Certified",
    status: "Passed",
    platformReference: VisualizationPlatform.metadata.id,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));

