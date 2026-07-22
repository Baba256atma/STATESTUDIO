import { DashboardExecutiveWorkspaceVisualizationManifestPlatform } from "./dashboardExecutiveWorkspaceVisualizationManifest.ts";
import type { DashboardExecutiveWorkspacePlatformCapability } from "./dashboardExecutiveWorkspaceVisualizationPlatformTypes.ts";

const capabilityNames = Object.freeze([
  "Canonical platform publication", "Architectural composition publication",
  "Platform inventory publication", "Capability publication",
  "Guarantee publication", "Compatibility publication", "Dependency publication",
  "Metadata publication", "Readiness publication",
  "Certification readiness publication",
] as const);

export const DashboardExecutiveWorkspaceVisualizationPlatformCapabilities:
readonly DashboardExecutiveWorkspacePlatformCapability[] = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `EVE-6:6/Capability/${index + 1}` as const,
    name,
    description: `Declarative Platform capability: ${name}.`,
    manifestReference:
      DashboardExecutiveWorkspaceVisualizationManifestPlatform.metadata.id,
    deterministicOrder: index + 1,
    implementationProvided: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
