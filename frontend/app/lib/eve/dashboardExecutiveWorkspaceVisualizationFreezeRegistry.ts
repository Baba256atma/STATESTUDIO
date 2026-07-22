import { DashboardExecutiveWorkspaceVisualizationCertificationPlatform } from "./dashboardExecutiveWorkspaceVisualizationCertification.ts";
import type { DashboardExecutiveWorkspaceFreezeRegistryEntry } from "./dashboardExecutiveWorkspaceVisualizationFreezeTypes.ts";

const certification =
  DashboardExecutiveWorkspaceVisualizationCertificationPlatform;
const platformEntries = certification.platform.composition;

export const DashboardExecutiveWorkspaceVisualizationFreezeRegistry:
readonly DashboardExecutiveWorkspaceFreezeRegistryEntry[] = Object.freeze([
  ...platformEntries.map((entry, index) => Object.freeze({
    id: `EVE-6:8/Registry/${entry.phase}` as const,
    phase: entry.phase,
    canonicalReference: entry,
    certificationReference: certification.metadata.id,
    deterministicOrder: index + 1,
    preservedByReference: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
  Object.freeze({
    id: "EVE-6:8/Registry/Certification" as const,
    phase: "Certification",
    canonicalReference: certification,
    certificationReference: certification.metadata.id,
    deterministicOrder: platformEntries.length + 1,
    preservedByReference: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
]);
