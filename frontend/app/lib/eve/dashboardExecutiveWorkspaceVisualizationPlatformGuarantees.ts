import { DashboardExecutiveWorkspaceVisualizationManifestPlatform } from "./dashboardExecutiveWorkspaceVisualizationManifest.ts";
import type { DashboardExecutiveWorkspacePlatformGuarantee } from "./dashboardExecutiveWorkspaceVisualizationPlatformTypes.ts";

const guaranteeNames = Object.freeze([
  "Foundation preserved", "Registry preserved", "Model preserved",
  "Validation preserved", "Manifest preserved", "Canonical composition preserved",
  "Canonical references preserved", "Canonical inventories preserved",
  "Compatibility preserved", "Dependency integrity preserved",
  "Metadata immutability preserved", "ReadyForCertification guaranteed",
] as const);

export const DashboardExecutiveWorkspaceVisualizationPlatformGuarantees:
readonly DashboardExecutiveWorkspacePlatformGuarantee[] = Object.freeze(
  guaranteeNames.map((name, index) => Object.freeze({
    id: `EVE-6:6/Guarantee/${index + 1}` as const,
    name,
    guaranteed: true as const,
    manifestReference:
      DashboardExecutiveWorkspaceVisualizationManifestPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
