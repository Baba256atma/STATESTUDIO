import type { VisualizationPlatformFreezeLock } from "./visualizationPlatformFreezeTypes.ts";

const lockNames = Object.freeze([
  "Platform identity lock", "Phase composition lock", "Dependency lock",
  "Inventory lock", "Capability lock", "Guarantee lock", "Compatibility lock",
  "Public export lock", "Namespace lock", "Canonical reference lock",
  "Version lock", "Certification lock",
] as const);

export const VisualizationPlatformFreezeLocks:
readonly VisualizationPlatformFreezeLock[] = Object.freeze(
  lockNames.map((canonicalName, index) => Object.freeze({
    id: `EVE-8:8/Lock/${index + 1}` as const,
    canonicalName,
    lockIdentifier: "EVE-8-VISUALIZATION-PLATFORM-LOCKED" as const,
    status: "Locked" as const,
    description: `Immutable architectural lock: ${canonicalName}.`,
    deterministicOrder: index + 1,
    runtimeLocking: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
