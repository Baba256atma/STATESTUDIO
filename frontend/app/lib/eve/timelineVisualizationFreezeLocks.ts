import type { TimelineVisualizationFreezeLock } from "./timelineVisualizationFreezeTypes.ts";

const lockNames = Object.freeze([
  "Foundation Locked", "Registry Locked", "Model Locked", "Validation Locked",
  "Manifest Locked", "Platform Locked", "Certification Locked",
  "Canonical Composition Locked", "Canonical References Locked", "Inventory Locked",
  "Public Surface Locked", "Timeline Visualization Suite Locked",
] as const);

export const TimelineVisualizationFreezeLocks:
readonly TimelineVisualizationFreezeLock[] = Object.freeze(
  lockNames.map((name, index) => Object.freeze({
    id: `EVE-4:8/Lock/${name.replaceAll(" ", "")}`,
    name,
    lockIdentifier: "EVE-4-TIMELINE-VISUALIZATION-LOCKED",
    lockVersion: "1.0.0",
    status: "Frozen",
    stableIdentity: `EVE-4:8/Lock/${name.replaceAll(" ", "")}`,
    deterministicOrder: index + 1,
    runtimeLocking: false,
    metadataOnly: true,
    immutable: true,
  })),
);
