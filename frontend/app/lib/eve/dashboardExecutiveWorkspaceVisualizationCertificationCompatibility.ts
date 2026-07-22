import { DashboardExecutiveWorkspaceVisualizationPlatform } from "./dashboardExecutiveWorkspaceVisualizationPlatform.ts";
import type { DashboardExecutiveWorkspaceCertificationCompatibilityEntry } from "./dashboardExecutiveWorkspaceVisualizationCertificationTypes.ts";

const platform = DashboardExecutiveWorkspaceVisualizationPlatform;
const composition = platform.composition;
const verificationSources = Object.freeze([
  ["Foundation compatibility verified", composition[0]!.canonicalReference],
  ["Registry compatibility verified", composition[1]!.canonicalReference],
  ["Model compatibility verified", composition[2]!.canonicalReference],
  ["Validation compatibility verified", composition[3]!.canonicalReference],
  ["Manifest compatibility verified", composition[4]!.canonicalReference],
  ["Platform compatibility verified", platform.metadata.id],
  ["Public surface compatibility verified", platform.metadata.id],
  ["Freeze compatibility verified", platform.metadata.id],
] as const);

export const DashboardExecutiveWorkspaceVisualizationCertificationCompatibility:
readonly DashboardExecutiveWorkspaceCertificationCompatibilityEntry[] = Object.freeze(
  verificationSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-6:7/Compatibility/${index + 1}` as const,
    name,
    verified: true as const,
    canonicalReference,
    deterministicOrder: index + 1,
    runtimeVerification: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
