import type { DashboardExecutiveWorkspaceManifestGuarantee } from "./dashboardExecutiveWorkspaceVisualizationManifestTypes.ts";
import { DashboardExecutiveWorkspaceVisualizationValidationPlatform } from "./dashboardExecutiveWorkspaceVisualizationValidation.ts";

const guaranteeNames = Object.freeze([
  "Foundation preserved", "Registry preserved", "Model preserved",
  "Validation preserved", "Canonical composition preserved",
  "Canonical references preserved", "Inventory preservation guaranteed",
  "Compatibility preservation guaranteed", "Dependency integrity guaranteed",
  "Metadata immutability guaranteed", "Public surface integrity guaranteed",
  "ReadyForPlatform guaranteed",
] as const);

export const DashboardExecutiveWorkspaceVisualizationManifestGuarantees:
readonly DashboardExecutiveWorkspaceManifestGuarantee[] = Object.freeze(
  guaranteeNames.map((name, index) => Object.freeze({
    id: `EVE-6:5/Guarantee/${index + 1}` as const,
    name,
    description: `Declarative Manifest guarantee: ${name}.`,
    guaranteed: true as const,
    evidenceReference:
      DashboardExecutiveWorkspaceVisualizationValidationPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
