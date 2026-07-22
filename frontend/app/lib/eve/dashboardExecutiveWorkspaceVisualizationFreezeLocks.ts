import type { DashboardExecutiveWorkspaceFreezeLock } from "./dashboardExecutiveWorkspaceVisualizationFreezeTypes.ts";

const lockNames = Object.freeze([
  "Foundation Lock", "Registry Lock", "Model Lock", "Validation Lock",
  "Manifest Lock", "Platform Lock", "Certification Lock",
  "Canonical Composition Lock", "Canonical Inventory Lock",
  "Public Surface Lock", "Dependency Lock", "Metadata Integrity Lock",
] as const);

export const DashboardExecutiveWorkspaceVisualizationFreezeLocks:
readonly DashboardExecutiveWorkspaceFreezeLock[] = Object.freeze(
  lockNames.map((canonicalName, index) => Object.freeze({
    id: `EVE-6:8/Lock/${index + 1}` as const,
    canonicalName,
    lockIdentifier:
      "EVE-6-DASHBOARD-EXECUTIVE-WORKSPACE-VISUALIZATION-LOCKED" as const,
    status: "Locked" as const,
    description: `Immutable architectural lock: ${canonicalName}.`,
    deterministicOrder: index + 1,
    runtimeLocking: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
